/// <reference types="stripe-v3" />
import { IStripePaymentDetails } from "../types";
import { StripeGenericField } from "./generic-field";
export declare class StripePaymentMenthodElement extends StripeGenericField {
    value: stripe.elements.Element | string;
    constructor();
    AddDetails(details: IStripePaymentDetails): void;
}
export declare function StripePaymentMenthodElementCompact(): void;
