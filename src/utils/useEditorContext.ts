import { EditorState } from 'draft-js';
import { createContext, Dispatch, SetStateAction, useContext } from 'react';

export interface LinkData {
  label: string;
  url: string;
}

interface EditorStoreContext {
  editorState: EditorState;
  setEditorState: Dispatch<SetStateAction<EditorState>>;
  focus: () => void;
  currentEntityKey: string;
  setCurrentEntityKey: Dispatch<SetStateAction<string>>;
  linkModalVisible: boolean;
  setLinkModalVisible: Dispatch<SetStateAction<boolean>>;
  linkData: LinkData;
  setLinkData: Dispatch<SetStateAction<LinkData>>;
}

const EditorContext = createContext({} as EditorStoreContext);

export const EditorProvider = EditorContext.Provider;

export const useEditContext = () => {
  return useContext(EditorContext);
};
