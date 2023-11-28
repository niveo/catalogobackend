import { PartialType } from '@nestjs/swagger';
import { CatalogoDto } from './catalog.dto';

export class CreateCatalogoDto extends PartialType(CatalogoDto) {}
