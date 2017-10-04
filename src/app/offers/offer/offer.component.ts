import {Component, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import {MdDialog} from "@angular/material";
import 'rxjs/Observable';

import {Offer} from "../offers.model";
import {Group} from "../groups.model";
import {EditModuleDialogComponent} from "../../modules/edit-module-dialog/edit-module-dialog.component";

@Component({
    selector: 'app-offer',
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.css']
})
export class OfferComponent implements OnInit {
    pageTitle = 'Offers';
    id: number;
    item;
    offerState: Observable<any>;
    @Output() editMode = false;
    selectedSaler;
    offersModules: Group[];
    editModuleGroup: number;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private dialog: MdDialog) {
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.route.params.subscribe(
            (params: Params) => {
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.offerState = this.httpClient.get<Offer>('http://wrenchweb.com/http/offerData', {
                    observe: 'body',
                    responseType: 'json'
                });
                this.offerState.take(1).subscribe((res) => {
                    this.item = res;
                    this.selectedSaler = this.item.offerDescription.saler[1].value;
                    this.offersModules = this.item.groups;
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
                groupUid: groupUid
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                let group = this.offersModules.filter(group => group.uid === result.groupUid)[0];
                let groupIndex = this.offersModules.indexOf(group);
                let module = this.offersModules[groupIndex].modules.filter(module => module.name === result.name)[0];
                let moduleIndex = this.offersModules[groupIndex].modules.indexOf(module);

                if (result.groupUid === this.editModuleGroup) {
                    this.offersModules[groupIndex].modules[moduleIndex] = result;
                }
                else {
                    let groupOld = this.offersModules.filter(group => group.uid === this.editModuleGroup)[0];
                    let groupOldIndex = this.offersModules.indexOf(groupOld);
                    let moduleOld = this.offersModules[groupOldIndex].modules.filter(module => module.name === result.name)[0];
                    let moduleOldIndex = this.offersModules[groupOldIndex].modules.indexOf(moduleOld);

                    this.offersModules[groupOldIndex].modules.splice(moduleOldIndex, 1);
                    this.offersModules[groupIndex].modules.push(result);
                }

            }
        });

    }

    addModule(groupUid: number) {
        console.log(groupUid, 'module add');
    }

}
