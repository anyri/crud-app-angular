import { Component, OnInit } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { Subscription } from 'rxjs/Subscription';
import { User } from '../authorization/user.model';

import { AuthorizationComponent } from '../authorization/authorization.component/authorization.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  bsModalRef: BsModalRef;
  activeUser: User;

  constructor(private modalService: BsModalService) {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user)
      this.activeUser = user;
  }

  ngOnInit() {
  }

  public openAuthorizationModal() {
    this.bsModalRef = this.modalService.show(AuthorizationComponent);

    let subscribeOnHide: Subscription = this.modalService.onHide.subscribe(
      result => {
        this.activeUser = this.bsModalRef.content.user;
      },
      error => {

      }
    )
  }

  public singOut() {
    localStorage.removeItem('user');
    this.activeUser = undefined;
  }

}
