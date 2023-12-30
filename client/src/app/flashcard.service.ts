import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlashcardService {
  private apiBaseUrl = 'http://localhost:3000/api'; // Update with your API base URL

  constructor(private http: HttpClient) {}

  // Get flashcards for a specific subject with difficulty level names
  getFlashcardsBySubject(subjectId: number): Observable<any[]> {
    const url = `${this.apiBaseUrl}/flashcards/${subjectId}`;
    return this.http.get<any[]>(url);
  }

  // Create a new flashcard
  createFlashcard(flashcardData: any): Observable<any> {
    const url = `${this.apiBaseUrl}/flashcards`;
    return this.http.post<any>(url, flashcardData);
  }

  updateFlashcardDifficulty(flashcardId: number, difficultyId: number): Observable<any> {
    const url = `${this.apiBaseUrl}/flashcards/${flashcardId}/difficulty`;
    const body = { difficulty_id: difficultyId };

    return this.http.put<any>(url, body);
  }
}
