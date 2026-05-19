# WKND Headless React — AEM Headless + Universal Editor

A React SPA that connects to **AEM as a Cloud Service** as a headless CMS, hosted on **Adobe App Builder**, and editable in-context via **Universal Editor**.

It uses the WKND shared content (Adventures + Articles) served through AEM GraphQL persisted queries, with a secure App Builder proxy action handling service-credential authentication so no secrets reach the browser.

---

## Architecture

```
Browser (React SPA)
  └─► App Builder CDN (adobeio-static.net)
        ├─ Static assets (JS / CSS / HTML)
        └─ graphql-proxy Action (Node.js)
              └─► AEM Author (GraphQL persisted queries)
                    └─ WKND Shared Content Fragments
```

**Universal Editor** connects directly to AEM Author using the user's IMS session to read and write Content Fragments in-context.

---

## Pages

| Route | Content |
|---|---|
| `/` | Home — hero banner + featured adventures + featured articles |
| `/adventures` | Full WKND adventures grid |
| `/adventure/:slug` | Adventure detail — hero image, stats, description, itinerary |
| `/articles` | Magazine listing |
| `/article/:slug` | Article detail — author bio + rich text body |
| `/about` | Static about page |

---

## Local Development

### Prerequisites
- Node.js 18+
- Access to an AEM as a Cloud Service author instance with WKND content deployed

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.development.local` (gitignored — never commit):
   ```
   REACT_APP_HOST_URI=https://author-p<program>-e<env>.adobeaemcloud.com
   REACT_APP_USE_PROXY=false
   REACT_APP_AUTH_METHOD=dev-token
   REACT_APP_DEV_TOKEN=<dev token from AEM Developer Console>
   REACT_APP_GRAPHQL_ENDPOINT=/content/cq:graphql/wknd-shared/endpoint
   ```

   Get a dev token from: `https://author-p<program>-e<env>.adobeaemcloud.com` → top-right menu → **Developer Console** → **Integrations** → **Get Local Development Token**

   > Dev tokens expire every **24 hours** — refresh when you see 401 errors.

3. Start the app:
   ```bash
   npm start
   ```
   Opens at `http://localhost:3000`

---

## App Builder Deployment

The app is deployed to Adobe App Builder CDN. A `graphql-proxy` serverless action handles AEM authentication using a Technical Account (JWT service credentials), keeping secrets server-side.

### Prerequisites
- Adobe I/O CLI: `npm install -g @adobe/aio-cli`
- App Builder project set up in [Adobe Developer Console](https://developer.adobe.com/console)
- Run `aio app use --merge` in the project root to populate `.env` with runtime credentials

### Setup

Add the following to your `.env` (gitignored):

```
# App Builder runtime (populated by aio app use)
AIO_runtime_auth=...
AIO_runtime_namespace=...
AIO_runtime_apihost=https://adobeioruntime.net

# AEM service credentials (Technical Account from AEM Developer Console)
AEM_HOST=https://author-p<program>-e<env>.adobeaemcloud.com
AEM_TECHNICAL_CLIENT_ID=<clientId>
AEM_TECHNICAL_CLIENT_SECRET=<clientSecret>
AEM_ORG_ID=<org>@AdobeOrg
AEM_TECHNICAL_ACCOUNT_ID=<id>@techacct.adobe.com
AEM_PRIVATE_KEY_BASE64=<base64 encoded RSA private key>

# React app config
REACT_APP_HOST_URI=https://author-p<program>-e<env>.adobeaemcloud.com
REACT_APP_USE_PROXY=false
REACT_APP_AUTH_METHOD=dev-token
REACT_APP_DEV_TOKEN=<dev token — only needed locally>
REACT_APP_GRAPHQL_ENDPOINT=/content/cq:graphql/wknd-shared/endpoint
REACT_APP_ACTION_URL=https://<namespace>.adobeio-static.net/api/v1/web/wknd-headless/graphql-proxy
```

To base64-encode the private key:
```bash
python3 -c "import base64; print(base64.b64encode(open('private.key').read().encode()).decode())"
```

### Deploy

```bash
npm run deploy
```

This runs `npm run build` → `aio app deploy` → CDN cache bust in one command.

**Live app:** `https://<namespace>.adobeio-static.net/index.html`

---

## Universal Editor

The app is instrumented for in-context editing via Universal Editor. Every editable element has `data-aue-resource`, `data-aue-type`, `data-aue-prop`, and `data-aue-label` attributes pointing to the corresponding AEM Content Fragment node.

### How it works

- `public/index.html` declares the AEM connection:
  ```html
  <meta name="urn:adobe:aue:system:aemconnection" content="aem:https://author-p<program>-e<env>.adobeaemcloud.com" />
  <script src="https://universal-editor-service.adobe.io/corslib/LATEST" async></script>
  ```
- Universal Editor reads the `data-aue-*` attributes and shows an editing panel when you click any instrumented element
- Saves write directly back to AEM Content Fragments via the Universal Editor service

### Open in Universal Editor

1. Go to [https://experience.adobe.com/editor](https://experience.adobe.com/editor)
2. Enter the app URL: `https://<namespace>.adobeio-static.net/index.html`

### AEM CORS requirement

The AEM author CORS config must allow these origins:

```json
"alloworigin": [
  "https://experience.adobe.com",
  "https://universal-editor-service.adobe.io",
  "https://<namespace>.adobeio-static.net"
]
```

See `ui.config/.../com.adobe.granite.cors.impl.CORSPolicyImpl~wknd-graphql.cfg.json` in the AEM project. Deploy via Cloud Manager to apply.

---

## Environment Variables Reference

| Variable | Used in | Purpose |
|---|---|---|
| `REACT_APP_HOST_URI` | Browser (local dev) | AEM author base URL |
| `REACT_APP_AUTH_METHOD` | Browser (local dev) | `dev-token` / `basic` |
| `REACT_APP_DEV_TOKEN` | Browser (local dev) | Short-lived dev token (24h) |
| `REACT_APP_GRAPHQL_ENDPOINT` | Browser (local dev) | AEM GraphQL endpoint path |
| `REACT_APP_ACTION_URL` | Browser (production) | App Builder proxy action URL |
| `AEM_HOST` | Action (server) | AEM author URL for proxy |
| `AEM_TECHNICAL_CLIENT_ID` | Action (server) | Service credential client ID |
| `AEM_TECHNICAL_CLIENT_SECRET` | Action (server) | Service credential secret |
| `AEM_ORG_ID` | Action (server) | IMS org ID |
| `AEM_TECHNICAL_ACCOUNT_ID` | Action (server) | Technical account ID |
| `AEM_PRIVATE_KEY_BASE64` | Action (server) | Base64-encoded RSA private key |

---

## Tech Stack

- [React 18](https://reactjs.org/) + [React Router v6](https://reactrouter.com/)
- [AEM Headless Client JS](https://github.com/adobe/aem-headless-client-js)
- [Adobe App Builder](https://developer.adobe.com/app-builder/)
- [Universal Editor](https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/implementing/developing/universal-editor/introduction.html)
- [WKND Shared Content](https://github.com/adobe/aem-guides-wknd)
