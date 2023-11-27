import { Injectable } from '@nestjs/common';
import { Catalogo } from './schema/catalogo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CatalogoCreateDto } from './dto/catalogo-create.dto';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectModel(Catalogo.name) private catalogoModel: Model<Catalogo>,
  ) {}

  getAll(): Promise<Catalogo[]> {
    return this.catalogoModel.find().exec();
  }

  create(catalogoCreateDto: CatalogoCreateDto): Promise<Catalogo> {
    throw new Error('Method not implemented.');
  }
}
