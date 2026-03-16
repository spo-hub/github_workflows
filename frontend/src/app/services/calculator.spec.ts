import { TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator';

describe('Calculator', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add()', () => {
    it('should add two positive numbers', () => {
      expect(service.add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(service.add(-5, -3)).toBe(-8);
    });

    it('should add positive and negative numbers', () => {
      expect(service.add(10, -3)).toBe(7);
    });

    it('should handle zero', () => {
      expect(service.add(0, 5)).toBe(5);
      expect(service.add(5, 0)).toBe(5);
    });

    it('should add decimals', () => {
      expect(service.add(1.5, 2.3)).toBe(3.8);
    });

    it('should add operation to history', () => {
      service.add(2, 3);
      const history = service.getHistory();
      expect(history).toContain('2 + 3 = 5');
    });
  });

  describe('subtract()', () => {
    it('should subtract two numbers', () => {
      expect(service.subtract(10, 3)).toBe(7);
    });

    it('should handle negative resuls', () => {
      expect(service.subtract(3, 10)).toBe(-7);
    });

    it('should subtract negative nubmers', () => {
      expect(service.subtract(-5, -3)).toBe(-2);
    });

    it('should add operation to history', () => {
      service.subtract(10, 3);
      const history = service.getHistory();
      expect(history).toContain('10 - 3 = 7');
    });
  });

  describe('multiply()', () => {
    it('should multiply two positive numbers', () => {
      expect(service.multiply(4, 5)).toBe(20);
    });

    it('should multiply by zero', () => {
      expect(service.multiply(5, 0)).toBe(0);
    });

    it('should multiply negative numbers', () => {
      expect(service.multiply(-3, -4)).toBe(12);
    });

    it('should multiply positive and negative', () => {
      expect(service.multiply(5, -3)).toBe(-15);
    });

    it('should add operation to history', () => {
      service.multiply(4, 5);
      const history = service.getHistory();
      expect(history).toContain('4 * 5 = 20');
    });
  });

  describe('divide()', () => {
    it('should divide two numbers', () => {
      expect(service.divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(service.divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    it('should divide negative nubmers', () => {
      expect(service.divide(-10, 2)).toBe(-5);
      expect(service.divide(10, -2)).toBe(-5);
      expect(service.divide(-10, -2)).toBe(5);
    });

    it('should throw erro when dividing by zero', () => {
      expect(() => service.divide(10, 0)).toThrow('Cannot divide by zero');
    });

    it('should add operation to history', () => {
      service.divide(10, 2);
      const history = service.getHistory();
      expect(history).toContain('10 / 2 = 5');
    });

    it('should not add to history when division by zero fails', () => {
      const initialHistoryLength = service.getHistory().length;

      expect(() => service.divide(10, 0)).toThrow('Cannot divide by zero');

      expect(service.getHistory().length).toBe(initialHistoryLength);
    });
  });

  describe('History', () => {
    it('should start with empty history', () => {
      expect(service.getHistory()).toEqual([]);
    });

    it('should track multiple oepration', () => {
      service.add(2, 3);
      service.subtract(10, 5);
      service.multiply(4, 2);

      const history = service.getHistory();
      expect(history.length).toBe(3);
      expect(history[0]).toContain('2 + 3 = 5');
      expect(history[1]).toContain('10 - 5 = 5');
      expect(history[2]).toContain('4 * 2 = 8');
    });

    it('should return a copy of history (not reference)', () => {
      service.add(1, 1);
      const history1 = service.getHistory();
      const history2 = service.getHistory();

      expect(history1).toEqual(history2);
      expect(history1).not.toBe(history2);
    });

    it('should clear history', () => {
      service.add(1, 1);
      service.subtract(5, 2);

      expect(service.getHistory().length).toBe(2);

      service.clearHistory();

      expect(service.getHistory()).toEqual([]);
    });

    it('should continue adding to history after clear', () => {
      service.add(1, 1);
      service.clearHistory();
      service.multiply(2, 3);

      const history = service.getHistory();
      expect(history.length).toBe(1);
      expect(history).toContain('2 * 3 = 6');
    });
  });

  // Test 7: Service Isolation (each test gets fresh instance)
  describe('Service Isolation', () => {
    it('should have clean state in first teset', () => {
      expect(service.getHistory().length).toBe(0);
      service.add(1, 1);
      expect(service.getHistory().length).toBe(1);
    });

    it('should have clean state in second test', () => {
      expect(service.getHistory().length).toBe(0);
    });
  });
});
