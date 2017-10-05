import {Action} from '@ngrx/store';
import {Group} from "../../offers/groups.model";

export const SET_CHAPTERS = 'SET_CHAPTERS';
export const ADD_CHAPTER = 'ADD_CHAPTER';
export const UPDATE_CHAPTER = 'UPDATE_CHAPTER';
export const DELETE_CHAPTER = 'DELETE_CHAPTER';
export const GET_CHAPTERS = 'GET_CHAPTERS';
export const STORE_CHAPTER = 'STORE_CHAPTER';


export class SetChapters implements Action {
    readonly type = SET_CHAPTERS;

    constructor(public payload: Group[]) {
    }
}

export class AddChapter implements Action {
    readonly type = ADD_CHAPTER;

    constructor(public payload: Group) {
    }
}

export class UpdateChapter implements Action {
    readonly type = UPDATE_CHAPTER;

    constructor(public payload: { index: number, updatedChapter: Group }) {
    }
}

export class DeleteChapter implements Action {
    readonly type = DELETE_CHAPTER;

    constructor(public payload: number) {
    }
}

export class GetChapters implements Action {
    readonly type = GET_CHAPTERS;
}

export class StoreChapters implements Action {
    readonly type = STORE_CHAPTER;
}


export type ChaptersActions = SetChapters | AddChapter | UpdateChapter | DeleteChapter | GetChapters  | StoreChapters ;