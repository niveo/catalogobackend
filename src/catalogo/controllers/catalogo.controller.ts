import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Post,
  Put,
  Query,
  InternalServerErrorException,
  Param,
} from '@nestjs/common';
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
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@dtos';
import {
  CatalogoDto,
  CreateCatalogoDto,
  UpdateCatalogoDto,
} from '../models/dtos';
import { CatalogoService } from '../services/catalogo.service';
import {
  ApiPaginatedResponse,
  RegistroNaoLocalizadoError,
  MediaType,
} from '@common';
//@ApiOAuth2(['pets:write'])
//@UseGuards(AuthorizationGuard)
@ApiUnauthorizedResponse({ description: 'Requisição não autenticada' })
@ApiNotImplementedResponse({ description: 'Classe não implementada' })
@ApiTags('catalogo')
@Controller('catalogo')
@ApiExtraModels(PageDto)
@ApiExtraModels(CatalogoDto)
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}

  @ApiPaginatedResponse(CatalogoDto)
  @ApiProduces(MediaType.APPLICATION_JSON)
  @ApiConsumes(MediaType.APPLICATION_JSON)
  @ApiOperation({ summary: 'Carregar registros paginados' })
  @Get()
  getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CatalogoDto>> {
    return this.service.getAll(pageOptionsDto);
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
  @ApiResponse({ status: 200, description: 'Registro atualizado com sucesso.' })
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
    type: UpdateCatalogoDto,
    required: true,
    description: 'Atualzação de um catalogo pelo ID',
  })
  @ApiProduces(MediaType.APPLICATION_JSON)
  update(
    @Param('id') id: string,
    @Body() updateCatalogoDto: UpdateCatalogoDto,
  ) {
    this.service.update(id, updateCatalogoDto);
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
