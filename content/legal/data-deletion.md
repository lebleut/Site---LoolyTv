# LoolyTv Data Deletion

**Last updated:** September 5, 2026

LoolyTv uses a **parent Google account** to create the family profile. Parents may also set an optional password for email sign-in. Additional devices may be linked with a pairing code. You can delete your account and request deletion of other server-side data as described below.

## Delete your account (cloud profile and library)

Deleting your LoolyTv account removes from our servers:

- Your parent profile (email / Google subject link, optional password hash, parent display name, child nickname, birth year, language, country)
- Synced library playlist IDs and app options
- Active and revoked sessions for that account (including paired devices and short-lived online-presence records)
- Pending pairing challenges, parent-upgrade requests, and password-reset tokens for that account

These are the same account records used in our internal admin tools, so deleting the account also removes those identifiers from staff views.

Account deletion does **not** remove **aggregated popular search queries** used for autocomplete. Those records are not tied to your account (they store only a normalized query string, country code, and counts).

### How

1. In the App: **Options → Account → Delete account**, or
2. Email **loolytv@salinnovation.com** with subject “Delete LoolyTv account” and the Google email used to sign in.

After account deletion, sign-in will create a new empty account if you register again with the same Google user.

## Installation ID / content reports

Separately, you can request deletion of **content reports** tied to your device’s **installation ID** (used for rate limiting reports).

### What we delete for an installation ID

Associated **content reports** stored on our servers for that ID.

We may retain limited records when required for security, fraud prevention, or legal compliance, as described in the Privacy Policy.

### How to request installation-ID deletion

#### Option A — In the App

Open **Options → About → Request data deletion**. The App opens this page with your installation ID already filled in.

If you never submitted a content report from that device, the result will say there was nothing to delete — that means the request succeeded and no report records exist for that ID.

#### Option B — Public form

Use the form on this page (when opened from [https://loolytv.com/legal/data-deletion](https://loolytv.com/legal/data-deletion)) and paste your installation ID.

#### Option C — Email

Email **loolytv@salinnovation.com** with:

- Subject: Data deletion request
- Your installation ID (from Options → About)
- Approximate dates you used the App

## What stays on the device

Cached playlist metadata, videos, thumbnails, and local watch progress are stored on the device. Uninstall the App and clear app data if you want them removed locally. Signing out also clears the local library cache on that device.

## Finding your installation ID

In the App: **Options → About → Installation ID**.

## Contact

**loolytv@salinnovation.com**
