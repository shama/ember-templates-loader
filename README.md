# ember-templates-loader

> Load templates into Ember with webpack.

## Description

This will precompile your Handlebar templates when you build with webpack with overrides specific for Ember.

## Usage

``` js
var MyView = Ember.View.extend({
  template: require('ember-templates!./templates/my-view.hbs')
});
```

## Install

`npm install ember-templates-loader --save-dev`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History
* 0.2.0 - Precompile templates for Ember and publish

## License
Copyright (c) 2014 Kyle Robinson Young  
Licensed under the MIT license.
