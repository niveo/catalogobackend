import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Catalogo, CatalogoSchema } from '../schema/catalogo.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { CatalogoDtoStub } from '../tests/stubs/catalogo.dto.stub';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';
import { CatalogoService } from '../services/catalogo.service';
import { CatalogoController } from './catalogo.controller';

describe('CatalogoController', () => {
  let catalogoController: CatalogoController;

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
      controllers: [CatalogoController],
      providers: [
        CatalogoService,
        { provide: getModelToken(Catalogo.name), useValue: catalogoModel },
      ],
    }).compile();

    catalogoController = app.get<CatalogoController>(CatalogoController);
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
    expect(catalogoController).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const { descricao } = await catalogoController.create(CatalogoDtoStub());
      expect(descricao).toEqual(CatalogoDtoStub().descricao);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar a descrição atualizada', async () => {
      const { _id } = await catalogoController.create(CatalogoDtoStub());
      const { descricao } = await catalogoController.update(
        String(_id),
        CatalogoUpdateDtoStub(),
      );
      expect(descricao).toEqual(CatalogoUpdateDtoStub().descricao);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      await catalogoController.create(CatalogoDtoStub());
      const resgistros = await catalogoController.getAll();
      expect(resgistros).toHaveLength(1);
    });

    it('Deve retornar a descrição do catalogo"', async () => {
      const { _id } = await catalogoController.create(CatalogoDtoStub());
      const { descricao } = await catalogoController.getId(String(_id));
      expect(descricao).toEqual(CatalogoDtoStub().descricao);
    });
  });

  describe('Remover Catalogo', () => {
    it('Deve retornar definido"', async () => {
      const { _id } = await catalogoController.create(CatalogoDtoStub());
      expect(await catalogoController.deleteId(String(_id))).toBeDefined();
    });
  });
});
