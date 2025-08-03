import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';

import { LoginRequestDto } from '@presentation/dto/auth/login-request.dto';
import { LoginResponseDto } from '@presentation/dto/auth/login-response.dto';

import { AuthService } from '../../services/auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza login e retorna um JWT' })
  @ApiCreatedResponse({
    description: 'Login realizado com sucesso',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Usuário ou senha inválidos' })
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    body: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }
    return this.authService.login(user);
  }
}