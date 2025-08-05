import { ApiProperty } from '@nestjs/swagger';

export class WishlistItemResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID do produto',
  })
  productUuid: string;

  @ApiProperty({
    example: '2024-01-15T10:30:00.000Z',
    description: 'Data de adição do item na wishlist',
  })
  addedAt: Date;

  @ApiProperty({
    example: 'Quero comprar na Black Friday',
    description: 'Observações sobre o produto',
    required: false,
  })
  notes?: string;
}

export class WishlistItemsResponseDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174001',
    description: 'UUID da wishlist',
  })
  uuid: string;

  @ApiProperty({
    type: [WishlistItemResponseDto],
    description: 'Lista de itens da wishlist',
  })
  items: WishlistItemResponseDto[];

  @ApiProperty({
    example: 20,
    description: 'Número total de itens na wishlist',
  })
  totalItems: number;

  @ApiProperty({
    example: 5,
    description: 'Número de slots restantes (máximo 20 itens)',
  })
  remainingSlots: number;
}
