import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ModulesComponent} from './modules/modules.component';
import {OffersComponent} from './offers/offers.component';
import {ClientsComponent} from './clients/clients.component';

const appRoutes: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'modules', component: ModulesComponent},
    { path: 'offers', component: OffersComponent},
    { path: 'clients', component: ClientsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
