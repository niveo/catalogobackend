import { ApiProperty } from '@nestjs/swagger';
import { CatalogoPaginaCreateDto } from './catalogo-pagina-create.dto';

export class CatalogoCreateDto {
  @ApiProperty()
  descricao: string;

  @ApiProperty({
    description:
      'Propriedade para ativar ou desativar o catalogo para visualização do cliente',
    type: Boolean,
  })
  ativo: boolean;

  @ApiProperty({ type: [CatalogoPaginaCreateDto] })
  paginas: CatalogoPaginaCreateDto[];
}
