import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClsModule, ClsService } from 'nestjs-cls';
import { DataSource } from 'typeorm';
import produtoDataJson from '../../data/produtos.json';
import { CommonModule } from '../common.module';
import { USER_ID_TEST } from '../common/constants/constant';
import { Produto } from '../entities/produto.entity';
import { ProdutoController } from './produto.controller';
import { ProdutoService } from './produto.service';

describe('produtoController', () => {
  let produtoController: ProdutoController;
  let dataSource: DataSource;
  let cls: ClsService;
  let produtoData: Produto;
  let produtoDataCriado: Produto;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        ClsModule.forFeature(),
        TypeOrmModule.forFeature([Produto]),
      ],
      providers: [ProdutoService],
      controllers: [ProdutoController],
    }).compile();

    produtoData = produtoDataJson[0] as Produto;

    produtoController = app.get<ProdutoController>(ProdutoController);

    cls = app.get(ClsService);

    dataSource = app.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(produtoController).toBeDefined();
  });

  describe('Salvar Produto', () => {
    it('Tem que retornar objeto salvo', async () => {
      produtoDataCriado = await cls.runWith(USER_ID_TEST, () =>
        produtoController.create(produtoData),
      );
      const { descricao } = produtoDataCriado;
      expect(descricao).toEqual(produtoData.descricao);
    });
  });

  describe('Atualizar Produto', () => {
    it('Tem que retornar um registro e descrição atualizado', async () => {
      const affected = await cls.runWith(USER_ID_TEST, () =>
        produtoController.update(produtoDataCriado.id, produtoDataCriado),
      );
      expect(affected).toEqual(1);
    });
    it('Deve retornar um registro pela referencia', async () => {
      const registros = await cls.runWith(USER_ID_TEST, () =>
        produtoController.getReferencia(produtoDataCriado.referencia),
      );
      expect(registros).not.toBeNull();
      expect(registros.referencia).toEqual(produtoDataCriado.referencia);
    });
  });

  describe('Ler Produtos', () => {
    it('Deve retornar um registro"', async () => {
      const registros = await cls.runWith(USER_ID_TEST, () =>
        produtoController.getAll(),
      );
      expect(registros).not.toBeNull();
    });
  });

  describe('Remover Produto', () => {
    it('Tem que retornar um registro removido"', async () => {
      const affected = await cls.runWith(USER_ID_TEST, async () => {
        return produtoController.deleteId(produtoDataCriado.id);
      });
      expect(affected).toEqual(1);
    });
  });
});
