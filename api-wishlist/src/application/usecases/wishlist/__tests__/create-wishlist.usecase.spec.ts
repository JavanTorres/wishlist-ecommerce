import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';
import { DuplicateProductInWishlistException } from '@shared/exceptions/duplicate-product-in-wishlist.exception';
import { WishlistLimitExceededException } from '@shared/exceptions/wishlist-limit-exceeded.exception';

import { CreateWishlistUseCase } from '../create-wishlist.usecase';



describe('CreateWishlistUseCase', () => {
  let useCase: CreateWishlistUseCase;
  let repo: jest.Mocked<WishlistRepositoryContract>;

  beforeEach(() => {
    repo = {
      create: jest.fn(),
    } as unknown as jest.Mocked<WishlistRepositoryContract>;

    useCase = new CreateWishlistUseCase(repo);
  });

  it('deve criar uma wishlist, chamar repo.create e retornar o resultado', async () => {
    const dto: CreateWishlistDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Favoritos Games',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174002',
          notes: 'Quero comprar na Black Friday',
        },
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174003',
          notes: 'BATTLEFIELD 6',
        },
      ],
    };

    const wishlistItems = dto.items.map(item => 
      new WishlistItem(item.productUuid, new Date(), item.notes)
    );

    const mockWishlist = Wishlist.create(
      'test-uuid',
      dto.userUuid,
      dto.name,
      wishlistItems,
    );

    repo.create.mockResolvedValue(mockWishlist);

    const result = await useCase.execute(dto);

    expect(repo.create).toHaveBeenCalledTimes(1);

    const createdArg = repo.create.mock.calls[0][0];
    expect(createdArg).toBeInstanceOf(Wishlist);
    expect(createdArg.userUuid).toBe(dto.userUuid);
    expect(createdArg.name).toBe(dto.name);
    expect(createdArg.items.length).toBe(2);
    expect(createdArg.items[0]).toBeInstanceOf(WishlistItem);
    expect(createdArg.items[0].productUuid).toBe(dto.items![0].productUuid);
    expect(createdArg.items[0].notes).toBe(dto.items![0].notes);

    expect(result).toEqual(mockWishlist);
  });

  it('deve lançar WishlistLimitExceededException quando tentar criar wishlist com mais de 20 itens', async () => {
    const itemsOver20 = Array.from({ length: 21 }, (_, index) => ({
      productUuid: `123e4567-e89b-12d3-a456-42661417${index.toString().padStart(4, '0')}`,
      notes: `Item ${index + 1}`,
    }));

    const dto: CreateWishlistDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Wishlist com muitos itens',
      items: itemsOver20,
    };

    await expect(useCase.execute(dto)).rejects.toThrow(WishlistLimitExceededException);
    expect(repo.create).not.toHaveBeenCalled();
  });

  it('deve criar wishlist com exatamente 20 itens', async () => {
    const exactlyTwentyItems = Array.from({ length: 20 }, (_, index) => ({
      productUuid: `123e4567-e89b-12d3-a456-42661417${index.toString().padStart(4, '0')}`,
      notes: `Item ${index + 1}`,
    }));

    const dto: CreateWishlistDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Wishlist com 20 itens',
      items: exactlyTwentyItems,
    };

    const wishlistItems = dto.items.map(item => 
      new WishlistItem(item.productUuid, new Date(), item.notes)
    );

    const mockWishlist = Wishlist.create(
      'test-uuid',
      dto.userUuid,
      dto.name,
      wishlistItems,
    );

    repo.create.mockResolvedValue(mockWishlist);

    const result = await useCase.execute(dto);

    expect(repo.create).toHaveBeenCalledTimes(1);
    const createdArg = repo.create.mock.calls[0][0];
    expect(createdArg.items.length).toBe(20);
    expect(result).toEqual(mockWishlist);
  });

  it('deve lançar DuplicateProductInWishlistException quando há produtos duplicados (vem da entidade)', async () => {
    const dto: CreateWishlistDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174001',
      name: 'Favoritos Games',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174002',
          notes: 'Produto 1',
        },
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174002', // Duplicado
          notes: 'Produto 1 duplicado',
        },
      ],
    };

    // A exception deve vir da entidade, não do use case
    await expect(useCase.execute(dto)).rejects.toThrow(DuplicateProductInWishlistException);
    expect(repo.create).not.toHaveBeenCalled();
  });
});