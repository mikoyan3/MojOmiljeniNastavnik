import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterNastavnikComponent } from './register-nastavnik.component';

describe('RegisterNastavnikComponent', () => {
  let component: RegisterNastavnikComponent;
  let fixture: ComponentFixture<RegisterNastavnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterNastavnikComponent]
    });
    fixture = TestBed.createComponent(RegisterNastavnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
