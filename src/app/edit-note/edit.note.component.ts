import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Note } from '../notes/note.model';

@Component({
    selector: 'modal-content',
    templateUrl: './edit.note.component.html'
})
export class EditNoteContentComponent {
    public currentName: string = "";
    public note: Note = new Note();
    public isNewNote: boolean = false;
    public submit: boolean;
    public pending = true;
    constructor(public bsModalRef: BsModalRef) { }

    onSubmit() {
        this.submit = true;
        this.bsModalRef.hide();
    }
}