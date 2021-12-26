export type InlineStyleType = 'BOLD' | 'CODE' | 'ITALIC' | 'STRIKETHROUGH' | 'UNDERLINE';

export type HeaderType = 'header-one' | 'header-two' | 'header-three' | 'header-four' | 'header-five' | 'header-six';

export type BlockStyleType = HeaderType | 'unordered-list-item' | 'ordered-list-item' | 'blockquote' | 'code-block';

export type AtomicType = 'LINK' | 'HR' | 'IMAGE' | 'VIDEO';

export type CustomCharactersType = 'EMOJI';

export type UndoRedo = 'undo' | 'redo';

export type ControlTypes = InlineStyleType | BlockStyleType | AtomicType | CustomCharactersType | UndoRedo;
