import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FlashcardService {

  constructor(private http: HttpClient) { }

  getFlashcardsFromDatabase(): Observable<any> {
    return this.http.get('http://localhost:3000/flashcards/database');
  }

  addFlashcard(flashcard: any): Observable<any> {
    return this.http.post('http://localhost:3000/flashcards', flashcard);
  }

  getFlashcardTags(): Observable<any> {
    return this.http.get('http://localhost:3000/flashcards/tags');
  }
  
}
