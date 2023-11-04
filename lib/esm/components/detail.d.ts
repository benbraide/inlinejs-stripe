import { CustomElement } from "@benbraide/inlinejs-element";
import { IStripeField, IStripePaymentDetails } from "../types";
export declare class StripeDetailElement extends CustomElement implements IStripeField {
    input: HTMLInputElement | null;
    name: string;
    value: string;
    constructor();
    WaitReady(): Promise<void>;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected GetInput_(): HTMLInputElement | null;
}
export declare function StripeDetailElementCompact(): void;
