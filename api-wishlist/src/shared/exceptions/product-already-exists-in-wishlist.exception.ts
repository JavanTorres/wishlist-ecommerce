import { BadRequestException } from '@nestjs/common';

export class ProductAlreadyExistsInWishlistException extends BadRequestException {
  constructor(productUuid: string) {
    super(`Produto ${productUuid} já existe na wishlist.`);
  }
}
