import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CatalogoPaginaMapeamentoDto,
  CreateCatalogoPaginaMapeamentoDto,
  UpdateCatalogoPaginaMapeamentoDto,
} from '../dtos';
import { CatalogoPaginaMapeamento } from '../entities/catalogo-pagina-mapeamento.entity';

@Injectable()
export class CatalogoPaginaMapeamentoService {
  constructor(
    @InjectRepository(CatalogoPaginaMapeamento)
    private catalogoRepository: Repository<CatalogoPaginaMapeamento>,
  ) {}

  async getAll(idCatalogo: number): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.catalogoRepository.find({
      where: {
        catalogoPagina: {
          id: idCatalogo,
        },
      },
    });
  }

  async getAll2(): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.catalogoRepository.find();
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
