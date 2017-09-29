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

    @Effect()
    moduleFetch = this.actions$
        .ofType(ModulesActions.GET_MODULE)
        .switchMap((action: ModulesActions.GetModule) => {
            console.log(action);
            return this.httpClient.get<Module>('http://wrenchweb.com/http/modulesData');
        })
        .map((module) => {
            console.log(module);

            return {
                type: ModulesActions.SET_MODULE,
                payload: module
            }
        });


    constructor(private actions$: Actions, private httpClient: HttpClient) {
    }

}
