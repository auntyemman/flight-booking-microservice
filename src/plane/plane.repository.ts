import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropDataInput } from '../common/interface/util.interface';
import { Plane, PlaneDocument } from './entities/plane.entity';
import { RetrievePlanesDto } from './dto/retrieve-planes.dto';
import { PlaneUtility } from '../common/utils/plane.util';

@Injectable()
export class PlaneRepository {
  constructor(
    @InjectModel(Plane.name) private planeModel: Model<PlaneDocument>,
    private readonly planeUtility: PlaneUtility,
  ) {}

  async createPlane(data: any): Promise<PlaneDocument> {
    try {
      return await this.planeModel.create(data);
    } catch (error) {
      throw new Error(error?.messsage);
    }
  }

  async findPlane(
    where: PropDataInput,
    attributes?: string,
  ): Promise<PlaneDocument> {
    return await this.planeModel.findOne(where).lean().select(attributes);
  }

  async updatePlane(where: PropDataInput, data: any): Promise<PlaneDocument> {
    return await this.planeModel.findOneAndUpdate(where, data, {
      new: true,
    });
  }

  async retrieveAllPlanes<T>({
    limit,
    batch,
    search,
  }: Partial<RetrievePlanesDto>): Promise<{ data: T[]; count: number }> {
    let data,
      query = {};

    if (search) {
      query['$or'] = [
        {
          manufacturer: new RegExp(search, 'i'),
        },
        {
          model: new RegExp(search, 'i'),
        },
        {
          capacity: new RegExp(search, 'i'),
        },
        {
          registrationNumber: new RegExp(search, 'i'),
        },
      ];
    }

    data =
      batch && limit
        ? await this.planeModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .skip(this.planeUtility.paginationFunc(+batch, +limit))
            .limit(+limit)
        : await this.planeModel
            .find(query)
            .lean()
            .sort({ createdAt: -1 })
            .limit(10);
    const count = await this.planeModel.countDocuments(query);
    return { data, count };
  }

  async deletePlane(where: PropDataInput): Promise<PlaneDocument> {
    return await this.planeModel.findOneAndDelete(where);
  }
}
