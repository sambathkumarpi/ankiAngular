import { Component, OnInit } from '@angular/core';
import { SubjectService } from '../../subject.service';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  subjects: any[] = [];

  constructor(private subjectService: SubjectService) {}

  ngOnInit() {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });
  }

  addSubject() {
    // Handle the add action
    console.log('Adding a new subject');
    // You can navigate to a different component or open a modal for adding, etc.
  }

}
