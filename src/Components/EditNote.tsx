import {Navigate, useParams} from 'react-router-dom';
import type {Note, NoteData, Tag} from '../App';
import {NoteForm} from './NoteForm';

type EditNoteProps = {
  notes: Note[];
  availableTags: Tag[];
  onAddTag: (tag: Tag) => void;
  onSubmit: (id: string, data: NoteData) => void;
  onDelete: (id: string) => void;
};

const EditNote = ({
  notes,
  availableTags,
  onAddTag,
  onSubmit,
}: EditNoteProps) => {
  const params = useParams();
  const note = notes.find((n) => n.id === params.id);

  if (!note) return <Navigate to="/" replace />;

  return (
    <>
      <NoteForm
        onSubmit={(data) => onSubmit(note.id, data)}
        onAddTag={onAddTag}
        availableTags={availableTags}
        title={note.title}
        markdown={note.markdown}
        tags={note.tags}
        showFooterActions={false}
      />
    </>
  );
};

export default EditNote;
