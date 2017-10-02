import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {StoreModule} from "@ngrx/store";
import {EffectsModule} from "@ngrx/effects";
import {AppRoutingModule} from './app-router.module';

import {AppComponent} from './app.component';
import {
CovalentDataTableModule, CovalentDialogsModule,
CovalentExpansionPanelModule, CovalentFileModule, CovalentLayoutModule, CovalentLoadingModule, CovalentMediaModule,
CovalentMenuModule,
CovalentNotificationsModule, CovalentPagingModule, CovalentSearchModule, CovalentStepsModule
} from '@covalent/core';
import {CovalentHttpModule} from '@covalent/http';
import {CovalentHighlightModule} from '@covalent/highlight';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentDynamicFormsModule} from '@covalent/dynamic-forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdButtonModule, MdCardModule, MdGridListModule, MdIconModule, MdListModule, MdMenuModule, MdOptionModule,
    MdTabsModule,
    MdToolbarModule, MdTooltipModule, MatSelectModule, MdCheckboxModule, MdSidenavModule, MdSlideToggleModule,
    MdAutocompleteModule, MdSelectModule, MdDialogModule, MdSnackBarModule, MdNativeDateModule, MdDatepickerModule,
    MdInputModule
} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { ModulesComponent } from './modules/modules.component';
import { OffersComponent } from './offers/offers.component';
import { ClientsComponent } from './clients/clients.component';
import { SharedService } from './shared/shared.service';
import {Ng2FilterPipeModule} from 'ng2-filter-pipe';
import { ModuleComponent } from './modules/module/module.component';
import {modulesReducer} from "./modules/store/modules.reducers";
import {ModulesEffects} from "./modules/store/modules.effects";
import {HttpClientModule} from "@angular/common/http";
import {RteComponent} from "./modules/module/rte/rte.component";
import {CurrencyPipe} from "./pipes/currency.pipe";
import { NewModuleComponent } from './modules/new-module/new-module.component';


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModulesComponent,
        OffersComponent,
        ClientsComponent,
        ModuleComponent,
        RteComponent,
        NewModuleComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        Ng2FilterPipeModule,
        StoreModule.forRoot({modulesList: modulesReducer}),
        EffectsModule.forRoot([ModulesEffects]),
        HttpClientModule,
        /** Material Modules */
        MdButtonModule,
        MdCheckboxModule,
        MdMenuModule,
        MdSidenavModule,
        MdIconModule,
        MdInputModule,
        MdListModule,
        MdCardModule,
        MdTabsModule,
        MdSlideToggleModule,
        MdAutocompleteModule,
        MdGridListModule,
        MdSelectModule,
        MdDialogModule,
        MdSnackBarModule,
        MdNativeDateModule,
        MdOptionModule,
        MdToolbarModule,
        MdTooltipModule,
        MatSelectModule,
        MdDatepickerModule,
        MdNativeDateModule,
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
        CovalentNotificationsModule
    ],
    providers: [SharedService, CurrencyPipe],
    bootstrap: [AppComponent]
})
export class AppModule {
}
