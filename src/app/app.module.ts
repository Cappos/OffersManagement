import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {AppRoutingModule} from './app-router.module';

import {AppComponent} from './app.component';
import {
    CovalentCommonModule,
    CovalentDataTableModule, CovalentDialogsModule,
    CovalentExpansionPanelModule, CovalentFileModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
    CovalentMenuModule,
    CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule, CovalentStepsModule, TdLoadingService
} from '@covalent/core';
import {CovalentHttpModule} from '@covalent/http';
import {CovalentHighlightModule} from '@covalent/highlight';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentDynamicFormsModule} from '@covalent/dynamic-forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MatButtonModule, MatCardModule, MatGridListModule, MatIconModule, MatListModule, MatMenuModule, MatOptionModule,
    MatTabsModule,
    MatToolbarModule, MatTooltipModule, MatCheckboxModule, MatSidenavModule, MatSlideToggleModule,
    MatAutocompleteModule, MatSelectModule, MatDialogModule, MatSnackBarModule, MatNativeDateModule, MatDatepickerModule,
    MatInputModule, MatExpansionModule, MatChipsModule
} from '@angular/material';
import {MatFormFieldModule} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModulesComponent } from './modules/modules.component';
import { OffersComponent } from './offers/offers.component';
import { ClientsComponent } from './clients/clients.component';
import { SharedService } from './shared/shared.service';
import {Ng2FilterPipeModule} from 'ng2-filter-pipe';
import { ModuleComponent } from './modules/module/module.component';
import {modulesReducer} from './modules/store/modules.reducers';
import {ModulesEffects} from './modules/store/modules.effects';
import {HttpClientModule} from '@angular/common/http';
import {RteComponent} from './modules/module/rte/rte.component';
import { NewModuleComponent } from './modules/new-module/new-module.component';
import {clientsReducer} from './clients/store/clients.reducers';
import {ClientsEffects} from './clients/store/clients.effects';
import { ClientComponent } from './clients/client/client.component';
import { NewClientComponent } from './clients/new-client/new-client.component';
import { NewOfferComponent } from './offers/new-offer/new-offer.component';
import {offersReducer} from './offers/store/offers.reducers';
import {OffersEffects} from './offers/store/offers.effects';
import { OfferComponent } from './offers/offer/offer.component';
import { EditModuleDialogComponent } from './modules/edit-module-dialog/edit-module-dialog.component';
import { ChaptersComponent } from './chapters/chapters.component';
import {chaptersReducer} from './chapters/store/chapters.reducers';
import {ChaptersEffects} from './chapters/store/chapters.effects';
import { ChapterComponent } from './chapters/chapter/chapter.component';
import { NewChapterComponent } from './chapters/new-chapter/new-chapter.component';
import { ChapterDialogComponent } from './chapters/chapter-dialog/chapter-dialog.component';
import { AdditionalDataComponent } from './additional-data/additional-data.component';
import { PageComponent } from './additional-data/page/page.component';
import { SellersComponent } from './sellers/sellers.component';
import { NewSellerComponent } from './sellers/new-seller/new-seller.component';
import { ModuleListDialogComponent } from './modules/module-list-dialog/module-list-dialog.component';
import { ChapterListDialogComponent } from './chapters/chapter-list-dialog/chapter-list-dialog.component';
import {DragulaModule} from 'ng2-dragula';
import {MediaBrowserComponent} from './media-browser/media-browser.component';
import {DataService} from './shared/data.service';
import { PageListDialogComponent } from './additional-data/page-list-dialog/page-list-dialog.component';
import { PageEditDialogComponent } from './additional-data/page-edit-dialog/page-edit-dialog.component';
import {Apollo, ApolloModule} from "apollo-angular";
import {DataNodeService} from "./dataNode.service";
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from "apollo-cache-inmemory";
import {NgPipesModule} from 'ngx-pipes';
import { PdfComponent } from './pdf/pdf.component';



@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModulesComponent,
        OffersComponent,
        ClientsComponent,
        ModuleComponent,
        RteComponent,
        NewModuleComponent,
        ClientComponent,
        NewClientComponent,
        NewOfferComponent,
        OfferComponent,
        EditModuleDialogComponent,
        ChaptersComponent,
        ChapterComponent,
        NewChapterComponent,
        ChapterDialogComponent,
        AdditionalDataComponent,
        PageComponent,
        SellersComponent,
        NewSellerComponent,
        ModuleListDialogComponent,
        ChapterListDialogComponent,
        MediaBrowserComponent,
        PageListDialogComponent,
        PageEditDialogComponent,
        PdfComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        Ng2FilterPipeModule,
        StoreModule.forRoot({modulesList: modulesReducer, clientsList: clientsReducer, offersList: offersReducer, chaptersList: chaptersReducer}),
        EffectsModule.forRoot([ModulesEffects, ClientsEffects, OffersEffects, ChaptersEffects]),
        HttpClientModule,
        DragulaModule,
        NgPipesModule,
        /** Material Modules */
        MatButtonModule,
        MatCheckboxModule,
        MatMenuModule,
        MatSidenavModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatListModule,
        MatCardModule,
        MatTabsModule,
        MatSlideToggleModule,
        MatAutocompleteModule,
        MatGridListModule,
        MatSelectModule,
        MatDialogModule,
        MatSnackBarModule,
        MatNativeDateModule,
        MatOptionModule,
        MatToolbarModule,
        MatTooltipModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatExpansionModule,
        MatChipsModule,
        /** Covalent Modules */
        CovalentLoadingModule,
        CovalentLayoutModule,
        CovalentStepsModule,
        CovalentHttpModule.forRoot(),
        CovalentHighlightModule,
        CovalentMarkdownModule,
        CovalentDynamicFormsModule,
        CovalentFileModule,
        CovalentSearchModule,
        CovalentDataTableModule,
        CovalentPagingModule,
        CovalentDialogsModule,
        CovalentExpansionPanelModule,
        CovalentMediaModule,
        CovalentMenuModule,
        CovalentNotificationsModule,
        CovalentCommonModule,
        /** Apollo*/
        HttpClientModule,
        ApolloModule,
        HttpLinkModule
    ],
    providers: [SharedService, TdLoadingService, DataService, DataNodeService, NgPipesModule],
    entryComponents: [EditModuleDialogComponent, ChapterDialogComponent, NewSellerComponent, ModuleListDialogComponent, ChapterListDialogComponent, MediaBrowserComponent, PageListDialogComponent, PageEditDialogComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        apollo: Apollo,
        httpLink: HttpLink
    ) {
        apollo.create({
            // By default, this client will send queries to the
            // `/graphql` endpoint on the same host
            link: httpLink.create({}),
            cache: new InMemoryCache()
        });
    }
}
