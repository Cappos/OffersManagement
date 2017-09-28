import * as ModulesActions from './modules.actions'
import {Module} from "../modules.model";

export interface FeatureState {
    modulesList: State
}

export interface State {
    modules: Module[];
}

const initialState: State = {
    modules: [
        {
            "uid": 1,
            "name": "Tresom",
            "bodytext": "Oth intartic fx lower end r rad, init for opn fx type 3A/B/C",
            "price": 690,
            "tstamp": "1/7/2017",
            "cruserId": 72,
            "crdate": "12/13/2016",
            "modify": true,
            "groupUid": 50
        }, {
            "uid": 2,
            "name": "Pannier",
            "bodytext": "Chronic multifocal osteomyelitis",
            "price": 700,
            "tstamp": "2/18/2017",
            "cruserId": 40,
            "crdate": "9/19/2017",
            "modify": false,
            "groupUid": 16
        }, {
            "uid": 3,
            "name": "Alphazap",
            "bodytext": "Anterior disloc of proximal end of tibia, unsp knee, sequela",
            "price": 416,
            "tstamp": "8/19/2017",
            "cruserId": 45,
            "crdate": "10/21/2016",
            "modify": false,
            "groupUid": 100
        }, {
            "uid": 4,
            "name": "Voltsillam",
            "bodytext": "Methemoglobinemia",
            "price": 902,
            "tstamp": "2/11/2017",
            "cruserId": 31,
            "crdate": "2/22/2017",
            "modify": true,
            "groupUid": 26
        }, {
            "uid": 5,
            "name": "Fintone",
            "bodytext": "Insect bite (nonvenomous) of breast, right breast, init",
            "price": 952,
            "tstamp": "8/10/2017",
            "cruserId": 73,
            "crdate": "12/29/2016",
            "modify": false,
            "groupUid": 46
        }, {
            "uid": 6,
            "name": "Flexidy",
            "bodytext": "Nondisp fx of lateral condyle of r tibia, 7thB",
            "price": 452,
            "tstamp": "3/19/2017",
            "cruserId": 50,
            "crdate": "11/28/2016",
            "modify": false,
            "groupUid": 93
        }, {
            "uid": 7,
            "name": "Solarbreeze",
            "bodytext": "Nondisp fx of prox phalanx of unsp less toe(s), 7thP",
            "price": 496,
            "tstamp": "9/16/2017",
            "cruserId": 37,
            "crdate": "2/5/2017",
            "modify": false,
            "groupUid": 93
        }, {
            "uid": 8,
            "name": "Konklux",
            "bodytext": "Acquired absence of unspecified hand",
            "price": 674,
            "tstamp": "10/21/2016",
            "cruserId": 96,
            "crdate": "4/19/2017",
            "modify": false,
            "groupUid": 74
        }, {
            "uid": 9,
            "name": "Sub-Ex",
            "bodytext": "Displ oblique fx shaft of l tibia, 7thJ",
            "price": 16,
            "tstamp": "1/20/2017",
            "cruserId": 58,
            "crdate": "11/5/2016",
            "modify": true,
            "groupUid": 75
        }, {
            "uid": 10,
            "name": "Subin",
            "bodytext": "Diffuse TBI w LOC >24 hr w return to conscious levels",
            "price": 509,
            "tstamp": "4/11/2017",
            "cruserId": 34,
            "crdate": "4/3/2017",
            "modify": true,
            "groupUid": 67
        }, {
            "uid": 11,
            "name": "Matsoft",
            "bodytext": "Benign neoplasm of meninges, unspecified",
            "price": 362,
            "tstamp": "2/5/2017",
            "cruserId": 69,
            "crdate": "7/17/2017",
            "modify": true,
            "groupUid": 6
        }, {
            "uid": 12,
            "name": "Konklux",
            "bodytext": "Bariatric surgery status",
            "price": 707,
            "tstamp": "8/11/2017",
            "cruserId": 13,
            "crdate": "3/9/2017",
            "modify": false,
            "groupUid": 72
        }, {
            "uid": 13,
            "name": "Voyatouch",
            "bodytext": "Poisoning by oth synthetic narcotics, accidental, init",
            "price": 122,
            "tstamp": "2/4/2017",
            "cruserId": 52,
            "crdate": "12/4/2016",
            "modify": false,
            "groupUid": 65
        }, {
            "uid": 14,
            "name": "It",
            "bodytext": "Cystic fibrosis with other intestinal manifestations",
            "price": 637,
            "tstamp": "11/16/2016",
            "cruserId": 9,
            "crdate": "5/4/2017",
            "modify": false,
            "groupUid": 69
        }, {
            "uid": 15,
            "name": "Solarbreeze",
            "bodytext": "Nondisp fx of epiphy (separation) (upper) of r femr, 7thB",
            "price": 52,
            "tstamp": "4/23/2017",
            "cruserId": 42,
            "crdate": "4/14/2017",
            "modify": false,
            "groupUid": 13
        }, {
            "uid": 16,
            "name": "Zontrax",
            "bodytext": "Chronic paroxysmal hemicrania, not intractable",
            "price": 364,
            "tstamp": "3/13/2017",
            "cruserId": 29,
            "crdate": "8/4/2017",
            "modify": false,
            "groupUid": 16
        }, {
            "uid": 17,
            "name": "Greenlam",
            "bodytext": "Contusion of right hand, sequela",
            "price": 308,
            "tstamp": "10/21/2016",
            "cruserId": 99,
            "crdate": "4/1/2017",
            "modify": false,
            "groupUid": 99
        }, {
            "uid": 18,
            "name": "Bitchip",
            "bodytext": "Type 2 diabetes mellitus with circulatory complications",
            "price": 583,
            "tstamp": "12/21/2016",
            "cruserId": 85,
            "crdate": "1/16/2017",
            "modify": true,
            "groupUid": 80
        }, {
            "uid": 19,
            "name": "Job",
            "bodytext": "Other stimulant abuse with intoxication delirium",
            "price": 781,
            "tstamp": "3/5/2017",
            "cruserId": 90,
            "crdate": "9/23/2017",
            "modify": false,
            "groupUid": 47
        }, {
            "uid": 20,
            "name": "Zoolab",
            "bodytext": "Other non-in-line roller-skating accident, subs encntr",
            "price": 913,
            "tstamp": "1/24/2017",
            "cruserId": 80,
            "crdate": "9/14/2017",
            "modify": true,
            "groupUid": 60
        }]
};

export function modulesReducer(state = initialState, action: ModulesActions.ModulesActions) {
    switch (action.type) {
        case (ModulesActions.SET_MODULES):
            return {
                ...state,
                modules: [...action.payload]
            };
        case (ModulesActions.ADD_MODULE):
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
            const modules =  [...state.modules];
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