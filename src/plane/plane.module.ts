import { Module } from '@nestjs/common';
import { PlaneService } from './plane.service';
import { PlaneController } from './plane.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PlaneRepository } from './plane.repository';
import { Plane, PlaneSchema } from './entities/plane.entity';
import { PlaneUtility } from '../common/utils/plane.util';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Plane.name, schema: PlaneSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.registerAsync([
      {
        name: 'FLIGHT_BOOKING_SERVICE',
        inject: [ConfigService],
        useFactory: async (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: config.get('RABBITMQ_URL'),
            queue: config.get('BOOKING_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: configService.get('RABBITMQ_URL'),
            queue: configService.get('AUTH_QUEUE'),
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [PlaneController],
  providers: [PlaneService, PlaneRepository, PlaneUtility],
  exports: [PlaneService],
})
export class PlaneModule {}
