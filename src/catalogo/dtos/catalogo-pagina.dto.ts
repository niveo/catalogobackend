import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaMapeamentoDto } from './catalogo-pagina-mapeamento.dto';
import { CatalogoDto } from './catalogo.dto';
import { IsNotEmpty, IsNotEmptyObject, IsNumber } from 'class-validator';

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
}
