import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { existsSync, mkdirSync } from 'fs';
import * as path from 'path';
import { PlaneModule } from './plane/plane.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    PlaneModule,
    BookingModule,

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    if (!existsSync(path.join(__dirname, '..', 'logs'))) {
      mkdirSync(path.join(__dirname, '..', 'logs'));
    }
    return;
  }
}
