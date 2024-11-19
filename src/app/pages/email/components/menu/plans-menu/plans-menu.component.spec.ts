import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansMenuComponent } from './plans-menu.component';

describe('PlansMenuComponent', () => {
  let component: PlansMenuComponent;
  let fixture: ComponentFixture<PlansMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlansMenuComponent]
    });
    fixture = TestBed.createComponent(PlansMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
