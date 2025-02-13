import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleInputComponent } from './toggle-input.component';

describe('ToggleInputComponent', () => {
  let component: ToggleInputComponent;
  let fixture: ComponentFixture<ToggleInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleInputComponent]
    });
    fixture = TestBed.createComponent(ToggleInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
