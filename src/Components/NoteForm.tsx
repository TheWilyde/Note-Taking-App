import CreatableReactSelect from 'react-select/creatable';
import type {MultiValue} from 'react-select';
import {useNavigate} from 'react-router-dom';
import {useRef, useState, type FormEvent} from 'react';
import {v4 as uuidV4} from 'uuid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {NoteData, Tag} from '../App';

type NoteFormProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
  title?: string;
  markdown?: string;
  tags?: Tag[];
  showFooterActions?: boolean;
};

export const NoteForm = ({
  onSubmit,
  onAddTag,
  availableTags,
  title: initialTitle = '',
  markdown: initialMarkdown = '',
  tags = [],
  showFooterActions = true,
}: NoteFormProps) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const [markdown, setMarkdown] = useState<string>(initialMarkdown);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(tags);
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({
      title: titleRef.current!.value,
      markdown,
      tags: selectedTags,
    });
    navigate('..');
  }

  return (
    <form id="note-form" className="space-y-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a title"
            ref={titleRef}
            defaultValue={initialTitle}
            className="mt-1 block w-full h-[42px] rounded-lg border border-gray-300 bg-gray-50 px-3 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label
            htmlFor="tags"
            className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <CreatableReactSelect
            isMulti
            inputId="tags"
            placeholder="Add tags..."
            value={selectedTags.map((t) => ({label: t.label, value: t.id}))}
            options={availableTags.map((t) => ({label: t.label, value: t.id}))}
            onChange={(vals: MultiValue<{label: string; value: string}>) => {
              setSelectedTags(vals.map((v) => ({label: v.label, id: v.value})));
            }}
            onCreateOption={(label: string) => {
              const newTag = {id: uuidV4(), label};
              onAddTag(newTag);
              setSelectedTags((prev) => [...prev, newTag]);
            }}
            className="mt-1 w-full"
            classNamePrefix="rs"
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col h-[65vh] min-h-[420px]">
          <label
            htmlFor="body"
            className="block text-sm font-medium text-gray-700">
            Body
          </label>
          <textarea
            id="body"
            name="body"
            placeholder="Write your note with Markdown..."
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="mt-1 block w-full flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 resize-none"
          />
        </div>
        <div className="flex flex-col h-[65vh] min-h-[420px]">
          <div className="block text-sm font-medium text-gray-700">Preview</div>
          <div className="mt-1 flex-1 overflow-auto rounded-lg border border-gray-200 bg-white p-3">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => (
                  <h1 className="mb-3 mt-4 text-2xl font-semibold" {...props} />
                ),
                h2: ({node, ...props}) => (
                  <h2 className="mb-2 mt-4 text-xl font-semibold" {...props} />
                ),
                h3: ({node, ...props}) => (
                  <h3 className="mb-2 mt-3 text-lg font-semibold" {...props} />
                ),
                p: ({node, ...props}) => (
                  <p className="mb-3 leading-7 text-gray-800" {...props} />
                ),
                ul: ({node, ...props}) => (
                  <ul className="mb-3 list-disc pl-6" {...props} />
                ),
                ol: ({node, ...props}) => (
                  <ol className="mb-3 list-decimal pl-6" {...props} />
                ),
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                code: (props: any) =>
                  props.inline ? (
                    <code
                      className="rounded bg-gray-100 px-1 py-0.5 text-[0.95em]"
                      {...props}
                    />
                  ) : (
                    <pre className="overflow-auto rounded bg-gray-900 p-3">
                      <code className="text-gray-100" {...props} />
                    </pre>
                  ),
                blockquote: ({node, ...props}) => (
                  <blockquote
                    className="mb-3 border-l-4 border-gray-300 pl-3 text-gray-700 italic"
                    {...props}
                  />
                ),
                a: ({node, ...props}) => (
                  <a
                    className="text-indigo-600 underline hover:text-indigo-700"
                    {...props}
                  />
                ),
                hr: ({node, ...props}) => (
                  <hr className="my-4 border-gray-200" {...props} />
                ),
              }}>
              {markdown || '_Nothing to preview_'}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      {showFooterActions && (
        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            Cancel
          </button>
        </div>
      )}
    </form>
  );
};

export default NoteForm;
