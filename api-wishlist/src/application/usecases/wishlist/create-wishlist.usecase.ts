import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';
import { ErrorHandler, WISHLIST_EXCEPTIONS } from '@shared/utils/error-handler.util';

@Injectable()
export class CreateWishlistUseCase {
  private readonly logger = new Logger(CreateWishlistUseCase.name);

  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    try {
      const items = createWishlistDto.items?.map(
        item =>
          new WishlistItem(
            item.productUuid,
            item.addedAt || new Date(),
            item.notes,
          ),
      ) || [];

      const wishlist = Wishlist.create(
        uuidv4(),
        createWishlistDto.userUuid,
        createWishlistDto.name,
        items,
      );

      return this.wishlistRepository.create(wishlist);
    } catch (error) {
      this.logger.error(`Erro ao criar wishlist para usuário ${createWishlistDto.userUuid}:`, error.stack || error);
      
      // Usando ErrorHandler para tratamento padronizado
      ErrorHandler.handle(error, WISHLIST_EXCEPTIONS);
    }
  }
}
