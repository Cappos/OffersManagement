import {Actions, Effect} from "@ngrx/effects";
import * as OffersActions from './offers.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Offer} from "../offers.model";

@Injectable()
export class OffersEffects {
    @Effect()
    offersFetch = this.actions$
        .ofType(OffersActions.GET_OFFERS)
        .switchMap((action: OffersActions.GetOffers) => {
            return this.httpClient.get<Offer[]>('http://wrenchweb.com/http/offersData', {
                observe: 'body',
                responseType: 'json'
            })
        })
        .map((modules) => {
            return {
                type: OffersActions.SET_OFFERS,
                payload: modules
            }
        });


    constructor(private actions$: Actions, private httpClient: HttpClient) {
    }

}
