import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

//@ApiBearerAuth()
//@UseGuards(AuthorizationGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/registeredUser')
  registeredUser(@Query('user_id') user_id: string) {
    return this.appService.registeredUser(user_id);
  }

  @Get('/')
  getHello() {
    return 'Catalogo BackEnd';
  }
}
