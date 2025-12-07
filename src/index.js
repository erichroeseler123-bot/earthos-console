export default {
  async fetch(request, env, ctx) {
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
      headers: { 
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  },
};
