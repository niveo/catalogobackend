import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaMapeamentoDto } from './catalogo-pagina-mapeamento.dto';
import { CatalogoDto } from './catalogo.dto';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
} from 'class-validator';

export class CatalogoPaginaDto {
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
  pagina: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  size: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  height: number;

  @IsNumber()
  @ApiProperty({
    type: Number,
  })
  width: number;

  @IsString()
  @ApiProperty({
    type: String,
  })
  name: string;

  @IsNotEmptyObject()
  @ApiProperty({
    required: true,
    type: () => CatalogoDto,
  })
  catalogo?: CatalogoDto;

  @ApiProperty({
    required: false,
    type: CatalogoPaginaMapeamentoDto,
    isArray: true,
  })
  mapeamentos?: CatalogoPaginaMapeamentoDto[];

  @IsNumber()
  @ApiProperty({
    type: Number,
    readOnly: true,
    default: 0,
  })
  mapeados?: number = 0;
}
