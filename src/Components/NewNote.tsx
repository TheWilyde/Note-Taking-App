import type {NoteData, Tag} from '../App';
import {NoteForm} from './NoteForm';

type NewNoteProps = {
  onSubmit: (data: NoteData) => void;
  onAddTag: (tag: Tag) => void;
  availableTags: Tag[];
};

export const NewNote = ({onSubmit, onAddTag, availableTags}: NewNoteProps) => {
  return (
    <>
      <NoteForm
        onSubmit={onSubmit}
        onAddTag={onAddTag}
        availableTags={availableTags}
        showFooterActions={false}
      />
    </>
  );
};
