import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo, CatalogoPagina } from '../entities';
import { CommonModule } from '../../common.module';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { CatalogoPaginaCreateDtoStub } from '../tests/stubs/catalogo-pagina-create.dto.stub';
import { CatalogoPaginaUpdateDtoStub } from '../tests/stubs/catalogo-pagina-update.dto.stub';
import { CatalogoPaginaController } from './catalogo-pagina.controller';
import { CatalogoService } from '../services/catalogo.service';
import { CatalogoPaginaService } from '../services/catalogo-pagina.service';
import { CatalogoDto } from '../dtos';

describe('CatalogoPaginaController', () => {
  let dataSource: DataSource;
  let catalogoPaginaController: CatalogoPaginaController;
  let newCatalgo: CatalogoDto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        TypeOrmModule.forFeature([Catalogo, CatalogoPagina]),
      ],
      providers: [CatalogoPaginaService, CatalogoService],
      controllers: [CatalogoPaginaController],
    }).compile();

    catalogoPaginaController = app.get<CatalogoPaginaController>(
      CatalogoPaginaController,
    );

    dataSource = app.get<DataSource>(DataSource);

    const catalogoService = app.get<CatalogoService>(CatalogoService);

    newCatalgo = await catalogoService.create({
      ativo: true,
      descricao: '1',
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(catalogoPaginaController).toBeDefined();
  });

  describe('Salvar Catalogo Pagina', () => {
    it('Tem que retornar objeto salvo', async () => {
      const catalogoPaginaCreateDtoStub =
        CatalogoPaginaCreateDtoStub(newCatalgo);

      const { pagina, catalogo, mapeamentos } =
        await catalogoPaginaController.create(catalogoPaginaCreateDtoStub);

      expect(pagina).toEqual(1);
      expect(catalogo).not.toBeNull();

      expect(mapeamentos).not.toBeNull();
      expect(mapeamentos).not.toEqual([]);
      expect(mapeamentos).toHaveLength(
        catalogoPaginaCreateDtoStub.mapeamentos.length,
      );
    });
  });

  describe('Atualizar Catalogo Pagina', () => {
    it('Tem que retornar um registro e pagina atualizada', async () => {
      const { id } = await catalogoPaginaController.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );

      const catalogoPaginaUpdateDtoStub = CatalogoPaginaUpdateDtoStub();
      const { affected } = await catalogoPaginaController.update(
        id,
        catalogoPaginaUpdateDtoStub,
      );
      expect(affected).toEqual(1);

      const { pagina } = await catalogoPaginaController.getId(id);

      expect(pagina).toEqual(catalogoPaginaUpdateDtoStub.pagina);
    });
  });

  describe('Ler Paginas Catalogos ', () => {
    it('Deve retornar registros do stub"', async () => {
      const registros = await catalogoPaginaController.getAll(newCatalgo.id);
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(2);
    });
  });

  describe('Remover Catalogo Pagina', () => {
    it('Tem que retornar um registro removido"', async () => {
      const { id } = await catalogoPaginaController.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      const { affected } = await catalogoPaginaController.deleteId(id);
      expect(affected).toEqual(1);
    });

    it('Não pode retornar erro da busca do registro removido', async () => {
      const { id } = await catalogoPaginaController.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      await catalogoPaginaController.deleteId(id);
      await expect(catalogoPaginaController.getId(id)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
