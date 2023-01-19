"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InlineJSStripe = void 0;
const inlinejs_1 = require("@benbraide/inlinejs");
const stripe_1 = require("./directive/stripe");
function InlineJSStripe() {
    (0, inlinejs_1.WaitForGlobal)().then(() => (0, stripe_1.StripeDirectiveHandlerCompact)());
}
exports.InlineJSStripe = InlineJSStripe;
