import {Actions, Effect} from "@ngrx/effects";
import * as ClientsActions from '../store/clients.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {Client} from "../client.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ClientsEffects {
    @Effect()
    clientsFetch = this.actions$
        .ofType(ClientsActions.GET_CLIENTS)
        .switchMap((action: ClientsActions.GetClients) => {
            return this.httpClient.get<Client[]>('http://wrenchweb.com/http/clientsData', {
                observe: 'body',
                responseType: 'json'
            })
        })
        .map((clients) => {
            return {
                type: ClientsActions.SET_CLIENTS,
                payload: clients
            }
        });


    constructor(private actions$: Actions, private httpClient: HttpClient) {
    }

}

