import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ModulesComponent} from './modules/modules.component';
import {OffersComponent} from './offers/offers.component';
import {ClientsComponent} from './clients/clients.component';
import {ModuleComponent} from "./modules/module/module.component";
import {NewModuleComponent} from "./modules/new-module/new-module.component";

const appRoutes: Routes = [
    { path: '', component: DashboardComponent},
    { path: 'modules', component: ModulesComponent},
    { path: 'modules/:id', component: ModuleComponent},
    { path: 'new', component: NewModuleComponent},
    { path: 'offers', component: OffersComponent},
    { path: 'clients', component: ClientsComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
