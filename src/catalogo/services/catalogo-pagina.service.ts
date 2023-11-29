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
import { PageDto, PageMetaDto, PageOptionsDto } from 'dtos';

@Injectable()
export class CatalogoPaginaService {
  constructor(
    @InjectModel(CatalogoPagina.name)
    private readonly model: Model<CatalogoPagina>,
  ) {}

  async getAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CatalogoPaginaDto>> {
    const queryCount = this.model
      .find()
      .sort({ _id: -1 })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const query = this.model
      .find()
      .sort({ _id: -1 })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const itemCount = await queryCount.countDocuments();
    const entities = await query.exec();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
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
