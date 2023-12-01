import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';

export class CatalogoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

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

  @ApiProperty({
    required: false,
    type: CatalogoPaginaDto,
    isArray: true,
  })
  paginas?: CatalogoPaginaDto[];
}
