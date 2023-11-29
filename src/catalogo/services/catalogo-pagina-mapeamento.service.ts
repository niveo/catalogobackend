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
import { PageDto, PageMetaDto, PageOptionsDto } from 'dtos';

@Injectable()
export class CatalogoPaginaMapeamentoService {
  constructor(
    @InjectModel(CatalogoPaginaMapeamento.name)
    private readonly model: Model<CatalogoPaginaMapeamento>,
  ) {}

  async getAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CatalogoPaginaMapeamentoDto>> {
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
    await this.model.findByIdAndUpdate(id, updateCatalogoDto);
  }
}
