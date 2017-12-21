import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/take';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {SharedService} from "../../shared/shared.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Apollo} from 'apollo-angular';
import fetchModule from '../../queries/fetchModule';

@Component({
    selector: 'app-module',
    templateUrl: './module.component.html',
    styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
    pageTitle = 'Modules';
    id: number;
    item;
    @Output() editMode = false;
    rteData;
    groups: any[] = [
        {name: 'Technical', value: 1},
        {name: 'Design', value: 2},
        {name: 'Optimization', value: 3},
        {name: 'SEO', value: 4}

    ];
    selectedGroup = this.groups[0].value;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private loadingService: TdLoadingService, private location: Location, private apollo: Apollo) {
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
                this.id = params['id'];
                this.editMode = !!params['edit'];

                this.apollo.watchQuery<any>({
                    query: fetchModule,
                    variables: {
                        id: this.id
                    }
                }).valueChanges.subscribe(({data}) => {
                    this.item = data.module;
                    this.rteData = this.item.bodytext;
                    this.selectedGroup = this.item.groupUid;
                    this.loadingService.resolveAll('modulesLoader');
                });
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
