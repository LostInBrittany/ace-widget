/**
@license MIT
Copyright (c) 2015 Horacio "LostInBrittany" Gonzalez

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@element ace-widget
@blurb LostInBrittany's Ace (http://ace.c9.io/) widget
@homepage index.html
@demo demo/index.html
*/

/* globals ace */
/* eslint new-cap: ["error", { "capIsNewExceptions": ["AceWidgetShadowDom"] }] */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

import 'ace-builds/src-min-noconflict/ace.js';
import 'ace-builds/src-min-noconflict/ext-language_tools.js';
import 'ace-builds/src-min-noconflict/snippets/snippets.js';


class AceWidget extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          width: 100%;
        }
    
        #editor {
          border: 1px solid #e3e3e3;
          border-radius: 4px;
          @apply --ace-widget-editor;
        }
      </style>
      <div id="editor"></div>
    `;
  }

  static get is() { return 'ace-widget'; }

  static get properties() {
    return {
      theme: {
        type: String,
        value: 'ace/theme/eclipse',
        observer: 'themeChanged',
      },
      mode: {
        type: String,
        notify: true,
        observer: 'modeChanged',
      },
      value: {
        type: String,
        notify: true,
        observer: 'valueChanged',
      },
      readonly: {
        type: Boolean,
        value: false,
        observer: 'readonlyChanged',
      },
      softtabs: {
        type: Boolean,
        value: true,
        observer: 'softtabsChanged',
      },
      wrap: {
        type: Boolean,
        value: false,
        observer: 'wrapChanged',
      },
      fontSize: {
        type: String,
        value: '14px',
        observer: 'fontSizeChanged',
      },
      tabSize: {
        type: Number,
        value: 4,
        observer: 'tabSizeChanged',
      },
      snippets: {
        type: String,
        notify: true,
      },
      autoComplete: {
        type: Object,
        notify: true,
      },
      minlines: {
        type: Number,
        value: 15,
      },
      maxlines: {
        type: Number,
        value: 30,
      },
      enableLiveAutocompletion: {
        type: Boolean,
        value: false,
      },
      enableSnippets: {
        type: Boolean,
        value: false,
      },
      initialFocus: {
        type: Boolean,
        value: false,
      },
      placeholder: {
        type: String,
        value: '',
      },
      verbose: {
        type: Boolean,
        value: false,
      },
      baseUrl: {
        type: String,
        value: '',
      },
    };
  }


  /** 
   * In order to statically import non ES mudules resources, you need to use `importPath`.
   * But in order to use `importPath`, for elements defined in ES modules, users should implement
   * `static get importMeta() { return import.meta; }`, and the default
   * implementation of `importPath` will  return `import.meta.url`'s path.
   * More info on @Polymer/lib/mixins/element-mixin.js`
   */
  static get importMeta() { return import.meta; } 

  connectedCallback() {
    super.connectedCallback();

    // console.debug("[ace-widget] connectedCallback")
    let div = this.$.editor;
    div.style.width = '100%';
    div.style.height = '100%';
    this.editor = ace.edit(div);
    //this.init();

    this.dispatchEvent(new CustomEvent('editor-ready', { detail: {value: this.editor, oldValue: null}}));
    // console.debug("[ace-widget] connectedCallback done, initializing")
    this.initializeEditor();
  }

  initializeEditor() {
    let self = this;
    let editor = this.editor;

    this.head = document.head;


    this.injectStyle('#ace_editor\\.css');

    let baseUrl = this.baseUrl || `${this.importPath}../../ace-builds/src-min-noconflict/`

    ace.config.set('basePath', baseUrl);
    ace.config.set('modePath', baseUrl);
    ace.config.set('themePath', baseUrl);
    ace.config.set('workerPath', baseUrl);

    this.themeChanged();
    this.editorValue = '';
    editor.setOption('enableSnippets', this.enableSnippets);
    editor.setOption('enableBasicAutocompletion', true);
    editor.setOption('enableLiveAutocompletion', this.enableLiveAutocompletion);

    editor.on('change', this.editorChangeAction.bind(this));
    editor.on('input', this._updatePlaceholder.bind(this));
    setTimeout(this._updatePlaceholder.bind(this), 100);
    this.session = editor.getSession();

    if (this.initialFocus) {
      editor.focus();
    }

    editor.$blockScrolling = Infinity;

    editor.setTheme(this.theme);

    // Forcing a xyzChanged() call, because the initial one din't do anything as editor wasn't created yet
    this.readonlyChanged();
    this.wrapChanged();
    this.tabSizeChanged();
    this.modeChanged();
    this.softtabsChanged();
    this.fontSizeChanged();

    // Setting content

    // Trying to get content as HTML content
    let htmlContent = this.innerHTML.trim();
    // console.debug("[ace-widget] HTML content found", htmlContent);

    // If we have a value in the `value` attribute, we keep it, else we use the HTML content
    if (this.value === undefined) {
      this.value = htmlContent;
      // console.debug("[ace-widget] initializeEditor - using HTML content as value", this.value)
    } else {
      // Forcing a valueChanged() call, because the initial one din't do anything as editor wasn't created yet
      this.valueChanged();
    }
    // min and max lines
    editor.setOptions({
        minLines: this.minlines,
        maxLines: this.maxlines,
    });

    // snippets
    if (this.enableSnippets) {
      let snippetManager = ace.require('ace/snippets').snippetManager;
      snippetManager.register(this.snippets, 'javascript');
    }
    // autoComplete
    let langTools = ace.require('ace/ext/language_tools');
    let aceWidgetCompleter = {
      getCompletions: function(editor, session, pos, prefix, callback) {
        if (prefix.length === 0) {
          callback(null, []);
          return;
        }
        callback(null, self.autoComplete || []);
      },
    };
    langTools.addCompleter(aceWidgetCompleter);

    if (this.verbose) {
      console.debug('[ace-widget] After initializing: editor.getSession().getValue()',
          editor.getSession().getValue());
    }
  }


  fontSizeChanged() {
    if (this.editor == undefined) {
      return;
    }
    this.$.editor.style.fontSize = this.fontSize;
  }

  modeChanged() {
    if (!this.editor) return;
    this.editor.getSession().setMode(this.mode);
  }

  softtabsChanged() {
    if (this.editor == undefined) {
      return;
    }
    this.editor.getSession().setUseSoftTabs(this.softtabs);
  }

  themeChanged() {
    if (this.editor == undefined) {
      return;
    }
    this.editor.setTheme(this.theme);
    return;
  }

  valueChanged() {
    // console.debug("[ace-widget] valueChanged - ",this.value)
    if (this.editor == undefined) {
      return;
    }
    if (this.editorValue != this.value) {
      this.editorValue = this.value;
      this.editor.clearSelection();
      this.editor.resize();
    }
  }

  readonlyChanged() {
    if (this.editor == undefined) {
      return;
    }
    this.editor.setReadOnly(this.readonly);
    this.editor.setHighlightActiveLine(!this.readonly);
    this.editor.setHighlightGutterLine(!this.readonly);
    this.editor.renderer.$cursorLayer.element.style.opacity = this.readonly ? 0 : 1;
  }

  wrapChanged() {
    if (this.editor == undefined) {
      return;
    }
    this.editor.getSession().setUseWrapMode(this.wrap);
  }

  tabSizeChanged() {
    if (this.editor == undefined) {
      return;
    }
    if (this.tabSize) {
      this.editor.getSession().setTabSize(this.tabSize);
    }
  }

  editorChangeAction() {
    // console.debug("[ace-widget] editorChangeAction", {value: this.editorValue, oldValue: this._value})
    this.dispatchEvent(new CustomEvent('editor-content', {detail: {value: this.editorValue, oldValue: this._value}}));
  }

  get editorValue() {
    return this.editor.getValue();
  }

  set editorValue(value) {
    if (value === undefined) {
      return;
    }
    this._value = value;
    this.editor.setValue(value);
    // console.debug("[ace-widget] set editorValue", this.editorValue)
  }

  focus() {
    this.editor.focus();
  }

  _updatePlaceholder() {
    let shouldShow = !this.editor.session.getValue().length;
    let node = this.editor.renderer.emptyMessageNode;
    if (this.verbose) {
      console.debug('[ace-widget] _updatePlaceholder', {shouldShow: shouldShow, node: node});
    }
    if (!shouldShow && node) {
        this.editor.renderer.scroller.removeChild(this.editor.renderer.emptyMessageNode);
        this.editor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
        if (this.verbose) {
          console.debug('[ace-widget] _updatePlaceholder - shouldShow && !node');
        }
        node = this.editor.renderer.emptyMessageNode = document.createElement('div');
        node.textContent = this.placeholder;
        node.className = 'ace_comment';
        node.style.padding = '0 9px';
        node.style.zIndex = '1';
        node.style.position = 'absolute';
        node.style.color = '#aaa';
        if (this.verbose) {
          console.debug('[ace-widget] _updatePlaceholder - node', node);
        }
        this.editor.renderer.scroller.appendChild(node);
    }
  }

  /**
   * Injects a style element into ace-widget's shadow root
   * @param {CSSSelector} selector for an element in the same shadow tree or document as `ace-widget`
   */
  injectStyle(selector){
    const lightStyle = this.getRootNode().querySelector(selector) || document.querySelector(selector);
    this.shadowRoot.appendChild(lightStyle.cloneNode(true));
  }
}

window.customElements.define(AceWidget.is, AceWidget);

