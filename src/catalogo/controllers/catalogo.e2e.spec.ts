import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { ClsModule } from 'nestjs-cls';
import { Catalogo } from 'src/entities';
import request from 'supertest';
import { DataSource } from 'typeorm';
import catalogoDataJson from '../../../data/catalogo.json';
import { CommonModule } from '../../common.module';
import { CatalogoModule } from '../catalogo.module';

describe('Catalogo', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let catalogoData: Catalogo;
  let catalogoCriado: Catalogo;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule, ClsModule.forFeature(), CatalogoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
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

  it('should be defined', () => {});

  describe('POST', () => {
    it('deve retornar o catalogo criado', async () => {
      catalogoData.identificador = randomUUID();
      const stub = catalogoData;

      const { body } = await request(app.getHttpServer())
        .post('/catalogo')
        .send(stub)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      expect(body).toBeDefined();
      catalogoCriado = body;
    });
  });

  describe('PUT', () => {
    it('deve retornar o catalogo atualizado', async () => {
      const stub = catalogoData;
      const { text } = await request(app.getHttpServer())
        .put('/catalogo/' + catalogoCriado.id)
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
      expect(body).toHaveLength(1);
    });

    it('deve retornar um catalogo', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/catalogo/' + catalogoCriado.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toEqual({
        ativo: catalogoCriado.ativo,
        id: catalogoCriado.id,
        descricao: catalogoCriado.descricao,
        avatar: catalogoCriado.avatar,
        logo: catalogoCriado.logo,
        identificador: catalogoData.identificador,
        titulo: catalogoCriado.titulo,
      });
    });
  });

  describe('DELETE', () => {
    it('deve retornar um registro removido', async () => {
      const { text } = await request(app.getHttpServer())
        .delete('/catalogo/' + catalogoCriado.id)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(text).toEqual('1');
    });
  });
});
