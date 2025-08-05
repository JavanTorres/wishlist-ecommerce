export interface CreateWishlistItemDto {
  productUuid: string;
  addedAt?: Date;
  notes?: string;
}

export interface CreateWishlistDto {
  userUuid: string;
  name: string;
  items: CreateWishlistItemDto[];
}
