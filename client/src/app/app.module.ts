import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FlashcardsComponent } from './flashcards/flashcards.component';
import { FooterComponent } from './footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { HighchartsChartModule } from 'highcharts-angular';
import { LearnNowComponent } from './learn-now/learn-now.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { ContributeComponent } from './contribute/contribute.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SubjectcardComponent } from './learn-now/subjectcard/subjectcard.component';
import { SubjectComponent } from './contribute/subject/subject.component';
import { FlashcardComponent } from './contribute/flashcard/flashcard.component';
import { StudyListComponent } from './study-list/study-list.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PopupComponent } from './popup/popup.component';

@NgModule({
  declarations: [
    AppComponent,
    FlashcardsComponent,
    FooterComponent,
    LearnNowComponent,
    StatisticsComponent,
    ContributeComponent,
    NavigationComponent,
    SubjectcardComponent,
    SubjectComponent,
    FlashcardComponent,
    StudyListComponent,
    PopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HighchartsChartModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
