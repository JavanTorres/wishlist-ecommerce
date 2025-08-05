import { Wishlist } from '@domain/entities/wishlist.entity';

import { WishlistItemsResponseDto } from '../dto/wishlist/wishlist-items-response.dto';
import { WishlistResponseDto, WishlistItemResponseDto } from '../dto/wishlist/wishlist-response.dto';

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

  static toItemsResponse(wishlist: Wishlist): WishlistItemsResponseDto {
    return {
      uuid: wishlist.uuid,
      items: wishlist.items.map(item => ({
        productUuid: item.productUuid,
        addedAt: item.addedAt,
        notes: item.notes,
      })),
      totalItems: wishlist.items.length,
      remainingSlots: wishlist.getRemainingSlots(),
    };
  }
}