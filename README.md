[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/LostInBrittany/ace-widget)

# ace-widget #

> Even <strong>more</strong> embeddable code editor
> Custom Element - just one tag, and no JS needed to provide
> [Ace](http://ace.c9.io/) - The High Performance Code Editor
>
> Originally based on [pjako's fork](https://github.com/pjako/ace-element)
> of [PolymerLabs ace-element](https://github.com/PolymerLabs/ace-element).
>

> Polymer 3.x. element
> The legacy Polymer 2.x version is available [here](https://www.webcomponents.org/element/LostInBrittany/ace-widget/)

## Doc and demo

https://lostinbrittany.github.io/ace-widget/


## Usage example

<!---
```
<custom-element-demo>
  <template>
    <script src="../webcomponentsjs/webcomponents-lite.js"></script>
    <link rel="import" href="ace-widget.html">
    <next-code-block></next-code-block>
  </template>
</custom-element-demo>
```
-->
```html
  <ace-widget placeholder="Write something... Anything..." initial-focus>
  </ace-widget>
```


## Install


Install the component using [npm](https://www.npmjs.com/):

```sh
$ npm i @granite-elements/ace-widget --save
```

Once installed, import it in your application:

import '@granite-elements/ace-widget/ace-widget.js';



## Running demos and tests in browser

1. Fork the `ace-widget` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) 
and the [Polymer CLI](https://www.polymer-project.org/3.0/docs/tools/polymer-cli) installed.

1. When in the `ace-widget` directory, run `npm install` to install dependencies.

1. Serve the project using Polyumer CLI:

    `polymer serve --module-resolution node --component-dir node_modules`

1. Open the demo in the browser

    - http://127.0.0.1:8080/components/@greanite-elements/ace-widget/demo


## Attributes

Attribute     | Type      | Default | Description
---           | ---       | ---     | ---
`theme`       | *String*  | ``      | `Editor#setTheme` at [Ace API](http://ace.c9.io/#nav=api&api=editor)
`mode`        | *String*  | ``      | `EditSession#setMode` at [Ace API](http://ace.c9.io/#nav=api&api=edit_session)
`font-size`   | *String*  | ``      | `Editor#setFontSize` at [Ace API](http://ace.c9.io/#nav=api&api=editor)
`softtabs`    | *Boolean* | ``      | `EditSession#setUseSoftTabs()` at [Ace API](http://ace.c9.io/#nav=api&api=edit_session)
`tab-size`    | *Boolean* | ``      | `Session#setTabSize()` at [Ace API](http://ace.c9.io/#nav=api&api=edit_session)
`readonly`    | *Boolean* | ``      | `Editor#setReadOnly()` at [Ace API](http://ace.c9.io/#nav=api&api=editor)
`wrap`        | *Boolean* | ``      | `Session#setWrapMode()` at [Ace API](http://ace.c9.io/#nav=api&api=edit_session)
`autoComplete` | *Object* | ``   | Callback for `langTools.addCompleter` like the example at [Ace API](https://github.com/ajaxorg/ace/wiki/How-to-enable-Autocomplete-in-the-Ace-editor)
`minlines`    | *Number*  | 15      | `Editor.setOptions({minlines: minlines})`
`maxlines`    | *Number*  | 30      | `Editor.setOptions({minlines: maxlines})`
`initialFocus`| *Boolean* | ``      | If true, `Editor.focus()` is called upon initialisation
`placeholder` | *String*  | ``      | A placeholder text to show when the editor is empty

## Properties

Name        |  Description
---         | ---
`editor`    | Ace [editor](http://ace.c9.io/#nav=api&api=editor) object.
`value`     | [editor.get-/setValue()](http://ace.c9.io/#nav=api&api=editor)

## Events

Name             |  Description
---              | ---
`editor-content` | Triggered when editor content gets changed
`editor-ready`   | Triggered once Ace editor instance is created.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

[MIT License](http://opensource.org/licenses/MIT)
