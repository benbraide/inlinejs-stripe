/// <reference types="stripe-v3" />
import { IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement } from "@benbraide/inlinejs-element";
import { IStripeElement, IStripeField } from "../types";
export declare class StripeElement extends CustomElement implements IStripeElement {
    protected stripe_: stripe.Stripe | null;
    protected mounting_: boolean;
    protected mounted_: boolean;
    protected isReady_: boolean;
    protected readyWaiters_: (() => void)[];
    protected fields_: Array<IStripeField> | null;
    protected readyFields_: Array<IStripeField> | null;
    protected instanceWaiters_: (() => void)[];
    options: stripe.elements.ElementsOptions | null;
    publicKey: string;
    onready: string;
    defer: boolean;
    autofocus: boolean;
    constructor();
    AddStripeField(field: IStripeField): void;
    RemoveStripeField(field: IStripeField): void;
    FocusNextField(field: IStripeField): void;
    GetInstance(): stripe.Stripe | null;
    WaitInstance(): Promise<stripe.Stripe | null>;
    Mount(): void;
    Pay(clientSecret: string, save?: boolean): Promise<false | stripe.PaymentIntentResponse>;
    Setup(clientSecret: string): Promise<false | stripe.PaymentIntentResponse>;
    WaitReady(): Promise<void>;
    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void): void;
    protected PayOrSetup_(pay: boolean, clientSecret: string, save?: boolean): Promise<false | stripe.PaymentIntentResponse>;
}
export declare function StripeElementCompact(): void;
