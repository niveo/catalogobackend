import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
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

  create(
    createCatalogoPaginaMapeamentoDto: CreateCatalogoPaginaMapeamentoDto,
  ): Promise<InsertResult> {
    return this.catalogoRepository.insert(createCatalogoPaginaMapeamentoDto);
  }

  async getId(id: number): Promise<CatalogoPaginaMapeamentoDto> {
    return this.catalogoRepository.findOneByOrFail({
      id: id,
    });
  }

  async deleteId(id: number): Promise<UpdateResult> {
    return await this.catalogoRepository.softDelete({
      id: id,
    });
  }

  async update(
    id: number,
    updateCatalogoPaginaMapeamentoDto: UpdateCatalogoPaginaMapeamentoDto,
  ): Promise<UpdateResult> {
    return await this.catalogoRepository.update(
      { id: id },
      updateCatalogoPaginaMapeamentoDto,
    );
  }
}
