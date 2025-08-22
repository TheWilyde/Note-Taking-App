import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import ReactSelect from 'react-select';
import type {Tag} from '../App';

type SimplifiedNote = {
  id: string;
  title: string;
  tags: Tag[];
  markdown: string;
};

type NoteListProps = {
  availableTags: Tag[];
  notes: SimplifiedNote[];
  onDeleteTag: (id: string) => void;
  onUpdateTag: (id: string, label: string) => void;
  onAddTag: (tag: Tag) => void;
};

const NoteList = ({availableTags, notes}: NoteListProps) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [title, setTitle] = useState('');

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      return (
        (title === '' ||
          note.title.toLowerCase().includes(title.toLowerCase())) &&
        (selectedTags.length === 0 ||
          selectedTags.every((t) => note.tags.some((nt) => nt.id === t.id)))
      );
    });
  }, [title, selectedTags, notes]);

  const getExcerpt = (md: string) => {
    const flat = (md ?? '').replace(/\s+/g, ' ').trim();
    return flat.length > 160 ? flat.slice(0, 160) + '…' : flat;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="filter-title"
            className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="filter-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Filter by title..."
            className="mt-1 block w-full h-[42px] rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="filter-tags"
            className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <ReactSelect
            inputId="filter-tags"
            isMulti
            className="mt-1 w-full"
            classNamePrefix="rs"
            value={selectedTags.map((t) => ({label: t.label, value: t.id}))}
            options={availableTags.map((t) => ({label: t.label, value: t.id}))}
            onChange={(tags) => {
              const arr = Array.isArray(tags) ? tags : [];
              setSelectedTags(arr.map((t) => ({label: t.label, id: t.value})));
            }}
            styles={{
              control: (base: any, state: any) => ({
                ...base,
                minHeight: 42,
                borderRadius: 8,
                borderColor: state.isFocused ? '#6366F1' : '#D1D5DB',
                boxShadow: state.isFocused
                  ? '0 0 0 2px rgba(199,210,254,0.6)'
                  : 'none',
                '&:hover': {
                  borderColor: state.isFocused ? '#6366F1' : '#9CA3AF',
                },
                backgroundColor: '#F9FAFB',
              }),
              valueContainer: (base: any) => ({...base, padding: '2px 8px'}),
              input: (base: any) => ({...base, margin: 0}),
              multiValue: (base: any) => ({
                ...base,
                backgroundColor: '#E5E7EB',
                borderRadius: 6,
              }),
              multiValueLabel: (base: any) => ({
                ...base,
                color: '#111827',
                padding: '2px 6px',
              }),
              multiValueRemove: (base: any) => ({
                ...base,
                color: '#6B7280',
                ':hover': {backgroundColor: '#D1D5DB', color: '#374151'},
              }),
              menu: (base: any) => ({...base, zIndex: 50}),
              option: (base: any, state: any) => ({
                ...base,
                backgroundColor: state.isFocused ? '#F3F4F6' : 'white',
                color: '#111827',
              }),
            }}
          />
        </div>
      </div>

      <div className="flex-1 grid content-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.map((note) => (
          <Link
            key={note.id}
            to={`/${note.id}/edit`}
            className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square p-4">
              <div className="flex h-full flex-col gap-2">
                <span className="block truncate text-base font-medium text-gray-900">
                  {note.title || 'Untitled'}
                </span>
                <p className="text-sm text-gray-600 overflow-hidden">
                  {getExcerpt(note.markdown)}
                </p>
                {note.tags.length > 0 && (
                  <div className="mt-auto max-h-8 overflow-hidden flex flex-wrap items-center gap-2">
                    {note.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="max-w-[140px] truncate rounded-md bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
                        title={tag.label}>
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full h-full flex items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
            No notes match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteList;
