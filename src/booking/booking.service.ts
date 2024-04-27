import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorResponse } from '../common/interface/error-response.interface';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { BookingRepository } from './booking.repository';
import moment from 'moment';
import { BookingActionFlags, BookingStatus } from './interface/utils.interface';
import {
  BookingActionDto,
  RetrieveBookingsDto,
  CreateBookingDto,
} from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly configService: ConfigService,
    private readonly bookingRepository: BookingRepository,
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  private readonly ISE: string = 'Internal Server Error';

  /**
   * @Responsibility: auth service method to create a new flight booking
   *
   * @param createPlaneDto
   * @returns {Promise<any>}
   */

  async createBooking(createBookingDto: CreateBookingDto): Promise<any> {
    try {
      const { userId, ...otherProps } = createBookingDto;

      function createBookingData() {
        return {
          ...otherProps,
          bookerId: userId,
        };
      }

      return await this.bookingRepository.createBooking(createBookingData());
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  /**
   * @Responsibility: flight booking service method to retrieve all flight bookings with pagination
   *
   * @param retrieveBookingsDto
   * @returns {Promise<any>}
   */

  async retrieveAllBookings(
    retrieveBookingsDto: RetrieveBookingsDto,
  ): Promise<any> {
    if (
      retrieveBookingsDto?.flag !== BookingStatus.APPROVED &&
      retrieveBookingsDto?.flag !== BookingStatus.REJECTED &&
      retrieveBookingsDto?.flag !== BookingStatus.PENDING
    ) {
      throw new RpcException(
        this.errR({
          message: 'Invalid Flag',
          status: HttpStatus.BAD_REQUEST,
        }),
      );
    }

    try {
      const {
        limit,
        batch,
        search,
        userId,
        flag,
        filterStartDate,
        filterEndDate,
      } = retrieveBookingsDto;
      const { data, count } =
        await this.bookingRepository.retrieveAllBookings<object>({
          limit,
          batch,
          search,
          userId,
          flag,
          filterStartDate,
          filterEndDate,
        });

      return { data, count };
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  /**
   * @Responsibility: flight booking service method to retrieve single flight booking info
   *
   * @param bookingId
   * @returns {Promise<any>}
   */

  async retrieveSingleBooking(bookingId: string): Promise<any> {
    try {
      const theBooking = await this.bookingRepository.findBooking({
        _id: bookingId,
      });
      if (!theBooking) {
        throw new RpcException(
          this.errR({
            message: 'Booking not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      return theBooking;
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  /**
   * @Responsibility: flight booking service method to perform booking action
   *
   * @param bookingActionDto
   * @returns {Promise<any>}
   */

  async bookingAction(bookingActionDto: BookingActionDto): Promise<any> {
    try {
      const { bookingId, flag, rejectionReason } = bookingActionDto;

      if (
        flag !== BookingActionFlags.APPROVE &&
        flag !== BookingActionFlags.REJECT
      ) {
        throw new RpcException(
          this.errR({
            message: 'Invalid flag',
            status: HttpStatus.BAD_REQUEST,
          }),
        );
      }

      const theBooking = await this.bookingRepository.findBooking({
        _id: bookingId,
      });
      if (!theBooking) {
        throw new RpcException(
          this.errR({
            message: 'Booking not found',
            status: HttpStatus.NOT_FOUND,
          }),
        );
      }

      /* For appreoval of flight booking */
      if (flag === BookingActionFlags.APPROVE) {
        await this.bookingRepository.updateBooking(
          { _id: theBooking?._id },
          {
            status: BookingStatus.APPROVED,
            approvalDate: moment().utc().toDate(),
          },
        );
      }

      /* For rejection of flight booking */
      if (flag === BookingActionFlags.REJECT) {
        await this.bookingRepository.updateBooking(
          { _id: theBooking?._id },
          {
            status: BookingStatus.REJECTED,
            rejectionDate: moment().utc().toDate(),
            rejectionReason,
          },
        );
      }

      return {};
    } catch (error) {
      throw new RpcException(
        this.errR({
          message: error?.message ? error.message : this.ISE,
          status: error?.error?.status,
        }),
      );
    }
  }

  private errR(errorInput: { message: string; status: number }): ErrorResponse {
    return {
      message: errorInput.message,
      status: errorInput.status,
    };
  }
}
