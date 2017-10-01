import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule }    from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { NotesService } from './notes.service';
import { AuthorizationServise } from './authorization/authorization.servise';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { EditNoteContentComponent } from './edit-note/edit.note.component';
import { ConfirmContentComponent } from './confirmation/confirm.content.component';
import { AuthorizationComponent } from './authorization/authorization.component/authorization.component';
import { RecoveryComponent } from './recovery/recovery.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    NotesComponent,
    NoteComponent,
    ErrorPageComponent,
    EditNoteContentComponent,
    ConfirmContentComponent,
    AuthorizationComponent,
    RecoveryComponent       
  ],
  entryComponents:[EditNoteContentComponent, ConfirmContentComponent, AuthorizationComponent],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ModalModule.forRoot(),
    RouterModule.forRoot(APP_ROUTES),
    PaginationModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  providers: [NotesService, AuthorizationServise],
  bootstrap: [AppComponent]
})
export class AppModule { }
