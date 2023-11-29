import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';

export class CreateCatalogoPaginaDto extends PartialType(CatalogoPaginaDto) {
  @ApiProperty({
    type: String,
    readOnly: true,
  })
  catalogoID: string;
}
