import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';

@Component({
  selector: 'modal-content',
  template: `
    <div class="custom-modal">
      <div class="modal-header">        
        <button type="button" class="close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <h4 class="modal-title">{{title}}</h4>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" (click)="verify()">Yes</button>
        <button type="button" class="btn btn-default" (click)="bsModalRef.hide()">No</button>
      </div>
    </div>
    `
})
export class ConfirmContentComponent {
  public title: string;
  public confirm: boolean;
  constructor(public bsModalRef: BsModalRef) { }

  verify() {
    this.confirm = true;
    this.bsModalRef.hide();
  }
}