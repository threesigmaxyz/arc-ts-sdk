import { trySafeExecute } from '../../src/packages/client/utils/retryExecuteFunction';
import { wait } from '../../src/packages/client/utils/time';

jest.mock('../../src/packages/client/utils/time');

describe('trySafeExecute function', () => {
  beforeAll(() => {
    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => null);
  });

  beforeEach(() => {
    jest.spyOn(global, 'setTimeout');
    (wait as jest.Mock).mockImplementation((delay: number) => {
      return new Promise((resolve) => setTimeout(resolve, delay));
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should execute a function successfully on the first attempt', async () => {
    const mockFunc = jest.fn().mockResolvedValue('success');
    const result = await trySafeExecute(mockFunc, [{}]);
    expect(result).toEqual('success');
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  it('should retry the function upon failure and succeed', async () => {
    const mockFunc = jest
      .fn()
      .mockRejectedValueOnce(new Error('failed'))
      .mockResolvedValue('success');
    const result = await trySafeExecute(mockFunc, [{}]);
    expect(result).toEqual('success');
    expect(mockFunc).toHaveBeenCalledTimes(2);
  });

  it('should retry the function the correct number of times and then throw an error', async () => {
    const mockFunc = jest.fn().mockRejectedValue(new Error('failed'));
    await expect(trySafeExecute(mockFunc, [{}], 3)).rejects.toThrow('failed');
    expect(mockFunc).toHaveBeenCalledTimes(3);
  });

  it('should throw an error when no function is provided', async () => {
    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      trySafeExecute(null as any, [{}]),
    ).rejects.toThrow(`Function execution init conditions are erroneous: null`);
  });
});
