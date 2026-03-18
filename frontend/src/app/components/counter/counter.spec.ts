import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Counter } from './counter';

describe('Counter', () => {
  let component: Counter;
  let fixture: ComponentFixture<Counter>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Counter],
    }).compileComponents();

    fixture = TestBed.createComponent(Counter);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with count of 0', () => {
    expect(component.count()).toBe(0);
  });

  it('should display initial count in the template', () => {
    fixture.detectChanges();
    const countDisplay = compiled.querySelector('[data-testid="count-display"]');
    expect(countDisplay?.textContent).toBe('0');
  });

  describe('increment()', () => {
    it('should increase count by 1', () => {
      component.increment();
      expect(component.count()).toBe(1);
    });

    it('should update the display when incremented', () => {
      component.increment();
      fixture.detectChanges();

      const countDisplay = compiled.querySelector('[data-testid="count-display"]');
      expect(countDisplay?.textContent).toBe('1');
    });

    it('should increment when button is clicked', () => {
      fixture.detectChanges();
      const button = compiled.querySelector('[data-testid="increment-btn"]') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      expect(component.count()).toBe(1);
      const counstDisplay = compiled.querySelector('[data-testid="count-display"]');
      expect(counstDisplay?.textContent).toBe('1');
    });
  });

  describe('decrement()', () => {
    it('should decrease count by 1', () => {
      component.count.set(5);
      component.decrement();
      expect(component.count()).toBe(4);
    });

    it('should allow negative numbers', () => {
      component.decrement();
      expect(component.count()).toBe(-1);
    });

    it('should decrement when button is clicked', () => {
      const button = compiled.querySelector('[data-testid="decrement-btn"]') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      expect(component.count()).toBe(-1);
    });
  });

  describe('reset()', () => {
    it('should reset count to 0', () => {
      component.count.set(42);
      component.reset();
      expect(component.count()).toBe(0);
    });

    it('should reset when button is clicked', () => {
      component.count.set(10);
      fixture.detectChanges();

      const button = compiled.querySelector('[data-testid="reset-btn"]') as HTMLButtonElement;
      button.click();
      fixture.detectChanges();

      expect(component.count()).toBe(0);
      const countDisplay = compiled.querySelector('[data-testid="count-display"]');
      expect(countDisplay?.textContent).toBe('0');
    });
  });

  it('should handle multiple operations correctly', () => {
    component.increment();
    component.increment();
    component.increment();
    expect(component.count()).toBe(3);

    component.decrement();
    expect(component.count()).toBe(2);

    component.reset();
    expect(component.count()).toBe(0);
  });
});
