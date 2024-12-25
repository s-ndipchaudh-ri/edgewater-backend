import { Test, TestingModule } from '@nestjs/testing';
import { DatahostGateway } from './datahost.gateway';

describe('DatahostGateway', () => {
  let gateway: DatahostGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatahostGateway],
    }).compile();

    gateway = module.get<DatahostGateway>(DatahostGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
