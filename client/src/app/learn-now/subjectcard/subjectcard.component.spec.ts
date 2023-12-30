import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectcardComponent } from './subjectcard.component';

describe('SubjectcardComponent', () => {
  let component: SubjectcardComponent;
  let fixture: ComponentFixture<SubjectcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectcardComponent]
    });
    fixture = TestBed.createComponent(SubjectcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
