import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';
import { DuplicateProductInWishlistException } from '@shared/exceptions/duplicate-product-in-wishlist.exception';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

@Injectable()
export class UpdateWishlistUseCase {
  private readonly logger = new Logger(UpdateWishlistUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(uuid: string, updateWishlistDto: CreateWishlistDto) {
    try {
      const items = updateWishlistDto.items?.map(
        item =>
          new WishlistItem(
            item.productUuid,
            item.addedAt || new Date(), // Preserva a data original se existir
            item.notes,
          ),
      ) || [];

      const wishlist = Wishlist.create(
        uuid,
        updateWishlistDto.userUuid,
        updateWishlistDto.name,
        items,
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
      if (error instanceof WishlistLimitExceededException) {
        throw error;
      }
      if (error instanceof DuplicateProductInWishlistException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}