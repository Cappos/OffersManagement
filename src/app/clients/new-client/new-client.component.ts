import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {SharedService} from "../../shared/shared.service";
import {Router} from "@angular/router";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import createClient from "../../queries/createClient";
import fetchClients from "../../queries/fetchClients";
import {Apollo} from "apollo-angular";

@Component({
    selector: 'app-new-client',
    templateUrl: './new-client.component.html',
    styleUrls: ['./new-client.component.css']
})
export class NewClientComponent implements OnInit {

    pageTitle = 'Create new client';
    offers: any[] = [];

    constructor(private sharedService: SharedService, private router: Router, private loadingService: TdLoadingService, private apollo: Apollo) {
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
        const offers = this.offers.length ? this.offers : null;
        console.log(value);

        this.apollo.mutate({
            mutation: createClient,
            variables: {
                clientName: value.clientName,
                contactPerson: value.contactPerson,
                companyName: value.companyName,
                address: value.address,
                contactPhone: value.contactPhone,
                mobile: value.mobile,
                mail: value.mail,
                webSite: value.webSite,
                pib: value.pib,
                offers: offers
            },

            refetchQueries: [{
                query: fetchClients
            }]
        }).subscribe(() => {
            this.sharedService.sneckBarNotifications(`client created.`);
            this.router.navigate(['/clients']);
        });
    }
}
