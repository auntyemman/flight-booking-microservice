import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropDataInput } from '../common/interface/util.interface';
import { Booking, BookingDocument } from './entities/booking.entity';
import { RetrieveBookingsDto } from './dto/booking.dto';
import moment from 'moment';
import { PlaneUtility } from '../common/utils/plane.util';
import { BookingStatus } from './interface/utils.interface';

@Injectable()
export class BookingRepository {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private readonly planeUtility: PlaneUtility,
  ) {}

  /**
   * @Responsibility: Repo for creating a booking
   *
   * @param data
   * @returns {Promise<BookingDocument>}
   */

  async createBooking(data: any): Promise<BookingDocument> {
    try {
      return await this.bookingModel.create(data);
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }

  /**
   * @Responsibility: Repo for retrieving all flight bookings
   *
   * @param where
   * @param data
   * @returns {Promise<BookingDocument>}
   */

  async retrieveAllBookings<T>({
    limit,
    batch,
    search,
    userId,
    flag,
    filterStartDate,
    filterEndDate,
  }: Partial<RetrieveBookingsDto>): Promise<{ data: T[]; count: number }> {
    type Query = {
      status?: string;
      bookerId: string;
      createdAt?: object;
    };

    let data,
      query: Query = {
        bookerId: userId,
        status:
          flag === 'approved'
            ? BookingStatus.APPROVED
            : flag === 'rejected'
              ? BookingStatus.REJECTED
              : BookingStatus.PENDING,
      };

    /* Search functionality */
    if (search) {
      query['$or'] = [
        {
          flightNumber: new RegExp(search, 'i'),
        },
        {
          departureAirportCode: new RegExp(search, 'i'),
        },
        {
          arrivalAirportCode: new RegExp(search, 'i'),
        },
      ];
    }

    /* Filter functionality */
    if (filterStartDate && filterEndDate) {
      const startDate = moment(filterStartDate).toISOString().replace('Z', '');
      const endDate = moment(filterEndDate).toISOString().replace('Z', '');

      query = {
        ...query,
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      };
    }

    data =
      batch && limit
        ? await this.bookingModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .skip(this.planeUtility.paginationFunc(+batch, +limit))
            .limit(+limit)
        : await this.bookingModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .limit(10);
    const count = await this.bookingModel.countDocuments(query);
    return { data, count };
  }

  /**
   * @Responsibility: Repo to retrieve single booking detail
   *
   * @param where
   * @returns {Promise<BookingDocument>}
   */

  async findBooking(
    where: PropDataInput,
    attributes?: string,
  ): Promise<BookingDocument> {
    return await this.bookingModel.findOne(where).lean().select(attributes);
  }

  /**
   * @Responsibility: Repo for updating a flight booking
   *
   * @param where
   * @param data
   * @returns {Promise<BookingDocument>}
   */

  async updateBooking(
    where: PropDataInput,
    data: any,
  ): Promise<BookingDocument> {
    return await this.bookingModel.findOneAndUpdate(where, data, {
      new: true,
    });
  }
}
