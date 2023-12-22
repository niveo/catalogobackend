import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthorizationGuard } from './authorization';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/registeredUser')
  registeredUser(@Query('user_id') user_id: string) {
    return this.appService.registeredUser(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthorizationGuard)
  @Get('/userprofile')
  getUserId(): Promise<any> {
    return this.appService.getUserProfile();
  }

  @Get('/')
  getHello() {
    return 'Catalogo BackEnd';
  }
}
