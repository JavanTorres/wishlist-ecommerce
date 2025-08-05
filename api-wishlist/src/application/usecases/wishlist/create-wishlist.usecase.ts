import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';

@Injectable()
export class CreateWishlistUseCase {
  constructor(private readonly wishlistRepository: WishlistRepositoryContract) {}

  async execute(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
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
  }
}
