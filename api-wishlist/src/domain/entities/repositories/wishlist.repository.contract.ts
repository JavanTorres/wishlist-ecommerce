import { Wishlist } from '../wishlist.entity';

export abstract class WishlistRepositoryContract {
  abstract create(wishlist: Wishlist): Promise<Wishlist>;
  abstract findAll(): Promise<Wishlist[]>;
  abstract findById(uuid: string): Promise<Wishlist | null>;
  abstract deleteById(uuid: string): Promise<boolean>;
  abstract update(wishlist: Wishlist): Promise<Wishlist | null>;
}
