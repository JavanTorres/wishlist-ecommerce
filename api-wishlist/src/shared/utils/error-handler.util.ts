import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { DuplicateProductInWishlistException } from '@shared/exceptions/duplicate-product-in-wishlist.exception';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

/**
 * Lista de tipos de exceção que devem ser re-lançados sem modificação
 */
type KnownException = 
  | typeof NotFoundException
  | typeof WishlistLimitExceededException  
  | typeof DuplicateProductInWishlistException;

/**
 * Utilitário para tratamento padronizado de erros em use cases
 */
export class ErrorHandler {
  /**
   * Verifica se o erro é uma exceção conhecida que deve ser re-lançada
   */
  private static isKnownException(error: any, knownExceptions: KnownException[]): boolean {
    return knownExceptions.some(ExceptionType => error instanceof ExceptionType);
  }

  /**
   * Trata erros de forma padronizada
   * @param error - O erro capturado
   * @param knownExceptions - Lista de exceções que devem ser re-lançadas
   * @throws Re-lança exceções conhecidas ou InternalServerErrorException
   */
  static handle(error: any, knownExceptions: readonly KnownException[] = []): never {
    if (this.isKnownException(error, [...knownExceptions])) {
      throw error;
    }
    
    throw new InternalServerErrorException(error.message);
  }
}

/**
 * Exceções comuns para operações de wishlist
 */
export const WISHLIST_EXCEPTIONS = [
  NotFoundException,
  WishlistLimitExceededException,
  DuplicateProductInWishlistException,
] as const;
