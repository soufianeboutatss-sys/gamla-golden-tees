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
    const { productImageBase64, customText, textColor, textSize, logoBase64, logoPlacement, logoSize, textPosition, logoPosition, productName } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build the prompt with exact user-specified parameters
    let instruction = `You are a professional product mockup designer. Take this ${productName} product image and integrate the following customization directly onto the fabric/material of the garment in a photorealistic way, as if it was printed/embroidered on the product. The result should look like a real product photo from an e-commerce store. IMPORTANT: Respect the EXACT position, size, and color specified by the customer.`;

    if (customText) {
      const posDesc = textPosition ? `positioned at exactly ${Math.round(textPosition.x)}% from the left edge and ${Math.round(textPosition.y)}% from the top edge` : "centered on the front";
      const sizeDesc = textSize ? ` The text should occupy approximately ${textSize}% of the garment width.` : "";
      instruction += ` Print this text ${posDesc} of the garment: "${customText}" in ${textColor || "white"} color.${sizeDesc}`;
    }
    if (logoBase64) {
      const placement = logoPlacement === "back" ? "on the back" : "on the front";
      const posDesc = logoPosition && logoPlacement === "front" ? ` positioned at exactly ${Math.round(logoPosition.x)}% from the left edge and ${Math.round(logoPosition.y)}% from the top edge` : "";
      const sizeDesc = logoSize ? ` The logo should occupy approximately ${logoSize}% of the garment width.` : "";
      instruction += ` Also integrate the provided logo image ${placement}${posDesc} of the garment.${sizeDesc}`;
    }
    instruction += ` Keep the same background, lighting, and product positioning. Make the customization look naturally part of the garment.`;

    // Build messages with images
    const content: any[] = [{ type: "text", text: instruction }];

    // Add product image
    content.push({
      type: "image_url",
      image_url: { url: productImageBase64 },
    });

    // Add logo if provided
    if (logoBase64) {
      content.push({
        type: "image_url",
        image_url: { url: logoBase64 },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content }],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits required. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedImage = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!generatedImage) {
      return new Response(JSON.stringify({ error: "No image generated" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ image: generatedImage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-magic-preview error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
