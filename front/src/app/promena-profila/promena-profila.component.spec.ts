import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromenaProfilaComponent } from './promena-profila.component';

describe('PromenaProfilaComponent', () => {
  let component: PromenaProfilaComponent;
  let fixture: ComponentFixture<PromenaProfilaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PromenaProfilaComponent]
    });
    fixture = TestBed.createComponent(PromenaProfilaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
