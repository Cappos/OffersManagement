import {Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {MdDialog} from "@angular/material";
import 'rxjs/Observable';

import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {Group} from "../../offers/groups.model";
import {Module} from "../../modules/modules.model";

@Component({
    selector: 'app-new-chapter',
    templateUrl: './new-chapter.component.html',
    styleUrls: ['./new-chapter.component.css']
})

export class NewChapterComponent implements OnInit {
    pageTitle = 'Chapters';
    title = 'New chapter';
    item: Group;
    @Output() editMode = true;
    chaptersModules: Module[] = [];
    chapterPrice: number = 0;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private loadingService: TdLoadingService) {
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
        this.loadingService.resolveAll('modulesLoader');
    }

    onSave(form: NgForm) {
        const value = form.value;
        console.log(value);
    }

    onModuleRemove(moduleUid: number) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this module?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let module = this.chaptersModules.filter(module => module.uid === moduleUid)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);

                this.chaptersModules.splice(moduleIndex, 1);
            }
        });
    }

    addModule() {
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let modulePrices: any[] = [];
                let sum: number = 0;

                this.chaptersModules.push(result);

                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }

                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;


            }
        });
    }

}

