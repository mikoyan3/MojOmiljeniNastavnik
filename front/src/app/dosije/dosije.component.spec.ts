import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DosijeComponent } from './dosije.component';

describe('DosijeComponent', () => {
  let component: DosijeComponent;
  let fixture: ComponentFixture<DosijeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DosijeComponent]
    });
    fixture = TestBed.createComponent(DosijeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
