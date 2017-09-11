import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from "@angular/router";
import { Note } from './notes/note.model';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { NotesParams } from './notes/notes-params.model';

@Injectable()
export class NotesService {
    private queryStr: string = "";
    isError: boolean = false;
    params: NotesParams = { page: 1, count: 10, sortBy: "", sortOrder: "" };

    constructor(private http: Http, private route: ActivatedRoute, private router: Router) {
        this.route.firstChild.params.subscribe(params => this.params.page = Number(params['page']) || ( this.isError ? 1 : this.params.page) );
    }

    getNotes() {
        this.setUrlParams();
        return this.http.get(this.queryStr)
            .map(res => res.json() || [])
            .catch(error =>
                Observable.throw(error.json().error || 'Server error')
            );
    }

    getNote(id: string) {
        let queryStr: string = `api/note?id=${id}`;
        return this.http.get(queryStr)
            .map(res => res.json())
            .catch(error =>
                Observable.throw(error.json().error || 'Server error')
            )
    }

    removeNote(id: string) {
        return this.http.delete(`api/notes?id=${id}`) 
            .map(res => res.json() || [])
            .catch(error =>
                Observable.throw(error.json().error || 'Server error')
            )
    }

    private setUrlParams(): void {
        this.queryStr = `api/notes?offset=${this.getOffset()}&count=${this.params.count}`;
        if(this.params.sortBy && this.params.sortOrder) {
            this.queryStr += `&sortBy=${this.params.sortBy}&sortOrder=${this.params.sortOrder}`; 
        }   
        this.router.navigate(['notes', this.params.page]);
    }

    getParams(): NotesParams {
        return this.params;
    }

    private getOffset()  {
        return (this.params.page - 1) * this.params.count;
    }
}