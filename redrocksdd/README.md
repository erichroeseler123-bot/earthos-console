# Red Rocks DD

Consolidated production source for Red Rocks DD.

## Customer offer
- $299 fixed trip total
- $49 paid online to reserve
- $250 due at pickup
- vehicle capacity matched to the booked group
- pickup at 4:30 PM or later
- round trip, chairs, cooler, ice, Bluetooth speaker
- licensed DD remains onsite through the show
- up to 8 hours total

## Founding driver offer
- 10 founding-driver slots
- $250 per completed trip + optional tips
- $100 bonus after the founding driver's first successfully completed trip

## Frontend structure
- `index.html` — application shell
- `styles.css` — all site styling
- `config.js` — client-side shared pricing/service constants
- `base.js` — Supabase client and shared helpers
- `customer.js` — homepage, booking, status and verified reviews
- `driver.js` — founding signup, authentication and driver dashboard
- `admin.js` — operator approval, booking assignment and trip completion
- `router.js` — route dispatcher, Terms and Privacy

The production database and Stripe backend remain authoritative for prices, booking states, permissions and payment capture. Do not rely on client configuration for security.

## Booking lifecycle
`reserved -> matching -> assigned -> confirmed -> pickup -> active -> completed`

Exception states: `reassigning`, `cancelled`, `refunded`.

## Deployment
The public site is hosted in the Vercel `redrocksdd` project at `www.redrocksdd.com`. Production should be deployed as one complete file set; do not make partial Vercel deployments because omitted files are removed from the deployment.
