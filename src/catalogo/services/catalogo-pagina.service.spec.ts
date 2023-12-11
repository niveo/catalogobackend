import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo, CatalogoPagina } from 'src/entities';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { CommonModule } from '../../common.module';
import { CatalogoDto } from '../dtos';
import { CatalogoPaginaCreateDtoStub } from '../tests/stubs/catalogo-pagina-create.dto.stub';
import { CatalogoPaginaUpdateDtoStub } from '../tests/stubs/catalogo-pagina-update.dto.stub';
import { CatalogoPaginaService } from './catalogo-pagina.service';
import { CatalogoService } from './catalogo.service';

describe('CatalogoPaginaService', () => {
  let catalogoPaginaService: CatalogoPaginaService;
  let newCatalgo: CatalogoDto;
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
    expect(catalogoPaginaService).toBeDefined();
  });

  describe('Salvar Catalogo Pagina', () => {
    it('Tem que retornar objeto salvo', async () => {
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
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );

      const catalogoPaginaUpdateDtoStub = CatalogoPaginaUpdateDtoStub();
      const affected = await catalogoPaginaService.update(
        id,
        catalogoPaginaUpdateDtoStub,
      );
      expect(affected).toEqual(1);

      const { pagina } = await catalogoPaginaService.getId(id);

      expect(pagina).toEqual(catalogoPaginaUpdateDtoStub.pagina);
    });
  });

  describe('Ler Paginas Catalogos ', () => {
    it('Deve retornar registros do stub"', async () => {
      const registros = await catalogoPaginaService.getAll(newCatalgo.id);
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(2);
    });
  });

  describe('Remover Catalogo Pagina', () => {
    it('Tem que retornar um registro removido"', async () => {
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      const affected = await catalogoPaginaService.deleteId(id);
      expect(affected).toEqual(1);
    });

    it('Não pode retornar erro da busca do registro removido', async () => {
      const { id } = await catalogoPaginaService.create(
        CatalogoPaginaCreateDtoStub(newCatalgo),
      );
      await catalogoPaginaService.deleteId(id);
      await expect(catalogoPaginaService.getId(id)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
