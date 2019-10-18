/**
 * Pencil.js
 * @param {*} el 
 * @param {*} options 
 * @docs https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
 */
function Pencil(el, options = {}) {
  const {
    change,
    actions = [],
    className = 'editor'
  } = options;
  if (typeof el === 'string')
    el = document.querySelector(el);
  el.className = className;
  el.toolbar = document.createElement('div');
  el.content = document.createElement('div');
  el.toolbar.className = 'editor-toolbar';
  el.content.className = 'editor-content';
  el.content.contentEditable = true;
  el.content.oninput = change.bind(el);
  el.content.onkeydown = function (e) {
    if (e.which === 9) e.preventDefault();
  };
  el.exec = function (command, value) {
    return document.execCommand(command, false, value);
  };
  const ACTIONS = Pencil.actions;
  actions.map(function (action) {
    if (typeof action === 'string')
      return ACTIONS[action];
    if (ACTIONS[action.name])
      return Object.assign({}, ACTIONS[action.name], action);
    return action;
  }).forEach(function (action, i) {
    var button = document.createElement('button');
    var title = action.title || action.name || ('F' + (i + 1));
    button.title = title;
    button.innerHTML = action.icon || title;
    button.onclick = action.action.bind(el, el);
    button.className = 'editor-toolbar-button';
    el.toolbar.appendChild(button);
  });
  el.appendChild(el.toolbar);
  el.appendChild(el.content);
  return el;
}

Pencil.actions = {
  bold: {
    icon: '<b>B</b>',
    title: 'Bold',
    action: editor => editor.exec('bold')
  },
  italic: {
    icon: '<i>I</i>',
    title: 'Italic',
    action: editor => editor.exec('italic')
  },
  underline: {
    icon: '<u>U</u>',
    title: 'Underline',
    action: editor => editor.exec('underline')
  },
  strikethrough: {
    icon: '<strike>S</strike>',
    title: 'Strike-through',
    action: editor => editor.exec('strikeThrough')
  },
  heading1: {
    icon: '<b>H<sub>1</sub></b>',
    title: 'Heading 1',
    action: editor => editor.exec('formatBlock', '<H1>')
  },
  heading2: {
    icon: '<b>H<sub>2</sub></b>',
    title: 'Heading 2',
    action: editor => editor.exec('formatBlock', '<H2>')
  },
  paragraph: {
    icon: '&#182;',
    title: 'Paragraph',
    action: editor => editor.exec('formatBlock', '<P>')
  },
  quote: {
    icon: '&#8220; &#8221;',
    title: 'Quote',
    action: editor => editor.exec('formatBlock', '<BLOCKQUOTE>')
  },
  olist: {
    icon: '&#35;',
    title: 'Ordered List',
    action: editor => editor.exec('insertOrderedList')
  },
  ulist: {
    icon: '&#8226;',
    title: 'Unordered List',
    action: editor => editor.exec('insertUnorderedList')
  },
  code: {
    icon: '&lt;/&gt;',
    title: 'Code',
    action: editor => editor.exec('formatBlock', '<PRE>')
  },
  line: {
    icon: '&#8213;',
    title: 'Horizontal Line',
    action: editor => editor.exec('insertHorizontalRule')
  },
  link: {
    icon: '&#128279;',
    title: 'Link',
    action: editor => {
      const url = window.prompt('Enter the link URL')
      url && editor.exec('createLink', url)
    }
  },
  image: {
    icon: '&#128247;',
    title: 'Image',
    action: editor => {
      const url = window.prompt('Enter the image URL')
      url && editor.exec('insertImage', url)
    }
  },
  bgcolor: {
    icon: '<span style="background:#fadb20; padding:1px 3px">A</span>',
    title: 'Background Color',
    action: editor => {
      const color = window.prompt('Enter the Color')
      color && editor.exec('backColor', color)
    }
  },
  copy: {
    icon: '&copy;',
    title: 'Copy to Clipboard',
    action: editor => editor.exec('copy')
  },
  paste: {
    icon: '&#x1F4CB;',
    title: 'Patse',
    action: editor => editor.exec('paste')
  },
  cut: {
    icon: '&#x2702;&#xFE0F;',
    title: 'Cut Selection',
    action: editor => editor.exec('cut')
  },
  small: {
    icon: 'A-',
    title: 'Decrease Font Size',
    action: editor => editor.exec('decreaseFontSize')
  },
  big: {
    icon: 'A+',
    title: 'Increase Font Size',
    action: editor => editor.exec('increaseFontSize')
  },
  font: {
    icon: 'Aa',
    title: 'Font Family',
    action: editor => {
      const font = window.prompt('Enter the Font Name')
      font && editor.exec('fontName', font)
    }
  },
  size: {
    icon: 'Aa',
    title: 'Font Size',
    action: editor => {
      const size = window.prompt('Enter the Font Size(1-7)')
      size && editor.exec('fontSize', size)
    }
  },
  color: {
    icon: '<span style="color:red;">Aa</span>',
    title: 'Font Color',
    action: (editor, e) => {
      const icon = e.target;
      const colorPicker = document.createElement('input');
      colorPicker.type = 'color';
      colorPicker.onchange = e => {
        console.log('colorPicker', e);
        const color = e.target.value;
        icon.style.color = color;
        editor.exec('foreColor', color)
      };
      colorPicker.click();
    }
  },
  html: {
    icon: '&lt;/&gt;',
    title: 'Insert HTML Code',
    action: editor => {
      const html = window.prompt('Enter the HTML')
      html && editor.exec('insertHTML', html)
    }
  },
  center: {
    icon: '_A_',
    title: 'Text Align Center',
    action: editor => editor.exec('justifyCenter')
  },
  left: {
    icon: 'A__',
    title: 'Text Align Left',
    action: editor => editor.exec('justifyLeft')
  },
  right: {
    icon: '__A',
    title: 'Text Align Right',
    action: editor => editor.exec('justifyRight')
  },
  clearFormat: {
    icon: '&#x1F9F9;',
    title: 'Clear Format',
    action: editor => editor.exec('removeFormat')
  },
  subscript: {
    icon: 'A<sub>a</sub>',
    title: 'Sub Script',
    action: editor => editor.exec('subscript')
  },
  superscript: {
    icon: 'A<sup>a</sup>',
    title: 'Super Script',
    action: editor => editor.exec('superscript')
  },
  indent: {
    icon: '&#x27A1;&#xFE0F;',
    title: 'Indent',
    action: editor => editor.exec('indent')
  },
  outdent: {
    icon: '&#x2B05;&#xFE0F;',
    title: 'Outdent',
    action: editor => editor.exec('outdent')
  },
  table: {
    icon: 'T',
    title: 'Table',
    action: editor => {
      var table = '';
      table += '<table border="1" >';
      table += '<tr>';
      table += '<td>Heading1</td>';
      table += '<td>Heading2</td>';
      table += '<td>Heading3</td>';
      table += '</tr>';
      table += '<tr>';
      table += '<td>1</td>';
      table += '<td>2</td>';
      table += '<td>3</td>';
      table += '</tr>';
      table += '</table>';
      editor.exec('insertHTML', table)
    }
  }
};