import { WISHLIST_MAX_ITEMS } from '@shared/constants';
import { DuplicateProductInWishlistException } from '@shared/exceptions/duplicate-product-in-wishlist.exception';
import { ProductAlreadyExistsInWishlistException } from '@shared/exceptions/product-already-exists-in-wishlist.exception';
import { ProductNotFoundInWishlistException } from '@shared/exceptions/product-not-found-in-wishlist.exception';
import { UnauthorizedWishlistAccessException } from '@shared/exceptions/unauthorized-wishlist-access.exception';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

export class Wishlist {
  constructor(
    public readonly uuid: string,
    public readonly userUuid: string,
    public readonly name: string,
    public readonly items: WishlistItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {
    this.validateItemsLimit();
    this.validateNoDuplicateProducts();
  }

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

  private validateItemsLimit(): void {
    if (this.items.length > WISHLIST_MAX_ITEMS) {
      throw new WishlistLimitExceededException(this.items.length);
    }
  }

  private validateNoDuplicateProducts(): void {
    if (this.items.length === 0) return;
    
    const productUuids = this.items.map(item => item.productUuid);
    const uniqueProductUuids = new Set(productUuids);
    
    if (productUuids.length !== uniqueProductUuids.size) {
      const duplicateProductUuid = productUuids.find((uuid, index) => 
        productUuids.indexOf(uuid) !== index
      );
      throw new DuplicateProductInWishlistException(duplicateProductUuid!);
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

  public removeItem(productUuid: string): Wishlist {
    const newItems = this.items.filter(item => item.productUuid !== productUuid);
    return new Wishlist(
      this.uuid,
      this.userUuid,
      this.name,
      newItems,
      this.createdAt,
      new Date(),
    );
  }

  public hasItem(productUuid: string): boolean {
    return this.items.some(item => item.productUuid === productUuid);
  }

  public getItem(productUuid: string): WishlistItem | undefined {
    return this.items.find(item => item.productUuid === productUuid);
  }

  public verifyOwnership(userUuid: string): void {
    if (this.userUuid !== userUuid) {
      throw new UnauthorizedWishlistAccessException();
    }
  }

  public addItemSafely(item: WishlistItem, requestingUserUuid: string): Wishlist {
    this.verifyOwnership(requestingUserUuid);
    
    if (this.hasItem(item.productUuid)) {
      throw new ProductAlreadyExistsInWishlistException(item.productUuid);
    }
    
    return this.addItem(item);
  }

  public removeItemSafely(productUuid: string, requestingUserUuid: string): Wishlist {
    this.verifyOwnership(requestingUserUuid);
    
    if (!this.hasItem(productUuid)) {
      throw new ProductNotFoundInWishlistException(productUuid);
    }
    
    return this.removeItem(productUuid);
  }

  public getItemSafely(productUuid: string, requestingUserUuid: string): { exists: boolean; item?: WishlistItem } {
    this.verifyOwnership(requestingUserUuid);
    
    const item = this.getItem(productUuid);
    return {
      exists: !!item,
      item: item || undefined,
    };
  }
}

export class WishlistItem {
  constructor(
    public readonly productUuid: string,
    public readonly addedAt: Date,
    public readonly notes?: string,
  ) {}
}