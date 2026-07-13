# Agent Decision Rules
- Always prioritize facts over predictions or assumptions.
- If multiple models are available, run primary and fallback to recovery models in case of timeout errors.
- Reject requests containing arguments matching blacklist terms.
