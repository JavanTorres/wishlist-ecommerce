import { WISHLIST_MAX_ITEMS } from '@shared/constants';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

export class Wishlist {
  /**
   * Retorna um objeto para updateFields do ORM, omitindo updatedAt.
   */
  public static updateFields(wishlist: Wishlist): { uuid: string; userUuid: string; name: string; items: WishlistItem[]; createdAt: Date } {
    return {
      uuid: wishlist.uuid,
      userUuid: wishlist.userUuid,
      name: wishlist.name,
      items: wishlist.items,
      createdAt: wishlist.createdAt,
      // updatedAt omitido
    };
  }
  constructor(
    public readonly uuid: string,
    public readonly userUuid: string,
    public readonly name: string,
    public readonly items: WishlistItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateItemsLimit();
  }

  private validateItemsLimit(): void {
    if (this.items.length > WISHLIST_MAX_ITEMS) {
      throw new WishlistLimitExceededException(this.items.length);
    }
  }

  public canAddItems(itemsToAdd: number): boolean {
    return this.items.length + itemsToAdd <= WISHLIST_MAX_ITEMS;
  }

  public getRemainingSlots(): number {
    return Math.max(0, WISHLIST_MAX_ITEMS - this.items.length);
  }

  public static create(
    uuid: string,
    userUuid: string,
    name: string,
    items: WishlistItem[] = [],
    createdAt?: Date,
    updatedAt?: Date,
  ): Wishlist {
    const now = new Date();
    return new Wishlist(
      uuid,
      userUuid,
      name,
      items,
      createdAt || now,
      updatedAt || now,
    );
  }

  public addItem(item: WishlistItem): Wishlist {
    if (!this.canAddItems(1)) {
      throw new WishlistLimitExceededException(this.items.length);
    }

    const newItems = [...this.items, item];
    return new Wishlist(
      this.uuid,
      this.userUuid,
      this.name,
      newItems,
      this.createdAt,
      new Date(),
    );
  }

  public addItems(items: WishlistItem[]): Wishlist {
    if (!this.canAddItems(items.length)) {
      throw new WishlistLimitExceededException(this.items.length + items.length);
    }

    const newItems = [...this.items, ...items];
    return new Wishlist(
      this.uuid,
      this.userUuid,
      this.name,
      newItems,
      this.createdAt,
      new Date(),
    );
  }
}

export class WishlistItem {
  constructor(
    public readonly productUuid: string,
    public readonly addedAt: Date,
    public readonly notes?: string,
  ) {}
}