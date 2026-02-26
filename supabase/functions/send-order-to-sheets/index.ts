import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const WEBHOOK_URL = Deno.env.get("GOOGLE_SHEETS_WEBHOOK_URL");
    if (!WEBHOOK_URL) throw new Error("GOOGLE_SHEETS_WEBHOOK_URL not configured");

    const body = await req.json();
    const {
      productName,
      price,
      size,
      color,
      customerName,
      phone,
      address,
      city,
      customText,
      productImage,
      aiDesignImage,
    } = body;

    // Send to Google Sheets webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName,
        price,
        size,
        color,
        customerName,
        phone,
        address,
        city,
        customText,
        productImage: productImage || "",
        aiDesignImage: aiDesignImage || "",
      }),
    });

    const result = await response.text();
    console.log("Google Sheets response:", result);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-order-to-sheets error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
