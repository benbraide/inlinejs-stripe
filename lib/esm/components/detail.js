var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Property, RegisterCustomElement } from "@benbraide/inlinejs-element";
import { StripeGenericField } from "./generic-field";
export class StripeDetailElement extends StripeGenericField {
    constructor() {
        super(...arguments);
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
        const nameParts = this.name.split('.');
        if (nameParts.length == 1) {
            details.billingDetails[this.name] = ((input === null || input === void 0 ? void 0 : input.value) || this.value);
        }
        else { //Path
            let current = details.billingDetails;
            nameParts.slice(0, -1).forEach((part) => {
                current = (current[part] = (current[part] || {}));
            });
            current[nameParts.slice(-1)[0]] = ((input === null || input === void 0 ? void 0 : input.value) || this.value);
        }
    }
    GetInput_() {
        return (this.input || this.querySelector('input'));
    }
}
__decorate([
    Property({ type: 'object', checkStoredObject: true })
], StripeDetailElement.prototype, "input", void 0);
__decorate([
    Property({ type: 'string' })
], StripeDetailElement.prototype, "name", void 0);
__decorate([
    Property({ type: 'string', checkStoredObject: true })
], StripeDetailElement.prototype, "value", void 0);
export function StripeDetailElementCompact() {
    RegisterCustomElement(StripeDetailElement, 'stripe-detail');
}
