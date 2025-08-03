import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { WishlistRepositoryContract } from '@domain/entities/repositories/wishlist.repository.contract';
import { DeleteWishlistByIdUseCase } from '../delete-wishlist-by-id.usecase';

describe('DeleteWishlistByIdUseCase', () => {
  let repository: jest.Mocked<WishlistRepositoryContract>;
  let useCase: DeleteWishlistByIdUseCase;

  beforeEach(() => {
    repository = {
      deleteById: jest.fn(),
    } as any;
    useCase = new DeleteWishlistByIdUseCase(repository);
  });

  it('deve retornar void quando o UUID existir e for deletado', async () => {
    const validUuid = '123e4567-e89b-12d3-a456-426614174001';
    repository.deleteById.mockResolvedValue(true);

    await expect(useCase.execute(validUuid)).resolves.toBeUndefined();
    expect(repository.deleteById).toHaveBeenCalledWith(validUuid);
  });

  it('deve lançar NotFoundException quando não encontrar a wishlist', async () => {
    const invalidUuid = '123e4567-e89b-12d3-a456-426614174099';
    repository.deleteById.mockResolvedValue(false);

    await expect(useCase.execute(invalidUuid)).rejects.toBeInstanceOf(NotFoundException);
    await expect(useCase.execute(invalidUuid)).rejects.toThrow(
      `Wishlist uuid ${invalidUuid} não encontrado.`
    );
    expect(repository.deleteById).toHaveBeenCalledWith(invalidUuid);
  });

  it('deve lançar InternalServerErrorException quando o repositório lançar erro', async () => {
    const uuid = '123e4567-e89b-12d3-a456-426614174001';
    repository.deleteById.mockRejectedValue(new Error('Falha no banco de dados'));

    await expect(useCase.execute(uuid)).rejects.toBeInstanceOf(InternalServerErrorException);
    expect(repository.deleteById).toHaveBeenCalledWith(uuid);
  });
});