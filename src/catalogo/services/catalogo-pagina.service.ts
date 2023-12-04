import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CatalogoPaginaDto,
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
} from '../dtos';
import { CatalogoPagina } from '../entities/catalogo-pagina.entity';

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

  async deleteId(id: number): Promise<number> {
    return (
      await this.catalogoRepository.softDelete({
        id: id,
      })
    ).affected;
  }

  async update(
    id: number,
    updateCatalogoDto: UpdateCatalogoPaginaDto,
  ): Promise<number> {
    return (await this.catalogoRepository.update({ id: id }, updateCatalogoDto))
      .affected;
  }
}
