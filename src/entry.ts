import { WaitForGlobal } from '@benbraide/inlinejs';

import { StripeDirectiveHandlerCompact } from './directive/stripe';

export function InlineJSStripe(){
    WaitForGlobal().then(() => StripeDirectiveHandlerCompact());
}
