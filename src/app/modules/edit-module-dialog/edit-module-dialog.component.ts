import {Component, Inject, OnInit} from '@angular/core';
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {Apollo} from "apollo-angular";
import fetchModule from '../../queries/fetchModule';
import fetchCategories from '../../queries/fetchCategories';

@Component({
    selector: 'app-edit-module-dialog',
    templateUrl: './edit-module-dialog.component.html',
    styleUrls: ['./edit-module-dialog.component.css']
})
export class EditModuleDialogComponent implements OnInit {
    pageTitle = 'Modules';
    id: number;
    item;
    rteData = '';
    itemSaved = false;
    selectedChapter;
    categories: any[];
    selectedGroup;
    savedModuleData;
    count = 0;

    constructor(private sharedService: SharedService, public dialog: MatDialog, private _dialogService: TdDialogService, public dialogRef: MatDialogRef<EditModuleDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService, private apollo: Apollo) {

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
        console.log(this.data);
        if (this.data.edit && this.data.moduleUid) {
            this.id = this.data.groupUid;
            const chapterId = this.data.chapterId

            this.apollo.watchQuery<any>({
                query: fetchModule,
                variables: {
                    id: this.id
                },
                fetchPolicy: 'network-only'
            }).valueChanges.subscribe(({data}) => {
                this.item = data.module;
                this.categories = data.categories;
                this.rteData = this.item.bodytext;
                this.selectedChapter = chapterId;
                this.selectedGroup = this.item.categoryId[0].value;
            });
        }
        else if (this.data.edit) {
            this.id = this.data.groupUid;
            const chapterId = this.data.chapterId


            this.apollo.watchQuery<any>({
                query: fetchCategories
            }).valueChanges.subscribe(({data}) => {
                this.categories = data.categories;
                this.id = this.data.groupUid;
                this.item = this.data.moduleNew
                this.rteData = this.item.bodytext;
                this.selectedChapter = chapterId;
            });

        }
        else {
            console.log(this.data);
            this.apollo.watchQuery<any>({
                query: fetchCategories
            }).valueChanges.subscribe(({data}) => {
                this.categories = data.categories;
                this.id = this.data.groupUid;

            });
        }
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        const value = form.value;
        const category = this.categories.find(category => category.value == value.categoryId);
        this.count++;

        if (this.data.edit && this.item._id) {
            let price = value.price.replace(',', '');

            this.savedModuleData = value;
            this.savedModuleData.id = this.item._id;
            this.savedModuleData.bodytext = this.rteData;
            this.savedModuleData.price = +price;
            this.savedModuleData.groupUid = this.id;
            this.savedModuleData.categoryId = category._id;
        }
        else {
            this.savedModuleData = value;
            this.savedModuleData.id = this.id + this.count;
            this.savedModuleData.moduleNew = true;
            this.savedModuleData.bodytext = this.rteData;
            this.savedModuleData.groupUid = this.id;
            this.savedModuleData.categoryId = category._id;
        }
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

}
