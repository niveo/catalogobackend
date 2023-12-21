import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthorizationGuard } from 'src/authorization';
import { MobileService } from './mobile.service';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@Controller('mobile')
export class MobileController {
  constructor(private readonly service: MobileService) {}

  @Get('/buffer')
  async carregarArquivoBuffer(@Res() response: Response) {
    const file = await this.service.carregarArquivoBuffer();

    response.set(
      'Content-disposition',
      'attachment; filename=' + file.fileName,
    );
    response.set('Content-type', 'application/octet-stream');
    response.send(file.file);
  }
}
