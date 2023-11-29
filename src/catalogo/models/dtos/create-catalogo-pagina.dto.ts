import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateCatalogoPaginaDto {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  _id?: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    required: true,
    type: Number,
  })
  pagina: number;
}
