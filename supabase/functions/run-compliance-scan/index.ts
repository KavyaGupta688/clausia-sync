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
    const { policyId, scanType, codeContext } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Get authorization header and extract JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    // Extract the JWT token from "Bearer <token>"
    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client for admin operations
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Verify the JWT token and get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) {
      console.error('User authentication error:', userError);
      throw new Error(`Authentication failed: ${userError.message}`);
    }
    if (!user) {
      console.error('No user found in session');
      throw new Error('Unauthorized - no user session');
    }
    
    console.log('User authenticated:', user.id);

    console.log('Running compliance scan:', scanType);

    // Create scan record
    const { data: scan, error: scanError } = await supabaseClient
      .from('compliance_scans')
      .insert({
        user_id: user.id,
        policy_id: policyId || null,
        scan_type: scanType,
        status: 'running',
      })
      .select()
      .single();

    if (scanError) throw scanError;

    // Build AI prompt based on scan type
    let systemPrompt = `You are a compliance scanning expert. Analyze code, policies, and data practices to identify compliance issues, risks, and recommendations.`;
    
    let userPrompt = '';
    
    if (scanType === 'code_scan') {
      userPrompt = `Analyze the following code for privacy and compliance issues:

${codeContext || 'No code context provided'}

Identify:
1. Data collection points (cookies, local storage, API calls)
2. PII handling
3. Third-party integrations
4. Potential GDPR/CCPA violations
5. Missing consent mechanisms
6. Insecure data practices

Provide findings in JSON format:
{
  "findings": [
    {
      "title": "Issue title",
      "severity": "critical|high|medium|low",
      "description": "Detailed description",
      "location": "code location",
      "recommendation": "How to fix"
    }
  ]
}`;
    } else if (scanType === 'policy_drift') {
      userPrompt = `Analyze policy drift and suggest updates:

Detect if:
1. New features added without policy updates
2. Third-party services changed
3. Data collection expanded
4. Jurisdiction requirements changed
5. User rights need updating

Provide recommendations for policy updates.`;
    } else if (scanType === 'live_scan') {
      userPrompt = `Perform live compliance scan${codeContext ? ' for: ' + codeContext : ''}:

Check for:
1. Active cookie consent banners
2. Privacy policy links
3. Data collection disclosures
4. GDPR compliance indicators
5. User rights implementation
6. Data retention policies
7. Cookie security (HttpOnly, Secure, SameSite attributes)
8. Third-party tracking scripts
9. Data encryption practices

Provide findings in JSON format:
{
  "findings": [
    {
      "title": "Issue title",
      "severity": "critical|high|medium|low",
      "description": "Detailed description",
      "location": "location or component",
      "recommendation": "How to fix"
    }
  ]
}`;
    }

    // Call AI for analysis
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
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const aiData = await response.json();
    const analysisText = aiData.choices[0].message.content;

    // Parse findings from AI response
    let findings = [];
    let severitySummary = { critical: 0, high: 0, medium: 0, low: 0 };
    
    try {
      // Try to extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        findings = parsed.findings || [];
        
        // Count severity
        findings.forEach((f: any) => {
          if (f.severity in severitySummary) {
            severitySummary[f.severity as keyof typeof severitySummary]++;
          }
        });
      }
    } catch (e) {
      // If parsing fails, create generic findings
      findings = [{
        title: 'Compliance Analysis Complete',
        severity: 'medium',
        description: analysisText.substring(0, 500),
        location: 'General',
        recommendation: 'Review the full analysis for details'
      }];
      severitySummary.medium = 1;
    }

    // Update scan with results
    const { error: updateError } = await supabaseClient
      .from('compliance_scans')
      .update({
        status: 'completed',
        findings: findings,
        severity_summary: severitySummary,
        recommendations: findings.map((f: any) => f.recommendation),
        completed_at: new Date().toISOString(),
      })
      .eq('id', scan.id);

    if (updateError) throw updateError;

    console.log('Scan completed with', findings.length, 'findings');

    return new Response(
      JSON.stringify({ 
        success: true, 
        scanId: scan.id,
        findings,
        severitySummary
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in run-compliance-scan function:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});