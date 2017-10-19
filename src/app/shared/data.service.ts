import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Offer} from "../offers/offers.model";

@Injectable()
export class DataService {

    constructor(private httpClient: HttpClient){}

    getPagesData(){
        return this.httpClient.get<any>('http://wrenchweb.com/http/pagesData', {
            observe: 'body',
            responseType: 'json'
        });
    }

    getPageData(){
        return this.httpClient.get<any>('http://wrenchweb.com/http/pageData', {
            observe: 'body',
            responseType: 'json'
        });
    }

    getOfferData(){
        return this.httpClient.get<Offer>('http://wrenchweb.com/http/offerData', {
            observe: 'body',
            responseType: 'json'
        });
    }

}
