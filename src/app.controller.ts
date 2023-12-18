import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/registeredUser')
  registeredUser(@Query('user_id') user_id: string) {
    this.appService.registeredUser(user_id);
  }
}
