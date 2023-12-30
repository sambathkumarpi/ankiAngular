import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectService } from '../subject.service';

@Component({
  selector: 'app-learn-now',
  templateUrl: './learn-now.component.html',
  styleUrls: ['./learn-now.component.css']
})
export class LearnNowComponent implements OnInit {
  subjects: any[] = []; // Assuming you have a subjects array

  constructor(private route: ActivatedRoute, private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.getSubjects();
  }

  getSubjects() {
    this.subjectService.getSubjects().subscribe((data) => {
      this.subjects = data;
    });
  }
}
