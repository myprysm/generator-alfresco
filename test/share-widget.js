'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-alfresco:share-widget without option', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/share-widget'))
      .withPrompts({widgetName: 'SampleComponent'})
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'SampleComponent.js',
      'css/SampleComponent.css',
      'i18n/SampleComponent.properties',
      'templates/SampleComponent.html'
    ]);
  });

  it('contains replacements', function () {
    assert.fileContent([
      ['SampleComponent.js', 'SampleComponent'],
      ['css/SampleComponent.css', 'sample-component'],
      ['templates/SampleComponent.html', 'sample-component']
    ]);
  });
});

describe('generator-alfresco:share-widget with path', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/share-widget'))
      .withOptions({path: 'a/folder/with/'})
      .withPrompts({widgetName: 'SampleComponent'})
      .on('end', done);
  });

  it('creates files at path', function () {
    assert.file([
      'a/folder/with/SampleComponent.js',
      'a/folder/with/css/SampleComponent.css',
      'a/folder/with/i18n/SampleComponent.properties',
      'a/folder/with/templates/SampleComponent.html'
    ]);
  });
});

describe('generator-alfresco:share-widget with path and container', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/share-widget'))
      .withOptions({path: 'a/folder/with/', container: true})
      .withPrompts({widgetName: 'SampleComponent'})
      .on('end', done);
  });

  it('creates files at path', function () {
    assert.file([
      'a/folder/with/SampleComponent/SampleComponent.js',
      'a/folder/with/SampleComponent/css/SampleComponent.css',
      'a/folder/with/SampleComponent/i18n/SampleComponent.properties',
      'a/folder/with/SampleComponent/templates/SampleComponent.html'
    ]);
  });
});
