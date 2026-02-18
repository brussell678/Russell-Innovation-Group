# Contact Form Setup (Vercel + Resend)

This site now posts `contact.html` form submissions to `POST /api/contact`.

## 1. Create a Resend account
- Go to https://resend.com and create an API key.
- Verify your sending domain in Resend (`russell-innovation-group.com`).

## 2. Add Vercel environment variables
In Vercel Project Settings -> Environment Variables, add:

- `RESEND_API_KEY` = your Resend API key
- `CONTACT_TO_EMAIL` = `brandon.t.russell77@gmail.com` (or your preferred inbox)
- `CONTACT_FROM_EMAIL` = `Website Contact <noreply@russell-innovation-group.com>`

Note: if your domain sender is not verified yet, you can temporarily use:
- `CONTACT_FROM_EMAIL` = `RIG Website <onboarding@resend.dev>`

## 3. Configure DNS records in Cloudflare
Add the DNS records Resend provides for domain verification (typically SPF/DKIM-related TXT/CNAME records).

## 4. Redeploy
After env vars are set, redeploy from Vercel so `/api/contact` can read them.

## 5. Test
- Open `https://russell-innovation-group.com/contact.html`
- Submit the form
- Confirm message delivery at your `CONTACT_TO_EMAIL` inbox.
