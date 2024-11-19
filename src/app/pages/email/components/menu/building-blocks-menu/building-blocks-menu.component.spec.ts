import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildingBlocksMenuComponent } from './building-blocks-menu.component';

describe('BuildingBlocksMenuComponent', () => {
  let component: BuildingBlocksMenuComponent;
  let fixture: ComponentFixture<BuildingBlocksMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BuildingBlocksMenuComponent]
    });
    fixture = TestBed.createComponent(BuildingBlocksMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
