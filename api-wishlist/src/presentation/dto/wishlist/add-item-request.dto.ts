import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class AddItemRequestDto {
  @ApiProperty({
    description: 'UUID do produto a ser adicionado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsUUID('4')
  productUuid: string;

  @ApiProperty({
    description: 'Notas opcionais sobre o produto',
    example: 'Produto desejado para o aniversário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
