import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist } from '@domain/entities/wishlist.entity';

import { FindWishlistByIdUseCase } from '../find-wishlist-by-id.usecase';

describe('FindWishlistByIdUseCase', () => {
  let repository: jest.Mocked<WishlistRepositoryContract>;
  let useCase: FindWishlistByIdUseCase;

  const validUuid = '123e4567-e89b-12d3-a456-426614174001';
  const invalidUuid = '123e4567-e89b-12d3-a456-426614174099';

  const dummyWishlist = new Wishlist(
    validUuid,
    '123e4567-e89b-12d3-a456-426614174002',
    'Favoritos',
    [],
    new Date(),
    new Date()
  );

  beforeEach(() => {
    repository = {
      findById: jest.fn(),
    } as any;
    useCase = new FindWishlistByIdUseCase(repository);
  });

  it('deve retornar a wishlist quando o UUID existir', async () => {
    repository.findById.mockResolvedValue(dummyWishlist);

    const result = await useCase.execute(validUuid);

    expect(repository.findById).toHaveBeenCalledWith(validUuid);
    expect(result).toBe(dummyWishlist);
  });

  it('deve lançar NotFoundException quando não encontrar a wishlist', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute(invalidUuid)).rejects.toBeInstanceOf(NotFoundException);
    await expect(useCase.execute(invalidUuid)).rejects.toThrow(
      `Wishlist uuid ${invalidUuid} não encontrada.`
    );
    expect(repository.findById).toHaveBeenCalledWith(invalidUuid);
  });

  it('deve lançar InternalServerErrorException quando o repositório lançar erro', async () => {
    repository.findById.mockRejectedValue(new Error('Falha no banco de dados'));

    await expect(useCase.execute(validUuid)).rejects.toBeInstanceOf(InternalServerErrorException);
    await expect(useCase.execute(validUuid)).rejects.toThrow('Falha no banco de dados');
    expect(repository.findById).toHaveBeenCalledWith(validUuid);
  });
});