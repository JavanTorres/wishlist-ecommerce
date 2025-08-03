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
} from '@nestjs/swagger';



import { CreateWishlistRequestDto } from '@presentation/dto/create-wishlist-request.dto';
import { WishlistResponseDto } from '@presentation/dto/wishlist-response.dto';
import { WishlistMapper } from '@presentation/mappers/wishlist.mapper';
import { WishlistService } from '@services/wishlist.service';

@Controller({
  path: 'wishlists',
  version: '1',
})
@ApiTags('wishlists')
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
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWishlistRequestDto: CreateWishlistRequestDto,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistService.create(createWishlistRequestDto);
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
    @Param('uuid') uuid: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createWishlistRequestDto: CreateWishlistRequestDto,
  ): Promise<WishlistResponseDto> {
    const wishlist = await this.wishlistService.update(
      uuid,
      createWishlistRequestDto,
    );
    return WishlistMapper.toResponse(wishlist);
  }
}
