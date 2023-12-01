import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo } from '../entities';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';
import { CatalogoService } from './catalogo.service';
import { CommonModule } from '../../common.module';
import { criarContainer, removerContainer } from '../../tests/container-test';

describe('CatalogoService', () => {
  let catalogoService: CatalogoService;

  beforeAll(async () => {
    await criarContainer();
    const app: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TypeOrmModule.forFeature([Catalogo])],
      providers: [CatalogoService],
    }).compile();

    catalogoService = app.get<CatalogoService>(CatalogoService);
  });

  afterAll(async () => {
    await removerContainer();
  });

  it('should be defined', () => {
    expect(catalogoService).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const { descricao, paginas } = await catalogoService.create(
        CatalogoCreateDtoStub(),
      );
      expect(descricao).toEqual(CatalogoCreateDtoStub().descricao);
      expect(paginas).not.toBeNull();
      expect(paginas).not.toBe([]);
      expect(paginas).toHaveLength(CatalogoCreateDtoStub().paginas.length);

      const { mapeamentos } = paginas[0];
      const { mapeamentos: mapeamentosStub } =
        CatalogoCreateDtoStub().paginas[0];
      expect(mapeamentos).not.toBeNull();
      expect(mapeamentos).not.toBe([]);
      expect(mapeamentos).toHaveLength(mapeamentosStub.length);
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
