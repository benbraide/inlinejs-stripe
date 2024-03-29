import { EvaluateLater, IElementScopeCreatedCallbackParams, JournalTry } from "@benbraide/inlinejs";
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripePaymentDetails, StripeFieldChangeHandlerType } from "../types";
import { StripeGenericField } from "./generic-field";

export class StripeFieldElement extends StripeGenericField{
    protected stripeField_: stripe.elements.Element | null = null;
    
    protected isReady_ = false;
    protected isComplete_ = false;
    protected lastError_: stripe.Error | null = null;
    
    protected readyWaiters_ = new Array<() => void>();
    protected changeListeners = new Array<StripeFieldChangeHandlerType>();

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

    public IsInteractive(){
        return true;
    }

    public WaitReady(){
        return new Promise<void>(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }

    public AddChangeListener(listener: StripeFieldChangeHandlerType){
        this.changeListeners.push(listener);
    }

    public RemoveChangeListener(listener: StripeFieldChangeHandlerType){
        const index = this.changeListeners.indexOf(listener);
        (index >= 0) && this.changeListeners.splice(index, 1);
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
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);

        scope.AddPostProcessCallback(() => {
            this.GetStripe_()?.WaitInstance().then((details) => {
                if (!details?.stripe){
                    return;
                }

                let type = '';
                if (['number', 'expiry', 'cvc'].includes(this.type)){
                    type = `card${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
                }
                else if (['card', 'cardNumber', 'cardExpiry', 'cardCvc', 'postalCode', 'paymentRequestButton', 'iban', 'idealBank'].includes(this.type)){
                    type = this.type;
                }

                if (type && details.elements){
                    this.stripeField_ = details.elements.create((type as stripe.elements.elementsType), (this.options || this.GetStripe_()?.options || undefined));

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
                        if ((event?.error || null) !== this.lastError_){
                            this.lastError_ = (event?.error || null);
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.onerrors,
                                disableFunctionCall: false,
                            })(undefined, [this.lastError_], { error: this.lastError_ });

                            this.changeListeners.forEach(listener => JournalTry(() => listener('error', this.lastError_)));
                        }
                        
                        if ((event?.complete || false) != this.isComplete_){
                            this.isComplete_ = (event?.complete || false);
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.oncomplete,
                                disableFunctionCall: false,
                            })(undefined, [this.isComplete_], { complete: this.isComplete_ });

                            this.changeListeners.forEach(listener => JournalTry(() => listener('complete', this.isComplete_)));
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
}

export function StripeFieldElementCompact(){
    RegisterCustomElement(StripeFieldElement, 'stripe-field');
}
