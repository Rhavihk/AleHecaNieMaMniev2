const { onRequest } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fetch = require("node-fetch");
const crypto = require("crypto");

initializeApp();
const db = getFirestore();

/**
 * Discord OAuth callback handler.
 *
 * Flow:
 *  1. Discord redirects here with ?code=...&state=<guild_id>
 *  2. We exchange code for access_token
 *  3. We fetch Discord user + guild member info
 *  4. We write a one-time auth_token doc to Firestore
 *  5. We redirect the browser to the GitHub Pages frontend with ?token=<token>
 *
 * Required env vars (set via `firebase functions:secrets:set` or .env):
 *   DISCORD_CLIENT_ID
 *   DISCORD_CLIENT_SECRET
 *   FRONTEND_URL  → e.g. https://YOURUSERNAME.github.io/REPONAME
 */
exports.discordCallback = onRequest(
  { secrets: ["DISCORD_CLIENT_ID", "DISCORD_CLIENT_SECRET"], cors: true },
  async (req, res) => {
    const { code, state } = req.query;
    const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    // The redirect_uri must EXACTLY match what's registered in Discord dev portal
    const REDIRECT_URI =
      process.env.FUNCTIONS_URL + "/discordCallback" ||
      `https://us-central1-${process.env.GCLOUD_PROJECT}.cloudfunctions.net/discordCallback`;

    if (!code) {
      return res.redirect(`${FRONTEND_URL}/auth/callback?error=no_code`);
    }

    try {
      // 1. Exchange code for token
      const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: DISCORD_CLIENT_ID,
          client_secret: DISCORD_CLIENT_SECRET,
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });
      if (!tokenRes.ok) throw new Error("Token exchange failed");
      const { access_token } = await tokenRes.json();

      // 2. Fetch Discord user
      const userRes = await fetch("https://discord.com/api/users/@me", {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      if (!userRes.ok) throw new Error("Failed to fetch Discord user");
      const discordUser = await userRes.json();

      // 3. Fetch guild nickname if guild_id provided
      const guildId = state && state !== "no_guild" ? state : null;
      let guildNickname =
        discordUser.global_name || discordUser.username;

      if (guildId) {
        try {
          const memberRes = await fetch(
            `https://discord.com/api/users/@me/guilds/${guildId}/member`,
            { headers: { Authorization: `Bearer ${access_token}` } }
          );
          if (memberRes.ok) {
            const member = await memberRes.json();
            guildNickname =
              member.nick ||
              discordUser.global_name ||
              discordUser.username;
          }
        } catch (_) {
          // ignore — use fallback nickname
        }
      }

      // 4. Write one-time auth token to Firestore (TTL 5 min)
      const token = crypto.randomBytes(32).toString("hex");
      const userData = {
        discord_id: discordUser.id,
        username: discordUser.username,
        discriminator: discordUser.discriminator || "0",
        avatar: discordUser.avatar || null,
        guild_id: guildId,
        guild_nickname: guildNickname,
        expires_at: Date.now() + 5 * 60 * 1000,
      };
      await db.collection("auth_tokens").doc(token).set(userData);

      // 5. Redirect to frontend
      res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (err) {
      console.error("Discord OAuth error:", err);
      res.redirect(
        `${FRONTEND_URL}/auth/callback?error=${encodeURIComponent(err.message)}`
      );
    }
  }
);
