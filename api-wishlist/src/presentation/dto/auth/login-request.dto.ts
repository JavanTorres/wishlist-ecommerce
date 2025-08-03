import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({
    example: 'admin',
    description: 'Nome de usuário',
    default: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    example: 'password',
    description: 'Senha do usuário',
    default: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}