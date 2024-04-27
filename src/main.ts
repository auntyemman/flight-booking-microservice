import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { FlightBookingMsLogger } from './common/interceptor/logger.interceptor';
import * as http from 'http';

async function bootstrap() {
  const logger = new Logger('FlightBookingMicroservice');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: process.env.BOOKING_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalInterceptors(new FlightBookingMsLogger());

  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.end('Welcom to flight booking microservice');
  });

  server.listen(5002);

  await app.listen().finally(() => logger.log(`Flight Booking Microservice`));
}
bootstrap();
