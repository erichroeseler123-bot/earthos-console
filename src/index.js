export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only return JSON if they ask for the API
    if (url.pathname === "/api") {
      const data = {
        system: "EarthOS TRSL Console",
        status: "ONLINE",
        version: "v2.4.0",
        modules: {
          earth: {
            atmosphere: "Stable (78% N2, 21% O2)",
            hydrosphere: "Monitoring levels",
            lithosphere: "Active tectonic tracking"
          }
        },
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(data, null, 2), {
        headers: { "content-type": "application/json" },
      });
    }

    // If it's not the API, return a 404 (Cloudflare Assets will handle the main page before this runs)
    return new Response("Not Found", { status: 404 });
  },
};
