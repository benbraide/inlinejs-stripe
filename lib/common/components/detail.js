"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeDetailElementCompact = exports.StripeDetailElement = void 0;
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
const generic_field_1 = require("./generic-field");
class StripeDetailElement extends generic_field_1.StripeGenericField {
    constructor() {
        super();
        this.input = null;
        this.name = '';
        this.value = '';
    }
    ToggleFocus(focused) {
        const input = this.GetInput_();
        input && (focused ? input.focus() : input.blur());
    }
    Reset() {
        const input = this.GetInput_();
        input && (input.value = '');
    }
    AddDetails(details) {
        const input = this.GetInput_();
        if (!this.name || (!(input === null || input === void 0 ? void 0 : input.value) && !this.value)) {
            return;
        }
        details.billingDetails = (details.billingDetails || {});
        if (this.name === 'address') {
            details.billingDetails.address = (details.billingDetails.address || {});
            details.billingDetails.address.line1 = ((input === null || input === void 0 ? void 0 : input.value) || this.value);
        }
        else {
            details.billingDetails[this.name] = ((input === null || input === void 0 ? void 0 : input.value) || this.value);
        }
    }
    GetInput_() {
        return (this.input || this.querySelector('input'));
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], StripeDetailElement.prototype, "input", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeDetailElement.prototype, "name", void 0);
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'string' })
], StripeDetailElement.prototype, "value", void 0);
exports.StripeDetailElement = StripeDetailElement;
function StripeDetailElementCompact() {
    (0, inlinejs_element_1.RegisterCustomElement)(StripeDetailElement, 'stripe-detail');
}
exports.StripeDetailElementCompact = StripeDetailElementCompact;
