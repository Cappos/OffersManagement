import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {NgForm} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {DataService} from "../../shared/data.service";


@Component({
    selector: 'app-page-edit-dialog',
    templateUrl: './page-edit-dialog.component.html',
    styleUrls: ['./page-edit-dialog.component.css']
})

export class PageEditDialogComponent implements OnInit {
    id: number;
    item;
    pageState: Observable<any>;
    rteData = '';
    savedPageData;
    itemSaved = false;
    editMode = true;

    constructor(private dataService: DataService, public dialog: MatDialog, private _dialogService: TdDialogService, public dialogRef: MatDialogRef<PageEditDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService) {

        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
    }

    ngOnInit() {
        if (this.data.edit) {
            this.id = this.data.pageUid;
            this.pageState = this.dataService.getPageData();

            this.pageState.take(1).subscribe((res) => {
                this.item = res;
                this.rteData = this.item.bodytext;
            })
        }

        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        console.log('saved');
        this.savedPageData = form.value;
        this.savedPageData.bodytext = this.rteData;
        this.savedPageData.uid = this.id || 120;
        this.savedPageData.type = 2;
        this.itemSaved = true;
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

    closeDialog() {
        this._dialogService.closeAll();
    }

}