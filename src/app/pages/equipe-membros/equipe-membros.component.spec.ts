import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipeMembrosComponent } from './equipe-membros.component';

describe('EquipeMembrosComponent', () => {
  let component: EquipeMembrosComponent;
  let fixture: ComponentFixture<EquipeMembrosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EquipeMembrosComponent]
    });
    fixture = TestBed.createComponent(EquipeMembrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
