import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://sandnine:y4nWwChddMP7NtpW@cluster0.f4qpzni.mongodb.net/catalogodb',
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
