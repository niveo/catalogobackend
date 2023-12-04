import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { CommonModule } from '../../common.module';
import { CatalogoPaginaDto } from '../dtos';
import {
  Catalogo,
  CatalogoPagina,
  CatalogoPaginaMapeamento,
} from '../entities';
import { CatalogoPaginaMapeamentoCreateDtoStub } from '../tests/stubs/catalogo-pagina-mapeamento-create.dto.stub';
import { CatalogoPaginaMapeamentoUpdateDtoStub } from '../tests/stubs/catalogo-pagina-mapeamento-update.dto.stub';
import { CatalogoPaginaMapeamentoController } from './catalogo-pagina-mapemanto.controller';
import { CatalogoPaginaMapeamentoService } from '../services/catalogo-pagina-mapeamento.service';
import { CatalogoPaginaService } from '../services/catalogo-pagina.service';
import { CatalogoService } from '../services/catalogo.service';

describe('CatalogoPaginaMapeamentoController', () => {
  let catalogoPaginaMapeamentoController: CatalogoPaginaMapeamentoController;
  let newCatalgoPagina: CatalogoPaginaDto;
  let dataSource: DataSource;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CommonModule,
        TypeOrmModule.forFeature([
          Catalogo,
          CatalogoPagina,
          CatalogoPaginaMapeamento,
        ]),
      ],
      providers: [
        CatalogoPaginaMapeamentoService,
        CatalogoPaginaService,
        CatalogoService,
      ],
      controllers: [CatalogoPaginaMapeamentoController],
    }).compile();

    catalogoPaginaMapeamentoController =
      app.get<CatalogoPaginaMapeamentoController>(
        CatalogoPaginaMapeamentoController,
      );

    dataSource = app.get<DataSource>(DataSource);

    const catalogoPaginaService = app.get<CatalogoPaginaService>(
      CatalogoPaginaService,
    );
    const catalogoService = app.get<CatalogoService>(CatalogoService);
    const catalogo = await catalogoService.create({
      ativo: true,
      descricao: 'Teste',
    });

    newCatalgoPagina = await catalogoPaginaService.create({
      catalogo: catalogo,
      pagina: 1,
    });
  });

  afterAll(async () => {
    await dataSource.dropDatabase();
    await dataSource.destroy();
  });

  it('should be defined', () => {
    expect(catalogoPaginaMapeamentoController).toBeDefined();
  });

  describe('Salvar Mapeamento', () => {
    it('Tem que retornar objeto salvo', async () => {
      const catalogoPaginaCreateDtoStub =
        CatalogoPaginaMapeamentoCreateDtoStub(newCatalgoPagina);
      const {
        finalPosicalX,
        finalPosicalY,
        inicialPosicalX,
        height,
        inicialPosicalY,
        width,
      } = await catalogoPaginaMapeamentoController.create(
        catalogoPaginaCreateDtoStub,
      );
      expect(finalPosicalX).toEqual(catalogoPaginaCreateDtoStub.finalPosicalX);
      expect(finalPosicalY).toEqual(catalogoPaginaCreateDtoStub.finalPosicalY);
      expect(inicialPosicalX).toEqual(
        catalogoPaginaCreateDtoStub.inicialPosicalX,
      );
      expect(height).toEqual(catalogoPaginaCreateDtoStub.height);
      expect(width).toEqual(catalogoPaginaCreateDtoStub.width);
      expect(inicialPosicalY).toEqual(
        catalogoPaginaCreateDtoStub.inicialPosicalY,
      );
    });
  });

  describe('Atualizar Mapeamento', () => {
    it('Tem que retornar um registro e pagina atualizada', async () => {
      const { id } = await catalogoPaginaMapeamentoController.create(
        CatalogoPaginaMapeamentoCreateDtoStub(newCatalgoPagina),
      );

      const catalogoPaginaUpdateDtoStub =
        CatalogoPaginaMapeamentoUpdateDtoStub();
      const affected = await catalogoPaginaMapeamentoController.update(
        id,
        catalogoPaginaUpdateDtoStub,
      );
      expect(affected).toEqual(1);

      const {
        finalPosicalX,
        finalPosicalY,
        inicialPosicalX,
        height,
        inicialPosicalY,
        width,
      } = await catalogoPaginaMapeamentoController.getId(id);

      expect(finalPosicalX).toEqual(catalogoPaginaUpdateDtoStub.finalPosicalX);
      expect(finalPosicalY).toEqual(catalogoPaginaUpdateDtoStub.finalPosicalY);
      expect(inicialPosicalX).toEqual(
        catalogoPaginaUpdateDtoStub.inicialPosicalX,
      );
      expect(height).toEqual(catalogoPaginaUpdateDtoStub.height);
      expect(width).toEqual(catalogoPaginaUpdateDtoStub.width);
      expect(inicialPosicalY).toEqual(
        catalogoPaginaUpdateDtoStub.inicialPosicalY,
      );
    });
  });

  describe('Ler Mapeamentos da Pagina', () => {
    it('Deve retornar registros do stub"', async () => {
      const registros = await catalogoPaginaMapeamentoController.getAll(
        newCatalgoPagina.id,
      );
      expect(registros).not.toBeNull();
      expect(registros).toHaveLength(2);
    });
  });

  describe('Remover Mapeamento', () => {
    it('Tem que retornar um registro removido"', async () => {
      const { id } = await catalogoPaginaMapeamentoController.create(
        CatalogoPaginaMapeamentoCreateDtoStub(newCatalgoPagina),
      );
      const affected = await catalogoPaginaMapeamentoController.deleteId(id);
      expect(affected).toEqual(1);
    });

    it('Não pode retornar erro da busca do registro removido', async () => {
      const { id } = await catalogoPaginaMapeamentoController.create(
        CatalogoPaginaMapeamentoCreateDtoStub(newCatalgoPagina),
      );
      await catalogoPaginaMapeamentoController.deleteId(id);
      await expect(
        catalogoPaginaMapeamentoController.getId(id),
      ).rejects.toThrow(EntityNotFoundError);
    });
  });
});
