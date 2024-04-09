import { CustomDatePipe } from './customdate.pipe';

describe('CustomdatePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomDatePipe();
    expect(pipe).toBeTruthy();
  });
});
