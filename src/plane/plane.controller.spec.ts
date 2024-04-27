import { Test, TestingModule } from '@nestjs/testing';
import { PlaneController } from './plane.controller';
import { PlaneService } from './plane.service';

describe('PlaneController', () => {
  let controller: PlaneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlaneController],
      providers: [PlaneService],
    }).compile();

    controller = module.get<PlaneController>(PlaneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
