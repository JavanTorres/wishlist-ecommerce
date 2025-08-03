export interface CreateWishlistItemDto {
  productUuid: string;
  notes?: string;
}

export interface CreateWishlistDto {
  userUuid: string;
  name: string;
  items: CreateWishlistItemDto[];
}
