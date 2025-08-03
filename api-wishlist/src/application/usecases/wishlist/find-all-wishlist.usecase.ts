import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist } from '@domain/entities/wishlist.entity';

@Injectable()
export class FindAllWishlistsUseCase {
  private readonly logger = new Logger(FindAllWishlistsUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(): Promise<Wishlist[]> {
    try {
      return await this.wishlistRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar todas as wishlists:', error.stack || error);
      throw new InternalServerErrorException(
        `Erro ao buscar todas as wishlists: ${error.message}`
      );
    }
  }
}
