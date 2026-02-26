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
      customText, productImage, aiDesignImage,
    } = body;

    const orderId = crypto.randomUUID();
    let productImageUrl = productImage || "";
    let aiDesignImageUrl = "";

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

    // Upload product image
    if (productImage && productImage.startsWith("data:")) {
      try {
        productImageUrl = await uploadBase64Image(productImage, "product");
      } catch (e) { console.error("Product image upload error:", e); }
    }

    // Upload AI design image
    if (aiDesignImage && aiDesignImage.startsWith("data:")) {
      try {
        aiDesignImageUrl = await uploadBase64Image(aiDesignImage, "ai-design");
      } catch (e) { console.error("AI image upload error:", e); }
    }

    // Send to Google Sheets webhook
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productName, price, size, color,
        customerName, phone, address, city,
        customText,
        productImage: productImageUrl,
        aiDesignImage: aiDesignImageUrl,
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
