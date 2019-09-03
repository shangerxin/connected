import { Component, Output, EventEmitter } from "@angular/core";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
    selector: "ng-save-session-dialog",
    templateUrl: "./saveSessionDialog.html",
    styleUrls: ["./saveSessionDialog.css"]
})
export class InputSessionNameDialogComponent {
    sessionName;
    sessionDescription;
    @Output()
    saveSessionEvent = new EventEmitter<any>();

    constructor(private modalService: NgbModal) {}
    open(content) {
        this.modalService
            .open(content, { ariaLabelledBy: "modal-basic-title" })
            .result.then(
                () => {
                    this.saveSessionEvent.emit({
                        name: this.sessionName,
                        description: this.sessionDescription
                    });
                    this.clear();
                },
                () => {
                    this.clear();
                }
            );
    }

    protected clear() {
        this.sessionName = null;
        this.sessionDescription = null;
    }
}
