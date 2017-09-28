import {Component, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Module} from "../modules.model";

import * as ModulesActions from '../store/modules.actions'
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {

    constructor(private store: Store<{ modulesList: { modules: Module[] } }>) {
    }

    ngOnInit() {
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newModule = new Module(value.uid, value.name, value.bodytext, value.price, value.tstamp, value.cruserId, value.crdate, value.modify, value.groupUid);
        this.store.dispatch(new ModulesActions.AddModule(newModule));
    }

}
