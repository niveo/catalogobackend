import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import { Catalogo } from './schema/catalogo.schema';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CatalogoCreateDto } from './dto/catalogo-create.dto';

@ApiTags('catalogo')
@Controller('api/catalogo')
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}
  @Get()
  getAll(): Promise<Catalogo[]> {
    return this.service.getAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
  })
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: Catalogo,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  create(@Body() catalogoCreateDto: CatalogoCreateDto): Promise<Catalogo> {
    return this.service.create(catalogoCreateDto);
  }
}
