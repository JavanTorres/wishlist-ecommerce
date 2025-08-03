import { Wishlist } from '@domain/entities/wishlist.entity';

import { WishlistResponseDto, WishlistItemResponseDto } from '../dto/wishlist-response.dto';

export class WishlistMapper {
  static toResponse(wishlist: Wishlist): WishlistResponseDto {
    return {
      uuid: wishlist.uuid,
      userUuid: wishlist.userUuid,
      name: wishlist.name,
      items: wishlist.items.map(
        (item): WishlistItemResponseDto => ({
          productUuid: item.productUuid,
          addedAt: item.addedAt,
          notes: item.notes,
        })
      ),
      createdAt: wishlist.createdAt,
    };
  }
}