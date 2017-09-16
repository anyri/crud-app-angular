import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { NotesService } from './notes.service';
import { ErrorPageComponent } from './error-page/error-page.component';
import { EditNoteContentComponent } from './edit-note/edit.note.component';
import { ConfirmContentComponent } from './confirmation/confirm.content.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NotesComponent,
    NoteComponent,
    ErrorPageComponent,
    EditNoteContentComponent,
    ConfirmContentComponent    
  ],
  entryComponents:[EditNoteContentComponent, ConfirmContentComponent],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES),
    PaginationModule.forRoot()
  ],
  providers: [NotesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
