import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  private history: string[] = [];

  add(a: number, b: number): number {
    const result = a + b;
    this.addToHistory(`${a} + ${b} = ${result}`);
    return result;
  }

  subtract(a: number, b: number): number {
    const result = a - b;
    this.addToHistory(`${a} - ${b} = ${result}`);
    return result;
  }

  multiply(a: number, b: number): number {
    const result = a * b;
    this.addToHistory(`${a} * ${b} = ${result}`);
    return result;
  }

  divide(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Cannot divide by zero');
    }
    const result = a / b;
    this.addToHistory(`${a} / ${b} = ${result}`);
    return result;
  }

  getHistory(): string[] {
    return [...this.history];
  }

  clearHistory(): void {
    this.history = [];
  }

  private addToHistory(operation: string): void {
    this.history.push(operation);
  }
}
