import { WaitForGlobal } from '@benbraide/inlinejs';

import { StripeDirectiveHandlerCompact } from './directive/stripe';

WaitForGlobal().then(() => StripeDirectiveHandlerCompact());
