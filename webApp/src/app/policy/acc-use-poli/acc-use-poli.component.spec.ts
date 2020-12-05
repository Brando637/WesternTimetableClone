import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccUsePoliComponent } from './acc-use-poli.component';

describe('AccUsePoliComponent', () => {
  let component: AccUsePoliComponent;
  let fixture: ComponentFixture<AccUsePoliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccUsePoliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccUsePoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
