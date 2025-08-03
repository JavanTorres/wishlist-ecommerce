

import { Module } from '@nestjs/common';


import { CreateWishlistUseCase } from '@application/usecases/wishlist/create-wishlist.usecase';
import { DeleteWishlistByIdUseCase } from '@application/usecases/wishlist/delete-wishlist-by-id.usecase';
import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlist.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { UpdateWishlistUseCase } from '@application/usecases/wishlist/update-wishlist.usecase';
import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { WishlistRepositoryImpl } from '@infrastructure/database/wishlist.repository.impl';
import { WishlistController } from '@presentation/controllers/wishlist.controller';
import { WishlistService } from '@services/wishlist.service';

import { MongodbModule } from './mongodb.module';

@Module({
  imports: [MongodbModule],
  controllers: [WishlistController],
  providers: [
    WishlistService,
    CreateWishlistUseCase,
    FindAllWishlistsUseCase,
    FindWishlistByIdUseCase,
    DeleteWishlistByIdUseCase,
    UpdateWishlistUseCase,
    { provide: WishlistRepositoryContract, useClass: WishlistRepositoryImpl },
  ],
})
export class WishlistModule {}
