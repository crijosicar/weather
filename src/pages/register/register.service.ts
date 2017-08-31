import { Categories } from '../../common/const-categories';
import {
    Headers,
    Http,
    RequestOptions,
    Response
} from '@angular/http';
import { Injectable } from '@angular/core';
import { IResponseUtil } from '../../interfaces/response-util.interface';
import { Observable } from 'rxjs/Observable';
import { URL_API, GEOCODING_URL_API, GEOCODING_KEY_API } from '../../common/const-util';
import '../../common/rxjs-operators';


@Injectable()
export class RegisterService {

    private cityUrl = 'city';
    private valueListUrl = 'value-list';
    private personUrl = 'person/addNewUser';
    private gender = Categories.GENDER;
    private citynameUrl = 'city/getCityByCityName';
    private headers = new Headers({ 
        'Content-Type' : 'application/json',
        'Access-Control-Allow-Origin' : '*'
    });

    constructor(private http: Http) { }

    getAllCities(): Observable<IResponseUtil> {
        return this.http.get(`${URL_API}p/${this.cityUrl}/getAllCities`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAllGenders(): Observable<IResponseUtil> {
        return this.http.get(`${URL_API}p/${this.valueListUrl}/getAllValuesByCategory/${this.gender}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    registerNewUser(body: Object): Observable<IResponseUtil> {
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(`${URL_API}p/${this.personUrl}`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCityNameByLatLon(lat: string, lon: string): Observable<any> {
        return this.http.get(`${GEOCODING_URL_API}?latlng=${lat},${lon}&sensor=true&key=${GEOCODING_KEY_API}`)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    getCityByCityname(body: Object): Observable<IResponseUtil> {
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(`${URL_API}p/${this.citynameUrl}`, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
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