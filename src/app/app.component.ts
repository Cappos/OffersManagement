import {Component, OnInit} from '@angular/core';
import {SharedService} from "./shared/shared.service";
import {AuthService} from "./auth/auth.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pageTitle;
    localStorageMaxTime: any = 2;
    date: any = new Date().getTime();
    setupTime: any = localStorage.getItem('created');

    constructor(private sharedService: SharedService, private authService: AuthService, private router: Router) {
        //Check user login
        if ((this.date - this.setupTime) > this.localStorageMaxTime * 60 * 60 * 1000) {
            localStorage.clear();
        }
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
        }

        // get page title on page change
        this.sharedService.titleChanged.subscribe(title => this.pageTitle = title);
    }

    ngOnInit() {

    }

    onLogout() {
        this.authService.logout();
    }
}