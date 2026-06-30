# Cloud Architecture and Technology Stack

> **Note:** This document describes the **production-grade cloud architecture** intended for enterprise deployment. The current MVP implementation uses a local stack: Python + FastAPI + CSV files + React 19. The GCP architecture described here is the target for Phase 3+ deployment.

---

## 1. Objective

Define a scalable, resilient, production-ready cloud architecture for deploying the intelligent tourism redistribution engine at enterprise scale.

The solution is designed using managed services from Google Cloud Platform (GCP), minimising operational complexity and facilitating future evolution of the system.

---

## 2. Architectural Principles

**Scalability**
Capacity to support millions of users and recommendations.

**Modularity**
Decoupled services connected via APIs.

**Observability**
Comprehensive monitoring of components and models.

**Security**
Protection of personal data and regulatory compliance.

**Sustainability**
Optimisation of technological and tourism resource usage.

---

## 3. General Architecture

```
TUI Digital Channels
        |
   API Gateway
        |
Recommendation Service
        |
  Feature Store
        |
 Vertex AI Models
        |
    BigQuery
        |
   Data Lake
        |
Operational Data Sources
```

---

## 4. Ingestion Layer

**Cloud Storage**
Initial data storage.
Types of information:
- Bookings.
- Hotel inventory.
- Activities.
- Events.
- External data.

**Cloud Dataflow**
Batch and streaming data processing.
Functions:
- Cleaning.
- Transformation.
- Validation.

---

## 5. Analytics Platform

**BigQuery**
Primary analytics repository.
Stores:
- Historical data.
- Aggregated data.
- Business metrics.
- Analytical features.

Benefits:
- High scalability.
- Standard SQL.
- Native AI integration.

---

## 6. Data Lake

**Google Cloud Storage**
Recommended structure:

| Zone | Contents |
|---|---|
| Raw Zone | Original, unprocessed data |
| Curated Zone | Cleaned and validated data |
| Business Zone | Data ready for consumption |

---

## 7. Feature Store

**Vertex AI Feature Store**
Centralises variables used by the models.

User features:
- Travel history.
- Preferences.
- Segment.

Destination features:
- Popularity.
- Occupancy.
- Sustainability Score.

Context features:
- Season.
- Events.
- Weather.

Benefits:
- Consistency between training and inference.
- Variable reuse.
- Reduced operational complexity.

---

## 8. Model Training

**Vertex AI Training**
Responsible for model training.

Planned models:

**Affinity Model**
Predicts user-destination affinity.

**Sustainability Model**
Estimates tourist pressure.

**Ranking Model**
Generates final recommendations.

---

## 9. Model Registry

**Vertex AI Model Registry**
Enables:
- Versioning.
- Traceability.
- Governance.
- Model rollback.

---

## 10. Online Inference

**Vertex AI Endpoints**
Exposes models in real time.
Objective: Generate recommendations during user browsing.
Target latency: Under 500 ms.

---

## 11. Recommendation Service

**Cloud Run**
Primary microservice.
Responsibilities:
- Retrieve user profile.
- Query models.
- Execute ranking.
- Generate final response.

Benefits:
- Automatic scaling.
- Low operational cost.
- Simplified deployment.

---

## 12. APIs

**Recommendation API**
Returns personalised recommendations.

**User Profile API**
Retrieves consolidated user information.

**Sustainability API**
Exposes sustainability indicators.

**Analytics API**
Queries operational metrics.

---

## 13. Executive Dashboard

**Looker**
Primary visualisation tool.

Business metrics:
- Bookings.
- Conversion.
- Revenue.

AI metrics:
- CTR.
- Precision.
- Acceptance Rate.

Sustainability metrics:
- Redistribution.
- Congestion.
- Regional diversification.

---

## 14. Observability

**Cloud Monitoring**
Infrastructure monitoring.

**Cloud Logging**
Centralised log management.

**Vertex AI Monitoring**
Model drift and performance monitoring.

Indicators:
- Latency.
- Availability.
- Precision.
- Data Drift.

---

## 15. Security

**Identity and Access Management**
Role-based access control.

**Data Encryption**
Encryption in transit and at rest.

**Audit Logging**
Activity and access records.

**GDPR Compliance**
Protection of personal data for European travellers.

---

## 16. CI/CD

**Cloud Build**
Deployment automation.

**Artifact Registry**
Image and artefact management.

**GitHub**
Version control.

Pipeline:
```
Development → Testing → Validation → Production
```

---

## 17. Target Architecture

### Current MVP (Built — June 2026)

| Dimension | Spec |
|---|---|
| Users | 100 synthetic profiles (CSV) |
| Destinations | 20 Spanish destinations (CSV) |
| Bookings | ~1,000 records (CSV) |
| API | FastAPI, localhost:8000 |
| Frontend | React 19, localhost:5173 |
| Dashboard | Streamlit, localhost:8501 (optional) |
| Availability | Local development only |
| Latency | Typically under 200 ms on local hardware |
| Scaling | Single process, no auto-scaling |

### Production Target (Phase 3+, GCP)

| Dimension | Spec |
|---|---|
| Users | Millions |
| Destinations | Thousands |
| Recommendations | Real-time |
| Target availability | 99.9% |
| Target latency | Under 500 ms |
| Scaling | Automatic and on-demand (Cloud Run) |

---

## 18. Architecture Benefits

**Technical**
- Scalability.
- High availability.
- Simplified maintenance.

**Business**
- Rapid implementation.
- Lower operational cost.
- Greater capacity for innovation.

**Sustainability**
- Support for ESG objectives.
- Continuous measurement of tourism impact.
- Future international scalability.

---

## Conclusion

The proposed architecture enables the deployment of an enterprise-grade sustainable tourism recommendation platform using managed services from Google Cloud Platform.

The solution combines advanced analytics, Artificial Intelligence, and continuous monitoring to deliver personalised recommendations that serve both TUI's business objectives and its sustainability goals.
