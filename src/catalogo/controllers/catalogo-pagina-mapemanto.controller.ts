import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
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
import { CatalogoPaginaMapeamentoService } from '../../catalogo/services/catalogo-pagina-mapeamento.service';
import { MediaType, RegistroNaoLocalizadoError } from '../../common';
import {
  CatalogoPaginaMapeamentoDto,
  CreateCatalogoPaginaMapeamentoDto,
  UpdateCatalogoPaginaMapeamentoDto,
} from '../../dtos';
import { AuthorizationGuard } from '../../authorization';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Requisição não autenticada' })
@ApiTags('catalogoPaginaMapeamento')
@Controller('catalogo_pagina_mapeamento')
@ApiExtraModels(CatalogoPaginaMapeamentoDto)
export class CatalogoPaginaMapeamentoController {
  constructor(private readonly service: CatalogoPaginaMapeamentoService) {}

  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros paginados' })
  @Get()
  getAll(
    @Query('idCatalogoPagina', ParseIntPipe) idCatalogoPagina: number,
  ): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.service.getCatalogoPaginaMapeamento(idCatalogoPagina);
  }

  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros dos produtos mapeados' })
  @Get('lista/:idCatalogoPagina')
  getMapeamentoProdutoCordenadas(
    @Param('idCatalogoPagina', ParseIntPipe) idCatalogoPagina: number,
  ): Promise<CatalogoPaginaMapeamentoDto[]> {
    return this.service.getMapeamentoProdutoCordenadas(idCatalogoPagina);
  }

  @ApiOperation({ summary: 'Carregar registro por id' })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Get(':id')
  async getId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatalogoPaginaMapeamentoDto> {
    return await this.service.getId(id);
  }

  @ApiOperation({ summary: 'Remover registro mapeado' })
  @ApiResponse({ status: 200, description: 'Registro removido com sucesso.' })
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Delete('deleteMapeado')
  async deleteProdutoCordenada(
    @Query('id', ParseIntPipe) id: number,
    @Query('produto', ParseIntPipe) produto: number,
  ) {
    try {
      return await this.service.deleteProdutoCordenada(id, produto);
    } catch (e) {
      console.error(e);
      if (e instanceof RegistroNaoLocalizadoError)
        throw new NotFoundException(e.message);
      else throw new InternalServerErrorException();
    }
  }

  @ApiOperation({ summary: 'Remover registro por id' })
  @ApiResponse({ status: 200, description: 'Registro removido com sucesso.' })
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @Delete(':id')
  async deleteId(@Param('id', ParseIntPipe) id: number) {
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
    type: UpdateCatalogoPaginaMapeamentoDto,
    required: true,
    description: 'Atualzação de um catalogo pelo ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCatalogoDto: UpdateCatalogoPaginaMapeamentoDto,
  ): Promise<number> {
    return this.service.update(id, updateCatalogoDto);
  }

  @ApiOperation({ summary: 'Incluir novo registro' })
  @ApiCreatedResponse({
    description: 'Registro incluido com sucesso',
    type: CatalogoPaginaMapeamentoDto,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @Post()
  @ApiBody({
    type: CreateCatalogoPaginaMapeamentoDto,
    required: true,
    description: 'Corpo do catalogo para inclusão',
  })
  create(
    @Body() catalogoCreateDto: CreateCatalogoPaginaMapeamentoDto,
  ): Promise<CatalogoPaginaMapeamentoDto> {
    return this.service.create(catalogoCreateDto);
  }
}
