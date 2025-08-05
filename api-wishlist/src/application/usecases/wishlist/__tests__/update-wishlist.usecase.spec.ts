import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { Wishlist, WishlistItem } from '@domain/entities/wishlist.entity';
import { DuplicateProductInWishlistException } from '@shared/exceptions/duplicate-product-in-wishlist.exception';

import { UpdateWishlistUseCase } from '../update-wishlist.usecase';

describe('UpdateWishlistUseCase', () => {
  let useCase: UpdateWishlistUseCase;
  let repository: jest.Mocked<WishlistRepositoryContract>;

  beforeEach(() => {
    repository = {
      update: jest.fn(),
    } as any;
    useCase = new UpdateWishlistUseCase(repository);
  });

  it('deve retornar a wishlist atualizada quando encontrada', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174001';
    const updateDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Favoritos Atualizados',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174003',
          notes: 'Atualizado',
        },
      ],
    };
    const updatedWishlist = new Wishlist(
      uuid,
      updateDto.userUuid,
      updateDto.name,
      [
        new WishlistItem(
          updateDto.items[0].productUuid,
          expect.any(Date),
          updateDto.items[0].notes
        ),
      ],
      expect.any(Date),
      expect.any(Date)
    );

    repository.update.mockResolvedValue(updatedWishlist);

    const result = await useCase.execute(uuid, updateDto);

    expect(repository.update).toHaveBeenCalledWith(expect.any(Wishlist));
    expect(result).toEqual(updatedWishlist);
  });

  it('deve lançar NotFoundException quando a wishlist não for encontrada', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174099';
    const updateDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Favoritos Atualizados',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174003',
          notes: 'Atualizado',
        },
      ],
    };

    repository.update.mockResolvedValue(null);

    await expect(useCase.execute(uuid, updateDto)).rejects.toBeInstanceOf(NotFoundException);
    await expect(useCase.execute(uuid, updateDto)).rejects.toThrow(
      `Wishlist uuid ${uuid} não encontrada.`
    );
    expect(repository.update).toHaveBeenCalledWith(expect.any(Wishlist));
  });

  it('deve lançar InternalServerErrorException quando o repositório lançar erro', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174004';
    const updateDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174005',
      name: 'Favoritos Atualizados',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174006',
          notes: 'Atualizado',
        },
      ],
    };
    const error = new Error('falha no banco');
    repository.update.mockRejectedValue(error);

    await expect(useCase.execute(uuid, updateDto)).rejects.toBeInstanceOf(InternalServerErrorException);
    await expect(useCase.execute(uuid, updateDto)).rejects.toThrow('falha no banco');
  });

  it('deve lançar DuplicateProductInWishlistException quando há produtos duplicados (vem da entidade)', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174004';
    const updateDto = {
      userUuid: '123e4567-e89b-12d3-a456-426614174005',
      name: 'Favoritos com Duplicatas',
      items: [
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174006',
          notes: 'Produto 1',
        },
        {
          productUuid: '123e4567-e89b-12d3-a456-426614174006', // Duplicado
          notes: 'Produto 1 duplicado',
        },
      ],
    };

    // A exception deve vir da entidade, não do use case
    await expect(useCase.execute(uuid, updateDto)).rejects.toThrow(DuplicateProductInWishlistException);
    expect(repository.update).not.toHaveBeenCalled();
  });
});