# Marked

A minimal note-taking app with live Markdown preview. Built with React, TypeScript, Vite, and Tailwind.

## Features

- Create and edit notes with title, tags, and Markdown body
- Live side-by-side Markdown preview on New and Edit pages
- Filter notes by title and tags
- Manage tags (rename, add, delete) from the header modal
- LocalStorage persistence

## Usage

- New note: header “Create” button or go to `/new`
- Edit note: click a note card or go to `/:id/edit`
- Manage tags: open “Edit Tags” in the header (hidden on New/Edit pages)

## Tech

- React + TypeScript + Vite
- React Router
- Tailwind CSS
- react-markdown + remark-gfm
- react-select (creatable)
- uuid

## Scripts

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint`

Key files:

- App and routes: [src/App.tsx](src/App.tsx)
- New note: [src/Components/NewNote.tsx](src/Components/NewNote.tsx)
- Edit note: [src/Components/EditNote.tsx](src/Components/EditNote.tsx)
- Form + live preview: [src/Components/NoteForm.tsx](src/Components/NoteForm.tsx)
- Note list: [src/Components/NoteList.tsx](src/Components/NoteList.tsx)
- View-only renderer: [src/Components/ViewNote.tsx](src/Components/ViewNote.tsx)
