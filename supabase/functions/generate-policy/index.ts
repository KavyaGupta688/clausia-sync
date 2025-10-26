import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      productName, 
      productDescription, 
      dataTypes, 
      jurisdictions, 
      thirdPartyServices 
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    // Create Supabase client with the user's auth context
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { 
        global: { 
          headers: { Authorization: authHeader } 
        } 
      }
    );

    // Verify the user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('Auth verification error:', userError);
      throw new Error('Authentication failed');
    }
    
    if (!user) {
      console.error('No user found in token');
      throw new Error('Unauthorized');
    }

    console.log('User authenticated:', user.id);

    console.log('Generating policy for:', productName);

    // Build comprehensive system prompt
    const systemPrompt = `You are a legal compliance expert specializing in data privacy laws. Generate comprehensive, legally accurate privacy policies tailored to specific products and jurisdictions.

Key responsibilities:
- Generate clear, compliant privacy policy clauses
- Address specific data types being collected
- Cover jurisdiction-specific requirements (${jurisdictions.join(', ')})
- Include third-party service disclosures
- Use precise legal language while remaining readable
- Cover all required sections: data collection, usage, storage, user rights, retention, and contact information

Generate a complete privacy policy document in HTML format with proper sections and subsections.`;

    const userPrompt = `Generate a comprehensive privacy policy for the following product:

Product Name: ${productName}
Description: ${productDescription}

Data Types Collected:
${dataTypes.map((dt: string) => `- ${dt}`).join('\n')}

Target Jurisdictions:
${jurisdictions.map((j: string) => `- ${j}`).join('\n')}

Third-Party Services:
${thirdPartyServices}

Requirements:
1. Include all required sections for ${jurisdictions.join(', ')} compliance
2. Address each data type collected with specific usage justification
3. Include user rights specific to each jurisdiction
4. Specify data retention periods
5. Include third-party service disclosures
6. Provide clear contact information section
7. Format as HTML with proper headings (h3, h4) and paragraphs

Generate the policy content now:`;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API Error:', response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedContent = aiData.choices[0].message.content;

    console.log('Policy generated successfully');

    // Save policy to database
    const { data: policy, error: dbError } = await supabaseClient
      .from('policies')
      .insert({
        user_id: user.id,
        product_name: productName,
        product_description: productDescription,
        policy_type: 'privacy_policy',
        content: generatedContent,
        data_types: dataTypes,
        jurisdictions: jurisdictions,
        third_party_services: thirdPartyServices ? [thirdPartyServices] : [],
        status: 'draft',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        content: generatedContent,
        policyId: policy.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-policy function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});