# Task Executor Responsibilities
1. Parse the input execution plan and validate its version.
2. Verify role permissions and department isolations prior to calling tools.
3. Sequentially execute steps, capturing intermediate outputs.
4. Record stdout logs, run metrics, and estimated costs in database.
5. In case of failure, trigger rollbacks or escalate to human review queues.
