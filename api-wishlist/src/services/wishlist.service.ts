import { Injectable } from '@nestjs/common';

import { CreateWishlistUseCase } from '@application/usecases/wishlist/create-wishlist.usecase';
import { DeleteWishlistByIdUseCase } from '@application/usecases/wishlist/delete-wishlist-by-id.usecase';
import { FindAllWishlistsUseCase } from '@application/usecases/wishlist/find-all-wishlist.usecase';
import { FindWishlistByIdUseCase } from '@application/usecases/wishlist/find-wishlist-by-id.usecase';
import { UpdateWishlistUseCase } from '@application/usecases/wishlist/update-wishlist.usecase';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';

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

  async addItem(
    wishlistUuid: string,
    userUuid: string,
    itemData: { productUuid: string; notes?: string },
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistByIdUseCase.execute(wishlistUuid);

    const newItem = new WishlistItem(
      itemData.productUuid,
      new Date(),
      itemData.notes,
    );

    const updatedWishlist = wishlist.addItemSafely(newItem, userUuid);

    return this.updateWishlistUseCase.execute(wishlistUuid, {
      name: updatedWishlist.name,
      items: updatedWishlist.items.map(item => ({
        productUuid: item.productUuid,
        addedAt: item.addedAt, // Preserva a data original
        notes: item.notes,
      })),
      userUuid: updatedWishlist.userUuid,
    });
  }

  async removeItem(
    wishlistUuid: string,
    userUuid: string,
    productUuid: string,
  ): Promise<Wishlist> {
    const wishlist = await this.findWishlistByIdUseCase.execute(wishlistUuid);

    const updatedWishlist = wishlist.removeItemSafely(productUuid, userUuid);

    return this.updateWishlistUseCase.execute(wishlistUuid, {
      name: updatedWishlist.name,
      items: updatedWishlist.items.map(item => ({
        productUuid: item.productUuid,
        addedAt: item.addedAt, // Preserva a data original
        notes: item.notes,
      })),
      userUuid: updatedWishlist.userUuid,
    });
  }

  async findByIdAndUser(wishlistUuid: string, userUuid: string): Promise<Wishlist> {
    const wishlist = await this.findWishlistByIdUseCase.execute(wishlistUuid);
    
    wishlist.verifyOwnership(userUuid);

    return wishlist;
  }

  async checkItemExists(
    wishlistUuid: string,
    userUuid: string,
    productUuid: string,
  ): Promise<{ exists: boolean; item?: WishlistItem }> {
    const wishlist = await this.findWishlistByIdUseCase.execute(wishlistUuid);
    
    return wishlist.getItemSafely(productUuid, userUuid);
  }
}
