/* eslint-disable consistent-return */
const chalk = require('chalk');
const EntityGenerator = require('generator-jhipster/generators/entity');
const _ = require('lodash');
const { isReservedTableName } = require('generator-jhipster/jdl/jhipster/reserved-keywords');

module.exports = class extends EntityGenerator {
    constructor(args, opts) {
        super(args, { fromBlueprint: true, ...opts }); // fromBlueprint variable is important

        const jhContext = (this.jhipsterContext = this.options.jhipsterContext);

        if (!jhContext) {
            this.error(
                `This is a JHipster blueprint and should be used only like ${chalk.yellow(
                    'jhipster --blueprints custom-server-side-blueprint'
                )}`
            );
        }

        this.configOptions = jhContext.configOptions || {};
    }

    get initializing() {
        /**
         * Any method beginning with _ can be reused from the superclass `EntityGenerator`
         *
         * There are multiple ways to customize a phase from JHipster.
         *
         * 1. Let JHipster handle a phase, blueprint doesnt override anything.
         * ```
         *      return super._initializing();
         * ```
         *
         * 2. Override the entire phase, this is when the blueprint takes control of a phase
         * ```
         *      return {
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *          myAnotherCustomInitPhaseStep(){
         *              // Do all your stuff here
         *          }
         *      };
         * ```
         *
         * 3. Partially override a phase, this is when the blueprint gets the phase from JHipster and customizes it.
         * ```
         *      const phaseFromJHipster = super._initializing();
         *      const myCustomPhaseSteps = {
         *          displayLogo() {
         *              // override the displayLogo method from the _initializing phase of JHipster
         *          },
         *          myCustomInitPhaseStep() {
         *              // Do all your stuff here
         *          },
         *      }
         *      return { ...phaseFromJHipster, ...myCustomPhaseSteps };
         * ```
         */
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._initializing();
    }

    get prompting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._prompting();
    }

    get configuring() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._configuring();
    }

    get composing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._composing();
    }

    get loading() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._loading();
    }

    get preparingFields() {
        const customPrePhaseSteps = {
            myCustomPrePreparingFieldsStep() {
                // Stuff to do BEFORE the JHipster steps
                const entity = this.context;

                this.context.fields.forEach(field => {
                  this._prepareColumnAnnotationFieldForTemplates(entity, field, this);
                });
            }
        };
        const customPostPhaseSteps = {
            myCustomPostPreparingFieldsStep() {
                // Stuff to do AFTER the JHipster steps
                this.context.fields.forEach(field => {
                  this._prepareGeneratedValueAnnotationPrimaryKey(field);
                });
            }
        };
        return {
            ...customPrePhaseSteps,
            ...super._preparingFields(),
            ...customPostPhaseSteps
        };
    }    

    get preparing() {
        const customPostPhaseSteps = {
            myCustomPostPreparingStep() {
                // Stuff to do AFTER the JHipster steps
                const entity = this.context;

                _.defaults(entity, {
                    lombok: entity.lombok == true,
                });
            }
        };
        return {
            ...super._preparing(),
            ...customPostPhaseSteps
        };
    }

    get preparingRelationships() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._preparingRelationships();
    }

    get default() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._default();
    }

    get writing() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._writing();
    }

    get postWriting() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._postWriting();
    }

    get install() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._install();
    }

    get end() {
        // Here we are not overriding this phase and hence its being handled by JHipster
        return super._end();
    }   

    /**
     * Use the custom options defined at JDL as a Custom annotations to set the database auto generated strategy.
     * Ex:
     * entity ExampleClasse(ExampleTable) { generatedValue(identity) id Long }
     * 
     * @param {*} field 
     */
    _prepareGeneratedValueAnnotationPrimaryKey(field) {
        if (field.id) {
            if (field.options && field.options.generatedValue) {
                field.jpaGeneratedValue = field.options.generatedValue == 'identity' ? field.options.generatedValue : 'sequence';
                field.liquibaseAutoIncrement = true;
            }
        }
    }

    /**
     * Use the custom options defined at JDL as a Custom annotations to set the database ColumnName.
     * Ex:
     * entity ExampleClasse(ExampleTable) { @column(example_string) exampleString String }
     * 
     * @param {*} entityWithConfig 
     * @param {*} field 
     * @param {*} generator 
     * @returns field
     */
    _prepareColumnAnnotationFieldForTemplates(entityWithConfig, field, generator) {        
        if (field.options && field.options.column) {
            if (field.fieldNameAsDatabaseColumn === undefined) {
                const fieldComunNameUnderscored = _.snakeCase(field.options.column);
                const jhiFieldNamePrefix = generator.getColumnName(entityWithConfig.jhiPrefix);
                if (isReservedTableName(fieldComunNameUnderscored, entityWithConfig.prodDatabaseType)) {
                  if (!jhiFieldNamePrefix) {
                    generator.warning(
                      `The field name '${fieldComunNameUnderscored}' is regarded as a reserved keyword, but you have defined an empty jhiPrefix. This might lead to a non-working application.`
                    );
                    field.fieldNameAsDatabaseColumn = fieldComunNameUnderscored;
                  } else {
                    field.fieldNameAsDatabaseColumn = `${jhiFieldNamePrefix}_${fieldComunNameUnderscored}`;
                  }
                } else {
                  field.fieldNameAsDatabaseColumn = fieldComunNameUnderscored;
                }
              }
            field.columnName = field.fieldNameAsDatabaseColumn;
        }
        return field;
    }
};
