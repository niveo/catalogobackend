import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationGuard } from 'src/authorization';
import { MobileService } from './mobile.service';

@ApiBearerAuth()
@UseGuards(AuthorizationGuard)
@Controller('mobile')
export class MobileController {
  constructor(private readonly service: MobileService) {}
}
