# Mini Notes Application

## Project Overview

Mini Notes Application is a full-stack web application that allows users to manage personal notes with ease. Users can create, view, edit, delete, search, and filter notes by category. The project is built using Next.js with the App Router, TypeScript, and PostgreSQL, and demonstrates a complete CRUD workflow using REST API principles.

## Features

- Create a new note
- Display all notes
- Edit existing notes
- Delete notes
- Search notes by title and content
- Filter notes by category
- PostgreSQL database integration
- REST API using Next.js API Route Handlers
- Responsive UI
- Form validation

## Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- Tailwind CSS

**Backend**
- Node.js
- Next.js API Route Handlers (REST API)

**Database**
- PostgreSQL
- pg (node-postgres)

## Application Flow

1. The user opens the application and views a list of all existing notes fetched from the database.
2. The user can create a new note by filling out a form with title, content, and category.
3. The user can search notes by title or content, and filter notes by category.
4. The user can edit an existing note, which updates the record in the database.
5. The user can delete a note, which removes it from the database.
6. All data operations are handled through REST API endpoints connected to a PostgreSQL database.

## API Endpoints

| Method | Endpoint          | Description        |
|--------|-------------------|---------------------|
| GET    | /api/notes        | Fetch all notes     |
| POST   | /api/notes        | Create a note       |
| PUT    | /api/notes        | Update a note       |
| DELETE | /api/notes?id=1   | Delete a note       |

## Database Structure

**Database name:** `mini_notes`

**Table:** `notes`

| Column      | Description                     |
|-------------|----------------------------------|
| id          | Unique identifier for the note   |
| title       | Title of the note                |
| content     | Main content/body of the note    |
| category    | Category assigned to the note    |
| created_at  | Timestamp when the note was created |

## Project Structure

```
mini-notes/
├── app/
│   ├── api/
│   │   └── notes/
│   │       └── route.ts
│   ├── page.tsx
│   └── ...
├── lib/
│   └── db.ts
├── types/
├── public/
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v18 or later recommended)
- PostgreSQL (installed and running locally or accessible remotely)
- npm or yarn package manager

## Installation and Setup

1. Clone the repository:

```bash
git clone https://github.com/your-username/mini-notes.git
```

2. Navigate to the project directory:

```bash
cd mini-notes
```

3. Install dependencies:

```bash
npm install
```

4. Create a PostgreSQL database named `mini_notes` and set up the `notes` table with the required columns as described in the Database Structure section.

## Environment Variables

Create a `.env.local` file in the root directory and add the following variable:

```
DATABASE_URL=your_database_connection_string
```

**Note:** The `.env.local` file contains sensitive configuration and should not be committed to GitHub. Make sure it is included in your `.gitignore` file.

## Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at:

```
http://localhost:3000
```

## Screenshots

_Add screenshots of the application below._

**Home Page / Notes List**
`[Add screenshot here]`

**Create Note Form**
`[Add screenshot here]`

**Edit Note**
`[Add screenshot here]`

**Search and Filter**
`[Add screenshot here]`

## Future Enhancements

- User authentication and per-user notes
- Pagination for large note lists
- Rich text editor support for note content
- Dark mode support
- Note tagging in addition to categories

## Author

**Your Name**
Software Developer

- GitHub: [your-github-profile-link]
- LinkedIn: [your-linkedin-profile-link]
- Email: your-email@example.com
