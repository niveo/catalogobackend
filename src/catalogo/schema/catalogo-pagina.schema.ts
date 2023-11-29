import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { CatalogoPaginaMapeamento } from './catalogo-pagina-mapemanto.schema';
import { Catalogo } from './catalogo.schema';

export type CatalogoPaginaDocument = HydratedDocument<CatalogoPagina>;

@Schema({ collection: 'catalogo_pagina', timestamps: true })
export class CatalogoPagina {
  _id?: mongoose.Schema.Types.ObjectId;

  @Prop()
  pagina: number;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Catalogo',
      },
    ],
  })
  catalogo?: Catalogo;

  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CatalogoPaginaMapeamento',
      },
    ],
  })
  mapeamentos?: CatalogoPaginaMapeamento[];
}

export const CatalogoPaginaSchema =
  SchemaFactory.createForClass(CatalogoPagina);
