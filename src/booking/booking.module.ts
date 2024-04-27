import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BookingRepository } from './booking.repository';
import { Booking, BookingSchema } from './entities/booking.entity';
import { PlaneUtility } from '../common/utils/plane.util';
import { Plane, PlaneSchema } from '../plane/entities/plane.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Plane.name, schema: PlaneSchema },
    ]),
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
  controllers: [BookingController],
  providers: [BookingService, BookingRepository, PlaneUtility],
})
export class BookingModule {}
