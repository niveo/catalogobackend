import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
import { EntityNotFoundError } from 'typeorm';
import { AuthorizationGuard } from './../authorization';
import { MediaType } from './../common';
import { ProdutoService } from './produto.service';
import { CreateProdutoDto, ProdutoDto, UpdateProdutoDto } from './../dtos';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Requisição não autenticada' })
@ApiTags('produto')
@Controller('produto')
@ApiExtraModels(ProdutoDto)
export class ProdutoController {
  constructor(private readonly service: ProdutoService) {}

  @ApiOperation({ summary: 'Incluir novo registro' })
  @ApiCreatedResponse({
    description: 'Registro incluido com sucesso',
    type: ProdutoDto,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiBody({
    type: CreateProdutoDto,
    required: true,
    description: 'Corpo do produto para inclusão',
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createProdutoDto: CreateProdutoDto): Promise<ProdutoDto> {
    return this.service.create(createProdutoDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Importar uma lista de produtos em csv' })
  @Post('importar')
  @UseInterceptors(FilesInterceptor('files'))
  importarProdutos(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('comCabecalho', ParseBoolPipe) comCabecalho: boolean,
    @Query('separador') separador: string,
  ) {
    return this.service.importarProdutos(
      files[0].buffer,
      comCabecalho,
      separador,
    );
  }

  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  async getAll(): Promise<ProdutoDto[]> {
    return this.service.getAll();
  }

  @ApiOperation({ summary: 'Carregar registro por id' })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getId(@Param('id', ParseIntPipe) id: number): Promise<ProdutoDto> {
    return this.service.getId(id);
  }

  @ApiOperation({ summary: 'Carregar registro por referencia' })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Get('referencia/:referencia')
  async getReferencia(
    @Param('referencia') referencia: string,
  ): Promise<ProdutoDto> {
    try {
      return await this.service.getReferencia(referencia);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  @ApiOperation({ summary: 'Atualizar registro por id' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
  @ApiBody({
    type: UpdateProdutoDto,
    required: true,
    description: 'Atualzação de um produto pelo ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdutoDto: UpdateProdutoDto,
  ): Promise<number> {
    return this.service.update(id, updateProdutoDto);
  }

  @ApiOperation({ summary: 'Remover registro por id' })
  @ApiResponse({ status: 200, description: 'Registro removido com sucesso.' })
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async deleteId(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return await this.service.deleteId(id);
  }
}
