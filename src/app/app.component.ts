import {Component} from '@angular/core';
import {SharedService} from "./shared/shared.service";
import {Store} from "@ngrx/store";

import * as ModulesActions from './modules/store/modules.actions';
import * as fromModules from './modules/store/modules.reducers';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    pageTitle;

    constructor(private sharedService: SharedService, private store: Store<fromModules.FeatureState>) {
        // get page title on page change
        this.sharedService.titleChanged.subscribe(title => this.pageTitle = title);
    }

    // onClick(link: string) {
    //
    //     switch (link) {
    //         case('modules'):
    //             // return this.store.dispatch(new ModulesActions.GetModules());
    //
    //         case ('offers'):
    //             return console.log('offers');
    //         case ('clients'):
    //             return console.log('Clients');
    //         default:
    //             return null
    //     }
    //
    // }
}
