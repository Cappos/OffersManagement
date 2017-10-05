import {Action} from '@ngrx/store';
import {Module} from "../modules.model";

export const SET_CHAPTERS = 'SET_MODULES';
export const ADD_CHAPTER = 'ADD_MODULE';
export const UPDATE_MODULE = 'UPDATE_MODULE';
export const DELETE_MODULE = 'DELETE_MODULE';
export const GET_MODULES = 'GET_MODULES';
export const STORE_MODULE = 'STORE_MODULE';


export class SetModules implements Action {
    readonly type = SET_CHAPTERS;

    constructor(public payload: Module[]) {
    }
}

export class AddModule implements Action {
    readonly type = ADD_CHAPTER;

    constructor(public payload: Module) {
    }
}

export class UpdateModule implements Action {
    readonly type = UPDATE_MODULE;

    constructor(public payload: { index: number, updatedModule: Module }) {
    }
}

export class DeleteModule implements Action {
    readonly type = DELETE_MODULE;

    constructor(public payload: number) {
    }
}

export class GetModules implements Action {
    readonly type = GET_MODULES;
}

export class StoreModules implements Action {
    readonly type = STORE_MODULE;
}


export type ModulesActions = SetModules | AddModule | UpdateModule | DeleteModule | GetModules  | StoreModules ;