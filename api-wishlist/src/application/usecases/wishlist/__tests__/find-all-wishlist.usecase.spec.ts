import { InternalServerErrorException } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';

import { FindAllWishlistsUseCase } from '../find-all-wishlist.usecase';

describe('FindAllWishlistsUseCase', () => {
  let repository: jest.Mocked<WishlistRepositoryContract>;
  let useCase: FindAllWishlistsUseCase;

  beforeEach(() => {
    repository = {
      findAllByUserUuid: jest.fn(),
    } as any;
    useCase = new FindAllWishlistsUseCase(repository);
  });

  it('deve retornar uma lista de wishlists de um usuário quando o repositório.findAllByUserUuid resolver wishlists', async () => {
    const userUuid = 'e1f2a3b4-c5d6-7a8b-9c0d-e1f2a3b4c5d6';
    const wishlists: Wishlist[] = [
      new Wishlist(
        'd4f8c7a2-3b6e-4567-b2f1-a9c8e6d5f4b3',
        userUuid,
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
    repository.findAllByUserUuid.mockResolvedValue(wishlists);

    const result = await useCase.execute(userUuid);

    expect(repository.findAllByUserUuid).toHaveBeenCalledTimes(1);
    expect(repository.findAllByUserUuid).toHaveBeenCalledWith(userUuid);
    expect(result).toEqual(wishlists);
  });

  it('deve retornar um array vazio quando o usuário não possuir wishlists', async () => {
    const userUuid = 'e1f2a3b4-c5d6-7a8b-9c0d-e1f2a3b4c5d6';
    repository.findAllByUserUuid.mockResolvedValue([]);

    const result = await useCase.execute(userUuid);

    expect(repository.findAllByUserUuid).toHaveBeenCalledTimes(1);
    expect(repository.findAllByUserUuid).toHaveBeenCalledWith(userUuid);
    expect(result).toEqual([]);
  });

  it('deve lançar InternalServerErrorException quando o repositório lançar erro', async () => {
    const userUuid = 'e1f2a3b4-c5d6-7a8b-9c0d-e1f2a3b4c5d6';
    repository.findAllByUserUuid.mockRejectedValue(new Error('Falha no banco de dados'));

    const promise = useCase.execute(userUuid);

    await expect(promise).rejects.toBeInstanceOf(InternalServerErrorException);
    await expect(promise).rejects.toThrow('Erro ao buscar wishlists do usuário: Falha no banco de dados');
    expect(repository.findAllByUserUuid).toHaveBeenCalledTimes(1);
    expect(repository.findAllByUserUuid).toHaveBeenCalledWith(userUuid);
  });
});