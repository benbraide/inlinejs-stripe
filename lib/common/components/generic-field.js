"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeGenericField = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const inlinejs_element_1 = require("@benbraide/inlinejs-element");
class StripeGenericField extends inlinejs_element_1.CustomElement {
    constructor() {
        super(...arguments);
        this.stripe = null;
    }
    IsInteractive() {
        return false;
    }
    WaitReady() {
        return Promise.resolve();
    }
    AddChangeListener(listener) { }
    RemoveChangeListener(listener) { }
    ToggleFocus(focused) { }
    Reset() { }
    AddDetails(details) { }
    HandlePostAttributesProcessPostfix_() {
        var _a;
        super.HandlePostAttributesProcessPostfix_();
        (_a = this.GetStripe_()) === null || _a === void 0 ? void 0 : _a.AddStripeField(this);
    }
    GetStripe_() {
        return (this.stripe || (0, inlinejs_1.FindAncestor)(this, ancestor => ('AddStripeField' in ancestor)));
    }
}
__decorate([
    (0, inlinejs_element_1.Property)({ type: 'object', checkStoredObject: true })
], StripeGenericField.prototype, "stripe", void 0);
exports.StripeGenericField = StripeGenericField;
