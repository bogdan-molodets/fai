import { RtmlsModule } from './rtmls.module';

describe('RtmlsModule', () => {
  let rtmlsModule: RtmlsModule;

  beforeEach(() => {
    rtmlsModule = new RtmlsModule();
  });

  it('should create an instance', () => {
    expect(rtmlsModule).toBeTruthy();
  });
});
