import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CatalogoDto {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  _id?: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
  })
  descricao: string;

  @IsNotEmpty()
  @ApiProperty({
    description:
      'Propriedade para ativar ou desativar o catalogo para visualização do cliente',
    default: false,
    required: true,
    type: Boolean,
  })
  ativo: boolean = false;
}
