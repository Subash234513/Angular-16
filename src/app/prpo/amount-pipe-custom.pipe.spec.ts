import { AmountPipeCustomPipe } from './amount-pipe-custom.pipe';

describe('AmountPipeCustomPipe', () => {
  it('create an instance', () => {
    const pipe = new AmountPipeCustomPipe();
    expect(pipe).toBeTruthy();
  });
});
