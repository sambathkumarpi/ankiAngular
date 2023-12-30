import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { LearnNowComponent } from './learn-now/learn-now.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ContributeComponent } from './contribute/contribute.component';
import { NavigationComponent } from './navigation/navigation.component';
import {FlashcardComponent} from "./contribute/flashcard/flashcard.component";
import {SubjectComponent} from "./contribute/subject/subject.component";
import {StudyListComponent} from "./study-list/study-list.component";


const routes: Routes = [
  { path: 'learn-now', component: LearnNowComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: 'contribute', component: ContributeComponent },
  { path: 'contribute/subjects', component: SubjectComponent },
  { path: 'contribute/flashcards/:subjectId/edit', component: FlashcardComponent },
  { path: 'flashcards/:subjectId', component: FlashcardsComponent },
  { path: 'study-list', component: StudyListComponent},
  { path: 'nave', component: NavigationComponent},
  { path: '', redirectTo: '/nave', pathMatch: 'full' }
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
