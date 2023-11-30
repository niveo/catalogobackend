import { PartialType } from '@nestjs/swagger';
import { CatalogoPaginaDto } from './catalogo-pagina.dto';

export class CreateCatalogoPaginaDto extends PartialType(CatalogoPaginaDto) {}
