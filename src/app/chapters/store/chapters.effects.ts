import {Actions, Effect} from "@ngrx/effects";
import * as ChaptersActions from './chapters.actions';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Group} from "../../offers/groups.model";

@Injectable()
export class ChaptersEffects {
    @Effect()
    chaptersFetch = this.actions$
        .ofType(ChaptersActions.GET_CHAPTERS)
        .switchMap((action: ChaptersActions.GetChapters) => {
            return this.httpClient.get<Group[]>('http://wrenchweb.com/http/chaptersData', {
                observe: 'body',
                responseType: 'json'
            })
        })
        .map((chapters) => {
            return {
                type: ChaptersActions.SET_CHAPTERS,
                payload: chapters
            }
        });


    constructor(private actions$: Actions, private httpClient: HttpClient) {
    }

}
