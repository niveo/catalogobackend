import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';
import {
  CatalogoPagina,
  CatalogoPaginaSchema,
} from '../schema/catalogo-pagina.schema';
import { CatalogoPaginaService } from './catalogo-pagina.service';
import { CreateCatalogoPaginaDtoStub } from '../tests/stubs/create-catalogo-pagina.dto.stub';
import { CatalogoService } from './catalogo.service';
import { Catalogo, CatalogoSchema } from '../schema/catalogo.schema';
import { RegistroNaoLocalizadoError } from '../../common';

describe('CatalogoService', () => {
  let catalogoPaginaService: CatalogoPaginaService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;

    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CatalogoPaginaService,
        CatalogoService,
        {
          provide: getModelToken(CatalogoPagina.name),
          useValue: mongoConnection.model(
            CatalogoPagina.name,
            CatalogoPaginaSchema,
          ),
        },
        {
          provide: getModelToken(Catalogo.name),
          useValue: mongoConnection.model(Catalogo.name, CatalogoSchema),
        },
      ],
    }).compile();

    catalogoPaginaService = app.get<CatalogoPaginaService>(
      CatalogoPaginaService,
    );
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  it('should be defined', () => {
    expect(catalogoPaginaService).toBeDefined();
  });

  describe('Salvar Catalogo Pagina', () => {
    it('Tem que retornar objeto salvo', async () => {
      const pagina = await catalogoPaginaService.create(
        CreateCatalogoPaginaDtoStub(),
      );
      expect(pagina.pagina).toEqual(CreateCatalogoPaginaDtoStub().pagina);
    });
  });

  describe('Atualizar Catalogo Pagina', () => {
    it('Tem que retornar a descrição atualizada', async () => {
      const { _id } = await catalogoPaginaService.create(
        CreateCatalogoPaginaDtoStub(),
      );
      const { pagina } = await catalogoPaginaService.update(
        String(_id),
        CreateCatalogoPaginaDtoStub(),
      );
      expect(pagina).toEqual(CreateCatalogoPaginaDtoStub().pagina);
    });
  });

  describe('Ler Catalogo Paginas', () => {
    it('Deve retornar zero registros"', async () => {
      await catalogoPaginaService.create(CreateCatalogoPaginaDtoStub());

      await expect(
        catalogoPaginaService.getAll('65679f13ad0ca1e7c540d6bc'),
      ).rejects.toThrow(RegistroNaoLocalizadoError);
    });
  });

  describe('Remover Catalogo Pagina', () => {
    it('Deve retornar definido"', async () => {
      const { _id } = await catalogoPaginaService.create(
        CreateCatalogoPaginaDtoStub(),
      );
      expect(await catalogoPaginaService.deleteId(String(_id))).toBeDefined();
    });
  });
});
