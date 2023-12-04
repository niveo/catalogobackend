import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';
import { IsDecimal, IsNotEmpty, IsNotEmptyObject } from 'class-validator';

export class CatalogoPaginaMapeamentoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @IsDecimal()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalX: number;

  @IsDecimal()
  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalX: number;

  @IsDecimal()
  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalY: number;

  @IsDecimal()
  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalY: number;

  @IsDecimal()
  @ApiProperty({
    required: true,
    type: Number,
  })
  width: number;

  @IsDecimal()
  @ApiProperty({
    required: true,
    type: Number,
  })
  height: number;

  @IsNotEmptyObject()
  @ApiProperty({
    required: true,
    type: () => CatalogoPaginaDto,
  })
  catalogoPagina?: CatalogoPaginaDto;
}
