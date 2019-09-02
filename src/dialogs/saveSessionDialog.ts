import { Component } from "@angular/core";

import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "save-session-dialog",
    templateUrl: "./saveSessionDialog.html",
    styleUrls: ["./saveSessionDialog.css"]
})
export class InputSessionNameDialogComponent {
	isSuccess;
	sessionName;
	sessionDescription;
    constructor(private modalService: NgbModal) {}
    open(content) {
        this.modalService
            .open(content, { ariaLabelledBy: "modal-basic-title" })
            .result.then(
                result => {
                    this.isSuccess = true;
                },
                reason => {
                    this.isSuccess = false;
                }
            );
    }
}
