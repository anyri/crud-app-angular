import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { User } from './user.model';

@Injectable()
export class AuthorizationServise {

    constructor(private http: Http) {

    }

    doAuthorize(login: string, password: string) {
        return this.http.post('api/login', { login: login, password: password })
            .map(res => res.json())
            .catch(error =>
                Observable.throw(error.json().error || 'Server error')
            )
    }
}