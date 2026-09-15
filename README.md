# TRANSFLEX

A customer-facing EV charging network mockup for Puducherry drivers.

## Prototype experience

- Simulated mobile GPS set to Puducherry City
- Nearby charging stations around White Town, Heritage Town, Mission Street, Lawspet, Auroville Road, Ariyankuppam, and the ECR side
- Map-style charger discovery with station markers
- Smart Assistant recommendations
- Slot booking and confirmation flow
- My Bookings
- Puducherry to Chennai long-drive planner
- Vehicle profile personalization

## Run locally

Install dependencies and start Vite with the required environment variables:

    pnpm install
    PORT=5173 BASE_PATH=/ pnpm run dev

Open /preview/transflex-app/TransflexApp to view the mockup. The prototype uses simulated location, station, availability, map, and booking data so real APIs can be integrated later.
