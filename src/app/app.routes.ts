import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotesComponent } from './notes/notes.component';
import { NoteComponent } from './note/note.component';
import { ErrorPageComponent } from './error-page/error-page.component';

export const APP_ROUTES: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home', 
        component: HomeComponent
    },
    {
        path: 'notes',
        component: NotesComponent
    },
    {
        path: 'notes/:page',
        component: NotesComponent
    },
    {
        path: 'note/:id',
        component: NoteComponent
    }
    ,
    {
        path: 'error/:type',
        component: ErrorPageComponent
    }
];