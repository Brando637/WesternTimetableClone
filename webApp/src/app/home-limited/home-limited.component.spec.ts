import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLimitedComponent } from './home-limited.component';

describe('HomeLimitedComponent', () => {
  let component: HomeLimitedComponent;
  let fixture: ComponentFixture<HomeLimitedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLimitedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
