"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeFieldElementCompact = exports.StripeFieldElement = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const generic_field_1 = require("./generic-field");
class StripeFieldElement extends generic_field_1.StripeGenericField {
    constructor() {
        super();
        this.stripeField_ = null;
        this.isReady_ = false;
        this.isComplete_ = false;
        this.lastError_ = null;
        this.readyWaiters_ = new Array();
        this.changeListeners = new Array();
        this.options = null;
        this.type = '';
        this.oncustomready = '';
        this.oncustomcomplete = '';
        this.oncustomerror = '';
    }
    IsInteractive() {
        return true;
    }
    WaitReady() {
        return new Promise(resolve => {
            this.isReady_ ? resolve() : this.readyWaiters_.push(() => resolve());
        });
    }
    AddChangeListener(listener) {
        this.changeListeners.push(listener);
    }
    RemoveChangeListener(listener) {
        const index = this.changeListeners.indexOf(listener);
        (index >= 0) && this.changeListeners.splice(index, 1);
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
        super.HandleElementScopeCreated_(Object.assign({ scope }, rest), postAttributesCallback);
        scope.AddPostProcessCallback(() => {
            var _a;
            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.WaitInstance().then((details) => {
                var _a;
                if (!(details === null || details === void 0 ? void 0 : details.stripe) || !details.elements) {
                    return;
                }
                let type = '';
                if (['number', 'expiry', 'cvc'].includes(this.type)) {
                    type = `card${this.type.substring(0, 1).toUpperCase()}${this.type.substring(1)}`;
                }
                else if (['card', 'cardNumber', 'cardExpiry', 'cardCvc', 'postalCode', 'paymentRequestButton', 'iban', 'idealBank'].includes(this.type)) {
                    type = this.type;
                }
                if (!type) {
                    (0, inlinejs_1.JournalWarn)('The element type provided is invalid.', 'StripeField.Mount', this);
                    return;
                }
                this.stripeField_ = details.elements.create(type, (this.options || ((_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.options) || undefined));
                this.stripeField_.on('ready', () => {
                    this.isReady_ = true;
                    this.oncustomready && (0, inlinejs_1.EvaluateLater)({
                        componentId: this.componentId_,
                        contextElement: this,
                        expression: this.oncustomready,
                        disableFunctionCall: false,
                    })();
                    this.readyWaiters_.splice(0).forEach(waiter => (0, inlinejs_1.JournalTry)(waiter));
                });
                this.stripeField_.on('change', (event) => {
                    if (((event === null || event === void 0 ? void 0 : event.error) || null) !== this.lastError_) {
                        this.lastError_ = ((event === null || event === void 0 ? void 0 : event.error) || null);
                        this.oncustomerror && (0, inlinejs_1.EvaluateLater)({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.oncustomerror,
                            disableFunctionCall: false,
                        })(undefined, [this.lastError_], { error: this.lastError_ });
                        this.changeListeners.forEach(listener => (0, inlinejs_1.JournalTry)(() => listener('error', this.lastError_)));
                    }
                    if (((event === null || event === void 0 ? void 0 : event.complete) || false) != this.isComplete_) {
                        this.isComplete_ = ((event === null || event === void 0 ? void 0 : event.complete) || false);
                        this.oncustomcomplete && (0, inlinejs_1.EvaluateLater)({
                            componentId: this.componentId_,
                            contextElement: this,
                            expression: this.oncustomcomplete,
                            disableFunctionCall: false,
                        })(undefined, [this.isComplete_], { complete: this.isComplete_ });
                        this.changeListeners.forEach(listener => (0, inlinejs_1.JournalTry)(() => listener('complete', this.isComplete_)));
                    }
                });
                this.stripeField_.mount(this);
            }).catch(err => (0, inlinejs_1.JournalError)(err, 'StripeField.Mount', this));
        });
        scope.AddUninitCallback(() => {
            var _a;
            (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.RemoveStripeField(this);
            this.stripeField_ = null;
        });
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], StripeFieldElement.prototype, "options", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeFieldElement.prototype, "type", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeFieldElement.prototype, "oncustomready", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeFieldElement.prototype, "oncustomcomplete", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeFieldElement.prototype, "oncustomerror", void 0);
exports.StripeFieldElement = StripeFieldElement;
function StripeFieldElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(StripeFieldElement, 'stripe-field');
}
exports.StripeFieldElementCompact = StripeFieldElementCompact;
