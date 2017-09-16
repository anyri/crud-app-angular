import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Note } from './note.model';
import { NotesService } from '../notes.service';
import { ErrorMessages } from '../error-page/error.messages';
import { NotesParams } from './notes-params.model';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';

import { EditNoteContentComponent } from '../edit-note/edit.note.component';
import { ConfirmContentComponent } from '../confirmation/confirm.content.component';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  total: number = 0;
  pending: boolean;
  params: NotesParams;
  bsModalRef: BsModalRef;
  subsribeOnHide: Subscription;

  constructor(private noteService: NotesService, private router: Router, private modalService: BsModalService) {
    this.params = this.noteService.getParams();
    if (this.noteService.isError) this.params.page = 1;
  }

  ngOnInit() {
    this.getNotes();
  }

  getNotes(): void {
    this.noteService.isError = false;
    this.pending = true;
    this.noteService.getNotes().subscribe(
      data => {
        this.pending = false;
        if (data.status == 'fail' || data.notes.length == 0) {
          this.router.navigate(['error/note_not_found']);
          this.noteService.isError = true;
        }
        else {
          this.notes = data.notes;
          this.total = data.total;
        }
      },
      err => {
        this.pending = false;
        this.router.navigate(['error/bad_request']);
        this.noteService.isError = true;
      });
  }

  openEditNoteModal(noteId: number) {
    this.bsModalRef = this.modalService.show(EditNoteContentComponent);
    
    this.noteService.getNote(noteId).subscribe(
      data => this.EditNoteSettings(new Note(data.note)),
      error => console.log('Error get note for edit')
    ) 
  }

  private EditNoteSettings(note: Note): void {    
    this.bsModalRef.content.currentName = note.name;
    this.bsModalRef.content.note = note;
    this.bsModalRef.content.pending = false;

    this.subsribeOnHide = this.modalService.onHide.subscribe(
      result => {
        if (this.bsModalRef.content.submit) {
          this.upadteNote(note);
        }
        this.subsribeOnHide.unsubscribe();
      },
      error => console.log("Edit error")
    )
  }

  confirmRemove(note: Note) {
    if (note.pending)
      return;

    this.bsModalRef = this.modalService.show(ConfirmContentComponent);
    this.bsModalRef.content.title = `Are you sure, that you want to delete ${note.name}?`

    let subsribeOnHide: Subscription = this.modalService.onHide.subscribe(
      result => {
        console.log(`Deleting note = ${note.name}`)
        if (this.bsModalRef.content.confirm) {
          this.removeNote(note);
        }
        subsribeOnHide.unsubscribe();
      },
      error => console.log("Confirm remove error")
    )

  }

  private upadteNote(note: Note) {
    this.noteService.updateNote(note).subscribe(
      data => {
        if (data.status == 'fail') {
          console.log("Error! Note was not updated");
        } else  {
          console.log("Note was updated");
          this.getNotes();
        }
          
      },
      error => console.log("Error update")
    )
  }

  private removeNote(note: Note) {
    note.pending = true;
    let id: number = note.id;

    this.noteService.removeNote(id + "").subscribe(
      data => {
        note.pending = false;
        if (data.status == 'fail') {
          console.log("Error! Note was not removed");
        } else
          this.notes = this.notes.filter(note => note.id != id);
      },
      err => {
        note.pending = false;
        console.log("Error! Note was not removed");
      }
      )
  }

  checkSort(sortBy: string, sortOrder: string): boolean {
    if (this.params.sortBy != sortBy && !sortOrder)
      return true;
    if (this.params.sortBy == sortBy && this.params.sortOrder == sortOrder)
      return true;
    return false;
  }

  sort(sortBy: string): void {
    if (this.params.sortBy === sortBy) {
      if (!this.params.sortOrder) {
        this.params.sortOrder = 'asc';
      }
      else if (this.params.sortOrder === 'asc') {
        this.params.sortOrder = 'desc';
      }
      else if (this.params.sortOrder === 'desc') {
        this.params.sortOrder = '';
      }
    }
    else {
      this.params.sortOrder = 'asc';
    }
    this.params.sortBy = sortBy;
    this.getNotes();
  }

}
