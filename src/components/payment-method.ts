import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripePaymentDetails } from "../types";
import { StripeGenericField } from "./generic-field";

export class StripePaymentMenthodElement extends StripeGenericField{
    @Property({ type: 'object', checkStoredObject: true })
    public value: stripe.elements.Element | string = '';

    public constructor(){
        super({
            isTemplate: true,
            isHidden: true,
        });
    }
    
    public AddDetails(details: IStripePaymentDetails){
        this.value && (details.method = this.value);
    }
}

export function StripePaymentMenthodElementCompact(){
    RegisterCustomElement(StripePaymentMenthodElement, 'stripe-payment-method');
}
