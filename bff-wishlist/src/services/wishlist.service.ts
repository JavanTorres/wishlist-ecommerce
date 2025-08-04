import { Injectable, Inject } from '@nestjs/common';

import { WishlistGatewayPort } from '@application/ports/wishlist-gateway.port';
import { Wishlist } from '@domain/entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @Inject('WishlistGatewayPort')
    private readonly wishlistGateway: WishlistGatewayPort,
  ) {}

async findAll(token: string) {
  return this.wishlistGateway.findAll(token);
}

  async findById(uuid: string): Promise<Wishlist> {
    return this.wishlistGateway.findById(uuid);
  }
}