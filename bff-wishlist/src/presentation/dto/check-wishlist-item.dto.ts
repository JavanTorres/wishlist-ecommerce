import { Field, ObjectType } from '@nestjs/graphql';
import { Transform, Type } from 'class-transformer';

@ObjectType({ description: 'Item encontrado na wishlist' })
export class WishlistItemDto {
  @Field(() => String, { description: 'UUID do produto' })
  productUuid: string;

  @Field(() => Date, { nullable: true, description: 'Data quando o item foi adicionado' })
  @Type(() => Date)
  addedAt?: Date;

  @Field(() => String, { nullable: true, description: 'Notas sobre o produto' })
  notes?: string;

  @Field(() => String, { nullable: true, description: 'ID interno do item' })
  _id?: string;

  @Field(() => Date, { nullable: true, description: 'Data de criação' })
  @Type(() => Date)
  createdAt?: Date;

  @Field(() => Date, { nullable: true, description: 'Data de última atualização' })
  @Transform(({ value }) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return null;
  }, { toClassOnly: true })
  @Type(() => Date)
  updatedAt?: Date;
}

@ObjectType({ description: 'Resposta da verificação de existência de item na wishlist' })
export class CheckWishlistItemDto {
  @Field(() => Boolean, { description: 'Se o item existe na wishlist' })
  exists: boolean;

  @Field(() => WishlistItemDto, { nullable: true, description: 'Dados do item, se existir' })
  item?: WishlistItemDto;
}
