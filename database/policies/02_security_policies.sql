ALTER TABLE aspirants ENABLE ROW LEVEL SECURITY;
ALTER TABLE championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_public_aspirants 
ON aspirants FOR SELECT 
USING (true);

CREATE POLICY select_public_championships 
ON championships FOR SELECT 
USING (true);

CREATE POLICY select_public_standings 
ON standings FOR SELECT 
USING (true);
