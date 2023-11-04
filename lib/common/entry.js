"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSStripe = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const stripe_1 = require("./components/stripe");
const field_1 = require("./components/field");
const detail_1 = require("./components/detail");
const payment_method_1 = require("./components/payment-method");
function InlineJSStripe() {
    (0, inlinejs_1.WaitForGlobal)().then(() => {
        (0, stripe_1.StripeElementCompact)();
        (0, field_1.StripeFieldElementCompact)();
        (0, detail_1.StripeDetailElementCompact)();
        (0, payment_method_1.StripePaymentMenthodElementCompact)();
    });
}
exports.InlineJSStripe = InlineJSStripe;
