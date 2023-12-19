import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule, ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import catalogoDataJson from '../../../data/catalogo.json';
import { CommonModule } from '../../common.module';
import { Catalogo } from '../../entities';
import { imageKitProvider } from '../../providers/imagekit.provider';
import { CatalogoService } from '../services/catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { randomUUID } from 'crypto';
import { USER_ID_TEST } from '../../common/constants/constant';

describe('CatalogoController', () => {
  let catalogoController: CatalogoController;
  let dataSource: DataSource;
  let cls: ClsService;
  const user = USER_ID_TEST;
  let catalogoData: Catalogo;
  let catalogoCriado: Catalogo;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        ClsModule.forFeature(),
        TypeOrmModule.forFeature([Catalogo]),
      ],
      providers: [CatalogoService, ...imageKitProvider],
      controllers: [CatalogoController],
    }).compile();

    delete catalogoDataJson[0].paginas;
    catalogoData = catalogoDataJson[0] as Catalogo;
    catalogoData.identificador = randomUUID();

    catalogoController = app.get<CatalogoController>(CatalogoController);

    cls = app.get(ClsService);

    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(catalogoController).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      catalogoCriado = await cls.runWith(user, () =>
        catalogoController.create(catalogoData),
      );
      const { descricao } = catalogoCriado;
      expect(descricao).toEqual(catalogoData.descricao);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const affected = await cls.runWith(user, () =>
        catalogoController.update(catalogoCriado.id, catalogoCriado),
      );
      expect(affected).toEqual(1);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      const registros = await cls.runWith(user, () =>
        catalogoController.getAll(),
      );
      expect(registros).not.toBeNull();
    });
  });

  describe('Remover Catalogo', () => {
    it('Tem que retornar um registro removido"', async () => {
      const affected = await cls.runWith(user, async () => {
        return catalogoController.deleteId(catalogoCriado.id);
      });
      expect(affected).toEqual(1);
    });
  });
});
