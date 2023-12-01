import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo, CatalogoPagina } from '../entities';
import { CommonModule } from '../../common.module';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { CatalogoPaginaService } from './catalogo-pagina.service';
import { CatalogoPaginaCreateDtoStub } from '../tests/stubs/catalogo-pagina-create.dto.stub';
import { CatalogoService } from './catalogo.service';
import { CatalogoPaginaUpdateDtoStub } from '../tests/stubs/catalogo-pagina-update.dto.stub';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';

describe('CatalogoPaginaService', () => {
  let catalogoPaginaService: CatalogoPaginaService;
  let catalogoService: CatalogoService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        TypeOrmModule.forFeature([Catalogo, CatalogoPagina]),
      ],
      providers: [CatalogoPaginaService, CatalogoService],
    }).compile();

    catalogoPaginaService = app.get<CatalogoPaginaService>(
      CatalogoPaginaService,
    );

    catalogoService = app.get<CatalogoService>(CatalogoService);

    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(catalogoPaginaService).toBeDefined();
  });

  describe('Salvar Catalogo Pagina', () => {
    it('Tem que retornar objeto salvo', async () => {
      const newCatalgo = await catalogoService.create({
        ativo: true,
        descricao: '1',
      });

      const catalogoPaginaCreateDtoStub =
        CatalogoPaginaCreateDtoStub(newCatalgo);

      const { pagina, catalogo, mapeamentos } =
        await catalogoPaginaService.create(catalogoPaginaCreateDtoStub);

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
      const newCatalgo = await catalogoService.create({
        ativo: true,
        descricao: '1',
      });
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );

      const catalogoPaginaUpdateDtoStub = CatalogoPaginaUpdateDtoStub();
      const { affected } = await catalogoPaginaService.update(
        id,
        catalogoPaginaUpdateDtoStub,
      );
      expect(affected).toEqual(1);

      const { pagina } = await catalogoPaginaService.getId(id);

      expect(pagina).toEqual(catalogoPaginaUpdateDtoStub.pagina);
    });
  });

  describe('Ler Paginas Catalogos ', () => {
    it('Deve retornar um registro"', async () => {
      const newCatalgo = await catalogoService.create(CatalogoCreateDtoStub());
      const registros = await catalogoPaginaService.getAll(newCatalgo.id);
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(CatalogoCreateDtoStub().paginas.length);
    });
  });

  describe('Remover Catalogo Pagina', () => {
    it('Tem que retornar um registro removido"', async () => {
      const newCatalgo = await catalogoService.create({
        ativo: true,
        descricao: '1',
      });
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      const { affected } = await catalogoPaginaService.deleteId(id);
      expect(affected).toEqual(1);
    });

    it('Não pode retornar erro da busca do registro removido', async () => {
      const newCatalgo = await catalogoService.create({
        ativo: true,
        descricao: '1',
      });
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      await catalogoService.deleteId(id);
      await expect(catalogoService.getId(id)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
