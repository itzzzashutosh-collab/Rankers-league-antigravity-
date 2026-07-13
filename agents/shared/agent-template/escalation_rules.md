# Agent Escalation Rules
- When confidence matches value < 0.70, stop processing and yield to human-in-the-loop audit console queue.
- If primary and secondary model engines fail, raise system alert event "Agent Failed".
