import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';

import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlists.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { AuthHelper } from '@infrastructure/helpers/auth.helper';
import { WishlistDto } from '@presentation/dto/wishlist.dto';

@Resolver(() => WishlistDto)
export class WishlistResolver {
  constructor(
    private readonly findAllWishlistsUseCase: FindAllWishlistsUseCase,
    private readonly findWishlistByIdUseCase: FindWishlistByIdUseCase,
  ) {}

  @Query(() => [WishlistDto], { 
    name: 'wishlists',
    description: 'Busca todas as listas de desejos do usuário autenticado'
  })
  async wishlists(@Context() context): Promise<WishlistDto[]> {
    const token = AuthHelper.extractToken(context);
    const result = await this.findAllWishlistsUseCase.execute(token);
    return plainToInstance(WishlistDto, result);
  }

  @Query(() => WishlistDto, { 
    name: 'wishlist',
    description: 'Busca uma lista de desejos específica pelo UUID'
  })
  async findById(
    @Args('uuid', { 
      type: () => ID,
      description: 'UUID da lista de desejos a ser buscada'
    }) uuid: string, 
    @Context() context
  ): Promise<WishlistDto> {
    const token = AuthHelper.extractToken(context);
    const result = await this.findWishlistByIdUseCase.execute(token, uuid);
    return plainToInstance(WishlistDto, result);
  }
}