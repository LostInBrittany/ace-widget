# ace-widget #

> Even <strong>more</strong> embeddable code editor
> Custom Element - just one tag, and no JS needed to provide
> [Ace](http://ace.c9.io/) - The High Performance Code Editor
>
> Based on [pjako's fork](https://github.com/pjako/ace-element)
> of [PolymerLabs ace-element](https://github.com/PolymerLabs/ace-element).
>
> Polymer 1.2 ready


## Install

Install the component using [Bower](http://bower.io/):

```sh
$ bower install LostInBrittany/ace-widget --save
```

Or [download as ZIP](https://github.com/LostInBrittany/ace-widget/archive/gh-pages.zip).

## Usage

1. Import Web Components' polyfill (if needed):

    ```html
    <script src="bower_components/webcomponentsjs/webcomponents.min.js"></script>
    ```

2. Import Custom Element:

    ```html
    <link rel="import" href="bower_components/ace-widget/ace-widget.html">
    ```

3. Start using it!

    ```html
    <ace-widget>Editable code here</ace-widget>
    ```

## Attributes

Attribute     | Options   | Default | Description
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
