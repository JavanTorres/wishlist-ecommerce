import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { WishlistGateway } from '@infrastructure/gateways/wishlist.gateway';
import { WishlistResolver } from '@presentation/resolvers/wishlist.resolver';
import { WishlistService } from '@services/wishlist.service';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    WishlistResolver,
    WishlistService,
    {
      provide: 'WishlistGatewayPort',
      useClass: WishlistGateway,
    },
  ],
})
export class WishlistModule {}