import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { CreateWishlistDto } from '@presentation/dto/wishlist/create-wishlist.dto';

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

    const expectedWishlist = new Wishlist(
      expect.any(String),
      dto.userUuid,
      dto.name,
      [
        expect.any(WishlistItem),
        expect.any(WishlistItem),
      ],
      expect.any(Date),
      expect.any(Date),
    );

    repo.create.mockResolvedValue(expectedWishlist);

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

    expect(result).toBe(expectedWishlist);
  });
});