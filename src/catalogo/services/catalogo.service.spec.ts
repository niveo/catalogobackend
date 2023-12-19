import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule, ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import catalogoDataJson from '../../../data/catalogo.json';
import { CommonModule } from '../../common.module';
import { Catalogo } from '../../entities';
import { imageKitProvider } from '../../providers/imagekit.provider';
import { CatalogoService } from '../services/catalogo.service';
import { randomUUID } from 'crypto';
import { USER_ID_TEST } from '../../common/constants/constant';

describe('CatalogoService', () => {
  let catalogoService: CatalogoService;
  let dataSource: DataSource;
  let cls: ClsService;
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
    }).compile();

    delete catalogoDataJson[0].paginas;
    catalogoData = catalogoDataJson[0] as Catalogo;
    catalogoData.identificador = randomUUID();

    catalogoService = app.get<CatalogoService>(CatalogoService);

    cls = app.get(ClsService);

    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(catalogoService).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      catalogoCriado = await cls.runWith(USER_ID_TEST, () =>
        catalogoService.create(catalogoData),
      );
      const { descricao } = catalogoCriado;
      expect(descricao).toEqual(catalogoData.descricao);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const affected = await cls.runWith(USER_ID_TEST, () =>
        catalogoService.update(catalogoCriado.id, catalogoCriado),
      );
      expect(affected).toEqual(1);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      const registros = await cls.runWith(USER_ID_TEST, () =>
        catalogoService.getAll(),
      );
      expect(registros).not.toBeNull();
    });
  });

  describe('Remover Catalogo', () => {
    it('Tem que retornar um registro removido"', async () => {
      const affected = await cls.runWith(USER_ID_TEST, async () => {
        return catalogoService.deleteId(catalogoCriado.id);
      });
      expect(affected).toEqual(1);
    });
  });
});
