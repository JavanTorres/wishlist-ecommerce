import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PublisherPort } from '@application/ports/publisher.port';
import { WishlistPublisher } from '@infrastructure/messaging/publisher/wishlist.publisher';


@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PublisherPort,
      useClass: WishlistPublisher,
    },
  ],
  exports: [PublisherPort],
})
export class RabbitMQModule {}
