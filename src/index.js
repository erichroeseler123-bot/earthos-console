export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. INTERCEPT: Check if the user is asking for the raw data (API)
    if (url.pathname === "/api") {
      
      // Simulate slight sensor fluctuation (e.g., 20.90% to 21.10%)
      // This makes the dashboard look "alive" when data updates
      const o2Level = (20.9 + Math.random() * 0.2).toFixed(2);
      
      const data = {
        system: "EarthOS TRSL Console",
        status: "ONLINE",
        version: "v2.4.1",
        modules: {
          earth: {
            atmosphere: `Stable (78% N2, ${o2Level}% O2)`,
            hydrosphere: "Monitoring levels",
            lithosphere: "Active tectonic tracking"
          }
        },
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(data, null, 2), {
        headers: { 
          "content-type": "application/json",
          // Allow the dashboard to read this even if hosted elsewhere (CORS)
          "Access-Control-Allow-Origin": "*" 
        },
      });
    }

    // 2. FALLBACK: If it's not the API, return 404.
    // (Note: Cloudflare will serve your 'public/index.html' BEFORE hitting this 
    // for the root URL, so this only catches invalid paths.)
    return new Response("Not Found", { status: 404 });
  },
};
