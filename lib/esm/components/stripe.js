var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { EvaluateLater, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class StripeElement extends CustomElement {
    constructor() {
        super();
        this.stripe_ = null;
        this.elements_ = null;
        this.mounting_ = false;
        this.mounted_ = false;
        this.isReady_ = false;
        this.readyWaiters_ = new Array();
        this.fields_ = null;
        this.readyFields_ = null;
        this.instanceWaiters_ = new Array();
        this.completeFields_ = null;
        this.errorFields_ = null;
        this.options = null;
        this.publicKey = '';
        this.onready = '';
        this.oncomplete = '';
        this.onerrors = '';
        this.defer = false;
        this.focusnext = false;
    }
    AddStripeField(field) {
        this.fields_ = (this.fields_ || []);
        this.fields_.push(field);
        field.WaitReady().then(() => {
            this.readyFields_ = (this.readyFields_ || []);
            this.readyFields_.push(field);
            (this.fields_ && this.readyFields_ && this.fields_.length <= this.readyFields_.length) && JournalTry(() => {
                this.isReady_ = true;
                this.onready && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.onready,
                    disableFunctionCall: false,
                })();
                this.readyWaiters_.splice(0).forEach(waiter => JournalTry(waiter));
            });
        });
        field.AddChangeListener((type, data) => {
            if (type === 'complete') {
                let changed = false;
                this.completeFields_ = (this.completeFields_ || []);
                if (data && !this.completeFields_.includes(field)) {
                    this.completeFields_.push(field);
                    changed = !!(this.readyFields_ && this.completeFields_.length == this.readyFields_.length);
                }
                else if (!data && this.completeFields_.includes(field)) {
                    this.completeFields_ = this.completeFields_.filter(x => x !== field);
                    changed = !!(this.readyFields_ && (this.completeFields_.length == (this.readyFields_.length - 1)));
                }
                changed && this.oncomplete && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.oncomplete,
                    disableFunctionCall: false,
                })(undefined, [!!data], { complete: !!data });
                !!data && this.focusnext && this.FocusNextField(field);
            }
            else if (type === 'error') {
                let changed = false;
                this.errorFields_ = (this.errorFields_ || []);
                this.errorFields_.push(field);
                this.errorFields_ = (this.errorFields_ || []);
                if (data && !this.errorFields_.includes(field)) {
                    this.errorFields_.push(field);
                    changed = (this.errorFields_.length == 1);
                }
                else if (!data && this.errorFields_.includes(field)) {
                    this.errorFields_ = this.errorFields_.filter(x => x !== field);
                    changed = (this.errorFields_.length == 0);
                }
                changed && this.onerrors && EvaluateLater({
                    componentId: this.componentId_,
                    contextElement: this,
                    expression: this.onerrors,
                    disableFunctionCall: false,
                })(undefined, [data], { error: data });
            }
        });
    }
    RemoveStripeField(field) {
        this.fields_ && (this.fields_ = this.fields_.filter(x => x !== field));
        this.readyFields_ && (this.readyFields_ = this.readyFields_.filter(x => x !== field));
    }
    FocusNextField(field) {
        if (this.fields_) {
            const index = this.fields_.indexOf(field);
            (index >= 0 && index < this.fields_.length - 1) && this.fields_[index + 1].ToggleFocus(true);
        }
    }
    GetDetails() {
        return {
            stripe: this.stripe_,
            elements: this.elements_,
        };
    }
    GetInstance() {
        return this.stripe_;
    }
    WaitInstance() {
        return new Promise(resolve => {
            this.mounted_ ? resolve(this.GetDetails()) : this.instanceWaiters_.push(() => resolve(this.GetDetails()));
        });
    }
    Mount() {
        if (this.mounted_ || this.mounting_) {
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
    Pay(clientSecret, save = false) {
        return this.PayOrSetup_(true, clientSecret, save);
    }
    Setup(clientSecret) {
        return this.PayOrSetup_(false, clientSecret);
    }
    WaitReady() {
        return new Promise(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        scope.AddPostProcessCallback(() => (!this.defer && this.Mount()));
        scope.AddUninitCallback(() => (this.stripe_ = null));
    }
    PayOrSetup_(pay, clientSecret, save = false) {
        return new Promise((resolve, reject) => {
            this.WaitInstance().then((details) => {
                var _a, _b;
                if (!(details === null || details === void 0 ? void 0 : details.stripe)) {
                    return resolve(false);
                }
                const paymentDetails = {};
                (_a = this.fields_) === null || _a === void 0 ? void 0 : _a.forEach(field => field.AddDetails(paymentDetails));
                if (!paymentDetails.method) {
                    return resolve(false);
                }
                let cardDetails;
                if (typeof paymentDetails.method !== 'string') {
                    cardDetails = {
                        payment_method: {
                            card: paymentDetails.method,
                            billing_details: paymentDetails.billingDetails,
                        },
                    };
                }
                else {
                    cardDetails = {
                        payment_method: paymentDetails.method,
                    };
                }
                if (pay) {
                    ((_b = paymentDetails.billingDetails) === null || _b === void 0 ? void 0 : _b.email) && (cardDetails.receipt_email = paymentDetails.billingDetails.email);
                    save && (cardDetails.setup_future_usage = 'off_session');
                    details.stripe.confirmCardPayment(clientSecret, cardDetails).then(resolve).catch(reject);
                }
                else {
                    details.stripe.confirmCardSetup(clientSecret, cardDetails).then(resolve).catch(reject);
                }
            }).catch(reject);
        });
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], StripeElement.prototype, "options", void 0);
__decorate([
    Property({ type: 'string' })
], StripeElement.prototype, "publicKey", void 0);
__decorate([
    Property({ type: 'string' })
], StripeElement.prototype, "onready", void 0);
__decorate([
    Property({ type: 'string' })
], StripeElement.prototype, "oncomplete", void 0);
__decorate([
    Property({ type: 'string' })
], StripeElement.prototype, "onerrors", void 0);
__decorate([
    Property({ type: 'boolean' })
], StripeElement.prototype, "defer", void 0);
__decorate([
    Property({ type: 'boolean' })
], StripeElement.prototype, "focusnext", void 0);
export function StripeElementCompact() {
    RegisterCustomElement(StripeElement, 'stripe');
}
