import {Component, HostBinding, OnInit} from '@angular/core';
import {SharedService} from "../shared/shared.service";
import {LoadingMode, LoadingType, TdLoadingService} from "@covalent/core";
import {slideInDownAnimation} from "../_animations/app.animations";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import {Store} from "@ngrx/store";
import 'rxjs/operator/take';

import * as fromOffers from "../offers/store/offers.reducers";
import * as OffersActions from "../offers/store/offers.actions";
import {Router} from "@angular/router";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    animations: [slideInDownAnimation]
})
export class DashboardComponent implements OnInit {
    @HostBinding('@routeAnimation') routeAnimation: boolean = true;
    @HostBinding('class.td-route-animation') classAnimation: boolean = true;

    pageTitle = 'Dashboard';
    offersData;
    chaptersData;
    sellersData;
    clientsData;
    offersState: Observable<fromOffers.State>;

    constructor(private sharedService: SharedService, private loadingService: TdLoadingService, private httpClient: HttpClient, private store: Store<fromOffers.FeatureState>, private router: Router) {
        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');
        this.sharedService.changeTitle(this.pageTitle);
        this.store.dispatch(new OffersActions.GetOffers());
        this.offersState = this.store.select('offersList');
    }

    ngOnInit() {
        this.offersState.take(2).subscribe((fromOffers: fromOffers.State) => {
            this.offersData = fromOffers.offers;
            this.loadingService.resolveAll('modulesLoader');
        });
    }

    selectOffer(offerId: number) {
        console.log(offerId, 'offer selected');
        this.router.navigate(['/offers/' + offerId]);
    }
}
