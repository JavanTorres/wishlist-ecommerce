import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from './../src/app.module';

describe('HealthCheckController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // importa todo o AppModule
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init(); // inicializa a aplicação para receber requisições HTTP
  });

  it('/health-check (GET)', () => {
    return request(app.getHttpServer())
      .get('/health-check')
      .expect(200)
      .expect('OK');
  });
});
