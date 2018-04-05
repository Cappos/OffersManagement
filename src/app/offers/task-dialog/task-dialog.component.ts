import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {MatDialog, MatDialogRef} from "@angular/material";

@Component({
    selector: 'app-task-dialog',
    templateUrl: './task-dialog.component.html',
    styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {

    savedPersonData;

    constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<TaskDialogComponent>) {
    }

    ngOnInit() {
    }

    onSave(form: NgForm) {
        this.savedPersonData = form.value;
        this.dialogRef.close(this.savedPersonData);
    }
}
