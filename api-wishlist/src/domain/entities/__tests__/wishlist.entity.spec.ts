import { WISHLIST_MAX_ITEMS } from '@shared/constants';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

import { Wishlist, WishlistItem } from '../wishlist.entity';

describe('Wishlist Entity', () => {
  const validUuid = '123e4567-e89b-12d3-a456-426614174001';
  const userUuid = '123e4567-e89b-12d3-a456-426614174002';
  const wishlistName = 'Minha Wishlist';

  describe('constructor', () => {
    it('deve criar uma wishlist válida com itens dentro do limite', () => {
      const items = [
        new WishlistItem('product-1', new Date(), 'Nota 1'),
        new WishlistItem('product-2', new Date(), 'Nota 2'),
      ];

      const wishlist = new Wishlist(
        validUuid,
        userUuid,
        wishlistName,
        items,
        new Date(),
        new Date(),
      );

      expect(wishlist.uuid).toBe(validUuid);
      expect(wishlist.userUuid).toBe(userUuid);
      expect(wishlist.name).toBe(wishlistName);
      expect(wishlist.items).toHaveLength(2);
    });

    it('deve lançar WishlistLimitExceededException quando exceder o limite de itens', () => {
      const tooManyItems = Array.from({ length: WISHLIST_MAX_ITEMS + 1 }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );

      expect(() => {
        new Wishlist(
          validUuid,
          userUuid,
          wishlistName,
          tooManyItems,
          new Date(),
          new Date(),
        );
      }).toThrow(WishlistLimitExceededException);
    });

    it('deve aceitar exatamente o número máximo de itens', () => {
      const maxItems = Array.from({ length: WISHLIST_MAX_ITEMS }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );

      expect(() => {
        new Wishlist(
          validUuid,
          userUuid,
          wishlistName,
          maxItems,
          new Date(),
          new Date(),
        );
      }).not.toThrow();
    });
  });

  describe('create factory method', () => {
    it('deve criar uma wishlist usando o método factory', () => {
      const items = [new WishlistItem('product-1', new Date())];
      
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);

      expect(wishlist.uuid).toBe(validUuid);
      expect(wishlist.userUuid).toBe(userUuid);
      expect(wishlist.name).toBe(wishlistName);
      expect(wishlist.items).toEqual(items);
      expect(wishlist.createdAt).toBeInstanceOf(Date);
      expect(wishlist.updatedAt).toBeInstanceOf(Date);
    });

    it('deve criar uma wishlist vazia quando não informar itens', () => {
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName);

      expect(wishlist.items).toHaveLength(0);
    });
  });

  describe('canAddItems', () => {
    it('deve retornar true quando pode adicionar itens', () => {
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, []);

      expect(wishlist.canAddItems(5)).toBe(true);
      expect(wishlist.canAddItems(WISHLIST_MAX_ITEMS)).toBe(true);
    });

    it('deve retornar false quando não pode adicionar itens', () => {
      const items = Array.from({ length: WISHLIST_MAX_ITEMS }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);

      expect(wishlist.canAddItems(1)).toBe(false);
    });

    it('deve retornar false quando adicionar itens excederia o limite', () => {
      const items = Array.from({ length: 18 }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);

      expect(wishlist.canAddItems(2)).toBe(true);
      expect(wishlist.canAddItems(3)).toBe(false);
    });
  });

  describe('getRemainingSlots', () => {
    it('deve retornar o número correto de slots restantes', () => {
      const items = Array.from({ length: 15 }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);

      expect(wishlist.getRemainingSlots()).toBe(5);
    });

    it('deve retornar 0 quando a wishlist estiver cheia', () => {
      const items = Array.from({ length: WISHLIST_MAX_ITEMS }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);

      expect(wishlist.getRemainingSlots()).toBe(0);
    });

    it('deve retornar o máximo quando a wishlist estiver vazia', () => {
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, []);

      expect(wishlist.getRemainingSlots()).toBe(WISHLIST_MAX_ITEMS);
    });
  });

  describe('addItem', () => {
    it('deve adicionar um item quando há espaço disponível', async () => {
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, []);
      
      // Aguarda um pequeno intervalo para garantir que updatedAt seja diferente
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const newItem = new WishlistItem('new-product', new Date(), 'Nova nota');
      const updatedWishlist = wishlist.addItem(newItem);

      expect(updatedWishlist.items).toHaveLength(1);
      expect(updatedWishlist.items[0]).toBe(newItem);
      expect(updatedWishlist.updatedAt.getTime()).toBeGreaterThanOrEqual(wishlist.updatedAt.getTime());
    });

    it('deve lançar exceção quando tentar adicionar item em wishlist cheia', () => {
      const items = Array.from({ length: WISHLIST_MAX_ITEMS }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, items);
      const newItem = new WishlistItem('new-product', new Date());

      expect(() => wishlist.addItem(newItem)).toThrow(WishlistLimitExceededException);
    });
  });

  describe('addItems', () => {
    it('deve adicionar múltiplos itens quando há espaço disponível', () => {
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, []);
      const newItems = [
        new WishlistItem('product-1', new Date()),
        new WishlistItem('product-2', new Date()),
      ];

      const updatedWishlist = wishlist.addItems(newItems);

      expect(updatedWishlist.items).toHaveLength(2);
      expect(updatedWishlist.items).toEqual(expect.arrayContaining(newItems));
    });

    it('deve lançar exceção quando tentar adicionar itens que excedem o limite', () => {
      const existingItems = Array.from({ length: 19 }, (_, index) =>
        new WishlistItem(`product-${index}`, new Date()),
      );
      const wishlist = Wishlist.create(validUuid, userUuid, wishlistName, existingItems);
      
      const newItems = [
        new WishlistItem('product-19', new Date()),
        new WishlistItem('product-20', new Date()),
      ];

      expect(() => wishlist.addItems(newItems)).toThrow(WishlistLimitExceededException);
    });
  });
});
