# Nusfa LIMS — UI Prototype

Professional React + Vite prototype for the Nusfa LIMS laboratory management system.

## Run locally

```bash
npm install
npm run dev
```

Then open the localhost URL shown by Vite (normally http://localhost:5173).

## Included in this UI phase

- Dashboard with dynamic action cards
- Recent Activities
- Recent Bills with View / Download actions
- New Registration flow
- Existing patient lookup simulation
- Title search/custom title support
- Age / DOB toggle
- Auto gender suggestion from title with manual override
- Billing with searchable tests/packages
- Multiple test/package selection and removal
- Live subtotal, discount ₹ / %, discounted-by, paid and due calculations
- Bill Preview
- Print / Save as PDF through browser print dialog
- WhatsApp share action
- Referral dashboard
- Add Referral form
- Responsive sidebar and mobile layout
- Local browser state for the prototype

## Database

This version intentionally uses mock/local browser data only. The real PostgreSQL/Supabase database, authentication, role permissions, APIs, report-result workflow, and production deployment should be connected in the next phase.
