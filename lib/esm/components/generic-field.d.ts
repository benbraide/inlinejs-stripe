import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IStripeElement, IStripeField, IStripePaymentDetails, StripeFieldChangeHandlerType } from "../types";
export declare class StripeGenericField extends CustomElement implements IStripeField {
    stripe: IStripeElement | null;
    IsInteractive(): boolean;
    WaitReady(): Promise<void>;
    AddChangeListener(listener: StripeFieldChangeHandlerType): void;
    RemoveChangeListener(listener: StripeFieldChangeHandlerType): void;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected GetStripe_(): IStripeElement | null;
}
