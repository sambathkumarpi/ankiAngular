import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { FlashcardQuestionPageComponent } from './flashcard-question-page/flashcard-question-page.component';

const routes: Routes = [
  { path:'flashcards', component: FlashcardsComponent },
  {path : 'flashcard-question-page', component : FlashcardQuestionPageComponent}
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
