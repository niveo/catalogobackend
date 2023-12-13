import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class ProdutoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
  })
  referencia: string;

  @IsDefined()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: String,
  })
  descricao: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Propriedade para ativar ou desativar o catalogo para visualização do cliente',
    default: false,
    required: true,
    type: Boolean,
  })
  ativo: boolean = false;

  @Exclude()
  @ApiHideProperty()
  cadastrado?: Date;

  @Exclude()
  @ApiHideProperty()
  atualizado?: Date;

  @Exclude()
  @ApiHideProperty()
  removido?: Date;

  @Exclude()
  @ApiHideProperty()
  versao?: number;

  @Exclude()
  @ApiHideProperty()
  userId?: string;

  @IsNumber()
  @ApiProperty({
    type: Number,
    readOnly: true,
    default: 0,
  })
  mapeados?: number = 0;
}
