import { Test, TestingModule } from '@nestjs/testing';
import { CatalogoService } from './catalogo.service';
import { getModelToken } from '@nestjs/mongoose';
import { Catalogo, CatalogoSchema } from '../schema/catalogo.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { CatalogoDtoStub } from '../tests/stubs/catalogo.dto.stub';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';

describe('CatalogoService', () => {
  let catalogoService: CatalogoService;

  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let catalogoModel: Model<Catalogo>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    catalogoModel = mongoConnection.model(Catalogo.name, CatalogoSchema);

    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        CatalogoService,
        { provide: getModelToken(Catalogo.name), useValue: catalogoModel },
      ],
    }).compile();

    catalogoService = app.get<CatalogoService>(CatalogoService);
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
    expect(catalogoService).toBeDefined();
  });

  /*describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const { descricao } = await catalogoService.create(CatalogoDtoStub());
      expect(descricao).toEqual(CatalogoDtoStub().descricao);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar a descrição atualizada', async () => {
      const { _id } = await catalogoService.create(CatalogoDtoStub());
      const { descricao } = await catalogoService.update(
        String(_id),
        CatalogoUpdateDtoStub(),
      );
      expect(descricao).toEqual(CatalogoUpdateDtoStub().descricao);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      await catalogoService.create(CatalogoDtoStub());
      const resgistros = await catalogoService.getAll();
      expect(resgistros).toHaveLength(1);
    });
  });

  describe('Remover Catalogo', () => {
    it('Deve retornar definido"', async () => {
      const { _id } = await catalogoService.create(CatalogoDtoStub());
      expect(await catalogoService.deleteId(String(_id))).toBeDefined();
    });
  });*/
});
