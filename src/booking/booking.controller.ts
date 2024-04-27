import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { SubscriberPattern } from '../common/interface/subscriber-pattern.interface';
import {
  CreateBookingDto,
  RetrieveBookingsDto,
  BookingActionDto,
} from './dto/booking.dto';

@Controller()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern({ cmd: SubscriberPattern.CREATE_BOOKING })
  async createPlane(
    @Payload() createBookingDto: CreateBookingDto,
  ): Promise<any> {
    return await this.bookingService.createBooking(createBookingDto);
  }

  @MessagePattern({ cmd: SubscriberPattern.RETRIEVE_ALL_BOOKINGS })
  async retrieveAllBookings(
    @Payload() retrieveAllBookingsDto: RetrieveBookingsDto,
  ): Promise<any> {
    return await this.bookingService.retrieveAllBookings(
      retrieveAllBookingsDto,
    );
  }

  @MessagePattern({ cmd: SubscriberPattern.RETRIEVE_BOOKING })
  async retrieveSingleBooking(@Payload() bookingId: string): Promise<any> {
    return await this.bookingService.retrieveSingleBooking(bookingId);
  }

  @MessagePattern({ cmd: SubscriberPattern.BOOKING_ACTION })
  async bookingAction(
    @Payload() bookingActionDto: BookingActionDto,
  ): Promise<any> {
    return await this.bookingService.bookingAction(bookingActionDto);
  }
}
