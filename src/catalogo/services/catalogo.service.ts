import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatalogoDto, CreateCatalogoDto, UpdateCatalogoDto } from '../dtos';
import { Catalogo } from '../entities/catalogo.entity';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectRepository(Catalogo)
    private catalogoRepository: Repository<Catalogo>,
  ) {}

  async getAll(): Promise<CatalogoDto[]> {
    return await this.catalogoRepository.find();
  }

  create(catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    return this.catalogoRepository.save(catalogoCreateDto);
  }

  async getId(id: number): Promise<CatalogoDto> {
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
    updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<number> {
    return (await this.catalogoRepository.update(id, updateCatalogoDto))
      .affected;
  }

  importarCatalogoPdf() {}
}
