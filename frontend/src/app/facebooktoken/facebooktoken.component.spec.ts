import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebooktokenComponent } from './facebooktoken.component';

describe('FacebooktokenComponent', () => {
  let component: FacebooktokenComponent;
  let fixture: ComponentFixture<FacebooktokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebooktokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebooktokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
