import { Controller, Get } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { Catalogo } from './schema/catalogo.schema';

@Controller('api/catalogo')
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}
  @Get()
  getAll(): Promise<Catalogo[]> {
    return this.service.getAll();
  }
}
