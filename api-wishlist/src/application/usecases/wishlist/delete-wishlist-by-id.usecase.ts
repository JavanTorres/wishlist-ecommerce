import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';

@Injectable()
export class DeleteWishlistByIdUseCase {
  private readonly logger = new Logger(DeleteWishlistByIdUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(uuid: string): Promise<void> {
    try {
      const deleted = await this.wishlistRepository.deleteById(uuid);
      if (!deleted) {
        throw new NotFoundException(`Wishlist uuid ${uuid} não encontrado.`);
      }
    } catch (error) {
      this.logger.error(`Erro ao deletar wishlist uuid ${uuid}:`, error.stack || error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
