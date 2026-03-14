import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { StatisticsService } from './statistics';
import { CalculatorService } from './calculator';

type MockedFunction<T extends (...args: any[]) => any> = ReturnType<typeof vi.fn<T>>;

describe('StatisticsService', () => {
  let service: StatisticsService;
  let calculatorService: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatisticsService);
    calculatorService = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Testing with Real Dependency
  describe('calculateSum() - with real CalculatorService', () => {
    it('should calculate sum of numbers', () => {
      const result = service.calculateSum([1, 2, 3, 4, 5]);
      expect(result).toBe(15);
    });

    it('should return 0 for empty array', () => {
      const result = service.calculateSum([]);
      expect(result).toBe(0);
    });

    it('should handle negative nubmers', () => {
      const result = service.calculateSum([10, -5, 3]);
      expect(result).toBe(8);
    });

    it('should add operations to calculator history', () => {
      calculatorService.clearHistory();
      service.calculateSum([1, 2, 3]);

      const history = calculatorService.getHistory();
      expect(history.length).toBeGreaterThan(0);
    });
  });

  // Testing with Spie (Ominitoring Real Dependency)
  describe('calculateSum() - with spies', () => {
    it('should call calculator.add(9 for each number', () => {
      const addSpy = vi.spyOn(calculatorService, 'add');

      service.calculateSum([1, 2, 3]);

      expect(addSpy).toHaveBeenCalledTimes(3);
      expect(addSpy).toHaveBeenCalledWith(0, 1);
      expect(addSpy).toHaveBeenCalledWith(1, 2);
      expect(addSpy).toHaveBeenCalledWith(3, 3);
    });

    it('should not call calculator.add() for empty array', () => {
      const addSpy = vi.spyOn(calculatorService, 'add');

      service.calculateSum([]);

      expect(addSpy).not.toHaveBeenCalled();
    });
  });

  describe('calculateAverage()', () => {
    it('should calculate average of numbers', () => {
      const result = service.calculateAverage([10, 20, 30]);
      expect(result).toBe(20);
    });

    it('should handle decimals', () => {
      const result = service.calculateAverage([1, 2, 3]);
      expect(result).toBeCloseTo(2);
    });

    it('should throw erro for empty array', () => {
      expect(() => service.calculateAverage([])).toThrow('Cannot calculate average of empty array');
    });

    it('should call calculator.divide()', () => {
      const divideSpy = vi.spyOn(calculatorService, 'divide');

      service.calculateAverage([10, 20, 30]);

      expect(divideSpy).toHaveBeenCalledWith(60, 3);
    });
  });

  describe('calculateStatistics()', () => {
    it('should return complete stattistics', () => {
      const result = service.calculateStatistics([5, 10, 15]);

      expect(result).toEqual({
        total: 30,
        average: 10,
        count: 3,
      });
    });

    it('should return zeros for empty array', () => {
      const result = service.calculateStatistics([]);

      expect(result).toEqual({
        total: 0,
        average: 0,
        count: 0,
      });
    });

    it('should handle single number', () => {
      const result = service.calculateStatistics([42]);

      expect(result).toEqual({
        total: 42,
        average: 42,
        count: 1,
      });
    });
  });

  describe('getCalculationHistory()', () => {
    it('should return calculator history', () => {
      calculatorService.clearHistory();
      calculatorService.add(1, 2);
      calculatorService.multiply(3, 4);

      const history = service.getCalculationHistory();

      expect(history.length).toBe(2);
      expect(history[0]).toBe('1 + 2 = 3');
      expect(history[1]).toBe('3 * 4 = 12');
    });

    it('should call calculator.getHistory()', () => {
      const getHistorySpy = vi.spyOn(calculatorService, 'getHistory');

      service.getCalculationHistory();

      expect(getHistorySpy).toHaveBeenCalled();
    });
  });
});

// Testing with Mocked Dependencies
describe('StatisticsService - with mocked CalculatorService', () => {
  let service: StatisticsService;
  // let mockCalculatorService: Partial<CalculatorService>;
  let mockCalculatorService: {
    add: MockedFunction<typeof CalculatorService.prototype.add>;
    subtract: MockedFunction<typeof CalculatorService.prototype.subtract>;
    multiply: MockedFunction<typeof CalculatorService.prototype.multiply>;
    divide: MockedFunction<typeof CalculatorService.prototype.divide>;
    getHistory: MockedFunction<typeof CalculatorService.prototype.getHistory>;
    clearHistory: MockedFunction<typeof CalculatorService.prototype.clearHistory>;
  };

  beforeEach(() => {
    mockCalculatorService = {
      add: vi.fn(),
      subtract: vi.fn(),
      multiply: vi.fn(),
      divide: vi.fn(),
      getHistory: vi.fn(),
      clearHistory: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        StatisticsService,
        { provide: CalculatorService, useValue: mockCalculatorService },
      ],
    });

    service = TestBed.inject(StatisticsService);
  });

  it('should be crated with mocked dependency', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateSum() - with mock', () => {
    it('should use mocked add method', () => {
      mockCalculatorService.add
        .mockReturnValueOnce(1)
        .mockReturnValueOnce(3)
        .mockReturnValueOnce(6);

      const result = service.calculateSum([1, 2, 3]);

      expect(result).toBe(6);
      expect(mockCalculatorService.add).toHaveBeenCalledTimes(3);
    });

    it('should handle mock returning different values', () => {
      mockCalculatorService.add.mockReturnValue(100);

      const result = service.calculateSum([1, 2]);

      expect(result).toBe(100);
    });
  });

  describe('calculateAverage() - with mock', () => {
    it('should use mocked divide method', () => {
      mockCalculatorService.add.mockReturnValue(60);
      mockCalculatorService.divide.mockReturnValue(20);

      const result = service.calculateAverage([10, 20, 30]);

      expect(mockCalculatorService.divide).toHaveBeenCalledWith(60, 3);
      expect(result).toBe(20);
    });
  });

  describe('getCalculationHistory() - with mock', () => {
    it('should return mnocked history', () => {
      const mockHistory = ['mock operation 1', 'mock operation 2'];
      mockCalculatorService.getHistory.mockReturnValue(mockHistory);

      const result = service.getCalculationHistory();

      expect(result).toEqual(mockHistory);
      expect(mockCalculatorService.getHistory).toHaveBeenCalled();
    });
  });
});
