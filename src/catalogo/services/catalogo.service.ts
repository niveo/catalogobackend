import { Injectable } from '@nestjs/common';
import { Catalogo } from '../schema/catalogo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatalogoDto, UpdateCatalogoDto, CatalogoDto } from '../dtos'; 
import { RegistroNaoLocalizadoError } from 'common';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectModel(Catalogo.name) private readonly model: Model<Catalogo>,
  ) {}

  async getAll(): Promise<CatalogoDto[]> {
    const query = this.model.find();
    const entities = await query.exec();
    return entities;
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
