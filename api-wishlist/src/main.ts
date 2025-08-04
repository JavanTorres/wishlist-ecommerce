import {
  BadRequestException,
  HttpStatus,
  Logger,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { createSwaggerDocument } from './infrastructure/swagger/create-swagger-document.helper';
import { RoutesV1Module } from './modules/routes-v1.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({ origin: '*' });

  const port = Number(process.env.PORT) || 3000;

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const documentV1 = createSwaggerDocument(app, 'v1', '1.0', [RoutesV1Module]);
  SwaggerModule.setup('api-docs-v1', app, documentV1);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(errors) {
        const formatError = (err: any, path = ''): string[] => {
          const currentPath = path ? `${path}.${err.property}` : err.property;
          
          if (err.children && err.children.length > 0) {
            // Se tem filhos (erros aninhados), processa recursivamente
            return err.children.flatMap((child: any) => 
              formatError(child, currentPath)
            );
          }
          
          if (err.constraints) {
            // Se tem constraints, formata as mensagens
            return Object.values(err.constraints).map((constraint: any) => 
              `${currentPath}: ${constraint}`
            );
          }
          
          return [`${currentPath}: validation failed`];
        };

        const messages = errors.flatMap(err => formatError(err));
        
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          error: 'Erro de validação',
          message: messages,
        });
      },
    }),
  );

  await app.listen(port, '0.0.0.0');

  const logger = new Logger('Bootstrap');
  logger.log(`Aplicação rodando em http://localhost:${port}`);
}

bootstrap();
