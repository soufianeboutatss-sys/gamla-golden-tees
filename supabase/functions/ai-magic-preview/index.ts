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
    // Use a coordinate grid system to help the AI understand exact placement
    let instruction = `You are a professional product mockup designer. Take this ${productName} product image and apply the following customizations EXACTLY as specified. The result must look like a real product photo.

CRITICAL POSITIONING RULES:
- The image uses a coordinate system where (0%, 0%) is the TOP-LEFT corner and (100%, 100%) is the BOTTOM-RIGHT corner.
- 50% horizontally = center of the image.
- 50% vertically = middle of the image.
- You MUST place elements at the EXACT coordinates specified. Do NOT center them or move them to a "better" position.
- Do NOT reinterpret or adjust the positions. Place them EXACTLY where specified.`;

    if (customText) {
      const xPos = textPosition ? Math.round(textPosition.x) : 50;
      const yPos = textPosition ? Math.round(textPosition.y) : 50;
      const sizeDesc = textSize ? ` The text width should be approximately ${textSize}% of the total image width.` : "";
      instruction += `

TEXT CUSTOMIZATION:
- Text content: "${customText}"
- Text color: ${textColor || "white"}
- Horizontal position: ${xPos}% from the left edge (${xPos < 33 ? "LEFT side" : xPos > 66 ? "RIGHT side" : "CENTER"})
- Vertical position: ${yPos}% from the top edge (${yPos < 33 ? "UPPER area" : yPos > 66 ? "LOWER area" : "MIDDLE area"})${sizeDesc}
- Print this text directly on the fabric at this exact position.`;
    }
    if (logoBase64) {
      const placement = logoPlacement === "back" ? "on the back" : "on the front";
      const xPos = logoPosition ? Math.round(logoPosition.x) : 50;
      const yPos = logoPosition ? Math.round(logoPosition.y) : 30;
      const sizeDesc = logoSize ? ` The logo width should be approximately ${logoSize}% of the total image width.` : "";
      instruction += `

LOGO CUSTOMIZATION:
- Place the provided logo image ${placement} of the garment.
- Horizontal position: ${xPos}% from the left edge (${xPos < 33 ? "LEFT side" : xPos > 66 ? "RIGHT side" : "CENTER"})
- Vertical position: ${yPos}% from the top edge (${yPos < 33 ? "UPPER area" : yPos > 66 ? "LOWER area" : "MIDDLE area"})${sizeDesc}
- Integrate the logo naturally into the fabric texture.`;
    }
    instruction += `

FINAL RULES: Keep the exact same background, lighting, model pose, and product shape. Only add the customizations at their specified positions. Make them look printed/embroidered on the fabric.`;

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
