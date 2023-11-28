import { ApiProperty } from '@nestjs/swagger';
import { CreateCatalogoPaginaMapeamentoDto } from './create-catalogo-pagina-mapeamento.dto';

export class CreateCatalogoPaginaDto {
  @ApiProperty({
    required: true,
    type: Number,
  })
  pagina: number;

  @ApiProperty({
    type: [CreateCatalogoPaginaMapeamentoDto],
    isArray: true,
    required: true,
  })
  paginas: CreateCatalogoPaginaMapeamentoDto[];
}
