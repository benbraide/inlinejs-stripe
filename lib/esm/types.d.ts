/// <reference types="stripe-v3" />
export interface IStripePaymentDetails {
    method?: stripe.elements.Element | string;
    billingDetails?: stripe.BillingDetails;
}
export interface IStripeField {
    WaitReady(): Promise<void>;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
}
export interface IStripeElement {
    options: stripe.elements.ElementsOptions | null;
    AddStripeField(field: IStripeField): void;
    RemoveStripeField(field: IStripeField): void;
    FocusNextField(field: IStripeField): void;
    GetInstance(): stripe.Stripe | null;
    WaitInstance(): Promise<stripe.Stripe | null>;
    Mount(): void;
}
