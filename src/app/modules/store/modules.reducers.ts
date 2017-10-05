import * as ModulesActions from './modules.actions'
import {Module} from "../modules.model";

export interface FeatureState {
    modulesList: State
}

export interface State {
    modules: Module[];
}

const initialState: State = {
    modules: []
};

export function modulesReducer(state = initialState, action: ModulesActions.ModulesActions) {
    switch (action.type) {
        case (ModulesActions.SET_CHAPTERS):
            return {
                ...state,
                modules: [...action.payload]
            };
        case (ModulesActions.ADD_CHAPTER):
            return {
                ...state,
                modules: [...state.modules, action.payload]
            };
        case (ModulesActions.UPDATE_MODULE):
            const module = state.modules[action.payload.index];
            const updateModue = {
                ...module,
                ...action.payload.updatedModule
            };
            const modules = [...state.modules];
            modules[action.payload.index] = updateModue;
            return {
                ...state,
                modules: modules
            };

        case (ModulesActions.DELETE_MODULE):
            const oldModules = [...state.modules];
            oldModules.splice(action.payload, 1);
            return {
                ...state,
                modules: oldModules
            };
        default:
            return state;
    }
}