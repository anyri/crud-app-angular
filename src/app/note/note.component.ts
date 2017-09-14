import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Rx";
import { Router } from '@angular/router';
import { Note } from '../notes/note.model';
import { NotesService } from '../notes.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {
  noteId: number;
  routeSubscriber: Subscription;
  currentNote: Note = null;
  pending: boolean;
  errorMsg: string = "";

  constructor(private route: ActivatedRoute, private noteService: NotesService, private router: Router) {
    this.pending = true;
  }

  ngOnInit() {
    this.routeSubscriber = this.route.params.subscribe(params => {
      this.noteId = +params['id'];
      this.getNote();
    });
  }

  ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
  }

  getNote(): void {
    this.noteService.getNote(this.noteId)
      .subscribe(
      data => {
        if(data.status == 'fail')
          this.router.navigate(['error/note_not_found']);
        else
          this.currentNote = new Note(data.note);
        this.pending = false;
      },
      error => {
          this.router.navigate(['error/bad_request']);
          this.pending = false;
        }
      )
  }

}
