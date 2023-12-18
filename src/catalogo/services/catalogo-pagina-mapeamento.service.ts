import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CatalogoPaginaMapeamentoDto,
  CreateCatalogoPaginaMapeamentoDto,
  UpdateCatalogoPaginaMapeamentoDto,
} from '../../dtos';
import { Repository } from 'typeorm';
import { CatalogoPaginaMapeamento } from '../../entities/catalogo-pagina-mapeamento.entity';

@Injectable()
export class CatalogoPaginaMapeamentoService {
  constructor(
    @InjectRepository(CatalogoPaginaMapeamento)
    private catalogoRepository: Repository<CatalogoPaginaMapeamento>,
  ) {
    this.getMapeamentoProdutoCordenadas(1);
  }

  async getAll(idCatalogo: number): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.catalogoRepository.find({
      where: {
        catalogoPagina: {
          id: idCatalogo,
        },
      },
    });
  }

  getMapeamentoProdutoCordenadas(
    idCatalogo: number,
  ): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.catalogoRepository
      .createQueryBuilder('cpm')
      .leftJoin('cpm.catalogoPagina', 'catalogoPagina')
      .leftJoinAndSelect('cpm.produtos', 'produtos')
      .where('catalogoPagina.id = :id', {
        id: idCatalogo,
      })
      .cache(true)
      .getMany();
  }

  create(
    createCatalogoPaginaMapeamentoDto: CreateCatalogoPaginaMapeamentoDto,
  ): Promise<CatalogoPaginaMapeamentoDto> {
    return this.catalogoRepository.save(createCatalogoPaginaMapeamentoDto);
  }

  async getId(id: number): Promise<CatalogoPaginaMapeamentoDto> {
    return this.catalogoRepository.findOneByOrFail({
      id: id,
    });
  }

  async deleteId(id: number): Promise<number> {
    return (
      await this.catalogoRepository.softDelete({
        id: id,
      })
    ).affected;
  }

  async deleteProdutoCordenada(id: number, produto: number) {
    const registro = await this.catalogoRepository.findOneOrFail({
      where: {
        id: id,
      },
      relations: {
        produtos: true,
      },
    });

    const index = registro.produtos.findIndex((i) => i.id === produto);
    if (index !== -1) {
      registro.produtos.splice(index, 1);
    }

    //Se não existir produtos remover o mapeamento
    if (registro.produtos.length === 0) {
      await this.catalogoRepository.delete(id);
    } else {
      await this.catalogoRepository.save(registro);
    }
  }

  async update(
    id: number,
    updateCatalogoPaginaMapeamentoDto: UpdateCatalogoPaginaMapeamentoDto,
  ): Promise<number> {
    return (
      await this.catalogoRepository.update(
        { id: id },
        updateCatalogoPaginaMapeamentoDto,
      )
    ).affected;
  }
}
