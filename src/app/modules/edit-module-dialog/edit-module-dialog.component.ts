import {Component, Inject, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Module} from "../modules.model";
import {NgForm} from "@angular/forms";

import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";

@Component({
    selector: 'app-edit-module-dialog',
    templateUrl: './edit-module-dialog.component.html',
    styleUrls: ['./edit-module-dialog.component.css']
})
export class EditModuleDialogComponent implements OnInit {
    pageTitle = 'Modules';
    id: number;
    item: Module;
    moduleState: Observable<any>;
    rteData = '';
    groups: any[] = [
        {name: 'Technical', value: 1},
        {name: 'Design', value: 2},
        {name: 'Optimization', value: 3},
        {name: 'SEO', value: 4}

    ];

    savedModuleData;
    itemSaved = false;
    selectedGroup;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, public dialog: MatDialog, private _dialogService: TdDialogService, public dialogRef: MatDialogRef<EditModuleDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService) {

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
        if (this.data.edit) {
            this.id = this.data.moduleUid;
            this.moduleState = this.httpClient.get<Module>('http://wrenchweb.com/http/moduleData', {
                observe: 'body',
                responseType: 'json'
            });
            this.moduleState.take(1).subscribe((res) => {
                this.item = res;
                this.rteData = this.item.bodytext;
                this.selectedGroup = this.item.groupUid;
            })
        }
        else {
            this.selectedGroup = this.data.groupUid;
            console.log(this.selectedGroup, 'else');
        }
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        console.log('saved');
        this.savedModuleData = form.value;
        this.savedModuleData.bodytext = this.rteData;
        this.itemSaved = true;
    }

    keyupHandler(ev) {
        this.rteData = ev;
    }

}
