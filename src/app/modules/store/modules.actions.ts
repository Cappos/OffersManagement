import {Action} from '@ngrx/store';
import {Module} from "../modules.model";

export const ADD_MODULE = 'ADD_MODULE';

export class AddModule implements Action {
    readonly type = ADD_MODULE;
    payload: Module;
}

export type ModulesActions = AddModule;