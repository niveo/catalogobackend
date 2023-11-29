import { Model } from 'mongoose';
import { CatalogoPagina } from '../schema/catalogo-pagina.schema';
import { InjectModel } from '@nestjs/mongoose';

export class CatalogoPaginaService {
  constructor(
    @InjectModel(CatalogoPagina.name)
    private readonly model: Model<CatalogoPagina>,
  ) {}
}
