import { InternalServerErrorException } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';

import { FindAllWishlistsUseCase } from '../find-all-wishlist.usecase';

describe('FindAllWishlistsUseCase', () => {
  let repository: jest.Mocked<WishlistRepositoryContract>;
  let useCase: FindAllWishlistsUseCase;

  beforeEach(() => {
    repository = {
      findAll: jest.fn(),
    } as any;
    useCase = new FindAllWishlistsUseCase(repository);
  });

  it('deve retornar uma lista de wishlists quando o repositório.findAll resolver wishlists', async () => {
    const wishlists: Wishlist[] = [
      new Wishlist(
        'd4f8c7a2-3b6e-4567-b2f1-a9c8e6d5f4b3',
        'e1f2a3b4-c5d6-7a8b-9c0d-e1f2a3b4c5d6',
        'Favoritos',
        [
          new WishlistItem(
            '123e4567-e89b-12d3-a456-426614174002',
            new Date(),
            'Quero comprar na Black Friday'
          ),
        ],
        new Date(),
        new Date()
      ),
    ];
    repository.findAll.mockResolvedValue(wishlists);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(wishlists);
  });

  it('deve retornar um array vazio quando não houver wishlists', async () => {
    repository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });

  it('deve lançar InternalServerErrorException quando o repositório lançar erro', async () => {
    repository.findAll.mockRejectedValue(new Error('Falha no banco de dados'));

    const promise = useCase.execute();

    await expect(promise).rejects.toBeInstanceOf(InternalServerErrorException);
    await expect(promise).rejects.toThrow('Erro ao buscar todas as wishlists: Falha no banco de dados');
    expect(repository.findAll).toHaveBeenCalledTimes(1);
  });
});