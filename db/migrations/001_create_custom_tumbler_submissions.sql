CREATE TABLE IF NOT EXISTS custom_tumbler_submissions (
  id BIGSERIAL PRIMARY KEY,
  reference_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  personalization_text TEXT NOT NULL DEFAULT '',
  color_preferences TEXT NOT NULL DEFAULT '',
  printing_preference TEXT NOT NULL CHECK (printing_preference IN ('sublimation', 'uv')),
  design_service_option TEXT NOT NULL,
  design_notes TEXT NOT NULL DEFAULT '',
  uploaded_file_names TEXT[] NOT NULL DEFAULT '{}',
  uploaded_blob_urls TEXT[] NOT NULL DEFAULT '{}',
  copyright_permission_accepted BOOLEAN NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS custom_tumbler_submissions_created_at_idx
  ON custom_tumbler_submissions (created_at DESC);
