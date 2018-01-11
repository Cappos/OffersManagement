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
    count;

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
        // if edit module that is in database
        if (this.data.edit && this.data.moduleUid) {
            this.id = this.data.moduleUid;
            const chapterId = this.data.chapterId;
            this.apollo.watchQuery<any>({
                query: fetchModule,
                variables: {
                    id: this.id
                },
                fetchPolicy: 'network-only'
            }).valueChanges.subscribe(({data}) => {
                this.item = data.module;
                this.rteData = this.item.bodytext;
                this.categories = data.categories;
                this.selectedChapter = chapterId;
                if (this.item.categoryId) {
                    this.selectedGroup = this.item.categoryId[0].value;
                }
                this.loadingService.resolveAll('modulesLoader');
            });

        }
        // if edit module that is not yet saved
        else if (this.data.edit) {
            if (this.data.groupUid) {
                this.id = this.data.groupUid;
            }
            this.apollo.watchQuery<any>({
                query: fetchCategories
            }).valueChanges.subscribe(({data}) => {
                this.categories = data.categories;
                this.item = this.data.moduleNew;
                this.rteData = this.item.bodytext;
                if (this.item.categoryId) {
                    this.selectedGroup = this.item.categoryId[0].value;
                }
                this.loadingService.resolveAll('modulesLoader');
            });
        }
        // if this is a new module
        else {
            this.id = Math.random();
            this.apollo.watchQuery<any>({
                query: fetchCategories,
                fetchPolicy: 'network-only'
            }).valueChanges.subscribe(({data}) => {
                this.categories = data.categories;
                this.rteData = ' ';
                this.loadingService.resolveAll('modulesLoader');
            });
        }
    }

    onSave(form: NgForm) {
        const value = form.value;
        const category = this.categories.find(category => category.value == value.categoryId) || null;
        let price = value.price;
        let newPrice;

        // Format price
        if (price.length >= 6) {
            newPrice = price.replace(/,/g, '');
        }
        else {
            newPrice = price;
        }

        // Make temp id
        this.count = Math.random();

        this.savedModuleData = value;

        if (this.data.edit && this.item._id && !this.item.moduleNew) {
            this.savedModuleData.moduleNew = false;
            this.savedModuleData._id = this.id;
            this.savedModuleData.price = +newPrice;
        }
        else if (this.data.edit) {
            this.savedModuleData._id = this.data.moduleNew.id;
            this.savedModuleData.moduleNew = true;
            this.savedModuleData.price = +newPrice;
        }
        else {
            this.savedModuleData._id = this.id + this.count;
            this.savedModuleData.moduleNew = true;
        }

        this.savedModuleData.bodytext = this.rteData;
        this.savedModuleData.groupUid = this.data.groupUid;
        // Set category if is selected
        if (category) {
            this.savedModuleData.categoryId = category._id
        }
        this.itemSaved = true;
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }
}