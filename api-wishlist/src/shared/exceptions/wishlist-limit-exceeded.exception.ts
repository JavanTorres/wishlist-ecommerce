import { BadRequestException } from '@nestjs/common';

import { WISHLIST_MAX_ITEMS } from '@shared/constants';

export class WishlistLimitExceededException extends BadRequestException {
  constructor(currentItems?: number) {
    const message = currentItems 
      ? `Wishlist não pode ter mais de ${WISHLIST_MAX_ITEMS} itens. Atualmente possui ${currentItems} itens.`
      : `Wishlist não pode ter mais de ${WISHLIST_MAX_ITEMS} itens.`;
    
    super(message);
  }
}
