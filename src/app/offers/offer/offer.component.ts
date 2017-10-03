import {Component, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Params} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {NgForm} from "@angular/forms";
import 'rxjs/Observable';

import {Offer} from "../offers.model";
import {Group} from "../groups.model";

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

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient) {
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
                    console.log(res);
                    this.item = res;
                    this.selectedSaler = this.item.offerDescription.saler[1].value;
                    this.offersModules = this.item.group;
                })
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
        console.log(ev);
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }
    onModuleEdit(moduleUid: number){
        console.log(moduleUid, 'edit');
    }

    addModule(groupUid: number) {
        console.log(groupUid, 'module add');
    }

}
