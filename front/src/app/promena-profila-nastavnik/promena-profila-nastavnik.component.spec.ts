import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenaProfilaNastavnikComponent } from './promena-profila-nastavnik.component';

describe('PromenaProfilaNastavnikComponent', () => {
  let component: PromenaProfilaNastavnikComponent;
  let fixture: ComponentFixture<PromenaProfilaNastavnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromenaProfilaNastavnikComponent]
    });
    fixture = TestBed.createComponent(PromenaProfilaNastavnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
