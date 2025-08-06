
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist } from '@domain/entities/wishlist.entity';
import { WishlistDocument } from '@shared/mongodb/wishlist.schema';

@Injectable()
export class WishlistRepositoryImpl implements WishlistRepositoryContract {
  constructor(
    @InjectModel(WishlistDocument.name)
    private readonly model: Model<WishlistDocument>,
  ) {}

  async create(wishlist: Wishlist): Promise<Wishlist> {
    const createdWishlist = await this.model.create({
      uuid: wishlist.uuid,
      userUuid: wishlist.userUuid,
      name: wishlist.name,
      items: wishlist.items,
      createdAt: wishlist.createdAt,
      updatedAt: wishlist.updatedAt,
    });
    return new Wishlist(
      createdWishlist.uuid,
      createdWishlist.userUuid,
      createdWishlist.name,
      createdWishlist.items,
      createdWishlist.createdAt,
      createdWishlist.updatedAt,
    );
  }

  async findAll(): Promise<Wishlist[]> {
    const wishlists = await this.model.find().exec();
    return wishlists.map(
      (wishlist) =>
        new Wishlist(
          wishlist.uuid,
          wishlist.userUuid,
          wishlist.name,
          wishlist.items,
          wishlist.createdAt,
          wishlist.updatedAt,
        ),
    );
  }

  async findAllByUserUuid(userUuid: string): Promise<Wishlist[]> {
    const wishlists = await this.model.find({ userUuid }).exec();
    return wishlists.map(
      (wishlist) =>
        new Wishlist(
          wishlist.uuid,
          wishlist.userUuid,
          wishlist.name,
          wishlist.items,
          wishlist.createdAt,
          wishlist.updatedAt,
        ),
    );
  }

  async findById(uuid: string): Promise<Wishlist | null> {
    const wishlist = await this.model.findOne({ uuid }).exec();
    if (!wishlist) return null;
    return new Wishlist(
      wishlist.uuid,
      wishlist.userUuid,
      wishlist.name,
      wishlist.items,
      wishlist.createdAt,
      wishlist.updatedAt,
    );
  }

  async deleteById(uuid: string): Promise<boolean> {
    const result = await this.model.deleteOne({ uuid }).exec();
    return result.deletedCount === 1;
  }

  async update(wishlist: Wishlist): Promise<Wishlist | null> {
    const updatedWishlist = await this.model
      .findOneAndUpdate(
        { uuid: wishlist.uuid },
        {
          userUuid: wishlist.userUuid,
          name: wishlist.name,
          items: wishlist.items,
          updatedAt: wishlist.updatedAt,
        },
        { new: true },
      )
      .exec();

    if (!updatedWishlist) {
      return null;
    }

    return new Wishlist(
      updatedWishlist.uuid,
      updatedWishlist.userUuid,
      updatedWishlist.name,
      updatedWishlist.items,
      updatedWishlist.createdAt,
      updatedWishlist.updatedAt,
    );
  }

  async updateFields(fields: { uuid: string; userUuid: string; name: string; items: any[]; createdAt: Date }): Promise<Wishlist | null> {
    const updatedWishlist = await this.model
      .findOneAndUpdate(
        { uuid: fields.uuid },
        {
          userUuid: fields.userUuid,
          name: fields.name,
          items: fields.items,
          // createdAt mantém o original, updatedAt é atualizado automaticamente pelo Mongoose
        },
        { new: true },
      )
      .exec();

    if (!updatedWishlist) {
      return null;
    }

    return new Wishlist(
      updatedWishlist.uuid,
      updatedWishlist.userUuid,
      updatedWishlist.name,
      updatedWishlist.items,
      updatedWishlist.createdAt,
      updatedWishlist.updatedAt,
    );
  }
}
