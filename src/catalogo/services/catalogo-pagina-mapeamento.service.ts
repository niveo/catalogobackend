import { ClientSession, Model } from 'mongoose';
import { CatalogoPaginaMapeamento } from '../schema/catalogo-pagina-mapemanto.schema';

export class CatalogoPaginaMapeamentoService {
  constructor(private model: Model<CatalogoPaginaMapeamento>) {}

  async salvarRegistros(
    registros: CatalogoPaginaMapeamento[],
    session: ClientSession,
  ) {
    const inseridos = [];
    for (const registro of registros) {
      const existe = await this.model.exists({ _id: registro._id }).exec();
      if (existe?._id) {
        await this.model.findByIdAndUpdate(existe?._id, existe);
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
