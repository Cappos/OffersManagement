import {Action} from '@ngrx/store';
import {Offer} from "../offers.model";

export const SET_OFFERS = 'SET_OFFERS';
export const ADD_OFFER = 'ADD_OFFER';
export const UPDATE_OFFER = 'UPDATE_OFFER';
export const DELETE_OFFER = 'DELETE_OFFER';
export const GET_OFFERS = 'GET_OFFERS';
export const STORE_OFFER = 'STORE_OFFER';


export class SetOffers implements Action {
    readonly type = SET_OFFERS;

    constructor(public payload: Offer[]) {
    }
}

export class AddOffer implements Action {
    readonly type = ADD_OFFER;

    constructor(public payload: Offer) {
    }
}

export class UpdateOffer implements Action {
    readonly type = UPDATE_OFFER;

    constructor(public payload: { index: number, updatedOffer: Offer }) {
    }
}

export class DeleteOffer implements Action {
    readonly type = DELETE_OFFER;

    constructor(public payload: number) {
    }
}

export class GetOffers implements Action {
    readonly type = GET_OFFERS;
}

export class StoreOffers implements Action {
    readonly type = STORE_OFFER;
}


export type OffersActions = SetOffers | AddOffer | UpdateOffer | DeleteOffer | GetOffers  | StoreOffers ;