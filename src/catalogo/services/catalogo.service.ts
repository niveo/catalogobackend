import { Injectable } from '@nestjs/common';
import { Catalogo } from '../schema/catalogo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateCatalogoDto,
  UpdateCatalogoDto,
  CatalogoDto,
} from '../models/dtos';
import { PageDto, PageOptionsDto, PageMetaDto } from '@dtos';
import { RegistroNaoLocalizadoError } from '@common';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectModel(Catalogo.name) private readonly model: Model<Catalogo>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CatalogoDto>> {
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

  create(catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    return new this.model(catalogoCreateDto).save();
  }

  async getId(id: string): Promise<CatalogoDto> {
    const registro = await this.model.findById(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  async deleteId(id: string): Promise<any> {
    const registro = await this.model.findByIdAndDelete(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  async update(id: string, updateCatalogoDto: UpdateCatalogoDto) {
    await this.model.findByIdAndUpdate(id, updateCatalogoDto);
  }
}
