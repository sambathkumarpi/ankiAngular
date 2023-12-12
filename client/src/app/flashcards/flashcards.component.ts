import { Component, OnInit } from '@angular/core';
import { FlashcardService } from '../flashcard.service';

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})
export class FlashcardsComponent implements OnInit {

  flashcards: any[] = [];
  tags: any[] = [];

  constructor(private flashcardService: FlashcardService) { }

  ngOnInit(): void {
    this.flashcardService.getFlashcardsFromDatabase().subscribe(flashcards => {
      console.log(flashcards);
      
      this.flashcards = flashcards;

    });

    this.flashcardService.getFlashcardTags().subscribe(tags => {
      console.log(tags);
      this.tags = tags;

    });
    
  }
}
