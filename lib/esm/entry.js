import { WaitForGlobal } from '@benbraide/inlinejs';
import { StripeElementCompact } from './components/stripe';
import { StripeFieldElementCompact } from './components/field';
import { StripeDetailElementCompact } from './components/detail';
import { StripePaymentMenthodElementCompact } from './components/payment-method';
export function InlineJSStripe() {
    WaitForGlobal().then(() => {
        StripeElementCompact();
        StripeFieldElementCompact();
        StripeDetailElementCompact();
        StripePaymentMenthodElementCompact();
    });
}
