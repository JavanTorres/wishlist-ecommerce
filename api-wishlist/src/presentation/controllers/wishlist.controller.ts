import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  ValidationPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
  ApiNoContentResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@modules/jwt-auth.guard';
import { AddItemRequestDto } from '@presentation/dto/wishlist/add-item-request.dto';
import { CreateWishlistRequestDto } from '@presentation/dto/wishlist/create-wishlist-request.dto';
import { WishlistItemsResponseDto } from '@presentation/dto/wishlist/wishlist-items-response.dto';
import { WishlistResponseDto } from '@presentation/dto/wishlist/wishlist-response.dto';
import { WishlistMapper } from '@presentation/mappers/wishlist.mapper';
import { WishlistService } from '@services/wishlist.service';

@ApiBearerAuth('JWT')
@Controller({
  path: 'wishlists',
  version: '1',
})
@ApiTags('Wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova wishlist' })
  @ApiCreatedResponse({
    description: 'Wishlist criada com sucesso',
    type: WishlistResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  async create(
    @Request() req: any,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWishlistRequestDto: CreateWishlistRequestDto,
  ): Promise<WishlistResponseDto> {
    const userUuid = req.user.uuid;
    const wishlist = await this.wishlistService.create({
      ...createWishlistRequestDto,
      userUuid,
    });
    return WishlistMapper.toResponse(wishlist);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna todas as wishlists' })
  @ApiOkResponse({
    description: 'Lista de wishlists',
    type: WishlistResponseDto,
    isArray: true,
  })
  async findAll(): Promise<WishlistResponseDto[]> {
    const wishlists = await this.wishlistService.findAll();
    return wishlists.map(WishlistMapper.toResponse);
  }

  @Get(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Retorna uma wishlist pelo UUID' })
  @ApiParam({ name: 'uuid', description: 'UUID da wishlist' })
  @ApiOkResponse({
    description: 'Wishlist encontrada',
    type: WishlistResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Wishlist não encontrada' })
  async findById(@Param('uuid') uuid: string): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistService.findById(uuid);
    return WishlistMapper.toResponse(wishlist);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma wishlist pelo UUID' })
  @ApiParam({
    name: 'uuid',
    description: 'UUID v4 da wishlist',
    schema: { format: 'uuid' },
  })
  @ApiNoContentResponse({ description: 'Wishlist deletada com sucesso' })
  @ApiNotFoundResponse({ description: 'Wishlist não encontrada' })
  @ApiBadRequestResponse({ description: 'UUID inválido' })
  async deleteById(@Param('uuid') uuid: string): Promise<void> {
    await this.wishlistService.deleteById(uuid);
  }

  @Put(':uuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza uma wishlist existente' })
  @ApiOkResponse({
    description: 'Wishlist atualizada com sucesso',
    type: WishlistResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos' })
  async update(
    @Request() req: any,
    @Param('uuid') uuid: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWishlistRequestDto: CreateWishlistRequestDto,
  ): Promise<WishlistResponseDto> {
    const userUuid = req.user.uuid;
    const wishlist = await this.wishlistService.update(
      uuid,
      {
        ...createWishlistRequestDto,
        userUuid,
      },
    );
    return WishlistMapper.toResponse(wishlist);
  }

  @Post(':uuid/items')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Adiciona um produto na wishlist do cliente' })
  @ApiParam({ name: 'uuid', description: 'UUID da wishlist' })
  @ApiCreatedResponse({
    description: 'Produto adicionado com sucesso',
    type: WishlistResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos, limite excedido ou produto já existe na wishlist' })
  @ApiNotFoundResponse({ description: 'Wishlist não encontrada' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado à wishlist' })
  async addItem(
    @Request() req: any,
    @Param('uuid') uuid: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    addItemDto: AddItemRequestDto,
  ): Promise<WishlistResponseDto> {
    const userUuid = req.user.uuid;
    const wishlist = await this.wishlistService.addItem(uuid, userUuid, addItemDto);
    return WishlistMapper.toResponse(wishlist);
  }

  @Delete(':uuid/items/:productUuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Remove um produto da wishlist do cliente' })
  @ApiParam({ name: 'uuid', description: 'UUID da wishlist' })
  @ApiParam({ name: 'productUuid', description: 'UUID do produto' })
  @ApiOkResponse({
    description: 'Produto removido com sucesso',
    type: WishlistResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Wishlist ou produto não encontrado' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado à wishlist' })
  async removeItem(
    @Request() req: any,
    @Param('uuid') uuid: string,
    @Param('productUuid') productUuid: string,
  ): Promise<WishlistResponseDto> {
    const userUuid = req.user.uuid;
    const wishlist = await this.wishlistService.removeItem(uuid, userUuid, productUuid);
    return WishlistMapper.toResponse(wishlist);
  }

  @Get(':uuid/items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consulta todos os produtos da wishlist do cliente' })
  @ApiParam({ name: 'uuid', description: 'UUID da wishlist' })
  @ApiOkResponse({
    description: 'Lista de produtos da wishlist',
    type: WishlistItemsResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Wishlist não encontrada' })
  @ApiForbiddenResponse({ description: 'Acesso não autorizado à wishlist' })
  async getItems(
    @Request() req: any,
    @Param('uuid') uuid: string,
  ): Promise<WishlistItemsResponseDto> {
    const userUuid = req.user.uuid;
    const wishlist = await this.wishlistService.findByIdAndUser(uuid, userUuid);
    return WishlistMapper.toItemsResponse(wishlist);
  }

  @Get(':uuid/items/:productUuid')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Consulta se um produto está na wishlist do cliente' })
  @ApiParam({ name: 'uuid', description: 'UUID da wishlist' })
  @ApiParam({ name: 'productUuid', description: 'UUID do produto' })
  @ApiOkResponse({
    description: 'Produto encontrado na wishlist',
    schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean' },
        item: { type: 'object', nullable: true },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Wishlist não encontrada' })
  async checkItemExists(
    @Request() req: any,
    @Param('uuid') uuid: string,
    @Param('productUuid') productUuid: string,
  ): Promise<{ exists: boolean; item?: any }> {
    const userUuid = req.user.uuid;
    const result = await this.wishlistService.checkItemExists(uuid, userUuid, productUuid);
    return result;
  }
}
