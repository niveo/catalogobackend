import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CatalogoPaginaDto,
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
} from '../../dtos';
import { CatalogoPagina } from '../../entities/catalogo-pagina.entity';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class CatalogoPaginaService {
  constructor(
    @InjectRepository(CatalogoPagina)
    private readonly catalogoRepository: Repository<CatalogoPagina>,
    private readonly cls: ClsService,
  ) {}

  async getCatalogoPaginaMobile(): Promise<any[]> {
    const userId = this.cls.get('userId');
    return this.catalogoRepository
      .createQueryBuilder('catalogoPagina')
      .select('catalogo.id', 'catalogoId')
      .addSelect('catalogoPagina.id', 'id')
      .addSelect('catalogoPagina.pagina', 'pagina')
      .addSelect('catalogoPagina.size', 'size')
      .addSelect('catalogoPagina.height', 'height')
      .addSelect('catalogoPagina.width', 'width')
      .addSelect('catalogoPagina.name', 'name')
      .innerJoin('catalogoPagina.catalogo', 'catalogo')
      .where('catalogo.userId = :userId', { userId: userId })
      .getRawMany();
  }

  async getPaginasCatalogo(idCatalogo: number): Promise<CatalogoPaginaDto[]> {
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

  getPaginaLazy(id: number): Promise<CatalogoPaginaDto> {
    const qb = this.catalogoRepository.createQueryBuilder('pagina');
    qb.leftJoinAndSelect('pagina.mapeamentos', 'mapeamentos');
    qb.where('pagina.id = :id', { id: id });
    return qb.getOneOrFail();
  }

  async update(
    id: number,
    updateCatalogoDto: UpdateCatalogoPaginaDto,
  ): Promise<number> {
    return (await this.catalogoRepository.update({ id: id }, updateCatalogoDto))
      .affected;
  }
}
