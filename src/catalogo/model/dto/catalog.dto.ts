import { ApiProperty } from '@nestjs/swagger';
import { CreateCatalogoPaginaDto } from './create-catalogo-pagina.dto';

export class CatalogoDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  descricao: string;

  @ApiProperty({
    description:
      'Propriedade para ativar ou desativar o catalogo para visualização do cliente',
    default: false,
    required: true,
    type: Boolean,
  })
  ativo: boolean = false;

  @ApiProperty({
    type: [CreateCatalogoPaginaDto],
    isArray: true,
    required: true,
  })
  paginas: CreateCatalogoPaginaDto[];
}
