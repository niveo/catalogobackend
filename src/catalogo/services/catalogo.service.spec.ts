import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmProviderModule } from '../../typeorm.module';
import { Catalogo } from '../models';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';
import { CatalogoService } from './catalogo.service';

describe('CatalogoService', () => {
  let catalogoService: CatalogoService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [...typeOrmProviderModule, TypeOrmModule.forFeature([Catalogo])],
      providers: [CatalogoService],
    }).compile();

    catalogoService = app.get<CatalogoService>(CatalogoService);
  });

  afterAll(async () => {});

  afterEach(async () => {});

  it('should be defined', () => {
    expect(catalogoService).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const { descricao } = await catalogoService.create(
        CatalogoCreateDtoStub(),
      );
      expect(descricao).toEqual(CatalogoCreateDtoStub().descricao);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const { id } = await catalogoService.create(CatalogoCreateDtoStub());
      const { affected } = await catalogoService.update(
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
    it('Tem que retornar um registro removido"', async () => {
      const { id } = await catalogoService.create(CatalogoCreateDtoStub());
      const { affected } = await catalogoService.deleteId(id);
      expect(affected).toEqual(1);
    });
  });
});
