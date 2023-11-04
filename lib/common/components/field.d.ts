/// <reference types="stripe-v3" />
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IStripeElement, IStripeField, IStripePaymentDetails } from "../types";
export declare class StripeFieldElement extends CustomElement implements IStripeField {
    protected stripeField_: stripe.elements.Element | null;
    protected isReady_: boolean;
    protected readyWaiters_: (() => void)[];
    stripe: IStripeElement | null;
    options: stripe.elements.ElementsOptions | null;
    type: string;
    onready: string;
    oncomplete: string;
    onerrors: string;
    constructor();
    WaitReady(): Promise<void>;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected GetStripe_(): IStripeElement | null;
}
export declare function StripeFieldElementCompact(): void;
