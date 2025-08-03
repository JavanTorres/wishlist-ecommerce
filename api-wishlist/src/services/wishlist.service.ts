import { Injectable } from '@nestjs/common';

import { CreateWishlistUseCase } from '@application/usecases/wishlist/create-wishlist.usecase';
import { DeleteWishlistByIdUseCase } from '@application/usecases/wishlist/delete-wishlist-by-id.usecase';
import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlist.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { UpdateWishlistUseCase } from '@application/usecases/wishlist/update-wishlist.usecase';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/create-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    private readonly createWishlistUseCase: CreateWishlistUseCase,
    private readonly findAllWishlistsUseCase: FindAllWishlistsUseCase,
    private readonly findWishlistByIdUseCase: FindWishlistByIdUseCase,
    private readonly deleteWishlistByIdUseCase: DeleteWishlistByIdUseCase,
    private readonly updateWishlistUseCase: UpdateWishlistUseCase,
  ) {}

  async create(createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.createWishlistUseCase.execute(createWishlistDto);
  }

  async findAll(): Promise<Wishlist[]> {
    return this.findAllWishlistsUseCase.execute();
  }

  async findById(uuid: string): Promise<Wishlist> {
    return this.findWishlistByIdUseCase.execute(uuid);
  }

  async deleteById(uuid: string): Promise<void> {
    return this.deleteWishlistByIdUseCase.execute(uuid);
  }

  async update(uuid: string, createWishlistDto: CreateWishlistDto): Promise<Wishlist> {
    return this.updateWishlistUseCase.execute(uuid, createWishlistDto);
  }
}
