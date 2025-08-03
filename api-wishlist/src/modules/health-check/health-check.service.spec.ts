// Importa o helper Test e a interface TestingModule do pacote de testes do Nest
import { Test, TestingModule } from '@nestjs/testing';

// Importa o serviço que será testado
import { HealthCheckService } from './health-check.service';

describe('HealthCheckService', () => {
  // Declaração da variável que irá armazenar a instância do serviço
  let service: HealthCheckService;

  // Antes de cada teste, configura e compila um módulo de teste do Nest
  beforeEach(async () => {
    // Cria um módulo de teste, registrando o HealthCheckService como provider
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthCheckService],
    }).compile();

    // Recupera a instância do HealthCheckService a partir do módulo de teste
    service = module.get<HealthCheckService>(HealthCheckService);
  });

  // Primeiro caso de teste: verifica se o serviço foi definido corretamente
  it('should be defined', () => {
    // Expectativa: service não deve ser undefined ou null
    expect(service).toBeDefined();
  });

  // Segundo caso de teste: verifica o comportamento do método getStatus()
  it('getStatus should return "OK"', () => {
    // Executa service.getStatus() e compara o retorno com a string esperada
    expect(service.getStatus()).toBe('OK');
  });
});
