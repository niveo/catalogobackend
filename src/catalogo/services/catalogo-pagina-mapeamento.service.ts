import { Model } from 'mongoose';
import { CatalogoPaginaMapeamento } from '../schema/catalogo-pagina-mapemanto.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  CatalogoPaginaMapeamentoDto,
  CreateCatalogoPaginaMapeamentoDto,
  UpdateCatalogoPaginaMapeamentoDto,
} from '../dtos';
import { RegistroNaoLocalizadoError } from 'common';

@Injectable()
export class CatalogoPaginaMapeamentoService {
  constructor(
    @InjectModel(CatalogoPaginaMapeamento.name)
    private readonly model: Model<CatalogoPaginaMapeamento>,
  ) {}

  async getAll(
    idCatalogoPagina: string,
  ): Promise<CatalogoPaginaMapeamentoDto[]> {
    const query = this.model.find({ catalogoPagina: idCatalogoPagina });
    const entities = await query.exec();
    return entities;
  }

  create(
    catalogoCreateDto: CreateCatalogoPaginaMapeamentoDto,
  ): Promise<CatalogoPaginaMapeamentoDto> {
    return new this.model(catalogoCreateDto).save();
  }

  async getId(id: string): Promise<CatalogoPaginaMapeamentoDto> {
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
    updateCatalogoDto: UpdateCatalogoPaginaMapeamentoDto,
  ) {
    await this.model.findByIdAndUpdate(id, updateCatalogoDto, {
      returnDocument: 'after',
    });
  }
}
