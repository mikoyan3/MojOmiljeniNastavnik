import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OceniCasComponent } from './oceni-cas.component';

describe('OceniCasComponent', () => {
  let component: OceniCasComponent;
  let fixture: ComponentFixture<OceniCasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OceniCasComponent]
    });
    fixture = TestBed.createComponent(OceniCasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
