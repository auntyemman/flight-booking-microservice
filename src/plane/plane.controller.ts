import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlaneService } from './plane.service';
import { SubscriberPattern } from '../common/interface/subscriber-pattern.interface';
import { CreatePlaneDto, UpdatePlaneDto } from './dto/create-plane.dto';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';
// import { RetrieveBookingsDto } from 'src/booking/dto/booking.dto';

@Controller()
export class PlaneController {
  constructor(private readonly planeService: PlaneService) {}

  @MessagePattern({ cmd: SubscriberPattern.CREATE_PLANE })
  async createPlane(@Payload() createPlaneDto: CreatePlaneDto): Promise<any> {
    return await this.planeService.createPlane(createPlaneDto);
  }

  @MessagePattern({ cmd: SubscriberPattern.UPDATE_PLANE })
  async updatePlane(@Payload() updatePlaneDto: UpdatePlaneDto): Promise<any> {
    return await this.planeService.updatePlane(updatePlaneDto);
  }

  @MessagePattern({ cmd: SubscriberPattern.RETRIEVE_PLANE })
  async retrieveSinglePlane(@Payload() planeId: string): Promise<any> {
    return await this.planeService.retrieveSinglePlane(planeId);
  }

  @MessagePattern({ cmd: SubscriberPattern.RETRIEVE_ALL_PLANES })
  async retrieveAllPlanes(
    @Payload() retrievePlanesDto: RetrievePlanesDto,
  ): Promise<any> {
    return await this.planeService.retrieveAllPlanes(retrievePlanesDto);
  }

  @MessagePattern({ cmd: SubscriberPattern.DELETE_PLANE })
  async deleteSinglePlane(@Payload() planeId: string): Promise<any> {
    return await this.planeService.deleteSinglePlane(planeId);
  }
}
