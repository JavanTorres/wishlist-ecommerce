import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsArray, ValidateNested } from 'class-validator';

export class CreateWishlistItemRequestDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID do produto',
  })
  @IsNotEmpty()
  @IsString()
  productUuid: string;

  @ApiProperty({
    example: 'Quero comprar na Black Friday meu BATTLEFIELD 6',
    description: 'Observações sobre o produto',
    required: false,
  })
  @IsString()
  notes?: string;
}

export class CreateWishlistRequestDto {
  @ApiProperty({
    example: 'Favoritos Games',
    description: 'Nome da wishlist',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: [CreateWishlistItemRequestDto],
    description: 'Itens da wishlist',
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWishlistItemRequestDto)
  items: CreateWishlistItemRequestDto[];
}