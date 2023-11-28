import { Injectable } from '@nestjs/common';
import { Catalogo } from './schema/catalogo.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatalogoDto } from './model/dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './model/dto/update-catalogo.dto';
import { PaginatedDto } from 'src/model/dto/paginate.dto';
import { CatalogoDto } from './model/dto/catalog.dto';

@Injectable()
export class CatalogoService {
  constructor(
    @InjectModel(Catalogo.name) private catalogoModel: Model<Catalogo>,
  ) {}

  getAll(): Promise<PaginatedDto<CatalogoDto>> {
    //return this.catalogoModel.find().exec();
    throw new Error('Method not implemented.');
  }

  create(catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    throw new Error('Method not implemented.');
  }

  getId(id: string): Promise<CatalogoDto> {
    throw new Error('Method not implemented.');
  }

  deleteId(id: string) {
    throw new Error('Method not implemented.');
  }

  update(id: string, updateCatalogoDto: UpdateCatalogoDto): Promise<CatalogoDto> {
    throw new Error('Method not implemented.');
  }
}
