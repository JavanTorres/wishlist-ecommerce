import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlists.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { WishlistGateway } from '@infrastructure/gateways/wishlist.gateway';
import { WishlistResolver } from '@presentation/resolvers/wishlist.resolver';

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    WishlistResolver,
    FindAllWishlistsUseCase,
    FindWishlistByIdUseCase,
    {
      provide: 'WishlistGatewayPort',
      useClass: WishlistGateway,
    },
  ],
})
export class WishlistModule {}