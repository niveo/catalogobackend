import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { Exclude } from 'class-transformer';

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
}
