import { ForbiddenException } from '@nestjs/common';

export class UnauthorizedWishlistAccessException extends ForbiddenException {
  constructor() {
    super('Acesso não autorizado à wishlist.');
  }
}
