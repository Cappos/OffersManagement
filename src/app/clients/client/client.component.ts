import {Component, OnInit, Output} from '@angular/core';
import { Location } from '@angular/common';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {SharedService} from "../../shared/shared.service";
import {NgForm} from "@angular/forms";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {Apollo} from "apollo-angular";
import fetchClient from '../../queries/fetchClient';
import updateClient from '../../queries/updateClient';

@Component({
    selector: 'app-client',
    templateUrl: './client.component.html',
    styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
    pageTitle = 'Clients';
    id: number;
    item;
    offers: any[] =[];
    @Output() editMode = false;

    constructor(private route: ActivatedRoute, private sharedService: SharedService, private router: Router, private loadingService: TdLoadingService, private location: Location, private apollo: Apollo) {
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
                this.id = params['id'];
                this.editMode = !!params['edit'];

                this.apollo.watchQuery<any>({
                    query: fetchClient,
                    variables: {
                        id: this.id
                    },
                    fetchPolicy: 'network-only'
                }).valueChanges.subscribe(({data}) => {
                    this.item = data.client;
                    this.offers = this.item.offers;
                    this.loadingService.resolveAll('modulesLoader');
                });
            }
        );
    }

    onSave(form: NgForm) {
        const value = form.value;
        const offers = this.offers.length ? this.offers : null;

        this.apollo.mutate({
            mutation: updateClient,
            variables: {
                id: this.id,
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
            }
        }).subscribe(() => {
            this.editMode = false;
            this.sharedService.sneckBarNotifications(`client updated.`);
        });
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
