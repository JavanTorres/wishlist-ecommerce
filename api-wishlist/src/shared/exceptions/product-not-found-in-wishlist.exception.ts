import { NotFoundException } from '@nestjs/common';

export class ProductNotFoundInWishlistException extends NotFoundException {
  constructor(productUuid: string) {
    super(`Produto ${productUuid} não encontrado na wishlist.`);
  }
}
