import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarsControlComponent } from './bars-control.component';

describe('BarsControlComponent', () => {
  let component: BarsControlComponent;
  let fixture: ComponentFixture<BarsControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarsControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarsControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
