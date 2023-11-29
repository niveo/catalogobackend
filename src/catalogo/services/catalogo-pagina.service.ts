import { Model } from 'mongoose';
import { ClientSession } from 'mongodb';
import { CatalogoPagina } from '../schema/catalogo-pagina.schema';
import { CatalogoPaginaMapeamentoService } from './catalogo-pagina-mapeamento.service';

export class CatalogoPaginaService {
  constructor(
    private model: Model<CatalogoPagina>,
    private catalogoPaginaMapeamentoService: CatalogoPaginaMapeamentoService,
  ) {}

  async salvarRegistros(registros: CatalogoPagina[], session: ClientSession) {
    const inseridos = [];
    for (const registro of registros) {
      const inseridosMapeados =
        await this.catalogoPaginaMapeamentoService.salvarRegistros(
          registro.mapeamentos,
          session,
        );
      registro.mapeamentos.push(...inseridosMapeados);

      const existe = await this.model.exists({ _id: registro._id }).exec();
      if (existe?._id) {
        await this.model.findByIdAndUpdate(existe?._id, registro);
      } else {
        inseridos.push(
          await new this.model(registro).save({
            session: session,
          }),
        );
      }
    }

    return inseridos;
  }
}
