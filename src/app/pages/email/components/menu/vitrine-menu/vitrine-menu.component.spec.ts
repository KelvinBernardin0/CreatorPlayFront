import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VitrineMenuComponent } from './vitrine-menu.component';

describe('VitrineMenuComponent', () => {
  let component: VitrineMenuComponent;
  let fixture: ComponentFixture<VitrineMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VitrineMenuComponent]
    });
    fixture = TestBed.createComponent(VitrineMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
