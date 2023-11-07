import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripePaymentDetails } from "../types";
import { StripeGenericField } from "./generic-field";

export class StripeDetailElement extends StripeGenericField{
    @Property({ type: 'object', checkStoredObject: true })
    public input: HTMLInputElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'string' })
    public value = '';

    public constructor(){
        super();
    }

    public ToggleFocus(focused: boolean){
        const input = this.GetInput_();
        input && (focused ? input.focus() : input.blur());
    }

    public Reset(){
        const input = this.GetInput_();
        input && (input.value = '');
    }

    public AddDetails(details: IStripePaymentDetails){
        const input = this.GetInput_();
        if (!this.name || (!input?.value && !this.value)){
            return;
        }
        
        details.billingDetails = (details.billingDetails || {});
        if (this.name === 'address'){
            details.billingDetails.address = (details.billingDetails.address || {});
            details.billingDetails.address.line1 = (input?.value || this.value);
        }
        else{
            details.billingDetails[this.name] = (input?.value || this.value);
        }
    }

    protected GetInput_(){
        return (this.input || this.querySelector('input'));
    }
}

export function StripeDetailElementCompact(){
    RegisterCustomElement(StripeDetailElement, 'stripe-detail');
}
