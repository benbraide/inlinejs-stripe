export interface IStripePaymentDetails{
    method?: stripe.elements.Element | string;
    billingDetails?: stripe.BillingDetails;
}

export type StripeFieldChangeType = 'error' | 'complete';
export type StripeFieldChangeHandlerType = (type: StripeFieldChangeType, data: any) => void;

export interface IStripeField{
    WaitReady(): Promise<void>;
    AddChangeListener(listener: StripeFieldChangeHandlerType): void;
    RemoveChangeListener(listener: StripeFieldChangeHandlerType): void;
    ToggleFocus(focused: boolean): void;
    Reset(): void;
    AddDetails(details: IStripePaymentDetails): void;
}

export interface IStripeElement{
    options: stripe.elements.ElementsOptions | null;
    AddStripeField(field: IStripeField): void;
    RemoveStripeField(field: IStripeField): void;
    FocusNextField(field: IStripeField): void;
    GetInstance(): stripe.Stripe | null;
    WaitInstance(): Promise<stripe.Stripe | null>;
    Mount(): void;
}
