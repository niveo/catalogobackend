import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import ImageKit from 'imagekit';
import { ClsModule } from 'nestjs-cls';
import path from 'path';
import { Catalogo } from 'src/entities';
import request from 'supertest';
import { DataSource } from 'typeorm';
import catalogoDataJson from '../../../data/catalogo.json';
import { CommonModule } from '../../common.module';
import { imageKitProvider } from '../../providers/imagekit.provider';
import { CatalogoModule } from '../catalogo.module';

jest.useRealTimers();

describe('Catalogo', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let catalogoData: Catalogo;
  let catalogoCriado: Catalogo;
  let imageKit: ImageKit;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule, ClsModule.forFeature(), CatalogoModule],
      providers: [...imageKitProvider],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get<DataSource>(DataSource);

    imageKit = app.get<ImageKit>(ImageKit.name);

    delete catalogoDataJson[0].paginas;
    catalogoData = catalogoDataJson[0] as Catalogo;

    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  afterEach(() => {
    jest.useRealTimers();
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

  describe('IMPORTAR', () => {
    //Aumentar o tempo limite da chamado do teste
    jest.setTimeout(10 * 1000);
    it('deve retornar o catalogo importado', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/catalogo/importar')
        .query({ titulo: 'TESTE' })
        .query({ descricao: 'TESTE' })
        .query({ ativo: 'true' })
        .attach(
          'files',
          path.resolve(__dirname, '../../../data/catalogo/00001.jpg'),
        )
        .attach(
          'files',
          path.resolve(__dirname, '../../../data/catalogo/00002.jpg'),
        )
        .attach(
          'files',
          path.resolve(__dirname, '../../../data/catalogo/00003.jpg'),
        )
        .attach(
          'files',
          path.resolve(__dirname, '../../../data/catalogo/00004.jpg'),
        )
        .attach(
          'files',
          path.resolve(__dirname, '../../../data/catalogo/00005.jpg'),
        )
        .attach(
          'logo',
          path.resolve(
            __dirname,
            '../../../data/catalogo/bellesabeautycare_cover.jpeg',
          ),
        )
        .attach(
          'avatar',
          path.resolve(__dirname, '../../../data/catalogo/1661796749538.jpeg'),
        )
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).not.toBeNull();

      imageKit.deleteFolder(`catalogo/catalogos/${body.identificador}/`);
    });
  });
});
