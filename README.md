# Tresford Mulilima — Computer Science Portfolio

A responsive personal portfolio for presenting academic background, selected software projects, technical interests and contact channels.

## Stack
- HTML5, CSS3 and vanilla JavaScript
- Vercel serverless Node.js API routes
- GitHub public REST API for live public profile and repository data
- Resend for contact-message delivery (optional configuration)
- Upstash Redis REST API for aggregate page-view counting and rate limiting (optional configuration)
- OpenAI API for the portfolio assistant (optional configuration)

## Features
- Responsive layout, accessible skip navigation and persistent light/dark theme
- Animated role headline with reduced-motion support
- Project, skills, academic journey and learning-priority sections
- Live public GitHub profile statistics and recently updated repositories
- Personal photo gallery and print-ready student CV at `cv.html`
- Learning notes at `blog.html`
- Contact form backed by a serverless endpoint when configured
- Portfolio assistant restricted to facts documented in its system prompt
- Aggregate page-view counter without storing visitor profiles or IP addresses

## Deploy on Vercel
1. Import this GitHub repository into Vercel.
2. Set the project framework preset to **Other** and leave the root directory at the repository root.
3. Add the environment variables below in Vercel Project Settings → Environment Variables.
4. Deploy the feature branch for a preview, test all endpoints, then promote the reviewed version to production.

### Required for contact form
- `RESEND_API_KEY`: API key from Resend.
- `CONTACT_TO_EMAIL`: destination inbox, e.g. `tresfordmulilima@gmail.com`.
- `CONTACT_FROM_EMAIL`: sender address/domain verified with Resend.
- `SITE_URL`: canonical site origin, e.g. `https://your-domain.example`.

### Required for AI assistant
- `OPENAI_API_KEY`: server-side OpenAI API key. Never place this key in HTML or browser JavaScript.
- `OPENAI_MODEL` (optional): model available to the API account; defaults to `gpt-4o-mini`.

### Required for page-view counter
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis REST token.\n\nUpstash Redis is also required by the contact and assistant endpoints for daily usage limits (30 contact submissions and 100 assistant requests per UTC day). If Redis is not configured, these endpoints do not accept submissions.

All secrets belong in Vercel environment settings, never in Git. The form, assistant and counter return a clear unavailable state until their respective environment variables are configured. Do not share API keys in chat or commit them to this repository.

## Local development
Static pages can be opened with VS Code Live Server, but serverless API routes require the Vercel CLI:
```bash
npm install --global vercel
vercel dev
```
The APIs will remain unavailable until the environment variables are configured locally in an untracked `.env.local` file.

## Security and privacy notes
- Contact and assistant endpoints accept POST requests only, validate input and keep provider credentials server-side.
- The contact form includes a honeypot field and optional origin validation. Configure a verified sender and consider provider-side abuse controls before public launch.
- The assistant is constrained to portfolio facts and should not be treated as a general personal-data source.
- Analytics stores one aggregate page-view integer. It does not store IP addresses, browser fingerprints or individual visitor histories.
- GitHub data uses the unauthenticated public API. Rate limits may temporarily prevent the dashboard from loading.
- No certifications, awards, testimonials, employment history or project outcomes are claimed unless verified.
- Project links are direct only where the repository destination is known.

## CV
Open `cv.html` and select **Print / Save as PDF**. Complete all missing verified details before submitting it for a job or internship application.

## Owner
Tresford Mulilima · Zambia  
Email: tresfordmulilima@gmail.com  
GitHub: https://github.com/2007Trek
