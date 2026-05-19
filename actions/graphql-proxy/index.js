/*
 * App Builder proxy action — exchanges AEM service credentials for an IMS token,
 * then forwards the persisted-query request to AEM author.
 * Credentials never reach the browser.
 */

const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')

async function getImsToken (params) {
  const {
    AEM_TECHNICAL_CLIENT_ID,
    AEM_TECHNICAL_CLIENT_SECRET,
    AEM_ORG_ID,
    AEM_TECHNICAL_ACCOUNT_ID,
    AEM_PRIVATE_KEY_BASE64
  } = params

  const privateKey = Buffer.from(AEM_PRIVATE_KEY_BASE64, 'base64').toString('utf8')

  const payload = {
    exp: Math.floor(Date.now() / 1000) + 300,
    iss: AEM_ORG_ID,
    sub: AEM_TECHNICAL_ACCOUNT_ID,
    aud: `https://ims-na1.adobelogin.com/c/${AEM_TECHNICAL_CLIENT_ID}`,
    'https://ims-na1.adobelogin.com/s/ent_aem_cloud_api': true
  }

  const jwtToken = jwt.sign(payload, privateKey, { algorithm: 'RS256' })

  const res = await fetch('https://ims-na1.adobelogin.com/ims/exchange/jwt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: AEM_TECHNICAL_CLIENT_ID,
      client_secret: AEM_TECHNICAL_CLIENT_SECRET,
      jwt_token: jwtToken
    })
  })

  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`IMS token exchange failed: ${JSON.stringify(data)}`)
  }
  return data.access_token
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

async function main (params) {
  // Handle CORS preflight
  if (params.__ow_method === 'options') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  const { queryName, AEM_HOST } = params
  if (!queryName) {
    return { statusCode: 400, headers: CORS_HEADERS, body: { error: 'queryName is required' } }
  }

  try {
    const token = await getImsToken(params)

    // Build persisted query URL — variables passed as semicolon-delimited path params
    let url = `${AEM_HOST}/graphql/execute.json/${queryName}`
    const varKeys = Object.keys(params).filter(k => k.startsWith('var_'))
    if (varKeys.length) {
      const varParts = varKeys.map(k => `${k.replace('var_', '')}=${encodeURIComponent(params[k])}`)
      url += ';' + varParts.join(';')
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    const data = await res.json()
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: data
    }
  } catch (err) {
    return { statusCode: 500, headers: CORS_HEADERS, body: { error: err.message } }
  }
}

module.exports = { main }
