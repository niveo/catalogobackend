import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
import { AuthorizationGuard } from '../../authorization';
import { MediaType } from '../../common';
import { CatalogoDto, CreateCatalogoDto, UpdateCatalogoDto } from '../../dtos';
import { CatalogoService } from '../services/catalogo.service';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiUnauthorizedResponse({ description: 'Requisição não autenticada' })
@ApiTags('catalogo')
@Controller('catalogo')
@ApiExtraModels(CatalogoDto)
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}

  @ApiOperation({ summary: 'Incluir novo registro' })
  @ApiCreatedResponse({
    description: 'Registro incluido com sucesso',
    type: CatalogoDto,
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiBody({
    type: CreateCatalogoDto,
    required: true,
    description: 'Corpo do catalogo para inclusão',
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() catalogoCreateDto: CreateCatalogoDto): Promise<CatalogoDto> {
    return this.service.create(catalogoCreateDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Importar arquivos para um novo catalogo' })
  @Post('importar')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files' },
      { name: 'logo' },
      { name: 'avatar' },
    ]),
  )
  importarCatalogo(
    @UploadedFiles()
    files: {
      files: Express.Multer.File[];
      logo: Express.Multer.File[];
      avatar: Express.Multer.File[];
    },
    @Query('titulo') titulo: string,
    @Query('descricao') descricao: string,
    @Query('ativo', ParseBoolPipe) ativo: boolean,
  ) {
    return this.service.importarCatalogo(
      titulo,
      descricao,
      ativo,
      files.files,
      files.logo,
      files.avatar,
    );
  }

  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros' })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Get()
  getAll(): Promise<CatalogoDto[]> {
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
  async getId(@Param('id', ParseIntPipe) id: number): Promise<CatalogoDto> {
    return this.service.getId(id);
  }

  @ApiOperation({ summary: 'Carregar registro por id com paginas em lazy' })
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.TEXT_PLAIN)
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Get('lazy/:id')
  async getCatalogoLazy(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CatalogoDto> {
    return this.service.getCatalogoLazy(id);
  }

  @ApiOperation({ summary: 'Atualizar registro por id' })
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
  @ApiBody({
    type: UpdateCatalogoDto,
    required: true,
    description: 'Atualzação de um catalogo pelo ID',
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
    @Body() updateCatalogoDto: UpdateCatalogoDto,
  ): Promise<number> {
    return this.service.update(id, updateCatalogoDto);
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
  deleteId(@Param('id', ParseIntPipe) id: number): Promise<number> {
    return this.service.deleteId(id);
  }
}
