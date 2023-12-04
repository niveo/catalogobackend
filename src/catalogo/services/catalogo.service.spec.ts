import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo } from '../entities';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';
import { CatalogoService } from './catalogo.service';
import { CommonModule } from '../../common.module';
import { DataSource, EntityNotFoundError } from 'typeorm';

describe('CatalogoService', () => {
  let catalogoService: CatalogoService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TypeOrmModule.forFeature([Catalogo])],
      providers: [CatalogoService],
    }).compile();

    catalogoService = app.get<CatalogoService>(CatalogoService);

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
      const catalogoCreateDtoStub = CatalogoCreateDtoStub();
      const { descricao, paginas } = await catalogoService.create(
        catalogoCreateDtoStub,
      );
      expect(descricao).toEqual(catalogoCreateDtoStub.descricao);
      expect(paginas).not.toBeNull();
      expect(paginas).not.toEqual([]);
      expect(paginas).toHaveLength(catalogoCreateDtoStub.paginas.length);

      const { mapeamentos } = paginas[0];
      const { mapeamentos: mapeamentosStub } = catalogoCreateDtoStub.paginas[0];
      expect(mapeamentos).not.toBeNull();
      expect(mapeamentos).not.toEqual([]);
      expect(mapeamentos).toHaveLength(mapeamentosStub.length);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const { id } = await catalogoService.create(CatalogoCreateDtoStub());
      const affected = await catalogoService.update(
        id,
        CatalogoUpdateDtoStub(),
      );
      expect(affected).toEqual(1);

      const { descricao } = await catalogoService.getId(id);
      expect(descricao).toEqual(CatalogoUpdateDtoStub().descricao);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      const registros = await catalogoService.getAll();
      expect(registros).not.toBeNull();
    });
  });

  describe('Remover Catalogo', () => {
    it('Tem que retornar um registro removido', async () => {
      const { id } = await catalogoService.create(CatalogoCreateDtoStub());
      const affected = await catalogoService.deleteId(id);
      expect(affected).toEqual(1);
    });

    it('Não pode retornar erro da busca do registro removido', async () => {
      const { id } = await catalogoService.create(CatalogoCreateDtoStub());
      await catalogoService.deleteId(id);
      await expect(catalogoService.getId(id)).rejects.toThrow(
        EntityNotFoundError,
      );
    });
  });
});
