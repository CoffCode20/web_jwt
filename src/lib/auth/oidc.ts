const BASE_URL = `${process.env.OIDC_ISSUER}/protocol/openid-connect`;

const oidcFetch = async (endpoint: string, body: URLSearchParams) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok)
    throw new Error(`OIDC ${endpoint} failed: ${response.status}`);
  return response.json();
};

//handle refreshTokenRequest
export const refreshTokenRequest = (refresh_token: string) =>
  oidcFetch(
    "/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
      client_id: process.env.OIDC_CLIENT_ID!,
      client_secret: process.env.OIDC_CLIENT_SECRET!,
    })
  );

//handle logout request
export const logoutRequest = (refresh_token: string) =>
  oidcFetch(
    "/logout",
    new URLSearchParams({
      refresh_token,
      client_id: process.env.OIDC_CLIENT_ID!,
      client_secret: process.env.OIDC_CLIENT_SECRET!,
    })
  );
