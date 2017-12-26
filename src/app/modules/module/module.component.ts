import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import 'rxjs/add/operator/take';
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Apollo} from 'apollo-angular';
import fetchModule from '../../queries/fetchModule';
import updateModule from '../../queries/updateModule';
import getModulesData from '../../queries/fetchModules';


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
    selectedGroup;
    categories: any[];

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
                    },
                    fetchPolicy: 'network-only'
                }).valueChanges.subscribe(({data}) => {
                    console.log(data);
                    this.item = data.module;
                    this.categories = data.categories;
                    this.rteData = this.item.bodytext;
                    this.selectedGroup = this.item.groupId[0].value;
                    this.loadingService.resolveAll('modulesLoader');
                });
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        const category = this.categories.find(category => category.value == value.categoryId);
        const price = value.price.replace(',', '')

        this.apollo.mutate({
            mutation: updateModule,
            variables: {
                id: this.id,
                name: value.name,
                bodytext: this.rteData,
                price: +price,
                groupId: category._id
            },
            refetchQueries: [{
                query: getModulesData
            }]
        }).subscribe(() => {
            this.editMode = false;
            this.sharedService.sneckBarNotifications(`module updated.`);
            this.editMode = false;
        });
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
