import {Component} from '@angular/core';
import {SharedService} from "./shared/shared.service";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    pageTitle;

    constructor(private sharedService: SharedService) {
        // get page title on page change
        this.sharedService.titleChanged.subscribe(title => this.pageTitle = title);
    }
}
