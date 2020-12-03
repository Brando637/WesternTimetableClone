import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFullComponent } from './home-full.component';

describe('HomeFullComponent', () => {
  let component: HomeFullComponent;
  let fixture: ComponentFixture<HomeFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFullComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
