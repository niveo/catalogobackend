import { Model } from 'mongoose';
import { CatalogoPagina } from '../schema/catalogo-pagina.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  CatalogoPaginaDto,
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
} from '../dtos';
import { RegistroNaoLocalizadoError } from 'common';

@Injectable()
export class CatalogoPaginaService {
  constructor(
    @InjectModel(CatalogoPagina.name)
    private readonly model: Model<CatalogoPagina>,
  ) {}

  async getAll(idCatalogo: string): Promise<CatalogoPaginaDto[]> {
    const query = this.model.find({ catalogo: idCatalogo });
    const entities = await query.exec();
    return entities;
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

  async update(id: string, updateCatalogoDto: UpdateCatalogoPaginaDto) {
    await this.model.findByIdAndUpdate(id, updateCatalogoDto);
  }
}
