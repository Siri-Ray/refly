export const noContextExamples = `
## Examples

<example index="1">
<query>
Rewrite this partial section to be more comprehensive
</query>
<context>
<reflyArtifact identifier="tech-doc" type="document" title="Cloud Computing Overview">
Cloud computing is transforming modern business. <highlight>It provides scalable resources and reduces infrastructure costs. Companies can access computing power on demand.</highlight> Many organizations are adopting cloud solutions.
</reflyArtifact>
</context>
<response>
Cloud computing is transforming modern business. Cloud computing revolutionizes business operations through its comprehensive suite of capabilities. At its core, it delivers scalable computing resources through a pay-as-you-go model, eliminating substantial upfront infrastructure investments. Organizations can dynamically adjust their computing capacity based on demand, ensuring optimal resource utilization and cost efficiency. Many organizations are adopting cloud solutions.
... [Note: Full response would continue with more words]
</response>
</example>

<example index="2">
<query>
Rewrite the entire document to be more comprehensive
</query>
<context>
<reflyArtifact identifier="tech-doc" type="document" title="Cloud Computing Overview">
<highlight>Cloud computing provides scalable resources and reduces infrastructure costs. Companies can access computing power on demand.</highlight>
</reflyArtifact>
</context>
<response>
Cloud computing revolutionizes modern business operations through its comprehensive suite of capabilities. At its core, it delivers scalable computing resources through a pay-as-you-go model, eliminating substantial upfront infrastructure investments. Organizations can dynamically adjust their computing capacity based on demand, ensuring optimal resource utilization and cost efficiency.
... [Note: Full response would continue with more words]
</response>
</example>

<example index="3">
<query>
Improve the grammar and clarity of this section
</query>
<context>
<reflyArtifact identifier="api-docs" type="document" title="API Documentation">
Authentication is required for all endpoints. <highlight>When you wanting to make API calls, you need getting the token first and then you putting it in the header of you're request, this is important because without it the API will not work and give error.</highlight> See the authentication section for details.
</reflyArtifact>
</context>
<response>
Authentication is required for all endpoints. To make API calls, first obtain an authentication token and include it in your request headers. This step is crucial as requests without valid authentication tokens will result in error responses. See the authentication section for details.
... [Note: Full response would continue with more words]
</response>
</example>`;

// TODO: add citation
export const contextualExamples = `
## Context-Aware Examples

<example index="1">
<chatHistory>
<ChatHistoryItem type="human">What's our current cloud infrastructure cost?</ChatHistoryItem>
<ChatHistoryItem type="ai">Based on recent analysis, we've achieved 40% cost reduction .</ChatHistoryItem>
<ChatHistoryItem type="human">Please update our cloud overview with these details.</ChatHistoryItem>
</chatHistory>
<context>
<documentContext>
<reflyArtifact identifier="tech-doc" type="document" title="Cloud Computing Overview">
Cloud computing is transforming modern business. <highlight>It provides scalable resources and reduces infrastructure costs. Companies can access computing power on demand.</highlight> Many organizations are adopting cloud solutions.
</reflyArtifact>
</documentContext>

<referenceContext>
<MentionedContext>
<KnowledgeBaseResources>
<ContextItem citationIndex='1' type='resource' title='Cost Analysis'>
Our analysis shows:
- 40% reduction in infrastructure costs
- 60% improvement in resource utilization
- 30% faster deployment cycles
</ContextItem>
</KnowledgeBaseResources>
</MentionedContext>
</referenceContext>
</context>
<response>
Cloud computing is transforming modern business. It delivers elastic scalability and proven cost benefits, with our organization achieving a 40% reduction in infrastructure costs . The platform enables dynamic resource scaling with 60% improved utilization rates and 30% faster deployment cycles . Many organizations are adopting cloud solutions.
</response>
</example>

<example index="2">
<chatHistory>
<ChatHistoryItem type="human">What authentication method do we use?</ChatHistoryItem>
<ChatHistoryItem type="ai">We use JWT tokens with 15-minute expiration .</ChatHistoryItem>
<ChatHistoryItem type="human">Update our auth docs to reflect this.</ChatHistoryItem>
</chatHistory>
<context>
<documentContext>
<reflyArtifact identifier="api-docs" type="document" title="API Documentation">
Authentication is required for all endpoints. <highlight>When you wanting to make API calls, you need getting the token first and then you putting it in the header of you're request.</highlight> See the authentication section for details.
</reflyArtifact>
</documentContext>

<referenceContext>
<MentionedContext>
<KnowledgeBaseDocuments>
<ContextItem citationIndex='1' type='document' title='Security Standards'>
Authentication requirements:
- JWT-based authentication
- 15-minute token expiration
- Rate limiting enforced
</ContextItem>
</KnowledgeBaseDocuments>
</MentionedContext>
</referenceContext>
</context>
<response>
Authentication is required for all endpoints. To make API calls, obtain a JWT token which expires after 15 minutes . Include this token in your request headers and note that rate limiting is enforced on all endpoints . See the authentication section for details.
</response>
</example>

<example index="3">
<chatHistory>
<ChatHistoryItem type="human">How do we handle database backups?</ChatHistoryItem>
<ChatHistoryItem type="ai">We use automated daily backups with 30-day retention .</ChatHistoryItem>
<ChatHistoryItem type="human">Please update our backup documentation.</ChatHistoryItem>
</chatHistory>
<context>
<documentContext>
<reflyArtifact identifier="ops-doc" type="document" title="Database Operations">
Database management is critical. <highlight>We perform regular backups to ensure data safety.</highlight> Recovery procedures are documented below.
</reflyArtifact>
</documentContext>

<referenceContext>
<MentionedContext>
<KnowledgeBaseDocuments>
<ContextItem citationIndex='1' type='document' title='Backup Policy'>
Current backup strategy:
- Automated daily backups
- 30-day retention period
- Encrypted storage
</ContextItem>
<ContextItem citationIndex='2' type='document' title='Recovery SLA'>
Recovery time objectives:
- Critical data: 1 hour
- Non-critical: 4 hours
</ContextItem>
</KnowledgeBaseDocuments>
</MentionedContext>
</referenceContext>
</context>
<response>
Database management is critical. We implement automated daily backups with 30-day retention and encrypted storage . Our recovery SLAs guarantee 1-hour restoration for critical data and 4-hour recovery for non-critical systems . Recovery procedures are documented below.
</response>
</example>

<example index="4">
<chatHistory>
<ChatHistoryItem type="human">What monitoring tools do we use?</ChatHistoryItem>
<ChatHistoryItem type="ai">We use Prometheus with Grafana dashboards .</ChatHistoryItem>
<ChatHistoryItem type="human">Update our monitoring section with these details.</ChatHistoryItem>
</chatHistory>
<context>
<documentContext>
<reflyArtifact identifier="ops-doc" type="document" title="Operations Guide">
System health is monitored continuously. <highlight>We use various tools to track performance metrics.</highlight> Alert thresholds are defined below.
</reflyArtifact>
</documentContext>

<referenceContext>
<MentionedContext>
<KnowledgeBaseDocuments>
<ContextItem citationIndex='1' type='document' title='Monitoring Stack'>
Current tooling:
- Prometheus metrics
- Grafana dashboards
- PagerDuty alerts
</ContextItem>
<ContextItem citationIndex='2' type='document' title='Alert Thresholds'>
Standard thresholds:
- CPU: 80%
- Memory: 90%
- Latency: 500ms
</ContextItem>
</KnowledgeBaseDocuments>
</MentionedContext>
</referenceContext>
</context>
<response>
System health is monitored continuously. We leverage Prometheus for metrics collection with Grafana dashboards for visualization, integrated with PagerDuty for alerting . Our system triggers alerts at 80% CPU utilization, 90% memory usage, and 500ms latency thresholds . Alert thresholds are defined below.
</response>
</example>`;