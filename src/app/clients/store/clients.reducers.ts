import * as ClientsActions from './clients.actions'
import {Client} from "../client.model";

export interface FeatureState {
    clientsList: State
}

export interface State {
    clients: Client[];
}

const initialState: State = {
    clients: []
};

export function clientsReducer(state = initialState, action: ClientsActions.ClientsActions) {
    switch (action.type) {
        case (ClientsActions.SET_CLIENTS):
            return {
                ...state,
                clients: [...action.payload]
            };
        case (ClientsActions.ADD_CLIENT):
            return {
                ...state,
                clients: [...state.clients, action.payload]
            };
        case (ClientsActions.UPDATE_CLIENT):
            const module = state.clients[action.payload.index];
            const updateClient = {
                ...module,
                ...action.payload.updatedClients
            };
            const clients = [...state.clients];
            clients[action.payload.index] = updateClient;
            return {
                ...state,
                clients: clients
            };

        case (ClientsActions.DELETE_CLIENT):
            const oldClients = [...state.clients];
            oldClients.splice(action.payload, 1);
            return {
                ...state,
                clients: oldClients
            };
        default:
            return state;
    }
}