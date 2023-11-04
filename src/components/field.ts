import { EvaluateLater, FindAncestor, IElementScopeCreatedCallbackParams, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripeElement, IStripeField, IStripePaymentDetails } from "../types";

export class StripeFieldElement extends CustomElement implements IStripeField{
    protected stripeField_: stripe.elements.Element | null = null;
    
    protected isReady_ = false;
    protected readyWaiters_ = new Array<() => void>();

    @Property({ type: 'object', checkStoredObject: true })
    public stripe: IStripeElement | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public options: stripe.elements.ElementsOptions | null = null;

    @Property({ type: 'string' })
    public type = '';
    
    @Property({ type: 'string' })
    public onready = '';

    @Property({ type: 'string' })
    public oncomplete = '';

    @Property({ type: 'string' })
    public onerrors = '';

    public constructor(){
        super();
    }

    public WaitReady(){
        return new Promise<void>(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }

    public ToggleFocus(focused: boolean){
        (this.stripeField_ && (focused ? this.stripeField_?.focus() : this.stripeField_?.blur()));
    }

    public Reset(){
        this.stripeField_ && this.stripeField_?.clear();
    }

    public AddDetails(details: IStripePaymentDetails){
        (this.stripeField_ && (this.type === 'card' || this.type === 'number' || this.type === 'cardNumber')) && (details.method = this.stripeField_);
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, () => {
            this.GetStripe_()?.AddStripeField(this);
            postAttributesCallback && postAttributesCallback();
        });

        scope.AddPostProcessCallback(() => {
            this.GetStripe_()?.WaitInstance().then((stripe) => {
                if (!stripe){
                    return;
                }

                let type = '';
                if (['number', 'expiry', 'cvc'].includes(this.type)){
                    type = `card${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
                }
                else if (['card', 'cardNumber', 'cardExpiry', 'cardCvc', 'postalCode', 'paymentRequestButton', 'iban', 'idealBank'].includes(this.type)){
                    type = this.type;
                }

                if (type){
                    this.stripeField_ = stripe.elements().create((type as stripe.elements.elementsType), (this.options || this.GetStripe_()?.options || undefined));

                    this.stripeField_.on('ready', () => {
                        this.isReady_ = true;

                        this.onready && EvaluateLater({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.onready,
                            disableFunctionCall: false,
                        })();
                        
                        this.readyWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
                    });

                    this.stripeField_.on('change', (event) => {
                        if (event?.error){
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.onerrors,
                                disableFunctionCall: false,
                            })(undefined, [], { error: event.error });
                        }
                        else if (event?.complete){
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.oncomplete,
                                disableFunctionCall: false,
                            })();

                            this.GetStripe_()?.FocusNextField(this);
                        }
                    });
                    
                    this.stripeField_.mount(this);
                }
            });
        });

        scope.AddUninitCallback(() => {
            this.GetStripe_()?.RemoveStripeField(this);
            this.stripeField_ = null;
        });
    }

    protected GetStripe_(){
        return (this.stripe || FindAncestor<IStripeElement>(this, ancestor => ('AddStripeField' in ancestor)));
    }
}

export function StripeFieldElementCompact(){
    RegisterCustomElement(StripeFieldElement, 'stripe-field');
}
