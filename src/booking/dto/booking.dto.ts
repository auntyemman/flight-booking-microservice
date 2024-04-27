export class BookingActionDto {
  bookingId: string;
  flag: string;
  rejectionReason?: string;
}

export class CreateBookingDto {
  readonly flightNumber: string;
  readonly departureAirportCode: string;
  readonly arrivalAirportCode: string;
  readonly departureDate: string;
  readonly arrivalDate: string;
  readonly planeId: string;
  userId: string;
}

export class RetrieveBookingsDto {
  batch?: number;
  limit?: number;
  search?: string;
  userId: string;
  flag: string;
  filterStartDate?: string;
  filterEndDate?: string;
}
