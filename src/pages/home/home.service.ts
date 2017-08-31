import {
    Headers,
    Http,
    RequestOptions,
    Response
    } from '@angular/http';
import { Injectable } from '@angular/core';
import { IResponseUtil } from '../../interfaces/response-util.interface';
import { Observable } from 'rxjs/Observable';
import { URL_API } from '../../common/const-util';
import '../../common/rxjs-operators';

@Injectable()
export class HomeService {

    private authUrl = 'user/auth';
    private headers = new Headers({ 
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });
    constructor(private http: Http) { }

    getDataByUser(body: Object): Observable<IResponseUtil> {
        this.headers['Authorization'] = 'aklRa3dwbWcyMWEzcmFiUFVNckpyWXB5YnlCOWVw';
        console.log(this.headers);
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(`${URL_API}p/${this.authUrl}`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response | any) {
        return res.json();
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}