import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/create-wishlist.dto';

@Injectable()
export class CreateWishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    const wishlist = new Wishlist(
      uuidv4(),
      createWishlistDto.userUuid,
      createWishlistDto.name,
      createWishlistDto.items?.map(
        item =>
          new WishlistItem(
            item.productUuid,
            new Date(), // addedAt gerado automaticamente
            item.notes,
          ),
      ) || [],
      new Date(),
      new Date(),
    );
    return this.wishlistRepository.create(wishlist);
  }
}
