/// <reference types="stripe-v3" />
export interface IStripePaymentDetails {
    method?: stripe.elements.Element | string;
    billingDetails?: stripe.BillingDetails;
}
export declare type StripeFieldChangeType = 'error' | 'complete';
export declare type StripeFieldChangeHandlerType = (type: StripeFieldChangeType, data: any) => void;
export interface IStripeField {
    IsInteractive(): boolean;
    WaitReady(): Promise<void>;
    AddChangeListener(listener: StripeFieldChangeHandlerType): void;
    RemoveChangeListener(listener: StripeFieldChangeHandlerType): void;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
}
export interface IStripeDetails {
    stripe: stripe.Stripe | null;
    elements: stripe.elements.Elements | null;
}
export interface IStripeElement {
    options: stripe.elements.ElementsOptions | null;
    AddStripeField(field: IStripeField): void;
    RemoveStripeField(field: IStripeField): void;
    FocusNextField(field: IStripeField): void;
    GetDetails(): IStripeDetails | null;
    GetInstance(): stripe.Stripe | null;
    WaitInstance(): Promise<IStripeDetails | null>;
    Mount(): void;
}
