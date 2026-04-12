# Meridian CMS — Setup Guide
## How to activate the admin panel

The CMS is already built. You just need to do **two things in GitHub** to turn it on.

---

## Step 1 — Push the admin folder

Make sure your repo now has this structure:

```
meridian-property-group/
├── admin/
│   ├── index.html       ← CMS app
│   └── config.yml       ← CMS schema
├── assets/
├── index.html
├── listing.html
├── listings.json
└── README.md
```

Push to GitHub. GitHub Pages will rebuild automatically (~1 minute).

---

## Step 2 — Create a GitHub Personal Access Token (PAT)

This is how the client logs into the CMS. Takes 2 minutes.

1. Go to: **github.com → Settings → Developer Settings → Personal access tokens → Tokens (classic)**
   Direct link: https://github.com/settings/tokens/new

2. Fill in:
   - **Note:** `Meridian CMS`
   - **Expiration:** `No expiration` (or 1 year)
   - **Scopes:** tick `repo` (the top-level checkbox — this selects all repo permissions)

3. Click **Generate token**

4. **Copy the token immediately** — GitHub only shows it once.
   It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

5. Save it somewhere safe (e.g. a password manager, or email it to yourself).

---

## Step 3 — Log into the CMS

1. Go to: `https://guidoifawkes83-stack.github.io/meridian-property-group/admin/`

2. You'll see the Meridian login screen.

3. Click **"Sign in with token"**

4. Paste the token from Step 2.

5. You're in. ✅

---

## What the client sees

Once logged in, the client has three sections in the left sidebar:

| Section | What they can do |
|---|---|
| 🏠 Property Listings | Add / edit / remove listings, upload photos, change status to Sold |
| 👤 Agent Details | Update name, photo, phone, email |
| 🏢 Office Details | Update office address, contact info |

### Adding a new listing
1. Click **Property Listings** in the sidebar
2. Click **Add Property** (top right)
3. Fill in the form fields — Address, Suburb, Price, upload photos, etc.
4. Click **Save**
5. GitHub automatically commits the change
6. Site rebuilds in ~1 minute
7. The new listing appears live on the site

### Marking a property as Sold
1. Open the listing
2. Change **Status** from `Active` to `Sold`
3. Save
4. It moves from the main grid to the "Recently Sold" row automatically

### Removing a listing entirely
1. Open the listing
2. Change **Status** to `Unlisted`
3. Save
4. It disappears from the site (but stays in the JSON for your records)

---

## Token expiry

If the token has an expiry date, the client will need a new one when it expires. 
Repeat Step 2 and paste the new token at the login screen.

For a non-technical client: consider setting **No expiration** and keeping the token in a shared password manager.

---

## One-time config change needed

Before giving the CMS to a second agent client, update line 8 of `admin/config.yml`:

```yaml
repo: guidoifawkes83-stack/meridian-property-group
```

Change to their GitHub repo:

```yaml
repo: their-github-username/their-repo-name
```

That's the only change needed to white-label this for a new client.
