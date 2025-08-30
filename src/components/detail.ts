import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripePaymentDetails } from "../types";
import { StripeGenericField } from "./generic-field";

export class StripeDetailElement extends StripeGenericField{
    @Property({ type: 'object', checkStoredObject: true })
    public input: HTMLInputElement | null = null;

    @Property({ type: 'string' })
    public name = '';

    @Property({ type: 'string', checkStoredObject: true })
    public value: any = '';

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
        
        const nameParts = this.name.split('.');
        if (nameParts.length == 1){
            details.billingDetails[this.name] = (input?.value || this.value);
        }
        else{//Path
            let current: Record<string, any> = details.billingDetails;
            nameParts.slice(0, -1).forEach((part) => {
                current = (current[part] = (current[part] || {}));
            });
            current[nameParts.slice(-1)[0]] = (input?.value || this.value);
        }
    }

    protected GetInput_(){
        return (this.input || this.querySelector('input'));
    }
}

export function StripeDetailElementCompact(){
    RegisterCustomElement(StripeDetailElement, 'stripe-detail');
}
