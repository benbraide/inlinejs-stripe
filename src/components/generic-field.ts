import { FindAncestor } from "@benbraide/inlinejs";
import { CustomElement, Property } from "@benbraide/inlinejs-element";

import { IStripeElement, IStripeField, IStripePaymentDetails, StripeFieldChangeHandlerType } from "../types";

export class StripeGenericField extends CustomElement implements IStripeField{
    @Property({ type: 'object', checkStoredObject: true })
    public stripe: IStripeElement | null = null;

    public IsInteractive(){
        return false;
    }

    public WaitReady(){
        return Promise.resolve();
    }

    public AddChangeListener(listener: StripeFieldChangeHandlerType){}

    public RemoveChangeListener(listener: StripeFieldChangeHandlerType){}

    public ToggleFocus(focused: boolean){}

    public Reset(){}

    public AddDetails(details: IStripePaymentDetails){}

    protected HandlePostAttributesProcessPostfix_(): void {
        super.HandlePostAttributesProcessPostfix_();
        this.GetStripe_()?.AddStripeField(this);
    }

    protected GetStripe_(){
        return (this.stripe || FindAncestor<IStripeElement>(this, ancestor => ('AddStripeField' in ancestor)));
    }
}
