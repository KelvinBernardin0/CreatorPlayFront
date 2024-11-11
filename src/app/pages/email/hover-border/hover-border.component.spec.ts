import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoverBorderComponent } from './hover-border.component';

describe('HoverBorderComponent', () => {
  let component: HoverBorderComponent;
  let fixture: ComponentFixture<HoverBorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoverBorderComponent]
    });
    fixture = TestBed.createComponent(HoverBorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
