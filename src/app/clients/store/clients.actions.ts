import {Action} from '@ngrx/store';
import {Client} from "../client.model";

export const SET_CLIENTS = 'SET_CLIENTS';
export const ADD_CLIENT = 'ADD_CLIENT';
export const UPDATE_CLIENT = 'UPDATE_CLIENT';
export const DELETE_CLIENT = 'DELETE_CLIENT';
export const GET_CLIENTS = 'GET_CLIENTS';
export const STORE_CLIENT = 'STORE_CLIENT';


export class SetClients implements Action {
    readonly type = SET_CLIENTS;

    constructor(public payload: Client[]) {
    }
}

export class AddClient implements Action {
    readonly type = ADD_CLIENT;

    constructor(public payload: Client) {
    }
}

export class UpdateClient implements Action {
    readonly type = UPDATE_CLIENT;

    constructor(public payload: { index: number, updatedClients: Client }) {
    }
}

export class DeleteClient implements Action {
    readonly type = DELETE_CLIENT;

    constructor(public payload: number) {
    }
}

export class GetClients implements Action {
    readonly type = GET_CLIENTS;
}

export class StoreClients implements Action {
    readonly type = STORE_CLIENT;
}


export type ClientsActions = SetClients | AddClient | UpdateClient | DeleteClient | GetClients  | StoreClients ;