/// <reference types="stripe-v3" />
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
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
    onready: string;
    oncomplete: string;
    onerrors: string;
    constructor();
    IsInteractive(): boolean;
    WaitReady(): Promise<void>;
    AddChangeListener(listener: StripeFieldChangeHandlerType): void;
    RemoveChangeListener(listener: StripeFieldChangeHandlerType): void;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
}
export declare function StripeFieldElementCompact(): void;
