import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DmcaNotTakPoliComponent } from './dmca-not-tak-poli.component';

describe('DmcaNotTakPoliComponent', () => {
  let component: DmcaNotTakPoliComponent;
  let fixture: ComponentFixture<DmcaNotTakPoliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DmcaNotTakPoliComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DmcaNotTakPoliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
