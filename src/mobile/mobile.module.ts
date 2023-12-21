import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';
import { MobileController } from './mobile.controller';
import { MobileService } from './mobile.service';

@Module({
  imports: [ConfigModule, ClsModule.forFeature()],
  controllers: [MobileController],
  providers: [MobileService],
})
export class MobileModule {}
