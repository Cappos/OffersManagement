import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {ModulesComponent} from './modules/modules.component';
import {OffersComponent} from './offers/offers.component';
import {ClientsComponent} from './clients/clients.component';
import {ModuleComponent} from "./modules/module/module.component";
import {NewModuleComponent} from "./modules/new-module/new-module.component";
import {ClientComponent} from "./clients/client/client.component";
import {NewClientComponent} from "./clients/new-client/new-client.component";
import {NewOfferComponent} from "./offers/new-offer/new-offer.component";
import {OfferComponent} from "./offers/offer/offer.component";
import {ChaptersComponent} from "./chapters/chapters.component";
import {ChapterComponent} from "./chapters/chapter/chapter.component";
import {NewChapterComponent} from "./chapters/new-chapter/new-chapter.component";
import {AdditionalDataComponent} from "./additional-data/additional-data.component";
import {PageComponent} from "./additional-data/page/page.component";
import {SellersComponent} from "./sellers/sellers.component";
import {NewSellerComponent} from "./sellers/new-seller/new-seller.component";

const appRoutes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'chapters', component: ChaptersComponent},
    {path: 'chapters/:id', component: ChapterComponent},
    {path: 'chapters/:id/:edit', component: ChapterComponent},
    {path: 'newChapter', component: NewChapterComponent},
    {path: 'modules', component: ModulesComponent},
    {path: 'modules/:id', component: ModuleComponent},
    {path: 'modules/:id/:edit', component: ModuleComponent},
    {path: 'newModule', component: NewModuleComponent},
    {path: 'offers', component: OffersComponent},
    {path: 'offers/:id', component: OfferComponent},
    {path: 'offers/:id/:edit', component: OfferComponent},
    {path: 'newOffer', component: NewOfferComponent},
    {path: 'newOffer/:clientId', component: NewOfferComponent},
    {path: 'clients', component: ClientsComponent},
    {path: 'clients/:id', component: ClientComponent},
    {path: 'clients/:id/:edit', component: ClientComponent},
    {path: 'newClient', component: NewClientComponent},
    {
        path: 'additionalData', component: AdditionalDataComponent, children: [
        {path: 'page/:id', component: PageComponent},
        {path: 'page/:id?/:edit', component: PageComponent},
        {path: 'newPage', component: PageComponent}
    ]
    },
    {path: 'sellers', component: SellersComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}
