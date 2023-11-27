import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CatalogoPaginaMapeamentoDocument =
  HydratedDocument<CatalogoPaginaMapeamento>;

@Schema({ collection: 'catalogo_pagina_mapeamento', timestamps: true })
export class CatalogoPaginaMapeamento {
  _id: mongoose.Schema.Types.ObjectId;
  @Prop()
  inicialPosicalX: number;
  @Prop()
  finalPosicalX: number;
  @Prop()
  inicialPosicalY: number;
  @Prop()
  finalPosicalY: number;
  @Prop()
  width: number;
  @Prop()
  height: number;
}

export const CatalogoPaginaMapeamentoSchema = SchemaFactory.createForClass(
  CatalogoPaginaMapeamento,
);
