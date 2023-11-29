import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CatalogoPagina } from './catalogo-pagina.schema';

export type CatalogoDocument = HydratedDocument<Catalogo>;

@Schema({ collection: 'catalogo', timestamps: true })
export class Catalogo {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  descricao: string;

  @Prop()
  ativo: boolean;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatalogoPagina',
      },
    ],
  })
  paginas?: CatalogoPagina[];
}

export const CatalogoSchema = SchemaFactory.createForClass(Catalogo);
