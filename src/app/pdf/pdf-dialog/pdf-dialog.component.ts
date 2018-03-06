import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {LoadingMode, LoadingType, TdDialogService, TdLoadingService} from "@covalent/core";
import {SharedService} from "../../shared/shared.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as FileSaver from 'file-saver';


@Component({
    selector: 'app-pdf-dialog',
    templateUrl: './pdf-dialog.component.html',
    styleUrls: ['./pdf-dialog.component.scss']
})
export class PdfDialogComponent implements OnInit {
    pageTitle = 'PDF view';
    offerData: any;
    offerGroups: any;
    @ViewChild('pdfContainer') pdfContent;

    constructor(private sharedService: SharedService, public dialog: MatDialog, private _dialogService: TdDialogService, public dialogRef: MatDialogRef<PdfDialogComponent>, @Inject(MAT_DIALOG_DATA) private data: any, private loadingService: TdLoadingService, private http: HttpClient) {

        this.loadingService.create({
            name: 'modulesLoader',
            type: LoadingType.Circular,
            mode: LoadingMode.Indeterminate,
            color: 'accent',
        });
        this.loadingService.register('modulesLoader');

        this.sharedService.changeTitle(this.pageTitle);
    }

    ngOnInit() {
        this.offerData = this.data.offer;
        this.offerGroups = this.data.groups;
        console.log(this.offerData);
        console.log(this.pdfContent);
        this.loadingService.resolveAll('modulesLoader');
    }

    public downloadPDF() {
        return xepOnline.Formatter.Format('content', {
            pageMarginLeft: '0',
            pageMarginRight: '0',
            pageWidth: '210mm',
            pageHeight: '297mm',
            render: 'download',
            filename: this.offerData.offerNumber
        });
    }

    public generatePDF() {
        this.loadingService.register('modulesLoader');


        const data = this.pdfContent.nativeElement.innerHTML; // get pdf content

        // Replace all blank spaces
        const stripData = data
            .replace(/(_ngcontent-\w+-\w+="(.|\n)*?"|_ngcontent-\w+="(.|\n)*?"|_ngcontent-(\w+-\w+)|ng-(\w+))/g, '')
            .replace(/\n/g, "")
            .replace(/[\t ]+\</g, "<")
            .replace(/\>[\t ]+\</g, "><")
            .replace(/\>[\t ]+$/g, ">");

        // Send data to server for pdf generation
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.http.post('/pdf', {data: stripData}, {headers: headers, responseType: 'blob'}).subscribe(data => {

            // download pdf file from server
            let blob = new Blob([data], {
                type: 'application/pdf' // must match the Accept type
            });
            let filename = 'offer.pdf'; // set download file name
            FileSaver.saveAs(blob, filename);
            this.loadingService.resolveAll('modulesLoader');
        });
    }

}
