# ember-templates-loader

> Load templates into Ember with webpack.

## Description

This will precompile your HTMLBars templates when you build with webpack with overrides specific for Ember.

## Usage

``` js
var MyView = Ember.View.extend({
  template: require('ember-templates!./templates/my-view.hbs')
});
```

Or better within your `webpack.config.js`:

``` js
module.exports = {
  module: {
    loaders: [
      { test: /\.hbs$/, loader: 'ember-templates' }
    ]
  }
};
```

Now all required handlebars templates will be compiled for Ember first.

## Install

`npm install ember-templates-loader --save-dev`

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style.

## Release History
* 1.3.0 - Include ember-template-compiler directly instead of using napa.
* 1.2.0 - Wrap template in Ember.HTMLBars.template()
* 1.1.0 - Support for Ember 1.10 and HTMLBars
* 1.0.1 - Include ember-template-compiler in package.json (@mzgoddard)
* 1.0.0 - Update to Handlebars 2.0 and template compiler for Ember 1.9 (@mzgoddard)
* 0.2.0 - Precompile templates for Ember and publish

## License
Copyright (c) 2015 Kyle Robinson Young  
Licensed under the MIT license.
