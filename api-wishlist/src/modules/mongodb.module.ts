import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { WishlistRepositoryImpl } from '@infrastructure/database/wishlist.repository.impl';
import { WishlistDocument, WishlistSchema } from '@shared/mongodb/wishlist.schema';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    MongooseModule.forFeature([
      { name: WishlistDocument.name, schema: WishlistSchema },
    ]),
  ],
  providers: [WishlistRepositoryImpl],
  exports: [MongooseModule, WishlistRepositoryImpl],
})
export class MongodbModule {}