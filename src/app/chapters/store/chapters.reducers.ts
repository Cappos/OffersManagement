import * as ChaptersActions from './chapters.actions'
import {Group} from "../../offers/groups.model";

export interface FeatureState {
    chaptersList: State
}

export interface State {
    chapters: Group[];
}

const initialState: State = {
    chapters: []
};

export function chaptersReducer(state = initialState, action: ChaptersActions.ChaptersActions) {
    switch (action.type) {
        case (ChaptersActions.SET_CHAPTERS):
            return {
                ...state,
                chapters: [...action.payload]
            };
        case (ChaptersActions.ADD_CHAPTER):
            return {
                ...state,
                chapters: [...state.chapters, action.payload]
            };
        case (ChaptersActions.UPDATE_CHAPTER):
            const module = state.chapters[action.payload.index];
            const updateChapter = {
                ...module,
                ...action.payload.updatedChapter
            };
            const chapters = [...state.chapters];
            chapters[action.payload.index] = updateChapter;
            return {
                ...state,
                chapters: chapters
            };

        case (ChaptersActions.DELETE_CHAPTER):
            const oldChapter = [...state.chapters];
            oldChapter.splice(action.payload, 1);
            return {
                ...state,
                chapters: oldChapter
            };
        default:
            return state;
    }
}