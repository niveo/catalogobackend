import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';

export class CatalogoPaginaMapeamentoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

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

  @ApiProperty({
    required: true,
    type: Number,
  })
  width: number;

  @ApiProperty({
    required: true,
    type: Number,
  })
  height: number;

  @ApiProperty({
    required: true,
    type: () => CatalogoPaginaDto,
  })
  catalogoPagina?: CatalogoPaginaDto;
}
