/// <reference types="stripe-v3" />
import { CustomElement } from "@benbraide/inlinejs-element";
import { IStripeField, IStripePaymentDetails } from "../types";
export declare class StripePaymentMenthodElement extends CustomElement implements IStripeField {
    value: stripe.elements.Element | string;
    constructor();
    WaitReady(): Promise<void>;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
}
export declare function StripePaymentMenthodElementCompact(): void;
