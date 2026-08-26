---
name: project-readme-generator
description: Generates comprehensive README.md files for the root, frontend, and backend of the Movie Ticket Booking System project by analyzing codebase structure.
allowed-tools: ["read_url_content", "find_by_name", "grep_search", "write_to_file", "view_file"]
version: 2.0.0
author: GLINCKER Team
license: Apache-2.0
keywords: [documentation, readme, markdown, project, spring-boot, react]
---

# Project README Generator

Automatically generates professional, comprehensive `README.md` files for the Movie Ticket Booking System project by analyzing the specific project structure, dependencies, and architectural patterns (PBAC, VNPay).

## What This Skill Does

This skill helps you create high-quality README files tailored to this repository by:
- Analyzing the frontend/backend project structure
- Identifying Spring Boot, React, and PostgreSQL configurations
- Generating **THREE** separate README files: one for the root, one for the backend, and one for the frontend.
- Highlighting enterprise features like Dynamic PBAC and Pessimistic Locking

## Instructions

When generating a README for this project, follow these steps:

### 1. Project Discovery
- Confirm the `backend/` and `frontend/` directories.
- Examine configuration files like `backend/pom.xml` and `frontend/package.json`.

### 2. Output Requirements
You must generate and save **THREE** distinct README files:

#### A. Root README (`/README.md`)
- **Title**: `🍿 Movie Ticket Booking System` with badge shields.
- **Overview**: High-level summary of the fullstack application.
- **Monorepo Structure**: Briefly explain the separation between `backend/` and `frontend/`.
- **Global Prerequisites**: Java 21, Node.js 20, PostgreSQL 16.
- **Quick Start**: Basic commands to start both layers.
- **Links**: Provide hyperlinks to `./backend/README.md` and `./frontend/README.md` for deep dives.

#### B. Backend README (`/backend/README.md`)
- **Title**: `🛠️ Backend - Spring Boot Architecture`
- **Tech Stack**: Spring Boot 3, Spring Security, JPA, PostgreSQL, VNPay, ZXing.
- **Architecture Highlights**:
  - **Dynamic PBAC**: Detailed explanation of Permissions, RolePermissions, and `@PreAuthorize`.
  - **Concurrency**: How Pessimistic Locking is used for seat booking.
  - **Payment Flow**: Steps for VNPay integration.
- **Database Schema Overview**: Mention key tables (movies, rooms, seats, bookings, accounts, roles, permissions).
- **API Endpoints Table**: List key Public vs Authenticated endpoints.
- **Setup & Run**: Detailed Maven commands and `application-local.properties` setup.

#### C. Frontend README (`/frontend/README.md`)
- **Title**: `💻 Frontend - React Application`
- **Tech Stack**: React 19, TypeScript, Vite, TailwindCSS, Axios, React Router.
- **Project Structure**: Explain `components`, `pages`, `guards`, `features`, `api`.
- **State & Authentication**: Explain how JWT is stored in localStorage, the `axios` interceptor for 401 handling, and the route guards (`SuperAdminGuard`, `ManagerGuard`, etc.).
- **Key Features**: Seat map visualization, dynamic ticket pricing UI, QR code scanning.
- **Setup & Run**: Detailed npm commands (`npm install`, `npm run dev`).

### 3. Writing Style
- Professional, technical, and confident tone.
- Clear, concise language with Active voice.
- Code blocks with proper syntax highlighting.
- Write in English (or Vietnamese if explicitly requested).

### 4. Execution
Use the `write_to_file` tool to save all three files to their respective locations, then commit and push the changes.
