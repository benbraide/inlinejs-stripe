import { IStripePaymentDetails } from "../types";
import { StripeGenericField } from "./generic-field";
export declare class StripeDetailElement extends StripeGenericField {
    input: HTMLInputElement | null;
    name: string;
    value: string;
    constructor();
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected GetInput_(): HTMLInputElement | null;
}
export declare function StripeDetailElementCompact(): void;
