import { EvaluateLater, IElementScopeCreatedCallbackParams, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";

import { IStripeDetails, IStripeElement, IStripeField, IStripePaymentDetails } from "../types";

export class StripeElement extends CustomElement implements IStripeElement{
    protected stripe_: stripe.Stripe | null = null;
    protected elements_: stripe.elements.Elements | null = null;

    protected mounting_ = false;
    protected mounted_ = false;

    protected isReady_ = false;
    protected readyWaiters_ = new Array<() => void>();
    
    protected fields_: Array<IStripeField> | null = null;
    protected readyFields_: Array<IStripeField> | null = null;
    protected instanceWaiters_ = new Array<() => void>();

    protected interactiveFields_: Array<IStripeField> | null = null;
    protected completeFields_: Array<IStripeField> | null = null;
    protected errorFields_: Array<IStripeField> | null = null;
    
    @Property({ type: 'object', checkStoredObject: true })
    public options: stripe.elements.ElementsOptions | null = null;

    @Property({ type: 'string' })
    public publicKey = '';

    @Property({ type: 'string' })
    public oncustomready = '';

    @Property({ type: 'string' })
    public oncustomcomplete = '';

    @Property({ type: 'string' })
    public oncustomerror = '';
    
    @Property({ type: 'boolean' })
    public defer = false;

    @Property({ type: 'boolean' })
    public focusnext = false;

    public constructor(){
        super();
    }

    public AddStripeField(field: IStripeField){
        this.fields_ = (this.fields_ || []);
        this.fields_.push(field);

        field.WaitReady().then(() => {
            this.readyFields_ = (this.readyFields_ || []);
            this.readyFields_.push(field);

            if (field.IsInteractive()){
                this.interactiveFields_ = (this.interactiveFields_ || []);
                this.interactiveFields_.push(field);
            }

            (this.fields_ && this.readyFields_ && this.fields_.length <= this.readyFields_.length) && JournalTry(() => {
                this.isReady_ = true;
                
                this.oncustomready && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncustomready,
                    disableFunctionCall: false,
                })();
                
                this.readyWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
            });
        });

        field.AddChangeListener((type, data) => {
            if (type === 'complete'){
                let changed = false;
                
                this.completeFields_ = (this.completeFields_ || []);
                if (data && !this.completeFields_.includes(field)){
                    this.completeFields_.push(field);
                    changed = !!(this.interactiveFields_ && this.completeFields_.length == this.interactiveFields_.length);
                }
                else if (!data && this.completeFields_.includes(field)){
                    this.completeFields_ = this.completeFields_.filter(x => x !== field);
                    changed = !!(this.interactiveFields_ && (this.completeFields_.length == (this.interactiveFields_.length - 1)));
                }

                changed && this.oncustomcomplete && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncustomcomplete,
                    disableFunctionCall: false,
                })(undefined, [!!data], { complete: !!data });

                !!data && this.focusnext && this.FocusNextField(field);
            }
            else if (type === 'error'){
                let changed = false;

                this.errorFields_ = (this.errorFields_ || []);
                this.errorFields_.push(field);

                this.errorFields_ = (this.errorFields_ || []);
                if (data && !this.errorFields_.includes(field)){
                    this.errorFields_.push(field);
                    changed = (this.errorFields_.length == 1);
                }
                else if (!data && this.errorFields_.includes(field)){
                    this.errorFields_ = this.errorFields_.filter(x => x !== field);
                    changed = (this.errorFields_.length == 0);
                }

                changed && this.oncustomerror && EvaluateLater({ // Removed redundant 'params' argument
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncustomerror,
                    disableFunctionCall: false,
                })(undefined, [data], { error: data });
            }
        });
    }

    public RemoveStripeField(field: IStripeField){
        this.fields_ && (this.fields_ = this.fields_.filter(x => x !== field));
        this.readyFields_ && (this.readyFields_ = this.readyFields_.filter(x => x !== field));
        this.interactiveFields_ && (this.interactiveFields_ = this.interactiveFields_.filter(x => x !== field));
        this.completeFields_ && (this.completeFields_ = this.completeFields_.filter(x => x !== field));
        this.errorFields_ && (this.errorFields_ = this.errorFields_.filter(x => x !== field));
    }

    public FocusNextField(field: IStripeField){
        if (this.fields_){
            const index = this.fields_.indexOf(field);
            (index >= 0 && index < this.fields_.length - 1) && this.fields_[index + 1].ToggleFocus(true);
        }
    }

    public GetDetails(): IStripeDetails{
        return {
            stripe: this.stripe_,
            elements: this.elements_,
        };
    }

    public GetInstance(){
        return this.stripe_;
    }

    public WaitInstance(){
        return new Promise<IStripeDetails | null>(resolve => {
            this.mounted_ ? resolve(this.GetDetails()) : this.instanceWaiters_.push(() => resolve(this.GetDetails()));
        });
    }

    public Mount(){
        if (this.mounted_ || this.mounting_){
            return;
        }

        this.mounting_ = true;
        this.LoadResources().then(() => {
            this.mounting_ = false;
            this.mounted_ = true;

            this.stripe_ = Stripe(this.publicKey);
            this.elements_ = this.stripe_.elements();
            
            this.instanceWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
        });
    }

    public Pay(clientSecret: string, save = false){
        return this.PayOrSetup_(true, clientSecret, save);
    }

    public Setup(clientSecret: string){
        return this.PayOrSetup_(false, clientSecret);
    }

    public WaitReady(){
        return new Promise<void>(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }

    protected HandleElementScopeCreated_({ scope, ...rest }: IElementScopeCreatedCallbackParams, postAttributesCallback?: () => void){
        super.HandleElementScopeCreated_({ scope, ...rest }, postAttributesCallback);
        scope.AddPostProcessCallback(() => (!this.defer && this.Mount()));
        scope.AddUninitCallback(() => (this.stripe_ = null));
    }

    protected PayOrSetup_(pay: boolean, clientSecret: string, save = false){
        return new Promise<stripe.PaymentIntentResponse | false>((resolve, reject) => {
            this.WaitInstance().then((details) => {
                if (!details?.stripe){
                    return resolve(false);
                }

                const paymentDetails: IStripePaymentDetails = {};
                this.fields_?.forEach(field => field.AddDetails(paymentDetails));

                if (!paymentDetails.method){
                    return resolve(false);
                }

                let cardDetails: stripe.ConfirmCardPaymentData;
                if (typeof paymentDetails.method === 'string'){ // Payment Method ID
                    cardDetails = {
                        payment_method: paymentDetails.method,
                    };
                }
                else { // Stripe Element (e.g., CardElement)
                    cardDetails = {
                        payment_method: {
                            card: paymentDetails.method,
                            billing_details: paymentDetails.billingDetails,
                        },
                    };
                }

                if (pay){
                    paymentDetails.billingDetails?.email && (cardDetails.receipt_email = paymentDetails.billingDetails.email);
                    save && (cardDetails.setup_future_usage = 'off_session');
                    details.stripe.confirmCardPayment(clientSecret, cardDetails).then(resolve).catch(reject);
                }
                else{
                    details.stripe.confirmCardSetup(clientSecret, cardDetails).then(resolve).catch(reject);
                }
            }).catch(reject);
        });
    }
}

export function StripeElementCompact(){
    RegisterCustomElement(StripeElement, 'stripe');
}
