import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyListComponent } from './study-list.component';

describe('StudyListComponent', () => {
  let component: StudyListComponent;
  let fixture: ComponentFixture<StudyListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyListComponent]
    });
    fixture = TestBed.createComponent(StudyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
