import { Model } from 'mongoose';
import { CatalogoPaginaMapeamento } from '../schema/catalogo-pagina-mapemanto.schema';
import { InjectModel } from '@nestjs/mongoose';

export class CatalogoPaginaMapeamentoService {
  constructor(
    @InjectModel(CatalogoPaginaMapeamento.name)
    private readonly model: Model<CatalogoPaginaMapeamento>,
  ) {}
}
