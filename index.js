'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
const fastbootTransform = require('fastboot-transform');

const defaultOptions = {
  js: ['util', 'alert', 'button', 'carousel', 'collapse', 'dropdown', 'modal', 'tooltip', 'popover', 'scrollspy', 'tab']
};

module.exports = {
  name: 'ember-cli-bootstrap-4',

  included: function (app) {
    this._super.included(app);

    var popperPath = path.join('node_modules', 'popper.js', 'dist', 'umd');
    var jsPath = path.join('node_modules', 'bootstrap', 'js', 'dist');
    var options = Object.assign({}, defaultOptions, app.options[this.name]);
    var importOptions = {
      using: [{
        transformation: 'fastbootTransform'
      }]
    };

    if (Array.isArray(options.js)) {
      var include = options.js.map(function (item) { return item + '.js' });

      app.import({
        development: path.join(popperPath, 'popper.js'),
        production: path.join(popperPath, 'popper.min.js'),
      }, importOptions);

      app.import({
        development: path.join(popperPath, 'popper-utils.js'),
        production: path.join(popperPath, 'popper-utils.min.js'),
      }, importOptions);

      include.forEach(function (file) {
        app.import(path.join(jsPath, file), importOptions);
      });
    }
  },

  treeForStyles: function (tree) {
    var styleTrees = [];
    var current = this;
    var app;

    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));

    if (app.project.findAddonByName('ember-cli-sass')) {
      var scssDir = path.dirname(app.project.resolveSync('bootstrap/scss/bootstrap.scss'));
      styleTrees.push(new Funnel(scssDir, {
        destDir: 'ember-cli-bootstrap-4'
      }));
    }

    if (tree) {
      styleTrees.push(tree);
    }

    return mergeTrees(styleTrees, { overwrite: true });
  },

  importTransforms: function () {
    return {
      fastbootTransform: fastbootTransform
    }
  }
};
