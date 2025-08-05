import { Injectable, NotFoundException, Logger } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

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
      
      // Usando ErrorHandler para tratamento mais limpo
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}