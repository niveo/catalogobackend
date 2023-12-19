import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ClsModule, ClsService } from 'nestjs-cls';
import { Catalogo } from 'src/entities';
import request from 'supertest';
import { DataSource } from 'typeorm';
import catalogoDataJson from '../../../data/catalogo.json';
import { CommonModule } from '../../common.module';
import { CatalogoModule } from '../catalogo.module';
import { CatalogoService } from '../services/catalogo.service';

describe('Catalogo', () => {
  let app: INestApplication;
  let service: CatalogoService;
  let dataSource: DataSource;
  let cls: ClsService;
  const user = { userId: '1' };
  let catalogoData: Catalogo;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule, ClsModule.forFeature(), CatalogoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    cls = app.get(ClsService);
    service = app.get(CatalogoService);
    dataSource = app.get<DataSource>(DataSource);

    delete catalogoDataJson[0].paginas;
    catalogoData = catalogoDataJson[0] as Catalogo;

    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(() => {
    catalogoData.identificador = randomUUID();
  });

  it('should be defined', () => {});

  describe('POST', () => {
    it('deve retornar o catalogo criado', async () => {
      const stub = catalogoData;

      const { body } = await request(app.getHttpServer())
        .post('/catalogo')
        .send(stub)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      expect(body).toBeDefined();
    });
  });

  describe('PUT', () => {
    it('deve retornar o catalogo atualizado', async () => {
      const stub = catalogoData;
      const { id } = await cls.runWith(user, () => service.create(stub));
      const { text } = await request(app.getHttpServer())
        .put('/catalogo/' + id)
        .send(stub)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(text).toEqual('1');
    });
  });

  describe('GET /catalogos', () => {
    it('deve retornar uma lista de catalogos', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/catalogo')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toHaveLength(2);
    });

    it('deve retornar um catalogo', async () => {
      const stub = catalogoData;
      const { id } = await cls.runWith(user, () => service.create(stub));
      const { body } = await request(app.getHttpServer())
        .get('/catalogo/' + id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toEqual({
        ativo: stub.ativo,
        id: id,
        descricao: stub.descricao,
        avatar: stub.avatar,
        logo: stub.logo,
        identificador: catalogoData.identificador,
        titulo: stub.titulo,
      });
    });
  });

  describe('DELETE', () => {
    it('deve retornar um registro removido', async () => {
      const stub = catalogoData;
      const { id } = await cls.runWith(user, () => service.create(stub));
      const { text } = await request(app.getHttpServer())
        .delete('/catalogo/' + id)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(text).toEqual('1');
    });
  });
});
