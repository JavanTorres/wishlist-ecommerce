import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Type } from 'class-transformer';

@ObjectType()
export class WishlistItemDto {
  @Field()
  productUuid: string;

  @Type(() => Date)
  @Field()
  addedAt: Date;

  @Field({ nullable: true })
  notes?: string;
}

@ObjectType()
export class WishlistDto {
  @Field(() => ID)
  uuid: string;

  @Field()
  userUuid: string;

  @Field()
  name: string;

  @Type(() => WishlistItemDto)
  @Field(() => [WishlistItemDto])
  items: WishlistItemDto[];

  @Type(() => Date)
  @Field()
  createdAt: Date;
}