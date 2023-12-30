// flashcards.component.ts
import { Component, OnInit } from '@angular/core';
import { FlashcardService } from '../flashcard.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


interface Flashcard {
  id: number;
  question: string;
  answer: string;
  // Add any other properties based on your API response
}

@Component({
  selector: 'app-flashcards',
  templateUrl: './flashcards.component.html',
  styleUrls: ['./flashcards.component.css']
})

export class FlashcardsComponent implements OnInit {
  flashcards: Flashcard[] = [];
  currentIndex: number = 0;
  showAnswer: boolean = false;
  isFlipped = false;
  difficulty: string | null = null;

  constructor(private route: ActivatedRoute,
              private flashcardService: FlashcardService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log("params---------->"+params)
      const subjectId = +params['subjectId']; // Use + to convert the parameter to a number
      if (!isNaN(subjectId)) {
        this.loadFlashcardsBySubject(subjectId);
      } else {
        console.error('Invalid subject ID:', params['subjectId']);
      }
    });
  }

  loadFlashcardsBySubject(subjectId: number): void {
    this.flashcardService.getFlashcardsBySubject(subjectId).subscribe(
      (data) => {
        this.flashcards = data;
        console.log(data)
      },
      (error) => {
        console.error('Error fetching flashcards:', error);
      }
    );
  }

  nextFlashcard(): void {
    this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
    console.log("currentIndex----------------->", this.currentIndex  )
    this.showAnswer = false;
    this.difficulty = null; // Reset difficulty when moving to the next flashcard
  }

  toggleAnswer(): void {
    this.showAnswer = !this.showAnswer;
    this.isFlipped = true;
  }

  setDifficulty(difficulty: string): void {
    if (difficulty) {
      const difficultyValue = this.mapDifficultyToValue(difficulty.toLowerCase());
      if (difficultyValue !== undefined) {
        // Assuming you have a method in your service to update the difficulty
        this.flashcardService.updateFlashcardDifficulty(this.flashcards[this.currentIndex].id, difficultyValue).subscribe(
          () => {
            console.log('Difficulty updated successfully.');
            this.nextFlashcard(); // Move to the next flashcard after updating difficulty
          },
          (error) => {
            console.error('Error updating difficulty:', error);
          }
        );
      }
    }
  }

  private mapDifficultyToValue(difficulty: string): number | undefined {
    // Map difficulty levels to their corresponding numeric values
    switch (difficulty) {
      case 'very easy':
        return 1;
      case 'easy':
        return 2;
      case 'difficult':
        return 3;
      case 'hard':
        return 4;
      default:
        return undefined;
    }
  }
}
