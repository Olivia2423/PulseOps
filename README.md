# PulseOps – Real-Time Workflow Monitoring System

A mobile command center for monitoring operational workflows in real time.

PulseOps simulates a distributed order-processing system and provides live visibility into system health, workflow state transitions, alerts, and operator interventions. The application demonstrates event-driven architecture, real-time streaming, and operational tooling patterns commonly used in production systems.

---

## App Screenshots

| Dashboard | Live Feed |
|----------|-----------|
| ![](<img width="328" height="740" alt="image" src="https://github.com/user-attachments/assets/81d2c3a5-7271-4bd4-bee3-d6c20bb21246" />
) | ![](screenshots/livefeed.png) |

| Alerts | Orders |
|------|------|
| ![](screenshots/alerts.png) | ![](screenshots/orders.png) |

| Audit Log |
|----------|
| ![](screenshots/audit.png) |

---
# Demo Capabilities

PulseOps simulates how operational teams monitor and manage large-scale transaction pipelines.

The system includes:

- Real-time order lifecycle simulation
- Live operational metrics dashboard
- Alert detection and incident lifecycle management
- Operator actions with audit logging
- WebSocket-based event streaming
- Mobile monitoring interface

Orders continuously flow through a distributed pipeline while the mobile app observes system health and allows operators to respond to incidents.

---

## System Architecture

PulseOps uses an event-driven architecture.

The backend simulation engine generates order activity and system events.  
These events are streamed to the mobile application in real time using WebSockets.

**Flow:**

Backend Simulation Engine (Node.js)  
→ WebSocket Server (Socket.io)  
→ React Native Mobile App

The mobile app displays these events across multiple operational views:

- Dashboard – system health metrics
- Live Feed – real-time event stream
- Alerts – incident monitoring and response
- Orders – order lifecycle inspection
- Audit Log – operator activity history


The system uses an event-driven architecture where backend events stream to the mobile client via WebSockets.

---

# Order Lifecycle Simulation

Orders move through a realistic processing pipeline.

States:
ORDER_CREATED
ORDER_UPDATED
ALERT_TRIGGERED
ALERT_UPDATED
METRICS_UPDATED
AUDIT_LOGGED


Failures occur probabilistically to simulate real-world instability in distributed systems.

Operators can intervene by retrying failed orders.

---

# Alert System

PulseOps automatically detects operational issues using threshold-based monitoring.

Example triggers:

- High payment failure rate
- Excessive order backlog

Alert lifecycle:
OPEN → ACKNOWLEDGED → RESOLVED


If system conditions regress, alerts automatically reopen.

Alerts automatically resolve when system health recovers.

---

# Audit Logging

Every operational action is recorded in an immutable audit trail.

Examples:

- Order retry actions
- Alert acknowledgement
- Alert resolution
- Automatic system recovery

This simulates compliance and observability patterns used in enterprise systems.

---

# Real-Time Event Streaming

The backend emits events via WebSockets:
ORDER_CREATED,
ORDER_UPDATED,
ALERT_TRIGGERED,
ALERT_UPDATED,
METRICS_UPDATED,
AUDIT_LOGGED.


The mobile client subscribes to these events and updates UI state instantly.

---

# Technology Stack

## Mobile

- React Native (Expo)
- TypeScript
- Zustand state management
- Expo Router
- Socket.io Client

## Backend

- Node.js
- Express
- Socket.io
- TypeScript

## Architecture Concepts

- Event-driven architecture
- State machine modeling
- Real-time streaming
- Domain-driven state modeling
- Operational monitoring simulation

---

# Running the Project

## 1. Clone the repository
- git clone https://github.com/Olivia2423/PulseOps.git
- cd PulseOps

---

## 2. Start the backend server
- cd apps/server
- npm install
- npm run dev


Server runs at: http://localhost:4000

---

## 3. Start the mobile application
- cd mobile
- npm install
- npx expo start


Open the app using:

- Android Emulator
- iOS Simulator
- Expo Go on a mobile device

---

# Example Operational Workflow

1. Orders enter the system automatically.
2. Some orders fail during payment processing.
3. Failure rate crosses the alert threshold.
4. An alert is triggered.
5. An operator acknowledges the alert.
6. The operator retries a failed order.
7. System health recovers.
8. The alert automatically resolves.
9. All actions appear in the audit log.

---

# Why This Project Matters

PulseOps demonstrates engineering concepts commonly used in modern SaaS platforms:

- Real-time observability
- Distributed workflow monitoring
- Operational alerting
- Incident lifecycle management
- Event-driven architecture

These patterns are commonly used in logistics systems, payment platforms, marketplaces, and internal DevOps tooling.

---

# Author

**Olivia Kewang**  
Software Development Student – Olivia Kewang

- GitHub: https://github.com/Olivia2423 
- LinkedIn: https://www.linkedin.com/in/olivia-christy/

---

# Future Improvements

Potential enhancements include:

- Authentication and role-based operator accounts
- Metrics visualization charts
- Alert assignment workflow
- Order prioritization controls
- Persistent database storage
- Service health simulations
- Distributed worker nodes

---

## License

© 2026 Olivia Kewang. All rights reserved.
