export class Wishlist {
  constructor(
    public readonly uuid: string,
    public readonly userUuid: string,
    public readonly name: string,
    public readonly items: WishlistItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}

export class WishlistItem {
  constructor(
    public readonly productUuid: string,
    public readonly addedAt: Date,
    public readonly notes?: string,
  ) {}
}