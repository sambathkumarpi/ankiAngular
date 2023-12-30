import { Component, OnInit } from '@angular/core';
import { FlashcardService } from '../../flashcard.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-flashcards',
  templateUrl: 'flashcard.component.html',
  styleUrls: [ 'flashcard.component.css'],
})
export class FlashcardComponent implements OnInit {
  flashcards: any[] = [];
  flashcardFormModel: any = {
    question: '',
    answer: '',
    subject_id: '',
    difficulty_id: 1, // Default difficulty_id
  };

  constructor(private route: ActivatedRoute,
              private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log("params---------->"+params)
      const subjectId = +params['subjectId']; // Use + to convert the parameter to a number
      if (!isNaN(subjectId)) {
        this.loadFlashcards(subjectId);
        this.flashcardFormModel.subject_id = subjectId;
      } else {
        console.error('Invalid subject ID:', params['subjectId']);
      }
    });
  }

  loadFlashcards(subjectId: number): void {
    this.flashcardService.getFlashcardsBySubject(subjectId).subscribe(
      (data) => {
        this.flashcards = data;
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
      }
    );
  }

  createFlashcard(): void {
    this.flashcardService.createFlashcard(this.flashcardFormModel).subscribe(
      (data) => {
        console.log('New flashcard created:', data);
        this.loadFlashcards(this.flashcardFormModel.subjectId); // Provide the subjectId when loading flashcards
      },
      (error) => {
        console.error('Error creating flashcard:', error);
      }
    );
  }

  editFlashcard(flashcard: any): void {
    // Implement the edit logic as needed
    console.log('Edit flashcard:', flashcard);
  }

  deleteFlashcard(flashcardId: number): void {
    // Implement the delete logic as needed
    console.log('Delete flashcard with ID:', flashcardId);
  }

  submitFlashcard(): void {
    // You can call createFlashcard for simplicity, but you can separate create and update logic if needed
    this.createFlashcard();
  }
}

