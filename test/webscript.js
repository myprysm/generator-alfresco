'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-alfresco:webscript', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/webscript'))
      //.withOptions({someOption: true})
      .withPrompts({
        id: 'sample-webscript',
        shortname: 'sample-webscript',
        description: 'Sample description',
        url: '/com/sample/adminscript',
        method: 'GET',
        format: 'JSON',
        authentication: 'admin'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'sample-webscript.get.desc.xml',
      'sample-webscript.get.json.ftl',
      'sample-webscript.get.js'
    ]);
  });

  it('describes webscript', function () {
    assert.fileContent([
      ['sample-webscript.get.desc.xml', '<authentication>admin</authentication>'],
      ['sample-webscript.get.desc.xml', '<format default="json">extension</format>']
    ]);

    assert.noFileContent([
      ['sample-webscript.get.desc.xml', '<family>']
    ]);
  });
});
