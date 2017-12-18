import {Component, HostBinding, OnInit, ViewContainerRef} from '@angular/core';
import {NgForm} from '@angular/forms';
import {slideInDownAnimation} from '../_animations/app.animations';
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from '@covalent/core';
import {SharedService} from '../shared/shared.service';
import {NewSellerComponent} from './new-seller/new-seller.component';
import {MatDialog} from '@angular/material';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
    selector: 'app-sellers',
    templateUrl: './sellers.component.html',
    styleUrls: ['./sellers.component.css'],
    animations: [slideInDownAnimation]
})
export class SellersComponent implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('class.td-route-animation') classAnimation = true;

    pageTitle = 'Sellers';
    title = 'List of sellers';
    editMode = false;
    data: any;

    constructor(private loadingService: TdLoadingService, private sharedService: SharedService, private dialog: MatDialog, private _dialogService: TdDialogService, private _viewContainerRef: ViewContainerRef, private apollo: Apollo) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit(): void {
        this.apollo.watchQuery<any>({
            query: getSealerData
        }).valueChanges.subscribe(({data}) => {
            this.data = data.sealers;
        });

        this.loadingService.resolveAll('modulesLoader');
    }

    onEdit(uid) {
        console.log(uid, 'edit');
        this.editMode = true;
    }

    onSave(from: NgForm) {
        const value = from.value;
        this.editMode = false;
        console.log(value);
    }

    newSeller() {
        const dialogRef = this.dialog.open(NewSellerComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.apollo.mutate({
                    mutation: addSealer,
                    variables: {
                        name: result.name,
                        email: result.email,
                        phone: result.phone,
                        mobile: result.mobile,
                        value: result.value
                    },
                    refetchQueries: [{
                        query: getSealerData
                    }]
                }).subscribe((res) => {
                    this.sharedService.sneckBarNotifications(`user ${res.data.addSealer.name} created.`);
                });
            }
        });
    }

    onDelete(id: string) {
        this._dialogService.openConfirm({
            message: 'Are you sure you want to Delete this Sealer?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                this.apollo.mutate({
                    mutation: removeSealer,
                    variables: {
                        id: id,
                    },
                    refetchQueries: [{
                        query: getSealerData
                    }]
                }).subscribe((res) => {
                    this.sharedService.sneckBarNotifications(`user ${res.data.deleteSealer.name} deleted!!!.`);
                });
            }
        });

    }
}
const getSealerData = gql`
    {
        sealers{
            _id
            name
            email
            phone
            mobile
            value
        }
    }
`;
const addSealer = gql`
    mutation AddSealer($name: String!, $email: String!, $phone: String, $mobile: String, $value: Int!) {
        addSealer(name: $name, email: $email, phone: $phone, mobile: $mobile, value: $value){
            _id,
            name
            email
            phone
            mobile
            value
        }
    }
`;

const removeSealer = gql`
    mutation DeleteSealer($id: ID!) {
        deleteSealer(id: $id){
            name
        }
    }
`;
