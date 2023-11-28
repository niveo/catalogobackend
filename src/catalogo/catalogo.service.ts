import { Injectable } from '@nestjs/common';
import { Catalogo } from './schema/catalogo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatalogoDto } from './model/dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './model/dto/update-catalogo.dto';
import { CatalogoDto } from './model/dto/catalog.dto';
import { PageDto } from '../model/dtos/page.dto';
import { PageOptionsDto } from '../model/dtos/page-options.dto';
import { PageMetaDto } from '../model/dtos/page-meta.dto';
import { RegistroNaoLocalizadoError } from '../common/exceptions/registro-nao-localizado.error';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectModel(Catalogo.name) private catalogoModel: Model<Catalogo>,
  ) {}

  async getAll(pageOptionsDto: PageOptionsDto): Promise<PageDto<CatalogoDto>> {
    const queryCount = this.catalogoModel
      .find()
      .sort({ _id: -1 })
      .skip(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const query = this.catalogoModel
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
    return new this.catalogoModel(catalogoCreateDto).save();
  }

  async getId(id: string): Promise<CatalogoDto> {
    const registro = await this.catalogoModel.findById(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  async deleteId(id: string): Promise<any> {
    const registro = await this.catalogoModel.findByIdAndDelete(id);
    if (!registro) throw new RegistroNaoLocalizadoError();
    return registro;
  }

  update(
    id: string,
    updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<CatalogoDto> {
    throw new Error('Method not implemented.');
  }
}
