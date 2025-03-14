
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { heatmapType, imageDescription } = await req.json();
    
    // Construct a detailed prompt based on heatmap type
    let systemPrompt = "You are an expert UX analyst specializing in conversion rate optimization (CRO). ";
    systemPrompt += "Analyze the following heatmap data and provide insights on user behavior patterns, engagement, and optimization opportunities. ";
    systemPrompt += "Focus on concrete observations and actionable insights. Format your response as 2-3 concise paragraphs.";
    
    let userPrompt = `Analyze this ${heatmapType} heatmap data: ${imageDescription}.\n\n`;
    
    if (heatmapType === 'scroll') {
      userPrompt += "Focus on: scroll depth patterns, engagement drop-off points, content visibility issues, and how the scroll behavior might affect conversion rates.";
    } else if (heatmapType === 'click') {
      userPrompt += "Focus on: click distribution patterns, missed interaction opportunities, potentially confusing UI elements, CTA effectiveness, and navigation usability issues.";
    } else if (heatmapType === 'attention') {
      userPrompt += "Focus on: visual attention patterns, areas receiving high/low focus, content effectiveness, eye movement paths, and how attention distribution affects the conversion funnel.";
    }
    
    userPrompt += "\n\nProvide concrete observations from the data and actionable recommendations based on UX best practices.";

    console.log("Sending prompt to OpenAI:", { systemPrompt, userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const analysisText = data.choices[0].message.content;

    console.log("Analysis generated successfully");

    return new Response(JSON.stringify({ analysisText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-heatmap function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
