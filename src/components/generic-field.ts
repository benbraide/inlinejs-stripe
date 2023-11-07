import { FindAncestor, IElementScopeCreatedCallbackParams } from "@benbraide/inlinejs";
import { CustomElement, Property } from "@benbraide/inlinejs-element";

import { IStripeElement, IStripeField, IStripePaymentDetails, StripeFieldChangeHandlerType } from "../types";

export class StripeGenericField extends CustomElement implements IStripeField{
    @Property({ type: 'object', checkStoredObject: true })
    public stripe: IStripeElement | null = null;

    public WaitReady(){
        return Promise.resolve();
    }

    public AddChangeListener(listener: StripeFieldChangeHandlerType){}

    public RemoveChangeListener(listener: StripeFieldChangeHandlerType){}

    public ToggleFocus(focused: boolean){}

    public Reset(){}

    public AddDetails(details: IStripePaymentDetails){}

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.GetStripe_()?.AddStripeField(this);
            postAttributesCallback && postAttributesCallback();
        });
    }

    protected GetStripe_(){
        return (this.stripe || FindAncestor<IStripeElement>(this, ancestor => ('AddStripeField' in ancestor)));
    }
}
