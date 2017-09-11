import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ErrorMessages } from '../error-page/error.messages';

@Component({
  selector: 'error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  constructor(private route: ActivatedRoute) {

  }

  ngOnInit() {
   
  }

  @Input()
  message: string = ErrorMessages.ERROR_PAGE;

  private setMessage(type: string): void {
    switch(type) {
      case 'page_not_found':
        this.message = ErrorMessages.ERROR_PAGE;
        break;
      case 'bad_request':
        this.message = ErrorMessages.ERROR_REQUEST;
        break;
      case 'note_not_found':
        this.message = ErrorMessages.ERROR_NOTE;
        break;
      default:
        this.message = ErrorMessages.ERROR_PAGE;
    }
  }


}
