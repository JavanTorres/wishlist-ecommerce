import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PublisherPort } from '@application/ports/publisher.port';
import { Wishlist } from '@domain/entities/wishlist.entity';

@Injectable()
export class WishlistPublisher extends PublisherPort<Wishlist> {
  constructor(private readonly config: ConfigService) {
    super();
  }

  async publish(action: string, wishlist: Wishlist): Promise<void> {
    return;
  }
}