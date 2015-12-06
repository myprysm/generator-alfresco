'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-generator').test;

describe('generator-alfresco:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      //.withOptions({someOption: true})
      .withPrompts({
        name: 'projName',
        description: 'Description of projName',
        groupId: 'fr.myprysm',
        artifactId: 'projname',
        package: 'fr.myprysm.base',
        version: '1.0.0-SNAPSHOT'
      })
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
      'dummyfile.txt',
      '.gitignore',
      'pom.xml',
      'solr-config/pom.xml',
      'runner/test-ng/testng-alfresco-share.xml',
      'runner/pom.xml',
      'repo/src/main/properties/local',
      'repo/pom.xml',
      'share/src/test/resources/log4j.properties',
      'share/pom.xml'
    ]);

    assert.fileContent([
      ['pom.xml', '<groupId>fr.myprysm</groupId>'],
      ['pom.xml', '<artifactId>projname</artifactId>'],
      ['pom.xml', '<name>projName</name>'],
      ['pom.xml', '<version>1.0.0-SNAPSHOT</version>']
    ]);
  });
});
