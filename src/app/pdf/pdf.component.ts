import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-pdf',
    templateUrl: './pdf.component.html',
    styleUrls: ['./pdf.component.css']
})
export class PdfComponent implements OnInit {

    @Input() offerData: any;
    @Input() offerGroups: any;

    constructor() {
    }

    ngOnInit() {
        console.log(this.offerData);
        console.log(this.offerGroups);
    }

    public downloadPDF() {
        // return xepOnline.Formatter.Format('content', {render: 'newwin'});
        return xepOnline.Formatter.Format('content', {render: 'download', filename: this.offerData.offerNumber});
    }
}
