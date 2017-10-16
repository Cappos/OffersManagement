import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import {Observable} from "rxjs";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {HttpClient} from "@angular/common/http";
import {Client} from "../client.model";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    pageTitle = 'Clients';
    id: number;
    item;
    clientState: Observable<any>;
    @Output() editMode = false;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private httpClient: HttpClient, private router: Router, private loadingService: TdLoadingService, private location: Location) {
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
                this.id = +params['id'];
                this.editMode = !!params['edit'];
                this.clientState = this.httpClient.get<Client>('http://wrenchweb.com/http/clientData', {
                    observe: 'body',
                    responseType: 'json'
                });
                this.clientState.take(1).subscribe((res) => {
                    this.item = res;
                });
                this.loadingService.resolveAll('modulesLoader');
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        console.log(value);
        this.editMode = false;
    }

    onEdit() {
        console.log('edit');
        this.editMode = true
    }

    selectOffer(offerId: number) {
        console.log(offerId, 'offer selected');
        this.router.navigate(['/offers/' + offerId]);
    }

    addOffer(clientId: number) {
        console.log(clientId);
        this.router.navigate(['/newOffer/' + clientId]);
    }

    goBack(){
        this.location.back();
    }


}
