import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const {
      productName, price, size, color,
      customerName, phone, address, city,
      // Front side
      frontCustomText, frontTextColor, frontHasLogo,
      frontProductImage, frontAiDesignImage,
      // Back side
      backCustomText, backTextColor, backHasLogo,
      backProductImage, backAiDesignImage,
    } = body;

    const orderId = crypto.randomUUID();

    // Helper to upload base64 image to storage
    const uploadBase64Image = async (base64: string, name: string): Promise<string> => {
      const matches = base64.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!matches) return "";
      const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
      const binaryData = Uint8Array.from(atob(matches[2]), (c) => c.charCodeAt(0));
      const filePath = `${orderId}/${name}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("order-images")
        .upload(filePath, binaryData, {
          contentType: `image/${matches[1]}`,
          upsert: true,
        });

      if (uploadErr) {
        console.error(`Upload error (${name}):`, uploadErr);
        return "";
      }
      const { data: urlData } = supabase.storage.from("order-images").getPublicUrl(filePath);
      return urlData.publicUrl;
    };

    // Upload front images
    let frontProductUrl = "";
    let frontAiUrl = "";
    if (frontProductImage && frontProductImage.startsWith("data:")) {
      try { frontProductUrl = await uploadBase64Image(frontProductImage, "front-product"); } catch (e) { console.error("Front product upload error:", e); }
    }
    if (frontAiDesignImage && frontAiDesignImage.startsWith("data:")) {
      try { frontAiUrl = await uploadBase64Image(frontAiDesignImage, "front-ai-design"); } catch (e) { console.error("Front AI upload error:", e); }
    }

    // Upload back images
    let backProductUrl = "";
    let backAiUrl = "";
    if (backProductImage && backProductImage.startsWith("data:")) {
      try { backProductUrl = await uploadBase64Image(backProductImage, "back-product"); } catch (e) { console.error("Back product upload error:", e); }
    }
    if (backAiDesignImage && backAiDesignImage.startsWith("data:")) {
      try { backAiUrl = await uploadBase64Image(backAiDesignImage, "back-ai-design"); } catch (e) { console.error("Back AI upload error:", e); }
    }

    // Send to Google Sheets webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName, price, size, color,
        customerName, phone, address, city,
        // Front
        frontCustomText: frontCustomText || "",
        frontTextColor: frontTextColor || "",
        frontHasLogo: frontHasLogo ? "Oui" : "Non",
        frontProductImage: frontProductUrl,
        frontAiDesignImage: frontAiUrl,
        // Back
        backCustomText: backCustomText || "",
        backTextColor: backTextColor || "",
        backHasLogo: backHasLogo ? "Oui" : "Non",
        backProductImage: backProductUrl,
        backAiDesignImage: backAiUrl,
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
