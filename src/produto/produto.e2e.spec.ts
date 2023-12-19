import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import path from 'path';
import request from 'supertest';
import { DataSource } from 'typeorm';
import produtoDataJson from '../../data/produtos.json';
import { CommonModule } from '../common.module';
import { Produto } from '../entities/produto.entity';
import { ProdutoModule } from './produto.module';

describe('Produto', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let produtoData: Produto;
  let produtoCriado: Produto;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [CommonModule, ClsModule.forFeature(), ProdutoModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    dataSource = app.get<DataSource>(DataSource);

    produtoData = produtoDataJson[0] as Produto;

    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
    await app.close();
  });

  it('should be defined', () => {});

  describe('POST', () => {
    it('deve retornar o produto criado', async () => {
      const stub = produtoData;

      const { body } = await request(app.getHttpServer())
        .post('/produto')
        .send(stub)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
      expect(body).toBeDefined();
      produtoCriado = body;
    });
  });

  describe('PUT', () => {
    it('deve retornar o produto atualizado', async () => {
      const { text } = await request(app.getHttpServer())
        .put('/produto/' + produtoCriado.id)
        .send(produtoCriado)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(text).toEqual('1');
    });
  });

  describe('GET /produtos', () => {
    it('deve retornar uma lista de produtos', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/produto')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toHaveLength(1);
    });

    it('deve retornar um produto', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/produto/' + produtoCriado.id)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toEqual({
        ativo: produtoCriado.ativo,
        id: produtoCriado.id,
        descricao: produtoCriado.descricao,
        referencia: produtoCriado.referencia,
        mapeados: null,
      });
    });

    it('deve retornar um produto pela referencia', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/produto/referencia/' + produtoCriado.referencia)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(body).toEqual({
        ativo: produtoCriado.ativo,
        id: produtoCriado.id,
        descricao: produtoCriado.descricao,
        referencia: produtoCriado.referencia,
        mapeados: null,
      });
    });

    it('deve retornar produto não localizado', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/produto/referencia/' + '0')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(body.message).toEqual('Not Found');
    });
  });

  describe('DELETE', () => {
    it('deve retornar um registro removido', async () => {
      const { text } = await request(app.getHttpServer())
        .delete('/produto/' + produtoCriado.id)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
      expect(text).toEqual('1');
    });
  });

  describe('IMPORTAR', () => {
    it('deve retornar a quantidade de registros do csv', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/produto/importar')
        .query({ comCabecalho: 'true' })
        .query({ separador: ';' })
        .attach('files', path.resolve(__dirname, '../../data/produtos.csv'))
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(body).toHaveLength(184);
    });
  });
});
