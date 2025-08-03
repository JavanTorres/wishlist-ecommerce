import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist } from '@domain/entities/wishlist.entity';

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
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
