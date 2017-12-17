import {Component, HostBinding, OnInit, ViewContainerRef} from '@angular/core';
import {NgForm} from "@angular/forms";
import {slideInDownAnimation} from "../_animations/app.animations";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {SharedService} from "../shared/shared.service";
import {NewSellerComponent} from "./new-seller/new-seller.component";
import {MatDialog} from "@angular/material";
import {Apollo} from "apollo-angular";
import gql from "graphql-tag";

@Component({
    selector: 'app-sellers',
    templateUrl: './sellers.component.html',
    styleUrls: ['./sellers.component.css'],
    animations: [slideInDownAnimation]
})
export class SellersComponent implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    pageTitle = 'Sellers';
    title = 'List of sellers';
    editMode = false;
    // data: any[] = [
    //     {
    //         "name": "Martin Glatz",
    //         "uid": 1,
    //         "email": "martin.glatz@deepscreen.ch",
    //         "phone": "+41 43 255 68 68",
    //         "mobile": "+41 79 915 21 37"
    //     },
    //     {
    //         "name": "Simon Glatz",
    //         "uid": 2,
    //         "email": "simon.glatz@deepscreen.ch",
    //         "phone": "+41 43 255 68 68",
    //         "mobile": "+41 79 915 21 37"
    //     },
    //     {
    //         "name": "Lena Jung",
    //         "uid": 3,
    //         "email": "lena.jung@deepscreen.ch",
    //         "phone": "+41 43 255 68 68",
    //         "mobile": "+41 79 915 21 37"
    //     },
    //     {
    //         "name": "Sonia Kale",
    //         "uid": 4,
    //         "email": "sonia.kale@deepscreen.ch",
    //         "phone": "",
    //         "mobile": ""
    //     }
    // ];
    data;

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
        this.apollo.query({
            query: getSealerData
        }).subscribe(({data, loading}) => {
            console.log(data, loading);
            this.data = data
        });

        this.loadingService.resolveAll('modulesLoader');

    }

    onEdit(uid) {
        console.log(uid, 'edit');
        this.editMode = true
    }

    onSave(from: NgForm) {
        let value = from.value;
        this.editMode = false;
        console.log(value);
    }

    newSeller() {
        let dialogRef = this.dialog.open(NewSellerComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log(result);
                this.data.push(result);

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
                    console.log(res);
                    this.apollo.query({query: getSealerData, fetchPolicy: 'network-only'})
                        .subscribe(() => {
                            console.log('refresh done, our watchQuery will update')
                        });
                    this.data = this.apollo.watchQuery({query: getSealerData});
                });
            }
        })
    }

    onDelete(uid: number) {
        let id = uid;
        this._dialogService.openConfirm({
            message: 'Are you sure you want to remove this module?',
            viewContainerRef: this._viewContainerRef,
            title: 'Confirm remove',
            cancelButton: 'Cancel',
            acceptButton: 'Remove',
        }).afterClosed().subscribe((accept: boolean) => {
            if (accept) {
                let seller = this.data.filter(seller => seller.uid === id)[0];
                let sellerIndex = this.data.indexOf(seller);
                this.data.splice(sellerIndex, 1);
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
