import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';

@Injectable()
export class UpdateWishlistUseCase {
  private readonly logger = new Logger(UpdateWishlistUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(uuid: string, updateWishlistDto: CreateWishlistDto) {
    try {
      const wishlist = new Wishlist(
        uuid,
        updateWishlistDto.userUuid,
        updateWishlistDto.name,
        updateWishlistDto.items?.map(
          item =>
            new WishlistItem(
              item.productUuid,
              new Date(),
              item.notes,
            ),
        ) || [],
        new Date(),
        new Date(),
      );
      const wishlistUpdated = await this.wishlistRepository.update(wishlist);
      if (!wishlistUpdated) {
        throw new NotFoundException(`Wishlist uuid ${uuid} não encontrada.`);
      }
      return wishlistUpdated;
    } catch (error) {
      this.logger.error(`Erro ao atualizar wishlist uuid ${uuid}:`, error.stack || error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}