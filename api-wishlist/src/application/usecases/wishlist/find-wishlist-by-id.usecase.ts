import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class FindWishlistByIdUseCase {
  private readonly logger = new Logger(FindWishlistByIdUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(uuid: string): Promise<Wishlist> {
    try {
      const wishlist = await this.wishlistRepository.findById(uuid);
      if (!wishlist) {
        throw new NotFoundException(`Wishlist uuid ${uuid} não encontrada.`);
      }
      return wishlist;
    } catch (error) {
      this.logger.error(`Erro ao buscar wishlist uuid ${uuid}:`, error.stack || error);
      
      // Usando ErrorHandler para tratamento mais limpo
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
