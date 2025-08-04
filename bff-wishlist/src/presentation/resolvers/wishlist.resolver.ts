import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { WishlistDto } from '@presentation/dto/wishlist.dto';
import { WishlistService } from '@services/wishlist.service';

@Resolver(() => WishlistDto)
export class WishlistResolver {
  constructor(private readonly wishlistService: WishlistService) {}

  @Query(() => [WishlistDto], { name: 'wishlists' })
  async wishlists(@Context() context) {
    const token = context.req?.headers?.authorization;
    const result = await this.wishlistService.findAll(token);
    return plainToInstance(WishlistDto, result);
  }

  @Query(() => WishlistDto, { name: 'wishlist' })
  async findById(@Args('uuid', { type: () => ID }) uuid: string): Promise<WishlistDto> {
    return this.wishlistService.findById(uuid);
  }
}