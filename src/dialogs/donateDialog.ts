import { Component, Output, EventEmitter } from "@angular/core";

import { DonateVendors, CommandTypes } from "../environments/globalConstTypes";
import { NgbActiveModal, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BrowserService } from "../services/browserService";
import { CommandService } from "../services/commandService";

@Component({
    selector: "ng-donation-dialog",
    templateUrl: "./donateDialog.html",
    styleUrls: ["./donateDialog.css"]
})
export class DonateDialogComponent {
    public amount;
    public vendor;
    protected paypalDonationLinks = {
        3: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=SDPLY5RM6H2HW&currency_code=USD&amount=3&source=url",
        5: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=SDPLY5RM6H2HW&currency_code=USD&amount=5&source=url",
        10: "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=SDPLY5RM6H2HW&currency_code=USD&amount=10&source=url",
        any:
            "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=SDPLY5RM6H2HW&currency_code=USD&source=url"
    };
    constructor(
        private modalService: NgbModal,
		private browserService: BrowserService,
		private commandService:CommandService
    ) {}
    public amounts = [3, 5, 10, "any"];
    public async onClickPaypal(i, qrcontent) {
		this.commandService.commandSubject.next({
            type: CommandTypes.donate,
            args: {vendor:DonateVendors.paypal}
        });
        this.dispatchDonate(this.amounts[i], DonateVendors.paypal, qrcontent);
    }

    public async onClickAlipay(i, qrcontent) {
		this.commandService.commandSubject.next({
            type: CommandTypes.donate,
            args: {vendor:DonateVendors.alipay}
        });
        this.dispatchDonate(this.amounts[i], DonateVendors.alipay, qrcontent);
    }

    public async onClickWechat(i, qrcontent) {
		this.commandService.commandSubject.next({
            type: CommandTypes.donate,
            args: {vendor:DonateVendors.wechat}
        });
        this.dispatchDonate(this.amounts[i], DonateVendors.wechat, qrcontent);
	}

	public async open(content){
		this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
	}

    protected async dispatchDonate(amount, vendor, qrcontent) {
        this.amount = amount;
        this.vendor = vendor;
        if (vendor === DonateVendors.paypal) {
            this.browserService.openUrlInNewWindow(
                this.paypalDonationLinks[amount]
            );
        } else {
            this.modalService.open(qrcontent, { size: "sm" });
        }
	}
}