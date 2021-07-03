const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('Subgenerator server of custom-server-side-blueprint JHipster blueprint', () => {
    describe('Sample test', () => {
        before(async function () {
            this.timeout(20000);
            return helpers
                .create('jhipster:server')
                .withOptions({
                    fromCli: true,
                    skipInstall: true,
                    blueprint: 'custom-server-side-blueprint',
                    skipChecks: true,
                })
                .withGenerators([
                    [
                        require('generator-jhipster/generators/server'), // eslint-disable-line global-require
                        'jhipster:server',
                        require.resolve('generator-jhipster/generators/server'),
                    ],
                    [
                        require('../generators/server'), // eslint-disable-line global-require
                        'jhipster-custom-server-side-blueprint:server',
                        path.join(__dirname, '../generators/server/index.js'),
                    ],
                ])
                .withPrompts({
                    baseName: 'sampleMysql',
                    packageName: 'com.mycompany.myapp',
                    applicationType: 'monolith',
                    databaseType: 'sql',
                    devDatabaseType: 'h2Disk',
                    prodDatabaseType: 'mysql',
                    cacheProvider: 'ehcache',
                    authenticationType: 'session',
                    enableTranslation: true,
                    nativeLanguage: 'en',
                    languages: ['fr', 'de'],
                    buildTool: 'maven',
                    rememberMeKey: '2bb60a80889aa6e6767e9ccd8714982681152aa5',
                })
                .run();
        });

        it('it works', () => {
            // Adds your tests here
            assert.textEqual('Write your own tests!', 'Write your own tests!');
        });
    });
});
