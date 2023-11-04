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
import { EvaluateLater, FindAncestor, JournalTry } from "@benbraide/inlinejs";
import { CustomElement, Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
export class StripeFieldElement extends CustomElement {
    constructor() {
        super();
        this.stripeField_ = null;
        this.isReady_ = false;
        this.readyWaiters_ = new Array();
        this.stripe = null;
        this.options = null;
        this.type = '';
        this.onready = '';
        this.oncomplete = '';
        this.onerrors = '';
    }
    WaitReady() {
        return new Promise(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }
    ToggleFocus(focused) {
        var _a, _b;
        (this.stripeField_ && (focused ? (_a = this.stripeField_) === null || _a === void 0 ? void 0 : _a.focus() : (_b = this.stripeField_) === null || _b === void 0 ? void 0 : _b.blur()));
    }
    Reset() {
        var _a;
        this.stripeField_ && ((_a = this.stripeField_) === null || _a === void 0 ? void 0 : _a.clear());
    }
    AddDetails(details) {
        (this.stripeField_ && (this.type === 'card' || this.type === 'number' || this.type === 'cardNumber')) && (details.method = this.stripeField_);
    }
    HandleElementScopeCreated_(_a, postAttributesCallback) {
        var { scope } = _a, rest = __rest(_a, ["scope"]);
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), () => {
            var _a;
            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.AddStripeField(this);
            postAttributesCallback && postAttributesCallback();
        });
        scope.AddPostProcessCallback(() => {
            var _a;
            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.WaitInstance().then((stripe) => {
                var _a;
                if (!stripe) {
                    return;
                }
                let type = '';
                if (['number', 'expiry', 'cvc'].includes(this.type)) {
                    type = `card${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
                }
                else if (['card', 'cardNumber', 'cardExpiry', 'cardCvc', 'postalCode', 'paymentRequestButton', 'iban', 'idealBank'].includes(this.type)) {
                    type = this.type;
                }
                if (type) {
                    this.stripeField_ = stripe.elements().create(type, (this.options || ((_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.options) || undefined));
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
                        var _a;
                        if (event === null || event === void 0 ? void 0 : event.error) {
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.onerrors,
                                disableFunctionCall: false,
                            })(undefined, [], { error: event.error });
                        }
                        else if (event === null || event === void 0 ? void 0 : event.complete) {
                            EvaluateLater({
                                componentId: this.componentId_,
                                contextElement: this,
                                expression: this.oncomplete,
                                disableFunctionCall: false,
                            })();
                            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.FocusNextField(this);
                        }
                    });
                    this.stripeField_.mount(this);
                }
            });
        });
        scope.AddUninitCallback(() => {
            var _a;
            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.RemoveStripeField(this);
            this.stripeField_ = null;
        });
    }
    GetStripe_() {
        return (this.stripe || FindAncestor(this, ancestor => ('AddStripeField' in ancestor)));
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], StripeFieldElement.prototype, "stripe", void 0);
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], StripeFieldElement.prototype, "options", void 0);
__decorate([
    Property({ type: 'string' })
], StripeFieldElement.prototype, "type", void 0);
__decorate([
    Property({ type: 'string' })
], StripeFieldElement.prototype, "onready", void 0);
__decorate([
    Property({ type: 'string' })
], StripeFieldElement.prototype, "oncomplete", void 0);
__decorate([
    Property({ type: 'string' })
], StripeFieldElement.prototype, "onerrors", void 0);
export function StripeFieldElementCompact() {
    RegisterCustomElement(StripeFieldElement, 'stripe-field');
}