import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';
import { ProdutoDto } from './produto.dto';

export class CatalogoPaginaMapeamentoDto {
  @ApiProperty({
    type: Number,
    readOnly: true,
  })
  id?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalX: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalX: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
  })
  inicialPosicalY: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
  })
  finalPosicalY: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
  })
  width: number;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
  })
  height: number;

  @IsNotEmptyObject()
  @ApiProperty({
    required: true,
    type: () => ProdutoDto,
  })
  produto: ProdutoDto;

  @IsNotEmptyObject()
  @ApiProperty({
    required: true,
    type: () => CatalogoPaginaDto,
  })
  catalogoPagina?: CatalogoPaginaDto;
}
