import {Component, OnInit} from '@angular/core';
import {SharedService} from "./shared/shared.service";
import gql from "graphql-tag";
import {Apollo} from "apollo-angular";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    pageTitle;

    constructor(private sharedService: SharedService, private apollo: Apollo) {
        // get page title on page change
        this.sharedService.titleChanged.subscribe(title => this.pageTitle = title);
    }

    ngOnInit() {
        this.apollo.query({
            query
        }).subscribe(({data, loading}) => {
            console.log(data, loading);
        });
    }
}

const query = gql`
    {
        songs {
            id
            title
            lyrics {
                content
            }
        }
    }
`;
