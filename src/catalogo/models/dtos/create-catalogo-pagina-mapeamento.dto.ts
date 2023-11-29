import { ApiProperty } from '@nestjs/swagger';
import mongoose from 'mongoose';

export class CreateCatalogoPaginaMapeamentoDto {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  _id?: mongoose.Schema.Types.ObjectId;

  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalX: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalX: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalY: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalY: number;

  width: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  height: number;
}
