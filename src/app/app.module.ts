import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-router.module';

import {AppComponent} from './app.component';
import {
    CovalentExpansionPanelModule, CovalentLayoutModule, CovalentMediaModule, CovalentMenuModule,
    CovalentNotificationsModule
} from '@covalent/core';
import {CovalentHttpModule} from '@covalent/http';
import {CovalentHighlightModule} from '@covalent/highlight';
import {CovalentMarkdownModule} from '@covalent/markdown';
import {CovalentDynamicFormsModule} from '@covalent/dynamic-forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
    MdButtonModule, MdCardModule, MdGridListModule, MdIconModule, MdListModule, MdMenuModule, MdTabsModule,
    MdToolbarModule, MdTooltipModule
} from '@angular/material';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { ModulesComponent } from './modules/modules.component';
import { OffersComponent } from './offers/offers.component';
import { ClientsComponent } from './clients/clients.component';
import { SharedService } from './shared/shared.service';


@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ModulesComponent,
        OffersComponent,
        ClientsComponent
    ],
    imports: [
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        BrowserModule,
        AppRoutingModule,
        /** Material Modules */
        MdButtonModule,
        MdListModule,
        MdIconModule,
        MdCardModule,
        MdMenuModule,
        MdTabsModule,
        MdToolbarModule,
        MdGridListModule,
        MdTooltipModule,
        /** Covalent Modules */
        CovalentLayoutModule,
        CovalentExpansionPanelModule,
        CovalentNotificationsModule,
        CovalentMenuModule,
        CovalentMediaModule,
        CovalentHttpModule.forRoot(),
        CovalentHighlightModule,
        CovalentMarkdownModule,
        CovalentDynamicFormsModule
    ],
    providers: [SharedService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
