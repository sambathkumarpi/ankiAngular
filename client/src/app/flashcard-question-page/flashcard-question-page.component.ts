import { Component } from '@angular/core';
import {FlashcardsComponent} from "../flashcards/flashcards.component";

@Component({
  selector: 'app-flashcard-question-page',
  templateUrl: './flashcard-question-page.component.html',
  styleUrls: ['./flashcard-question-page.component.css']
})
export class FlashcardQuestionPageComponent
{
    question : string = 'Example question';
    answer : string = '';
}




