import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';
import { AuthorizationServise } from '../authorization.servise';
import { User } from '../user.model';

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {
  public login: string = "";
  public password: string = "";
  public errorAuthorize: boolean = false;
  public rememberMe: boolean;
  public user: User;

  constructor(public bsModalRef: BsModalRef, private authorizationServise: AuthorizationServise) { }

  ngOnInit() {
  }

  public verify() {
    if (this.login && this.password) {
      this.authorizationServise.doAuthorize(this.login, this.password).subscribe(
        data => {
          console.log("Is remember = " + this.rememberMe);
          if (data.status == 'fail') {
            this.errorAuthorize = true;
          } else {
            this.errorAuthorize = false;
            this.user = new User(data.userInfo);
            if (this.rememberMe) {
              localStorage.setItem('user', JSON.stringify(this.user));
            }
            this.bsModalRef.hide();
          }
        },
        error => {
          console.log("Error requset login-pass");
        }
      )
    }

  }

}
