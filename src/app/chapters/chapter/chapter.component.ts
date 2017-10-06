import {Component, OnInit, Output, ViewContainerRef} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {MdDialog} from "@angular/material";
import 'rxjs/Observable';

import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";
import {TdDialogService} from "@covalent/core";
import {Group} from "../../offers/groups.model";
import {Module} from "../../modules/modules.model";

@Component({
    selector: 'app-chapter',
    templateUrl: './chapter.component.html',
    styleUrls: ['./chapter.component.css']
})

export class ChapterComponent implements OnInit {
    pageTitle = 'Offers';
    id: number;
    item;
    chapterState: Observable<any>;
    @Output() editMode = false;
    chaptersModules: Module[];
    editModuleGroup: number;
    chapterPrice: number;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MdDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef) {
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.chapterState = this.httpClient.get<Group>('http://wrenchweb.com/http/chapterData', {
                    observe: 'body',
                    responseType: 'json'
                });
                this.chapterState.take(1).subscribe((res) => {
                    this.item = res;
                    this.chaptersModules = this.item.modules;
                    this.chapterPrice = this.item.subTotal;
                })
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        this.editMode = false;
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    onModuleEdit(moduleUid: number, groupUid: number) {
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                moduleUid: moduleUid,
                groupUid: groupUid,
                edit: true
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let module = this.chaptersModules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.chaptersModules.indexOf(module);
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update module after edit if parent group not change
                if (result.groupUid === this.editModuleGroup) {
                    this.chaptersModules[moduleIndex] = result;
                }
                // update module after edit if parent group change
                else {
                    let moduleOld = this.chaptersModules.filter(module => module.name === result.name)[0];
                    let moduleOldIndex = this.chaptersModules.indexOf(moduleOld);

                    this.chaptersModules.splice(moduleOldIndex, 1);
                }

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
            }
        });
    }

    onModuleRemove(moduleUid: number, groupUid: number) {
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
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update modules lis after module delete
                this.chaptersModules.splice(moduleIndex, 1);

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                if (modulePrices.length) {
                    sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                }
                else {
                    sum = 0;
                }
                this.chapterPrice = sum;
            }
        });
    }

    addModule(groupUid: number) {
        this.editModuleGroup = groupUid;
        let dialogRef = this.dialog.open(EditModuleDialogComponent, {
            data: {
                groupUid: groupUid,
                edit: false
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let modulePrices: any[] = [];
                let sum: number = 0;

                // update modules lis after adding module
                this.chaptersModules.push(result);

                // update chapter price
                for (let m in this.chaptersModules) {
                    modulePrices.push(this.chaptersModules[m].price);
                }
                sum = modulePrices.reduce((a, b) => parseInt(a) + parseInt(b));
                this.chapterPrice = sum;
            }
        });
    }

}
