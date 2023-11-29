import { PartialType } from '@nestjs/swagger';
import { CatalogoDto } from './catalogo.dto';

export class CreateCatalogoDto extends PartialType(CatalogoDto) {}
