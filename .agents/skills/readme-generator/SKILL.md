---
name: project-readme-generator
description: Generates comprehensive README.md files for the Movie Ticket Booking System project by analyzing codebase structure
allowed-tools: ["read_url_content", "find_by_name", "grep_search", "write_to_file", "view_file"]
version: 1.0.0
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
- Highlighting enterprise features like Dynamic PBAC and Pessimistic Locking
- Generating appropriate sections with clear setup instructions
- Following README best practices for a developer portfolio

## Instructions

When generating a README for this project, follow these steps:

### 1. Project Discovery

First, analyze the project structure:
- Use `list_dir` or `find_by_name` to confirm the `backend/` and `frontend/` directories.
- Use `view_file` to examine configuration files like `backend/pom.xml` and `frontend/package.json`.
- Detect specific security implementation details (e.g. `SecurityConfig.java`, PBAC mappings).

### 2. Content Analysis

Based on findings, determine:
- Project type: Fullstack Web Application
- Primary programming languages: Java (Backend), TypeScript (Frontend)
- Key features to highlight: Dynamic PBAC, VNPay integration, Seat Locking mechanism.
- Start and test commands for both layers.

### 3. README Generation

Create a `README.md` with these required sections:

**Required Sections:**
- **Title and Description**: `🍿 Movie Ticket Booking System` with badge shields (Spring Boot, React, PostgreSQL).
- **Features**: Key functionality (Multi-role dashboards, PBAC, VNPay, Pessimistic Locking).
- **Project Structure**: Explain the monorepo split (`frontend/` and `backend/`).
- **Tech Stack**: Frontend, Backend, and Database technologies used.
- **Getting Started**:
  - Prerequisites (Java 21, Node.js, PostgreSQL).
  - Backend setup commands.
  - Frontend setup commands.
- **License**: License information (if applicable).

### 4. Writing Style

Use this style for generated READMEs:
- Professional, technical, and confident tone.
- Clear, concise language with Active voice.
- Code blocks with proper syntax highlighting (`bash`, `java`, `typescript`).
- Badge shields for tech stack indicators.
- Emoji sparingly but effectively for section headers.
- Write in English (or Vietnamese if explicitly requested).

### 5. Output

Present the generated README to the user and offer to:
- Write it directly to `README.md` at the root using `write_to_file`.
- Make adjustments based on feedback.

## Examples

### Example 1: Fullstack Setup

**User Request:**
"Generate a README for this project to put on my GitHub."

**Agent Response:**
1. Confirms the presence of `backend` and `frontend` folders.
2. Extracts tech stack versions from `pom.xml` and `package.json`.
3. Drafts a complete README.md adhering to the structure.
4. Writes the file to the workspace and asks for user feedback.
