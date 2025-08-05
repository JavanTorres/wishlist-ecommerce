import { BadRequestException } from '@nestjs/common';

export class DuplicateProductInWishlistException extends BadRequestException {
  constructor(productUuid: string) {
    super(`Produto ${productUuid} duplicado. Não é possível adicionar produtos duplicados.`);
  }
}
