"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripePaymentMenthodElementCompact = exports.StripePaymentMenthodElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class StripePaymentMenthodElement extends inlinejs_element_1.CustomElement {
    constructor() {
        super({
            isTemplate: true,
            isHidden: true,
        });
        this.value = '';
    }
    WaitReady() {
        return Promise.resolve();
    }
    AddChangeListener(listener) { }
    RemoveChangeListener(listener) { }
    ToggleFocus(focused) { }
    Reset() { }
    AddDetails(details) {
        this.value && (details.method = this.value);
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], StripePaymentMenthodElement.prototype, "value", void 0);
exports.StripePaymentMenthodElement = StripePaymentMenthodElement;
function StripePaymentMenthodElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(StripePaymentMenthodElement, 'stripe-payment-method');
}
exports.StripePaymentMenthodElementCompact = StripePaymentMenthodElementCompact;
