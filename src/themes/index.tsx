import type { EditorThemeClasses } from 'lexical';

const theme: EditorThemeClasses = {
  characterLimit: 'UltraEditor__characterLimit',
  code: 'UltraEditor__code',
  codeHighlight: {
    atrule: 'UltraEditor__tokenAttr',
    attr: 'UltraEditor__tokenAttr',
    boolean: 'UltraEditor__tokenProperty',
    builtin: 'UltraEditor__tokenSelector',
    cdata: 'UltraEditor__tokenComment',
    char: 'UltraEditor__tokenSelector',
    class: 'UltraEditor__tokenFunction',
    'class-name': 'UltraEditor__tokenFunction',
    comment: 'UltraEditor__tokenComment',
    constant: 'UltraEditor__tokenProperty',
    deleted: 'UltraEditor__tokenProperty',
    doctype: 'UltraEditor__tokenComment',
    entity: 'UltraEditor__tokenOperator',
    function: 'UltraEditor__tokenFunction',
    important: 'UltraEditor__tokenVariable',
    inserted: 'UltraEditor__tokenSelector',
    keyword: 'UltraEditor__tokenAttr',
    namespace: 'UltraEditor__tokenVariable',
    number: 'UltraEditor__tokenProperty',
    operator: 'UltraEditor__tokenOperator',
    prolog: 'UltraEditor__tokenComment',
    property: 'UltraEditor__tokenProperty',
    punctuation: 'UltraEditor__tokenPunctuation',
    regex: 'UltraEditor__tokenVariable',
    selector: 'UltraEditor__tokenSelector',
    string: 'UltraEditor__tokenSelector',
    symbol: 'UltraEditor__tokenProperty',
    tag: 'UltraEditor__tokenProperty',
    url: 'UltraEditor__tokenOperator',
    variable: 'UltraEditor__tokenVariable',
  },
  hashtag: 'UltraEditor__hashtag',
  heading: {
    h1: 'UltraEditor__h1',
    h2: 'UltraEditor__h2',
    h3: 'UltraEditor__h3',
    h4: 'UltraEditor__h4',
    h5: 'UltraEditor__h5',
  },
  image: 'UltraEditor__image',
  link: 'UltraEditor__link',
  list: {
    listitem: 'UltraEditor__listItem',
    listitemChecked: 'UltraEditor__listItemChecked',
    listitemUnchecked: 'UltraEditor__listItemUnchecked',
    nested: {
      listitem: 'UltraEditor__nestedListItem',
    },
    olDepth: ['UltraEditor__ol1', 'UltraEditor__ol2', 'UltraEditor__ol3', 'UltraEditor__ol4', 'UltraEditor__ol5'],
    ul: 'UltraEditor__ul',
  },
  ltr: 'UltraEditor__ltr',
  mark: 'UltraEditor__mark',
  markOverlap: 'UltraEditor__markOverlap',
  paragraph: 'UltraEditor__paragraph',
  quote: 'UltraEditor__quote',
  rtl: 'UltraEditor__rtl',
  table: 'UltraEditor__table',
  tableCell: 'UltraEditor__tableCell',
  tableCellHeader: 'UltraEditor__tableCellHeader',
  text: {
    bold: 'UltraEditor__textBold',
    code: 'UltraEditor__textCode',
    italic: 'UltraEditor__textItalic',
    strikethrough: 'UltraEditor__textStrikethrough',
    subscript: 'UltraEditor__textSubscript',
    superscript: 'UltraEditor__textSuperscript',
    underline: 'UltraEditor__textUnderline',
    underlineStrikethrough: 'UltraEditor__textUnderlineStrikethrough',
  },
};

export default theme;
