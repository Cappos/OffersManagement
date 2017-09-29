import {Component, OnInit, Output} from '@angular/core';
import {Store} from "@ngrx/store";
import {Module} from "../modules.model";
import 'rxjs/add/operator/take';

import * as ModulesActions from '../store/modules.actions'
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

import * as fromModules from '../../modules/store/modules.reducers';

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
    id: number;
    item;
    moduleState: Observable<fromModules.State>;
    @Output() editMode = false;

    constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromModules.FeatureState>) {

    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.store.dispatch(new ModulesActions.GetModule(this.id));
                this.moduleState = this.store.select('modulesList');
                this.moduleState.take(1).subscribe((res) => {
                    console.log(res);
                })
            }
        );
    }

    onSubmit(form: NgForm) {
        const value = form.value;
        const newModule = new Module(value.uid, value.name, value.bodytext, value.price, value.tstamp, value.cruserId, value.crdate, value.modify, value.groupUid);
        this.store.dispatch(new ModulesActions.AddModule(newModule));
    }

}
