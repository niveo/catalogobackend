import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatalogoService } from './catalogo.service';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiNotImplementedResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCatalogoDto } from './model/dto/create-catalogo.dto';
import { UpdateCatalogoDto } from './model/dto/update-catalogo.dto';
import { PaginatedDto } from '../model/dto/paginate.dto';
import { CatalogoDto } from './model/dto/catalog.dto';
import { ApiPaginatedResponse } from '../common/decorator/api-pagination-response';
import { MediaType } from '../common/media-type';

@ApiNotImplementedResponse({ description: 'Classe não implementada' })
@ApiTags('catalogo')
@Controller('api/catalogo')
@ApiExtraModels(PaginatedDto)
@ApiExtraModels(CatalogoDto)
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}

  @ApiPaginatedResponse(CatalogoDto)
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros paginados' })
  @Get()
  getAll(): Promise<PaginatedDto<CatalogoDto>> {
    return this.service.getAll();
  }

  @ApiOperation({ summary: 'Carregar registro por id' })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Get(':id')
  async getId(@Param('id') id: string): Promise<CatalogoDto> {
    return this.service.getId(id);
  }

  @ApiOperation({ summary: 'Remover registro por id' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Delete(':id')
  async deleteId(@Param('id') id: string) {
    this.service.deleteId(id);
  }

  @ApiOperation({ summary: 'Atualizar registro por id' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
  @Put(':id')
  @ApiBody({
    type: UpdateCatalogoDto,
    required: true,
    description: 'Atualzação de um catalogo pelo ID',
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  update(
    @Param('id') id: string,
    @Body() updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<CatalogoDto> {
    return this.service.update(id, updateCatalogoDto);
  }

  @ApiOperation({ summary: 'Incluir novo registro' })
  @ApiCreatedResponse({
    description: 'Registro incluido com sucesso',
    type: CatalogoDto,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @Post()
  @ApiBody({
    type: CreateCatalogoDto,
    required: true,
    description: 'Corpo do catalogo para inclusão',
  })
  create(@Body() catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    return this.service.create(catalogoCreateDto);
  }
}
