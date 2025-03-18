/**
 * @license MIT
 * Copyright (c) 2015-2025 Horacio "LostInBrittany" Gonzalez
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
 * and associated documentation files (the "Software"), to deal in the Software without restriction, 
 * including without limitation the rights to use, copy, modify, merge, publish, distribute, 
 * sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * @element ace-widget
 * @description LostInBrittany's Ace (http://ace.c9.io/) widget - Lit implementation
 */

import { LitElement, html, css } from 'lit';

// Import Ace editor - using the latest import paths
import 'ace-builds/src-min-noconflict/ace.js';
import 'ace-builds/src-min-noconflict/ext-language_tools.js';
import 'ace-builds/src-min-noconflict/mode-javascript.js';
import 'ace-builds/src-min-noconflict/mode-html.js';
import 'ace-builds/src-min-noconflict/mode-css.js';
import 'ace-builds/src-min-noconflict/theme-eclipse.js';
import 'ace-builds/src-min-noconflict/theme-monokai.js';
import 'ace-builds/src-min-noconflict/theme-github.js';
import 'ace-builds/src-min-noconflict/theme-ambiance.js';
import 'ace-builds/src-min-noconflict/snippets/javascript.js';
import 'ace-builds/src-min-noconflict/snippets/html.js';
import 'ace-builds/src-min-noconflict/snippets/css.js';

// Note: We don't import worker files directly as they need to be loaded by Ace dynamically

// Define a custom focus function for the Ace editor
const editorFocus = function() { 
  const _self = this;
  setTimeout(function() {
    if (!_self.isFocused())
      _self.textInput.focus();
  });
  this.textInput.$focusScroll = "browser";
  this.textInput.focus();
};

/**
 * `ace-widget` - A Lit wrapper for the Ace editor
 *
 * @customElement
 * @lit-html
 * @lit-element
 */
export class AceWidget extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 100%;

      border: solid 1px #e3e3e3;
      position:relative;
    }

    #editor {
      border-radius: 4px;
      width: 100%;
      height: 100%;
      position: relative;
    }
  `;

  /**
   * Properties
   */
  static properties = {
    theme: { type: String },
    mode: { type: String },
    value: { type: String },
    readonly: { type: Boolean },
    softtabs: { type: Boolean },
    wrap: { type: Boolean },
    fontSize: { type: String },
    tabSize: { type: Number },
    snippets: { type: String },
    autoComplete: { type: Object },
    minlines: { type: Number },
    maxlines: { type: Number },
    enableLiveAutocompletion: { type: Boolean },
    enableSnippets: { type: Boolean },
    initialFocus: { type: Boolean },
    placeholder: { type: String },
    debug: { type: Boolean },
    debug: { type: Boolean },
    baseUrl: { type: String },
    disableWorker: { type: Boolean },
    
    // Internal state properties (private)
    _editor: { state: true },
    _session: { state: true },
    _value: { state: true }
  };
  
  constructor() {
    super();
    // Default values
    this.theme = 'ace/theme/eclipse';
    this.mode = '';
    this.value = '';
    this.readonly = false;
    this.softtabs = true;
    this.wrap = false;
    this.fontSize = '14px';
    this.tabSize = 4;
    this.snippets = '';
    this.autoComplete = null;
    // this.minlines = 15;
    // this.maxlines = 30;
    this.enableLiveAutocompletion = false;
    this.enableSnippets = false;
    this.initialFocus = false;
    this.placeholder = '';
    this.debug = false;
    this.debug = false;
    this.baseUrl = '';
    this.disableWorker = false;
    this._value = '';
  }

  async firstUpdated() {
    super.firstUpdated();

    if (this.debug) {
      console.debug("[ace-widget] firstUpdated");
    }

    let div = this.renderRoot.querySelector('#editor');

    if (this.debug) console.debug("[ace-widget] firstUpdated - div", div.style.width, div.style.height);

    this._editor = ace.edit(div);
    // https://github.com/ajaxorg/ace/issues/3850
    this._editor.renderer.attachToShadowRoot()

    this.dispatchEvent(
      new CustomEvent('editor-ready', { 
        detail: {value: this._editor, oldValue: null}}));
    this.initializeEditor();

    if (this.debug) console.debug("[ace-widget] firstUpdated - editor initialized");
  }


  async updated(changedProperties) {
    if (changedProperties.has('value')) {
      this.valueChanged();
    }
  }


  initializeEditor() {
    let self = this;
    let editor = this._editor;


    this.injectStyle('#ace_editor\\.css');

    let baseUrl = this.baseUrl || `${import.meta.url}/../node_modules/ace-builds/src-min-noconflict/`

    if (this.debug) console.debug("[ace-widget] initializeEditor - baseUrl", baseUrl);

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

    if (this.debug) {
      console.debug('[ace-widget] After initializing: editor.getSession().getValue()',
          editor.getSession().getValue());
    }
  }



  fontSizeChanged() {
    if (this._editor == undefined) {
      return;
    }
    console.dir(this._editor);
    this.renderRoot.querySelector('#editor')
      .style.fontSize = this.fontSize;
  }

  modeChanged() {
    if (!this._editor) return;
    this._editor.getSession().setMode(this.mode);
  }

  softtabsChanged() {
    if (this._editor == undefined) {
      return;
    }
    this._editor.getSession().setUseSoftTabs(this.softtabs);
  }

  themeChanged() {
    if (this._editor == undefined) {
      return;
    }
    this._editor.setTheme(this.theme);
    return;
  }

  valueChanged() {
    if (this.debug) {
      console.debug("[ace-widget] valueChanged - ",this.value)
    }
    if (this._editor == undefined) {
      return;
    }
    if (this.editorValue != this.value) {
      this.editorValue = this.value;
      this._editor.clearSelection();
      if (this.debug) {
        console.debug('[ace-widget] valueChanged - resize');
      }
      this._editor.resize();
    }
  }

  readonlyChanged() {
    if (this._editor == undefined) {
      return;
    }
    this._editor.setReadOnly(this.readonly);
    this._editor.setHighlightActiveLine(!this.readonly);
    this._editor.setHighlightGutterLine(!this.readonly);
    this._editor.renderer.$cursorLayer.element.style.opacity = this.readonly ? 0 : 1;
  }

  wrapChanged() {
    if (this._editor == undefined) {
      return;
    }
    this._editor.getSession().setUseWrapMode(this.wrap);
  }

  tabSizeChanged() {
    if (this._editor == undefined) {
      return;
    }
    if (this.tabSize) {
      this._editor.getSession().setTabSize(this.tabSize);
    }
  }

  editorChangeAction() {
    console.debug("[ace-widget] editorChangeAction", {value: this.editorValue, oldValue: this._value})
    this.dispatchEvent(new CustomEvent('editor-content', {detail: {value: this.editorValue, oldValue: this._value}}));
  }

  _updatePlaceholder() {
    let shouldShow = !this._editor.session.getValue().length;
    let node = this._editor.renderer.emptyMessageNode;
    if (!shouldShow && node) {
        this._editor.renderer.scroller.removeChild(this._editor.renderer.emptyMessageNode);
        this._editor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
        if (this.debug) {
          console.debug('[ace-widget] _updatePlaceholder - shouldShow && !node');
        }
        node = this._editor.renderer.emptyMessageNode = document.createElement('div');
        node.textContent = this.placeholder;
        node.className = 'ace_comment';
        node.style.padding = '0 9px';
        node.style.zIndex = '1';
        node.style.position = 'absolute';
        node.style.color = '#aaa';
        if (this.debug) {
          console.debug('[ace-widget] _updatePlaceholder - node', node);
        }
        this._editor.renderer.scroller.appendChild(node);
    }
  }


  get editorValue() {
    return this._editor.getValue();
  }

  set editorValue(value) {
    if (value === undefined) {
      return;
    }
    this._value = value;
    this._editor.setValue(value);
    // console.debug("[ace-widget] set editorValue", this.editorValue)
  }

  focus() {
    this._editor.focus();
  }
  /**
   * Injects a style element into ace-widget's shadow root
   * @param {CSSSelector} selector for an element in the same shadow tree or document as `ace-widget`
   */
    injectStyle(selector){
      if (this.debug) console.debug('[ace-widget] injectStyle - selector', selector);
      const lightStyle = this.getRootNode().querySelector(selector) || document.querySelector(selector);
      if (this.debug) console.debug('[ace-widget] injectStyle - lightStyle', lightStyle);
      this.renderRoot.appendChild(lightStyle.cloneNode(true));
    }
  
  /**
   * Render method
   */
  render() {
    if (this.debug) console.debug('[ace-widget] render', this.value);
    return html`<div id="editor"></div>`;
  }

}

// Register the element
customElements.define('ace-widget', AceWidget);
