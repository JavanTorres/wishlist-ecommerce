import { Wishlist } from '@domain/entities/wishlist.entity';
import { CreateWishlistInputDto } from '@presentation/dto/create-wishlist.dto';

export abstract class WishlistGatewayPort {
  abstract findAll(token: string): Promise<Wishlist[]>;
  abstract findById(token: string, uuid: string): Promise<Wishlist>;
  abstract create(token: string, createWishlistData: CreateWishlistInputDto): Promise<Wishlist>;
  abstract removeItem(token: string, wishlistUuid: string, productUuid: string): Promise<Wishlist>;
}
