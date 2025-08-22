import {
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import {useMemo, useState} from 'react';
import {NewNote} from './Components/NewNote';
import {useLocalStorage} from './Hooks/useLocalStorage';
import NoteList from './Components/NoteList';
import {v7 as uuidv7} from 'uuid';
import EditNote from './Components/EditNote';

export type Note = {id: string} & NoteData;
export type RawNote = {id: string} & RawNoteData;

export type RawNoteData = {
  title: string;
  markdown: string;
  tagIds: string[];
};

export type NoteData = {
  title: string;
  markdown: string;
  tags: Tag[];
};

export type Tag = {
  id: string;
  label: string;
};

const App = () => {
  const [notes, setNotes] = useLocalStorage<RawNote[]>('NOTES', []);
  const [tags, setTags] = useLocalStorage<Tag[]>('TAGS', []);
  const [editTagsOpen, setEditTagsOpen] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderActions =
    location.pathname === '/new' || location.pathname.endsWith('/edit');

  const isNew = location.pathname === '/new';
  const isEdit = location.pathname.endsWith('/edit');
  const editId = isEdit ? location.pathname.split('/').slice(-2)[0] : undefined;

  const notesWithTags = useMemo(
    () =>
      notes.map((note) => ({
        ...note,
        tags: tags.filter((tag) => note.tagIds.includes(tag.id)),
      })),
    [notes, tags]
  );

  function onCreateNote({tags, ...data}: NoteData) {
    setNotes((prev) => [
      ...prev,
      {...data, id: uuidv7(), tagIds: tags.map((t) => t.id)},
    ]);
  }

  function onUpdateNote(id: string, {tags, ...data}: NoteData) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? {...n, ...data, tagIds: tags.map((t) => t.id)} : n
      )
    );
  }

  function onDeleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function addTag(tag: Tag) {
    setTags((prev) => [...prev, tag]);
  }

  function updateTag(id: string, label: string) {
    setTags((prev) => prev.map((t) => (t.id === id ? {...t, label} : t)));
  }

  function deleteTag(id: string) {
    setTags((prev) => prev.filter((t) => t.id !== id));
    setNotes((prev) =>
      prev.map((n) => ({...n, tagIds: n.tagIds.filter((tid) => tid !== id)}))
    );
  }

  function addNewTagFromHeader() {
    const label = newTagLabel.trim();
    if (!label) return;
    const exists = tags.some(
      (t) => t.label.toLowerCase() === label.toLowerCase()
    );
    if (exists) return setNewTagLabel('');
    setTags((prev) => [...prev, {id: uuidv7(), label}]);
    setNewTagLabel('');
  }

  return (
    <div className="h-screen bg-gray-50">
      <div className="h-full mx-auto max-w-6xl p-4">
        <div className="h-full w-full rounded-2xl border border-gray-200 bg-white shadow-sm flex flex-col">
          <header className="border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Marked
              </h1>
              {!hideHeaderActions ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/new"
                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-white text-base font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Create
                  </Link>
                  <button
                    onClick={() => setEditTagsOpen(true)}
                    className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-base text-gray-700 bg-white font-semibold shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Edit Tags
                  </button>
                </div>
              ) : isNew ? (
                <div className="flex items-center gap-3">
                  <button
                    form="note-form"
                    type="submit"
                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-white text-base font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Save
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-base text-gray-700 bg-white font-semibold shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Cancel
                  </button>
                </div>
              ) : isEdit ? (
                <div className="flex items-center gap-3">
                  <button
                    form="note-form"
                    type="submit"
                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-white text-base font-semibold shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      if (!editId) return;
                      onDeleteNote(editId);
                      navigate('/');
                    }}
                    className="inline-flex items-center rounded-xl border border-red-300 px-4 py-2 text-base text-red-600 bg-white font-semibold shadow-sm hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300">
                    Delete
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center rounded-xl border border-gray-300 px-4 py-2 text-base text-gray-700 bg-white font-semibold shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    Cancel
                  </button>
                </div>
              ) : null}
            </div>
          </header>

          <main className="flex-1 overflow-auto p-4">
            <Routes>
              <Route
                path="/"
                element={
                  <NoteList
                    availableTags={tags}
                    notes={notesWithTags}
                    onUpdateTag={updateTag}
                    onDeleteTag={deleteTag}
                    onAddTag={addTag}
                  />
                }
              />
              <Route
                path="/new"
                element={
                  <NewNote
                    onSubmit={onCreateNote}
                    onAddTag={addTag}
                    availableTags={tags}
                  />
                }
              />
              <Route
                path="/:id/edit"
                element={
                  <EditNote
                    notes={notesWithTags}
                    availableTags={tags}
                    onAddTag={addTag}
                    onSubmit={onUpdateNote}
                    onDelete={onDeleteNote}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>

      {editTagsOpen && !hideHeaderActions && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setEditTagsOpen(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-lg ring-1 ring-black/5">
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                <h2 className="text-lg font-semibold">Edit Tags</h2>
                <button
                  onClick={() => setEditTagsOpen(false)}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                  aria-label="Close">
                  ×
                </button>
              </div>
              <div className="p-5">
                <div className="mb-4 flex items-center gap-2">
                  <input
                    type="text"
                    value={newTagLabel}
                    onChange={(e) => setNewTagLabel(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' &&
                      (e.preventDefault(), addNewTagFromHeader())
                    }
                    placeholder="New tag label"
                    className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                  />
                  <button
                    onClick={addNewTagFromHeader}
                    aria-label="Add tag"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    +
                  </button>
                </div>
                <div className="space-y-3">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                        value={tag.label}
                        onChange={(e) => updateTag(tag.id, e.target.value)}
                      />
                      <button
                        onClick={() => deleteTag(tag.id)}
                        aria-label="Delete tag"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-300 bg-white text-red-600 hover:bg-red-50">
                        ×
                      </button>
                    </div>
                  ))}
                  {tags.length === 0 && (
                    <div className="text-sm text-gray-500">
                      No tags yet. Create some while adding notes.
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t border-gray-100 px-5 py-3">
                <button
                  onClick={() => setEditTagsOpen(false)}
                  className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white font-medium shadow-sm hover:bg-gray-100">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
