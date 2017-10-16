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

}
