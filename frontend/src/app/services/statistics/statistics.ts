import { inject, Injectable } from '@angular/core';

import { CalculatorService } from '../calculator/calculator';

export interface Statistics {
  total: number;
  average: number;
  count: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private calculator = inject(CalculatorService);

  calculateSum(numbers: number[]): number {
    if (numbers.length === 0) {
      return 0;
    }

    return numbers.reduce((sum, num) => this.calculator.add(sum, num), 0);
  }

  calculateAverage(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Cannot calculate average of empty array');
    }

    const sum = this.calculateSum(numbers);
    return this.calculator.divide(sum, numbers.length);
  }

  calculateStatistics(numbers: number[]): Statistics {
    if (numbers.length === 0) {
      return { total: 0, average: 0, count: 0 };
    }

    const total = this.calculateSum(numbers);
    const average = this.calculateAverage(numbers);

    return {
      total,
      average,
      count: numbers.length,
    };
  }

  getCalculationHistory(): string[] {
    return this.calculator.getHistory();
  }
}
