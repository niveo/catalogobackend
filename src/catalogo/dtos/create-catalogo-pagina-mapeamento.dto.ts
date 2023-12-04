import { PartialType } from '@nestjs/swagger';
import { CatalogoPaginaMapeamentoDto } from './catalogo-pagina-mapeamento.dto';

export class CreateCatalogoPaginaMapeamentoDto extends PartialType(
  CatalogoPaginaMapeamentoDto,
) {}
