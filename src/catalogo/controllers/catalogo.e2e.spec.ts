import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { CommonModule } from '../../common.module';
import { CatalogoModule } from '../catalogo.module';
import { CatalogoService } from '../services/catalogo.service';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';

describe('Catalogo', () => {
  let app: INestApplication;
  let service: CatalogoService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule, CatalogoModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    service = app.get(CatalogoService);
    dataSource = app.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {});

  describe('GET /catalogos', () => {
    it('deve retornar uma lista de catalogos', async () => {
      const stub = CatalogoCreateDtoStub();
      const { id } = await service.create(stub);
      const { body } = await request(app.getHttpServer())
        .get('/catalogo')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toEqual([
        { ativo: stub.ativo, id: id, descricao: stub.descricao },
      ]);
    });

    it('deve retornar um catalogo', async () => {
      const stub = CatalogoCreateDtoStub();
      const { id } = await service.create(stub);
      const { body } = await request(app.getHttpServer())
        .get('/catalogo/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toEqual({
        ativo: stub.ativo,
        id: id,
        descricao: stub.descricao,
      });
    });
  });
});
