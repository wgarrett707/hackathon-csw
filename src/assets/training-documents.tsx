const trainingDocuments: string[] = [
  `# Employee Onboarding Guide

## Welcome to InnovateTech Solutions

### Company Overview
InnovateTech Solutions is a leading provider of enterprise AI and knowledge management platforms. Our mission is to transform how organizations capture, share, and leverage institutional knowledge.

### Your First Week
- **Day 1**: IT setup, security briefing, and office tour
- **Day 2**: Product overview and architecture deep dive
- **Day 3**: Team introductions and project assignments
- **Day 4**: Client interaction training and communication protocols
- **Day 5**: Shadow senior team members, begin initial tasks

### Core Values
- **Innovation First**: Always seek creative solutions to complex problems
- **Customer Success**: Our clients' success is our primary measure of achievement
- **Collaborative Growth**: We learn and grow together as a unified team
- **Quality Excellence**: Every deliverable meets our highest standards

### Essential Resources
- Company wiki: Available on internal portal
- Slack channels: #general, #engineering, #product, #support
- Project management: Linear for task tracking
- Knowledge base: Notion workspace with all documentation

### Key Contacts
- **HR**: Sarah Johnson (sarah.johnson@innovatetech.com)
- **IT Support**: Mark Chen (it-support@innovatetech.com)
- **Your Manager**: Will be introduced on Day 1`,

  `# Information Security and Data Privacy Policy

## Overview
This document outlines InnovateTech Solutions' information security policies and procedures that all employees must follow to protect company and client data.

## Data Classification
### Confidential Data
- Client source code and proprietary algorithms
- Customer personal information (PII)
- Financial records and business plans
- Employee personal information

### Internal Data
- Project documentation and specifications
- Internal communications and meeting notes
- Performance metrics and analytics
- Marketing materials and strategies

### Public Data
- Published blog posts and whitepapers
- Open source contributions
- Public marketing content
- Press releases

## Access Controls
### Account Security
- Use strong, unique passwords (minimum 12 characters)
- Enable two-factor authentication on all accounts
- Regular password updates every 90 days
- Never share login credentials

### Device Security
- Keep all devices updated with latest security patches
- Use company-approved antivirus software
- Lock screens when away from workstation
- Report lost or stolen devices immediately

## Data Handling Procedures
### Storage Requirements
- Store confidential data only in approved cloud services
- Use encryption for all sensitive data transmission
- Maintain local backups of critical work files
- Clean desk policy - secure all documents when not in use

### Sharing Guidelines
- Verify recipient identity before sharing sensitive information
- Use secure channels for confidential communications
- Apply appropriate access permissions to shared documents
- Remove access when team members change projects

## Incident Response
If you suspect a security breach:
1. Immediately disconnect affected systems
2. Contact IT security team: security@innovatetech.com
3. Document the incident details
4. Do not attempt to fix the issue independently
5. Preserve evidence for investigation

## Compliance Requirements
- GDPR compliance for EU client data
- SOC 2 Type II certification maintenance
- Regular security awareness training (quarterly)
- Annual policy review and acknowledgment`,

  `# Product Knowledge: Enterprise AI Platform

## Platform Overview
The InnovateTech Enterprise AI Platform helps organizations unlock the value of their institutional knowledge through intelligent automation and enhanced collaboration.

## Core Features

### Knowledge Discovery Engine
- **Semantic Search**: Natural language queries across all company documents
- **Automated Tagging**: ML-powered content categorization
- **Relationship Mapping**: Identifies connections between documents and people
- **Usage Analytics**: Tracks knowledge access patterns and gaps

### Intelligent Notifications
- **Smart Alerts**: Context-aware notifications for relevant updates
- **Priority Filtering**: AI-powered importance ranking
- **Integration Sync**: Real-time updates from GitHub, Slack, and other tools
- **Custom Triggers**: User-defined notification rules

### Collaboration Hub
- **Expert Identification**: Finds subject matter experts automatically
- **Knowledge Sharing**: Streamlined content creation and distribution
- **Discussion Threading**: Organized conversations around specific topics
- **Version Control**: Track document changes and contributor history

## Technical Architecture

### Backend Infrastructure
- **Cloud Platform**: AWS with multi-region deployment
- **Database**: PostgreSQL with Redis caching layer
- **APIs**: RESTful architecture with GraphQL endpoints
- **Security**: End-to-end encryption, OAuth 2.0 authentication

### AI/ML Stack
- **NLP Engine**: Transformer-based models for text understanding
- **Vector Database**: Pinecone for semantic similarity search
- **Training Pipeline**: Continuous learning from user interactions
- **Model Serving**: Kubernetes-based inference infrastructure

## Integration Capabilities

### Supported Platforms
- GitHub/GitLab for code repositories
- Slack/Microsoft Teams for communications
- Confluence/Notion for documentation
- Jira/Linear for project management
- Google Workspace/Office 365 for productivity

### API Documentation
- **REST Endpoints**: /api/v1/ for all core operations
- **Webhooks**: Real-time event notifications
- **SDKs**: Python, JavaScript, and Go client libraries
- **Rate Limits**: 1000 requests/hour per user

## Customer Success Stories
- **TechCorp Inc.**: 40% reduction in knowledge discovery time
- **Global Systems**: 60% improvement in cross-team collaboration
- **Innovation Labs**: 25% faster onboarding for new employees

## Troubleshooting Common Issues
- **Slow Search Results**: Check network connectivity and server status
- **Missing Content**: Verify integration permissions and sync status
- **Login Problems**: Confirm SSO configuration and user permissions`,

  `# Agile Development Process Guide

## Development Methodology
InnovateTech follows Scrum methodology with 2-week sprints and continuous integration practices.

## Sprint Cycle

### Sprint Planning (First Monday)
- **Duration**: 4 hours maximum
- **Participants**: Development team, Product Owner, Scrum Master
- **Objectives**: Select backlog items, estimate effort, define sprint goal
- **Deliverables**: Sprint backlog, capacity planning, task breakdown

### Daily Standups
- **Time**: 9:00 AM daily (15 minutes maximum)
- **Format**: What I did yesterday, what I'll do today, any blockers
- **Location**: Engineering workspace or Zoom (remote days)
- **Follow-up**: Offline discussions for complex issues

### Sprint Review (Second Friday)
- **Duration**: 2 hours maximum
- **Audience**: Stakeholders, product team, development team
- **Content**: Demo completed features, discuss metrics, gather feedback
- **Outcome**: Product backlog updates and next sprint priorities

### Sprint Retrospective (Second Friday)
- **Duration**: 1.5 hours
- **Focus**: Process improvement and team dynamics
- **Format**: What went well, what could improve, action items
- **Documentation**: Update team practices based on insights

## Code Quality Standards

### Code Review Process
- All code changes require peer review before merging
- Use pull request templates with security and testing checklists
- Automated testing must pass before review approval
- Senior developer approval required for architectural changes

### Testing Requirements
- **Unit Tests**: Minimum 80% code coverage
- **Integration Tests**: End-to-end feature validation
- **Performance Tests**: Response time and load testing
- **Security Tests**: Automated vulnerability scanning

### Coding Standards
- **Language Guidelines**: Follow established style guides (Prettier, ESLint)
- **Documentation**: Inline comments for complex logic, README updates
- **Naming Conventions**: Descriptive variable and function names
- **Error Handling**: Comprehensive logging and graceful degradation

## Project Management Tools

### Linear Workflow
- **Backlog Management**: Prioritized user stories and technical tasks
- **Sprint Board**: Track progress through development stages
- **Burndown Charts**: Monitor sprint progress and velocity
- **Release Planning**: Long-term roadmap and milestone tracking

### Git Workflow
- **Branch Strategy**: Feature branches from main, no direct commits
- **Commit Messages**: Conventional commits format with issue references
- **Merge Strategy**: Squash and merge for clean history
- **Release Tags**: Semantic versioning for all releases

## Definition of Done
A task is complete when:
- Code is written and reviewed
- Unit tests pass with adequate coverage
- Integration tests validate the feature
- Documentation is updated
- Product Owner accepts the implementation
- Code is deployed to staging environment

## Quality Metrics
- **Velocity**: Story points completed per sprint
- **Bug Rate**: New bugs per release
- **Code Coverage**: Percentage of tested code
- **Customer Satisfaction**: NPS scores and feedback ratings`,

  `# Customer Communication Best Practices

## Communication Principles
Effective customer communication builds trust, demonstrates expertise, and ensures project success.

## Email Communication

### Professional Format
- **Subject Lines**: Clear, specific, and action-oriented
- **Greeting**: Use customer's preferred name and title
- **Body**: Structured with bullet points and clear sections
- **Closing**: Professional signature with contact information

### Response Standards
- **Initial Response**: Within 4 business hours
- **Status Updates**: Weekly for ongoing projects
- **Issue Resolution**: 24-hour acknowledgment, clear timeline for fixes
- **Follow-up**: Confirm issue resolution and customer satisfaction

## Meeting Management

### Pre-Meeting Preparation
- Send agenda 24 hours in advance
- Include relevant documents and materials
- Test technology setup (Zoom, screen sharing, etc.)
- Prepare talking points and potential questions

### During Meetings
- **Punctuality**: Join 2-3 minutes early
- **Active Listening**: Take notes, ask clarifying questions
- **Clear Communication**: Avoid jargon, explain technical concepts
- **Action Items**: Document decisions and next steps

### Post-Meeting Follow-up
- Send summary within 24 hours
- Include action items with owners and deadlines
- Attach any promised materials or documents
- Schedule follow-up meetings as needed

## Technical Discussions

### Explaining Complex Concepts
- **Start Simple**: Begin with high-level overview
- **Use Analogies**: Relate technical concepts to familiar ideas
- **Visual Aids**: Diagrams, screenshots, and flowcharts
- **Check Understanding**: Ask questions to confirm comprehension

### Handling Technical Issues
- **Acknowledge Quickly**: Confirm receipt of issue report
- **Investigate Thoroughly**: Reproduce issues and analyze root cause
- **Communicate Progress**: Regular updates during investigation
- **Provide Solutions**: Clear steps for resolution and prevention

## Difficult Conversations

### De-escalation Techniques
- **Listen Actively**: Allow customer to express concerns fully
- **Acknowledge Feelings**: Validate customer frustrations
- **Focus on Solutions**: Redirect from problems to resolutions
- **Set Expectations**: Provide realistic timelines and outcomes

### When to Escalate
- Customer requests features outside scope
- Technical issues beyond your expertise
- Budget or timeline changes needed
- Customer satisfaction concerns

## Documentation Requirements

### Customer Records
- **Contact Information**: Current phone, email, and preferred communication method
- **Project History**: Previous interactions, issues, and resolutions
- **Preferences**: Communication style, meeting times, decision makers
- **Technical Environment**: Software versions, infrastructure details

### Issue Tracking
- **Ticket Creation**: Detailed description with reproduction steps
- **Status Updates**: Regular progress notes in customer portal
- **Resolution Documentation**: Root cause analysis and solution steps
- **Knowledge Base**: Update internal docs with common solutions

## Success Metrics
- **Response Time**: Average time to first response and resolution
- **Customer Satisfaction**: NPS scores and feedback ratings
- **Issue Resolution**: Percentage resolved on first contact
- **Relationship Quality**: Retention rates and expansion opportunities`
];
export default trainingDocuments