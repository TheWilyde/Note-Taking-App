import {Navigate, useNavigate, useParams} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type {Note} from '../App';

type ViewNoteProps = {
  notes: Note[];
};

const ViewNote = ({notes}: ViewNoteProps) => {
  const {id} = useParams();
  const navigate = useNavigate();
  const note = notes.find((n) => n.id === id);

  if (!note) return <Navigate to="/" replace />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{note.title || 'Untitled'}</h1>
        <button
          onClick={() => navigate(`/${note.id}/edit`)}
          className="inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 bg-white font-medium shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500">
          Edit
        </button>
      </div>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {note.tags.map((tag) => (
            <span
              key={tag.id}
              className="max-w-[160px] truncate rounded-md bg-indigo-100 px-2 py-1 text-xs text-indigo-700"
              title={tag.label}>
              {tag.label}
            </span>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate(`/${note.id}/edit`)}
        onKeyDown={(e) => e.key === 'Enter' && navigate(`/${note.id}/edit`)}
        className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props: any) => (
              <h1 className="mb-3 mt-4 text-2xl font-semibold" {...props} />
            ),
            h2: (props: any) => (
              <h2 className="mb-2 mt-4 text-xl font-semibold" {...props} />
            ),
            h3: (props: any) => (
              <h3 className="mb-2 mt-3 text-lg font-semibold" {...props} />
            ),
            p: (props: any) => (
              <p className="mb-3 leading-7 text-gray-800" {...props} />
            ),
            ul: (props: any) => (
              <ul className="mb-3 list-disc pl-6" {...props} />
            ),
            ol: (props: any) => (
              <ol className="mb-3 list-decimal pl-6" {...props} />
            ),
            li: (props: any) => <li className="mb-1" {...props} />,
            code: (props: any) =>
              props.inline ? (
                <code
                  className="rounded bg-gray-100 px-1 py-0.5 text-[0.95em]"
                  {...props}
                />
              ) : (
                <code
                  className="block overflow-auto rounded bg-gray-900 p-3 text-gray-100"
                  {...props}
                />
              ),
            blockquote: (props: any) => (
              <blockquote
                className="mb-3 border-l-4 border-gray-300 pl-3 text-gray-700 italic"
                {...props}
              />
            ),
            a: (props: any) => (
              <a
                className="text-indigo-600 underline hover:text-indigo-700"
                {...props}
              />
            ),
            hr: (props: any) => (
              <hr className="my-4 border-gray-200" {...props} />
            ),
          }}>
          {note.markdown || '_Click to edit_'}
        </ReactMarkdown>
      </div>
      <div className="text-xs text-gray-500">
        Click anywhere on the content to edit
      </div>
    </div>
  );
};

export default ViewNote;
