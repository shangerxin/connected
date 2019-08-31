import { TestBed } from "@angular/core/testing";
import { BrowserService } from "./browserService";

describe("BrowserService", () => {
    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        const service: BrowserService = TestBed.get(BrowserService);
        expect(service).toBeTruthy();
    });
});
