import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catalogo } from '../entities';
import { CatalogoUpdateDtoStub } from '../tests/stubs/catalogo-update.dto.stub';
import { CatalogoCreateDtoStub } from '../tests/stubs/catalogo-create.dto.stub';
import { CatalogoService } from '../services/catalogo.service';
import { CatalogoController } from './catalogo.controller';
import { CommonModule } from '../../common.module';
import { criarContainer, removerContainer } from '../../tests/container-test';

describe('CatalogoController', () => {
  let catalogoController: CatalogoController;

  beforeAll(async () => {
    await criarContainer();
    const app: TestingModule = await Test.createTestingModule({
      imports: [CommonModule, TypeOrmModule.forFeature([Catalogo])],
      providers: [CatalogoService],
      controllers: [CatalogoController],
    }).compile();

    catalogoController = app.get<CatalogoController>(CatalogoController);
  });

  afterAll(async () => {
    await removerContainer();
  });

  it('should be defined', () => {
    expect(catalogoController).toBeDefined();
  });

  describe('Salvar Catalogo', () => {
    it('Tem que retornar objeto salvo', async () => {
      const { descricao, paginas } = await catalogoController.create(
        CatalogoCreateDtoStub(),
      );
      expect(descricao).toEqual(CatalogoCreateDtoStub().descricao);
      expect(paginas).not.toBeNull();
      expect(paginas).not.toEqual([]);
      expect(paginas).toHaveLength(CatalogoCreateDtoStub().paginas.length);

      const { mapeamentos } = paginas[0];
      console.log(mapeamentos);
      const { mapeamentos: mapeamentosStub } =
        CatalogoCreateDtoStub().paginas[0];
      expect(mapeamentos).not.toBeNull();
      expect(mapeamentos).not.toEqual([]);
      expect(mapeamentos).toHaveLength(mapeamentosStub.length);
    });
  });

  describe('Atualizar Catalogo', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const { id } = await catalogoController.create(CatalogoCreateDtoStub());
      const { affected } = await catalogoController.update(
        id,
        CatalogoUpdateDtoStub(),
      );
      expect(affected).toEqual(1);

      const { descricao } = await catalogoController.getId(id);
      expect(descricao).toEqual(CatalogoUpdateDtoStub().descricao);
    });
  });

  describe('Ler Catalogos', () => {
    it('Deve retornar um registro"', async () => {
      const registros = await catalogoController.getAll();
      expect(registros).not.toBeNull();
    });
  });

  describe('Remover Catalogo', () => {
    it('Tem que retornar um registro removido"', async () => {
      const { id } = await catalogoController.create(CatalogoCreateDtoStub());
      const { affected } = await catalogoController.deleteId(id);
      expect(affected).toEqual(1);
    });
  });
});
