import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeriesControlComponent } from './series-control.component';

describe('SeriesControlComponent', () => {
  let component: SeriesControlComponent;
  let fixture: ComponentFixture<SeriesControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeriesControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeriesControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
