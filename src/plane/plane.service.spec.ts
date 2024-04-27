import { Test, TestingModule } from '@nestjs/testing';
import { PlaneService } from './plane.service';

describe('PlaneService', () => {
  let service: PlaneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlaneService],
    }).compile();

    service = module.get<PlaneService>(PlaneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
