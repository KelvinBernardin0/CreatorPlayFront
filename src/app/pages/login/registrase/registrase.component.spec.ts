import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistraseComponent } from './registrase.component.js';

describe('RegistraseComponent', () => {
  let component: RegistraseComponent;
  let fixture: ComponentFixture<RegistraseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistraseComponent]
    });
    fixture = TestBed.createComponent(RegistraseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
