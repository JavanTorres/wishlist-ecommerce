import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UUID_REGEX } from '@shared/constants';

@Schema({ _id: false })
export class WishlistItemSubdocument {
  @Prop({ required: true })
  productUuid: string;

  @Prop({ required: true })
  addedAt: Date;

  @Prop()
  notes?: string;
}

@Schema({ collection: 'wishlists', timestamps: true })
export class WishlistDocument extends Document {
  @Prop({ required: true, match: UUID_REGEX })
  uuid: string;

  @Prop({ required: true, match: UUID_REGEX })
  userUuid: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [SchemaFactory.createForClass(WishlistItemSubdocument)], default: [] })
  items: WishlistItemSubdocument[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const WishlistItemSchema = SchemaFactory.createForClass(WishlistItemSubdocument);
export const WishlistSchema = SchemaFactory.createForClass(WishlistDocument);
