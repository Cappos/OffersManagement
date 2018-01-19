import {Component, Inject, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {Apollo} from "apollo-angular";
import getPage from '../../queries/fetchPage';
import * as _ from "lodash";

@Component({
    selector: 'app-page-edit-dialog',
    templateUrl: './page-edit-dialog.component.html',
    styleUrls: ['./page-edit-dialog.component.css']
})

export class PageEditDialogComponent implements OnInit {
    id;
    item;
    rteData = '';
    savedPageData;
    itemSaved = false;
    editMode = true;
    order;

    constructor(public dialog: MatDialog, private _dialogService: TdDialogService, public dialogRef: MatDialogRef<PageEditDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService, private apollo: Apollo) {

        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
    }

    ngOnInit() {
        if (this.data.edit && !this.data.pageNew) {
            this.id = this.data.pageUid;
            this.apollo.watchQuery<any>({
                query: getPage,
                variables: {
                    id: this.id
                }
            }).valueChanges.subscribe(({data}) => {
                this.item = _.cloneDeep(data.page);
                this.rteData = this.item.bodytext;
                this.order = this.item.order;
                this.loadingService.resolveAll('modulesLoader');
            });
        }
        else if(this.data.pageUid){
            this.id = this.data.pageUid;
            this.item = this.data.pageNew;
            this.rteData = this.item.bodytext;
            this.order = this.item.order;
            this.loadingService.resolveAll('modulesLoader');
        }
        else {
            this.id = Math.random();
            this.rteData = ' ';
            this.loadingService.resolveAll('modulesLoader');
        }
    }

    onSave(form: NgForm) {
        console.log('saved');
        this.savedPageData = form.value;
        this.savedPageData.bodytext = this.rteData;
        this.savedPageData._id = this.id;
        this.savedPageData.type = 2;
        this.savedPageData.order = this.order;
        this.itemSaved = true;
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    closeDialog() {
        this._dialogService.closeAll();
    }

}