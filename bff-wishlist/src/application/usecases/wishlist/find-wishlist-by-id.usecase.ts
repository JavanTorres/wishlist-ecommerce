import { Injectable, Inject, Logger, BadRequestException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { validate as isUuid } from 'uuid';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class FindWishlistByIdUseCase {
  private readonly logger = new Logger(FindWishlistByIdUseCase.name);

  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

  async execute(token: string, uuid: string): Promise<Wishlist> {
    try {
      // Validação de token
      if (!token?.trim()) {
        throw new UnauthorizedException('Token de autorização é obrigatório');
      }

      // Validação de UUID
      if (!uuid?.trim()) {
        throw new BadRequestException('UUID é obrigatório');
      }

      if (!isUuid(uuid)) {
        throw new BadRequestException('UUID deve ter um formato válido');
      }

      const wishlist = await this.wishlistGateway.findById(token, uuid);
      
      if (!wishlist) {
        throw new NotFoundException('Wishlist não encontrada');
      }
      
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao buscar wishlist ${uuid}:`, error.stack || error);
      
      // Tratamento específico para erros do gateway
      if (error.message?.includes('not found') || error.message?.includes('404')) {
        throw new NotFoundException(`Wishlist com UUID ${uuid} não foi encontrada`);
      }
      
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
