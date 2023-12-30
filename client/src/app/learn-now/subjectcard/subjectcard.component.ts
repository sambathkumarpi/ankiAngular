import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-subjectcard',
  templateUrl: './subjectcard.component.html',
  styleUrls: ['./subjectcard.component.css']
})
export class SubjectcardComponent {
  @Input() itemName: string = '';

  constructor(private router: Router) {}

  navigateToFlashcard() {
    // Navigate to the flashcard page with the item value as a parameter
    this.router.navigate(['/flashcard', this.itemName]);
  }
}
