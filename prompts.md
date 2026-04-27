# Prompt 1 - Enrich US

Please analyze and fix the `user-story.md` file and follow these steps:

1.  You will act as a product expert with technical knowledge.

2.  Understand the problem described in the ticket
    
3.  Decide whether or not the User Story is completely detailed according to product's best practices: Include a full description of the functionality, a comprehensive list of fields to be updated, the structure and URLs of the necessary endpoints, the files to be modified according to the existing architecture and best practices, the steps required for the task to be considered complete, how to update any relevant documentation or create unit tests, and non-functional requirements related to security, performance, etc.
    
4.  If the user story lacks the technical and specific detail necessary to allow the developer to be fully autonomous when completing it, provide an improved story that is clearer, more specific, and more concise in line with product best practices described in step 3 on a new file called `user-story-enriched.md` using markdown format.

5.  If you have any questions, please ask them with the goal of achieving the best possible results before creating the enriched issue


# Prompt 2 - Enriched US breakdown

Analyze `user-story-enriched.md` file and break down the feature into individual tasks following these steps:

1.  Write each task definition in a single .md file.

2.  Use a short file name that wraps up the issue description. 

3.  First task should have all content related to prisma and schema definition.

4.  The second task should have all definition related to backend endpoint.

5.  Third task should have all description related to frontend stuff.

6.  Remember to have a consistent structure through all tasks definition.

7.  If you have any questions, please ask them with the goal of achieving the best possible results before creating tasks.


# Prompt 3 - Generate agents.md

## Context

Generate an `agents.md` file at the project root that serves as context documentation so an AI agent can work on the codebase without doubts.

## File Requirements

### Location
- The file must be created at the **project root**, not in subdirectories.

### Mandatory Content

1. **Project Overview**
   - Project name
   - Application type
   - General purpose
   - Project status

2. **Tech Stack**
   - Frontend: framework, language, port, testing
   - Backend: framework, language, ORM, database, ports, testing
   - Infrastructure: Docker Compose

3. **Project Structure**
   - Directory tree showing the complete structure
   - Brief description of each important directory/file

4. **Environment Variables**
   - Show `.env` structure without exposing real secrets
   - Use placeholders like `<password>` or `<secret>` for sensitive values
   - Include database connection details (host, port, user, db name)

5. **Available Commands**
   - Tables with commands organized by section (Backend, Frontend, Database)
   - Include: installation, development, build, tests, production
   - Clear description of each command

6. **Database Schema**
   - Show current Prisma schema
   - Include note about project development status

7. **Code Conventions**
   - Linting and formatting tools used
   - Important configurations (TypeScript strict, etc.)
   - Testing patterns

8. **Getting Started**
   - Numbered steps to start the project from scratch
   - Essential commands organized by component

9. **Documentation**
   - Reference to other relevant documentation files

### Excluded Content

- **DO NOT include**: Secrets, passwords, API keys, or any real credentials
- **DO NOT include**: Specific functionalities or features under development
- **DO NOT include**: User stories or acceptance criteria

### Detail Level

- Content must be sufficient for an agent to:
  - Understand the overall architecture
  - Run the project locally
  - Run tests
  - Perform development tasks without hesitation
  - Understand code conventions

### Format

- Use markdown with hierarchical headers (H1, H2, H3)
- Tables for command listings
- Syntax-highlighted code (```bash, ```env, ```prisma)
- Ordered lists for steps
- Well-separated and easy-to-scan sections

## Example Structure

```markdown
# [Project Name]

## Project Overview
...

## Tech Stack
...

## Project Structure
...

## Environment Variables
...

## Available Commands
...

## Database Schema
...

## Code Conventions
...

## Getting Started
...

## Documentation
...
```


# Prompt 4 - Implement task 1

Lets define a plan to implement the task 1. Definition is located at task-1-prisma-schema.md file. Remember to read the agents.md file to have all project context and if you have any question do not hesitate to check it with me to have the best results.


# Prompt 5 - Implement task 2

Lets define a plan to implement the task 2. Definition is located at task-2-backend-api.md file. Remember to read the agents.md file to have all project context and if you have any question do not hesitate to check it with me to have the best results.


# Prompt 6 - Implement task 3

Lets define a plan to implement the task 3. Definition is located at task-3-frontend-form.md file. Remember to read the agents.md file to have all project context and if you have any question do not hesitate to check it with me to have the best results.