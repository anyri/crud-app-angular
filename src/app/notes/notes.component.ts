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
  subscription: Subscription;

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

  openEditNoteModal(note: Note) {
    this.bsModalRef = this.modalService.show(EditNoteContentComponent);

    let subsribeOnHide: Subscription =  this.modalService.onHide.subscribe(
      result => {
        if (this.bsModalRef.content.submit && !this.bsModalRef.content.pending) {
          note.pending = true;
          this.upadteNote(this.bsModalRef.content.note);
        }

        this.subscription.unsubscribe();
        subsribeOnHide.unsubscribe();
      },
      error => {
        console.log("Error edit the note");
        this.subscription.unsubscribe();
        subsribeOnHide.unsubscribe();
      }
    );
    
    this.subscription = this.noteService.getNote(note.id).subscribe(
      data => {
        let note = data.note;
        this.bsModalRef.content.currentName = note.name;
        this.bsModalRef.content.note = note;
        this.bsModalRef.content.pending = false;

      },
      error => {
        console.log('Error get note for edit');
        this.subscription.unsubscribe();
      }
    ) 
  }

  private EditNoteSettings(note: Note): void {    
    this.bsModalRef.content.currentName = note.name;
    this.bsModalRef.content.note = note;
    this.bsModalRef.content.pending = false;

    let subsribeOnHide: Subscription =  this.modalService.onHide.subscribe(
      result => {
        if (this.bsModalRef.content.submit) {
          this.upadteNote(note);
        } else {
          this.subscription.unsubscribe();
        }
        subsribeOnHide.unsubscribe();
      },
      error => {
        console.log("Error edit the note");
        this.subscription.unsubscribe();
        subsribeOnHide.unsubscribe();
      }
    )
  }


  openNewNoteModal() {
    this.bsModalRef = this.modalService.show(EditNoteContentComponent);
    this.bsModalRef.content.note.createdAt = new Date();
    this.bsModalRef.content.note.updatedAt = new Date();
    this.bsModalRef.content.isNewNote = true;
    this.bsModalRef.content.pending = false;

    let subsribeOnHide: Subscription = this.modalService.onHide.subscribe(
      result => {
        if (this.bsModalRef.content.submit) {
          this.bsModalRef.content.note.id = this.total + 1;          
          this.createNote(this.bsModalRef.content.note);
        }
        subsribeOnHide.unsubscribe();
      },
      error => {
        console.log("Error create new note");
        subsribeOnHide.unsubscribe();
      }
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
          note.pending = true;
          this.removeNote(note);
        }
        subsribeOnHide.unsubscribe();
      },
      error => {
        console.log("Confirm remove error");
        subsribeOnHide.unsubscribe();
      }
    )

  }

  private createNote(note: Note) {
    this.subscription = this.noteService.addNote(note).subscribe(
      data => {
        if (data.status == 'fail') {
          console.log("Error!The Note was not added");
        } else  {
          console.log("The Note was added");
          this.getNotes();
        }
        this.subscription.unsubscribe();
      },
      error => {
        console.log("Error add new Note");
        this.subscription.unsubscribe();
      }
    )

  }

  private upadteNote(note: Note) {
     let subscription = this.noteService.updateNote(note).subscribe(
      data => {
        if (data.status == 'fail') {
          console.log("Error! Note was not updated");
        } else  {
          console.log("Note was updated");
          // this.getNotes();
          this.notes = this.notes.map(item => {
            if(item.id == note.id)
              return note;
            
            return item;
          })
        }  
        subscription.unsubscribe();
        note.pending = false;
      },
      error => {
        console.log("Error update");
        subscription.unsubscribe();
        note.pending = false;
      } 
    )
  }

  private removeNote(note: Note) {    
    let id: number = note.id;

    this.subscription = this.noteService.removeNote(id).subscribe(
      data => {        
        if (data.status == 'fail') {
          console.log("Error! Note was not removed");
        } else
          this.notes = this.notes.filter(note => note.id != id);

        this.subscription.unsubscribe();
        note.pending = false;
      },
      err => {
        note.pending = false;
        console.log("Error! Note was not removed");
        this.subscription.unsubscribe();
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
