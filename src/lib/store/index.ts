import { EditorState } from 'draft-js';
import { DispatchWithCallback } from 'lib/hooks/useStateWithCallback';
import { createContext } from 'react';

interface EditorStoreContext {
  editorState: EditorState;
  setEditorState: DispatchWithCallback<React.SetStateAction<EditorState>>;
  focus: () => void;
}

export const EditorStore = createContext({} as EditorStoreContext);
