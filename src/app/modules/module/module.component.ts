import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import {Store} from "@ngrx/store";
import {Module} from "../modules.model";
import 'rxjs/add/operator/take';

import * as ModulesActions from '../store/modules.actions'
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable} from "rxjs/Observable";

import * as fromModules from '../../modules/store/modules.reducers';
import {HttpClient} from "@angular/common/http";
import {SharedService} from "../../shared/shared.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
    pageTitle = 'Modules';
    id: number;
    item;
    moduleState: Observable<any>;
    @Output() editMode = false;
    rteData;
    groups: any[] = [
        {name: 'Technical', value: 1},
        {name: 'Design', value: 2},
        {name: 'Optimization', value: 3},
        {name: 'SEO', value: 4}

    ];
    selectedGroup = this.groups[0].value;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private store: Store<fromModules.FeatureState>, private httpClient: HttpClient, private loadingService: TdLoadingService, private location: Location) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.moduleState = this.httpClient.get<Module>('http://wrenchweb.com/http/moduleData', {
                    observe: 'body',
                    responseType: 'json'
                });
                this.moduleState.take(1).subscribe((res) => {
                    this.item = res;
                    this.rteData = this.item.bodytext;
                    this.loadingService.resolveAll('modulesLoader');
                })
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        // const updateModule = new Module(this.item.uid, value.name, this.rteData, value.price, value.tstamp, this.item.cruserId, this.item.crdate, this.item.modify, value.groupUid);
        // this.store.dispatch(new ModulesActions.AddModule(updateModule));
        this.editMode = false;
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    goBack(){
        this.location.back();
    }

}
