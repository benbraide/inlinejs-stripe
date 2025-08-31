/// <reference types="stripe-v3" />
import { IElementScope } from "@benbraide/inlinejs";
import { IStripePaymentDetails, StripeFieldChangeHandlerType } from "../types";
import { StripeGenericField } from "./generic-field";
export declare class StripeFieldElement extends StripeGenericField {
    protected stripeField_: stripe.elements.Element | null;
    protected isReady_: boolean;
    protected isComplete_: boolean;
    protected lastError_: stripe.Error | null;
    protected readyWaiters_: (() => void)[];
    protected changeListeners: StripeFieldChangeHandlerType[];
    options: stripe.elements.ElementsOptions | null;
    type: string;
    oncustomready: string;
    oncustomcomplete: string;
    oncustomerror: string;
    constructor();
    IsInteractive(): boolean;
    WaitReady(): Promise<void>;
    AddChangeListener(listener: StripeFieldChangeHandlerType): void;
    RemoveChangeListener(listener: StripeFieldChangeHandlerType): void;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected HandleElementScopeDestroyed_(scope: IElementScope): void;
    protected HandlePostProcess_(): void;
}
export declare function StripeFieldElementCompact(): void;
