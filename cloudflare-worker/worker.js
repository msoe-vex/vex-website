const worker = {
    async fetch(request, env) {
        const origin = request.headers.get("Origin") || "*";

        // Handle CORS Preflight
        if (request.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization",
                    "Access-Control-Max-Age": "86400",
                },
            });
        }

        const url = new URL(request.url);

        // POST /token or POST /
        if (request.method === "POST" && (url.pathname === "/token" || url.pathname === "/" || url.pathname === "/api/token")) {
            try {
                const body = await request.json().catch(() => ({}));
                if (!body.code) {
                    return jsonResponse({ error: "Missing 'code' parameter in request body" }, 400, origin);
                }

                if (!env.CLIENT_ID || !env.CLIENT_SECRET) {
                    return jsonResponse(
                        { error: "Cloudflare Worker is missing CLIENT_ID or CLIENT_SECRET in Variables and Secrets." },
                        500,
                        origin
                    );
                }

                // Exchange authorization code with GitHub OAuth
                const ghResponse = await fetch("https://github.com/login/oauth/access_token", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "User-Agent": "Raider-Robotics-Auth-Worker",
                    },
                    body: JSON.stringify({
                        client_id: env.CLIENT_ID,
                        client_secret: env.CLIENT_SECRET,
                        code: body.code,
                    }),
                });

                const ghData = await ghResponse.json();

                if (ghData.error) {
                    return jsonResponse({ error: ghData.error_description || ghData.error }, 400, origin);
                }

                return jsonResponse({ token: ghData.access_token }, 200, origin);
            } catch (err) {
                return jsonResponse(
                    { error: err?.message || "Internal worker error" },
                    500,
                    origin
                );
            }
        }

        return jsonResponse(
            {
                message: "Raider Robotics GitHub OAuth Worker",
                usage: "Send POST to /token with { code: 'github_oauth_code' }",
            },
            200,
            origin
        );
    },
};

export default worker;

function jsonResponse(data, status = 200, origin = "*") {
    return new Response(JSON.stringify(data), {
        status,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    });
}

