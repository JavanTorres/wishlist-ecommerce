export class WishlistItemResponseDto {
  productUuid: string;
  addedAt: Date;
  notes?: string;
}

export class WishlistResponseDto {
  uuid: string;
  userUuid: string;
  name: string;
  items: WishlistItemResponseDto[];
  createdAt: Date;
  updatedAt: Date;
}
