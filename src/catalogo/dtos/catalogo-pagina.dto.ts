import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaMapeamentoDto } from './catalogo-pagina-mapeamento.dto';
import { CatalogoDto } from './catalogo.dto';

export class CatalogoPaginaDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  pagina: number;

  @ApiProperty({
    required: true,
    type: () => CatalogoDto,
  })
  catalogo?: CatalogoDto;

  @ApiProperty({
    required: true,
    type: CatalogoPaginaMapeamentoDto,
    isArray: true,
  })
  mapeamentos?: CatalogoPaginaMapeamentoDto[];
}
