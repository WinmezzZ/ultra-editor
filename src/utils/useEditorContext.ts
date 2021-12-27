import { EditorState } from 'draft-js';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

interface EditorStoreContext {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  focus: () => void;
}

const EditorContext = createContext({} as EditorStoreContext);

export const EditorProvider = EditorContext.Provider;

export const useEditContext = () => {
  return useContext(EditorContext);
};
