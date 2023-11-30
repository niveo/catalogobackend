import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import {
  CatalogoPaginaDto,
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
} from '../dtos';
import { CatalogoPagina } from '../models/catalogo-pagina.entity';

@Injectable()
export class CatalogoPaginaService {
  constructor(
    @InjectRepository(CatalogoPagina)
    private readonly catalogoRepository: Repository<CatalogoPagina>,
  ) {}

  async getAll(idCatalogo: number): Promise<CatalogoPaginaDto[]> {
    return this.catalogoRepository.find({
      where: {
        catalogo: {
          id: idCatalogo,
        },
      },
    });
  }

  create(
    catalogoCreateDto: CreateCatalogoPaginaDto,
  ): Promise<CatalogoPaginaDto> {
    return this.catalogoRepository.save(catalogoCreateDto);
  }

  async getId(id: number): Promise<CatalogoPaginaDto> {
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
    updateCatalogoDto: UpdateCatalogoPaginaDto,
  ): Promise<UpdateResult> {
    return await this.catalogoRepository.update({ id: id }, updateCatalogoDto);
  }
}
