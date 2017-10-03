import * as OffersActions from './offers.actions'
import {Offer} from "../offers.model";

export interface FeatureState {
    offersList: State
}

export interface State {
    offers: Offer[];
}

const initialState: State = {
    offers: []
};

export function offersReducer(state = initialState, action: OffersActions.OffersActions) {
    switch (action.type) {
        case (OffersActions.SET_OFFERS):
            return {
                ...state,
                offers: [...action.payload]
            };
        case (OffersActions.ADD_OFFER):
            return {
                ...state,
                offers: [...state.offers, action.payload]
            };
        case (OffersActions.UPDATE_OFFER):
            const offer = state.offers[action.payload.index];
            const updateOffer = {
                ...offer,
                ...action.payload.updatedOffer
            };
            const offers = [...state.offers];
            offers[action.payload.index] = updateOffer;
            return {
                ...state,
                offers: offers
            };

        case (OffersActions.DELETE_OFFER):
            const oldModules = [...state.offers];
            oldModules.splice(action.payload, 1);
            return {
                ...state,
                offers: oldModules
            };
        default:
            return state;
    }
}