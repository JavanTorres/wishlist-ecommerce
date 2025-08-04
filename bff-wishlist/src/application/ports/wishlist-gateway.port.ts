import { Wishlist } from '@domain/entities/wishlist.entity';

export abstract class WishlistGatewayPort {
abstract findAll(token: string): Promise<Wishlist[]>;
abstract findById(uuid: string): Promise<Wishlist>;
}
