import { Model } from 'mongoose';
import { CatalogoPagina } from '../schema/catalogo-pagina.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  CatalogoPaginaDto,
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
} from '../dtos';
import { RegistroNaoLocalizadoError } from '../../common';
import { CatalogoService } from './catalogo.service';

@Injectable()
export class CatalogoPaginaService {
  constructor(
    @InjectModel(CatalogoPagina.name)
    private readonly model: Model<CatalogoPagina>,

    private readonly catalogoService: CatalogoService,
  ) {}

  async getAll(id: string): Promise<CatalogoPaginaDto[]> {
    const paginas = await this.catalogoService.getIdWithPaginas(id);
    return this.model.find({
      _id: { $in: paginas },
    });
  }

  create(
    catalogoCreateDto: CreateCatalogoPaginaDto,
  ): Promise<CatalogoPaginaDto> {
    return new this.model(catalogoCreateDto).save();
  }

  async getId(id: string): Promise<CatalogoPaginaDto> {
    const registro = await this.model.findById(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  async deleteId(id: string): Promise<any> {
    const registro = await this.model.findByIdAndDelete(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  async update(
    id: string,
    updateCatalogoDto: UpdateCatalogoPaginaDto,
  ): Promise<CatalogoPaginaDto> {
    return await this.model.findByIdAndUpdate(id, updateCatalogoDto, {
      returnDocument: 'after',
    });
  }
}
