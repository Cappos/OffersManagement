import {Actions, Effect} from "@ngrx/effects";
import * as ModulesActions from '../store/modules.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {Module} from "../modules.model";
import {Injectable} from "@angular/core";

@Injectable()
export class ModulesEffects {
    @Effect()
    modulesFetch = this.actions$
        .ofType(ModulesActions.GET_MODULES)
        .switchMap((action: ModulesActions.GetModules) => {
            return this.httpClient.get<Module[]>('http://wrenchweb.com/http/modulesData', {
                observe: 'body',
                responseType: 'json'
            })
        })
        .map((modules) => {
            return {
                type: ModulesActions.SET_MODULES,
                payload: modules
            }
        });


    constructor(private actions$: Actions, private httpClient: HttpClient) {
    }

}
