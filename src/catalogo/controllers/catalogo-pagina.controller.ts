import { CatalogoPaginaService } from './../services/catalogo-pagina.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  InternalServerErrorException,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateCatalogoPaginaDto,
  UpdateCatalogoPaginaDto,
  CatalogoPaginaDto,
} from '../dtos';
import { MediaType, RegistroNaoLocalizadoError } from '../../common';

@ApiUnauthorizedResponse({ description: 'Requisição não autenticada' })
@ApiTags('catalogoPagina')
@Controller('catalogo_pagina')
@ApiExtraModels(CreateCatalogoPaginaDto)
export class CatalogoPaginaController {
  constructor(private readonly service: CatalogoPaginaService) {}

  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros' })
  @Get()
  getAll(@Query() idCatalogo: string): Promise<CatalogoPaginaDto[]> {
    return this.service.getAll(idCatalogo);
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
  async getId(@Param('id') id: string): Promise<CatalogoPaginaDto> {
    try {
      return await this.service.getId(id);
    } catch (e) {
      console.error(e);
      if (e instanceof RegistroNaoLocalizadoError)
        throw new NotFoundException();
      else throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Remover registro por id' })
  @ApiResponse({ status: 200, description: 'Registro removido com sucesso.' })
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
  })
  @Delete(':id')
  async deleteId(@Param('id') id: string) {
    try {
      return await this.service.deleteId(id);
    } catch (e) {
      console.error(e);
      if (e instanceof RegistroNaoLocalizadoError)
        throw new NotFoundException(e.message);
      else throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Atualizar registro por id' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
  @Put(':id')
  @ApiBody({
    type: UpdateCatalogoPaginaDto,
    required: true,
    description: 'Atualzação de um catalogo pelo ID',
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  update(
    @Param('id') id: string,
    @Body() updateCatalogoDto: UpdateCatalogoPaginaDto,
  ) {
    this.service.update(id, updateCatalogoDto);
  }

  @ApiOperation({ summary: 'Incluir novo registro' })
  @ApiCreatedResponse({
    description: 'Registro incluido com sucesso',
    type: CatalogoPaginaDto,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @Post()
  @ApiBody({
    type: CreateCatalogoPaginaDto,
    required: true,
    description: 'Corpo do catalogo para inclusão',
  })
  create(
    @Body() catalogoCreateDto: CreateCatalogoPaginaDto,
  ): Promise<CatalogoPaginaDto> {
    return this.service.create(catalogoCreateDto);
  }
}
