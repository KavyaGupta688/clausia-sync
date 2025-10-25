-- Create tables for Clausia legal compliance system

-- Policies table to store generated legal documents
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  policy_type TEXT NOT NULL CHECK (policy_type IN ('privacy_policy', 'terms_of_service', 'cookie_policy', 'data_retention')),
  content TEXT NOT NULL,
  data_types JSONB DEFAULT '[]'::jsonb,
  jurisdictions TEXT[] DEFAULT '{}',
  third_party_services TEXT[] DEFAULT '{}',
  version INTEGER DEFAULT 1,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Compliance scans table to store scan results
CREATE TABLE public.compliance_scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE,
  scan_type TEXT NOT NULL CHECK (scan_type IN ('code_scan', 'policy_drift', 'vendor_changes', 'live_scan')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  findings JSONB DEFAULT '[]'::jsonb,
  severity_summary JSONB DEFAULT '{"critical": 0, "high": 0, "medium": 0, "low": 0}'::jsonb,
  recommendations JSONB DEFAULT '[]'::jsonb,
  scanned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Compliance mappings table for feature-to-clause mapping
CREATE TABLE public.compliance_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  policy_id UUID REFERENCES public.policies(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_description TEXT,
  data_flow JSONB,
  linked_clauses JSONB DEFAULT '[]'::jsonb,
  compliance_status TEXT DEFAULT 'compliant' CHECK (compliance_status IN ('compliant', 'needs_review', 'non_compliant')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Jurisdictions reference table
CREATE TABLE public.jurisdictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  requirements JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_mappings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jurisdictions ENABLE ROW LEVEL SECURITY;

-- RLS policies for policies table
CREATE POLICY "Users can view their own policies"
  ON public.policies FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own policies"
  ON public.policies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own policies"
  ON public.policies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own policies"
  ON public.policies FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for compliance_scans table
CREATE POLICY "Users can view their own scans"
  ON public.compliance_scans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans"
  ON public.compliance_scans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scans"
  ON public.compliance_scans FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS policies for compliance_mappings table
CREATE POLICY "Users can view their own mappings"
  ON public.compliance_mappings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mappings"
  ON public.compliance_mappings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mappings"
  ON public.compliance_mappings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mappings"
  ON public.compliance_mappings FOR DELETE
  USING (auth.uid() = user_id);

-- RLS policies for jurisdictions table (public read)
CREATE POLICY "Anyone can view jurisdictions"
  ON public.jurisdictions FOR SELECT
  USING (true);

-- Insert default jurisdictions
INSERT INTO public.jurisdictions (code, name, region, requirements) VALUES
  ('GDPR', 'General Data Protection Regulation', 'European Union', '{"data_minimization": true, "right_to_deletion": true, "consent_required": true, "dpo_required": false}'::jsonb),
  ('CCPA', 'California Consumer Privacy Act', 'California, USA', '{"opt_out_rights": true, "data_sale_disclosure": true, "access_rights": true}'::jsonb),
  ('DPDP', 'Digital Personal Data Protection Act', 'India', '{"consent_required": true, "data_localization": true, "right_to_deletion": true}'::jsonb),
  ('LGPD', 'Lei Geral de Proteção de Dados', 'Brazil', '{"consent_required": true, "right_to_deletion": true, "dpo_required": true}'::jsonb),
  ('PIPEDA', 'Personal Information Protection and Electronic Documents Act', 'Canada', '{"consent_required": true, "access_rights": true, "data_breach_notification": true}'::jsonb),
  ('PDPA', 'Personal Data Protection Act', 'Singapore', '{"consent_required": true, "dpo_required": true, "data_breach_notification": true}'::jsonb),
  ('APPI', 'Act on the Protection of Personal Information', 'Japan', '{"consent_required": true, "third_party_disclosure": true, "cross_border_transfer": true}'::jsonb),
  ('POPIA', 'Protection of Personal Information Act', 'South Africa', '{"consent_required": true, "data_minimization": true, "information_officer_required": true}'::jsonb);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_policies_updated_at
  BEFORE UPDATE ON public.policies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_compliance_mappings_updated_at
  BEFORE UPDATE ON public.compliance_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();