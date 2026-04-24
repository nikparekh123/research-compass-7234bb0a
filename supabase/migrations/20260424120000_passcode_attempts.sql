-- Rate-limit log for the Sunnyfi landing passcode edge function.
CREATE TABLE public.passcode_attempts (
  id         BIGSERIAL PRIMARY KEY,
  ip         TEXT NOT NULL,
  ok         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_passcode_attempts_ip_time
  ON public.passcode_attempts (ip, created_at DESC);

-- Only the edge function (service role) needs to read/write this.
-- Disable public access.
ALTER TABLE public.passcode_attempts ENABLE ROW LEVEL SECURITY;
-- No policies → no anon access. Service role bypasses RLS anyway.
