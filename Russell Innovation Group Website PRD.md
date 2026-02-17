Russell Innovation Group Website — Developer PRD (v1.0)
1. Metadata

Project Name: Russell Innovation Group Website

Prepared By: [Your Name]

Date: February 15, 2026

Version: 1.0

Author Role: Product Owner / Developer

Development Lead: [Codex/Engineer Name]

Status: Draft

2. Overview & Objectives

Purpose:
A professional, lightweight, static website to represent Russell Innovation Group, establish credibility for SBIR/STTR submissions, attract consulting inquiries, and provide a clean company presence.

Key Goals:

Validate Russell Innovation Group as a legitimate U.S. small business

Showcase capabilities (consulting + AI/BI services)

Provide a clear contact path

SEO baseline for discoverability

Target Deployment:

Static site build (Next.js or similar Static Site Generation framework) with DevOps pipeline to Vercel or equivalent.

3. Problem / Opportunity

Problem Statement:
SBIR reviewers and clients expect a professional online presence matching Russell Innovation Group’s technical credibility. Current Hostinger AI builder may not align with long-term flexibility or developer experience.

Opportunity:
Deliver a custom static site with SEO, performance, email integration, version control, and clear structure that can evolve into a more technical presence as Russell Innovation Group grows.

4. Target Users & Personas

Primary:

SBIR/STTR program reviewers

DoD program officers evaluating business credibility

Potential enterprise clients looking for consulting partners

Secondary:

Transitioning veterans

Partners and collaborators

5. Success Metrics

Site Launch: Live with full navigation and contact form

Performance: TTFB < 200ms; Lighthouse Performance score ≥ 90

SEO: Indexed pages with meta descriptions & sitemap

Leads: 5+ inquiries in first quarter

Mobile: LCP ≤ 2.5s on 4G

6. Content Requirements

Pages (Minimum):

Home

About

Solutions

Projects

Careers

Contact

Content Essentials:

Hero headline with clear value proposition

High-quality company logo & visual branding

Contact form with email endpoint and submission validation

Footer with domain email contacts & copyright

7. Functional Requirements
Navigation

Persistent header/menu across pages

Active link highlighting

Home Page

Hero section

Value proposition blocks

CTA button (Contact)

About

Company mission

Founder bio

Solutions

Three cards for core offerings

Short descriptive text

Projects

At least one featured project section

Careers

Static text with CTA to email resume

Contact

Form: Name, Email, Organization, Message

Validation and anti-spam

Post-submission “Thank You” messaging

8. Non-Functional Requirements
Technical

Static Site Generation (SSG) build (Next.js recommended)

Host on Vercel or Cloudflare Pages

Version control via GitHub

Use typescript or JavaScript depending on team preference

Performance

Pages must be statically generated and served via CDN for performance

Assets optimized for web (compressed images / fonts)

SEO

Unique meta title & description per page

Sitemap.xml & robots.txt

OpenGraph tags & Twitter cards

Accessibility standards (WCAG 2.1 AA)

9. Technical Stack (Developer Focus)

Framework: Next.js (SSG) or alternative static framework

Hosting: Vercel / Cloudflare Pages

CI/CD: GitHub Actions (automated deploy on push to main)

Domain: Cloudflare DNS

Email Integrations: Google Workspace; contact form handled via API service or serverless function

Analytics: Google Analytics

Static Site Generation ensures build-time rendering for speed and SEO optimization.

10. Deployment & DevOps

Connect GitHub repo to Vercel

Set up environment variables (e.g., form endpoint keys)

DNS records for domain via Cloudflare

Automated deployment on merge to main

Logging and CI status checks

11. Risks & Mitigations

Scope Creep:

Keep MVP strictly six pages.

Content Delays:

Use content placeholders if final content is late.

Performance & SEO:

Implement Lighthouse CI or QA check in CICD.

12. Acceptance Criteria (Checklist)

 All six pages created

 Navigation works across all screens

 Contact form submits successfully and sends email

 Meta titles, descriptions, and sitemap present

 Lighthouse performance ≥ 90

 Hosted live with SSL

 Domain email configured & verified

13. Timeline & Milestones
Milestone	Target Date
Repo & skeleton	Day 1–2
Page templates build	Day 3–5
Content integration	Day 6–7
SEO & performance	Day 8
QA & fixes	Day 9
Deploy & launch	Day 10
14. Notes for Codex in Visual Studio

Keep component structure modular

Use reusable UI components for consistency

Store content in JSON/MD for scalability

Generate sitemap as part of build

Ensure _app and _document handle global metadata