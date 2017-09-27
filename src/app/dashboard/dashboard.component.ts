import {Component, OnChanges} from '@angular/core';
import {SharedService} from "../shared/shared.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
    pageTitle = 'Dashboard';

  constructor(private sharedService: SharedService){
      this.sharedService.changeTitle(this.pageTitle);
  }
}
