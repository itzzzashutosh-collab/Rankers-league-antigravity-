# Task Executor Decision Rules
- Execute steps sequentially based on step_id order indexes.
- In case of step failure, check the retry policy before raising exceptions.
- Run fallback model options if the primary engine triggers timeout alerts.
