import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterRegisterComponent } from './center-register.component';

describe('CenterRegisterComponent', () => {
  let component: CenterRegisterComponent;
  let fixture: ComponentFixture<CenterRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
