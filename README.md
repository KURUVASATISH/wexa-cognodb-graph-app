# Wexa CognoDB Graph Application

A full-stack graph-based application built with **Node.js, Express.js, CognoDB, Cypher, HTML, CSS, and JavaScript**.

The application demonstrates how a graph database can model relationships between people, skills, projects, technologies, companies, and jobs. It also provides skill-based job recommendations by analyzing the overlap between a person's skills and the skills required by different jobs.

## Live Demo

**Live Application:**  
https://YOUR-RENDER-URL.onrender.com

**GitHub Repository:**  
https://github.com/KURUVASATISH/wexa-cognodb-graph-app

---

## Features

- Graph-based data modeling using CognoDB
- Person, skill, project, technology, company, and job entities
- Interactive relationship graph
- Person selection through a dynamic dropdown
- Display of a person's skills
- Skill-based job recommendations
- Matching and missing skill analysis
- Match percentage calculation
- REST API built with Express.js
- Database seeding scripts
- Production deployment using Render
- Environment-based configuration for database credentials

---

## Tech Stack

### Backend
- Node.js
- Express.js
- JavaScript
- CognoDB
- Cypher

### Frontend
- HTML
- CSS
- JavaScript
- D3.js

### Development & Deployment
- Git
- GitHub
- Render

---

## Application Architecture

```text
                    ┌──────────────────────┐
                    │      Frontend        │
                    │   HTML/CSS/JS/D3.js  │
                    └──────────┬───────────┘
                               │
                               │ HTTP / REST API
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │      Node.js         │
                    └──────────┬───────────┘
                               │
                               │ Cypher Queries
                               ▼
                    ┌──────────────────────┐
                    │      CognoDB         │
                    │    Graph Database    │
                    └──────────────────────┘