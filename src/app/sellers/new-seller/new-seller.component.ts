import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material";

@Component({
    selector: 'app-new-seller',
    templateUrl: './new-seller.component.html',
    styleUrls: ['./new-seller.component.css']
})
export class NewSellerComponent implements OnInit {
    savedSellerData;

    constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<NewSellerComponent>) {
    }

    ngOnInit() {
    }

    onSave(form: NgForm) {
        let value = form.value;
        this.savedSellerData = value;
        this.dialogRef.close(this.savedSellerData);
    }


}
