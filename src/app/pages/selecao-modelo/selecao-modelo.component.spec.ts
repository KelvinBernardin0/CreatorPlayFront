import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoModeloComponent } from './selecao-modelo.component';

describe('SelecaoModeloComponent', () => {
  let component: SelecaoModeloComponent;
  let fixture: ComponentFixture<SelecaoModeloComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelecaoModeloComponent]
    });
    fixture = TestBed.createComponent(SelecaoModeloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
