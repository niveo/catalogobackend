import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty, IsString } from 'class-validator';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';
import { Exclude } from 'class-transformer';

export class CatalogoDto {
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

  @Exclude()
  @ApiHideProperty()
  identificador?: string;

  @ApiProperty({
    required: false,
    type: CatalogoPaginaDto,
    isArray: true,
  })
  paginas?: CatalogoPaginaDto[];
}
