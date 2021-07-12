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

                this._preparingLombokAnnotationForEntityTemplates(entity);
                this._preparingSchemaAnnotationForEntityTemplates(entity);
                this._preparingNoCodCommentAnnotationForEntityTemplates(entity);
                this._preparingEsjtPatternAnnotationForEntityTemplates(entity, this);
                this._preparingApiVersionAnnotationForEntityTemplates(entity);
                this._preparingApiUrlAnnotationForEntityTemplates(entity);
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

    /**
     * Use the custom options defined at JDL as a Custom annotations to use lombok framework at domain entity instead of get and set
     * Ex:
     * @lombok entity ExampleClasse(ExampleTable) { exampleString String }
     * @param {*} entityWithConfig 
     */
    _preparingLombokAnnotationForEntityTemplates(entityWithConfig) {
        if (typeof entityWithConfig.lombok == 'string' && entityWithConfig.lombok.length > 0) {
            throw new Error('The annotation @lombok can not have a value. Ex: @lombok');
        }

        _.defaults(entityWithConfig, {
            lombok: entityWithConfig.lombok == true,
        });
    }

    /**
     * Use the custom options defined at JDL as a Custom annotations to set the schema for an domain entity.
     * Ex:
     * @schema(Name) entity ExampleClasse(ExampleTable) { exampleString String }
     * 
     * @param {*} entityWithConfig 
     */
    _preparingSchemaAnnotationForEntityTemplates(entityWithConfig) {
        let hasSchemaValue = typeof entityWithConfig.schema == 'string' && entityWithConfig.schema.length > 0;
        if (entityWithConfig.schema != undefined && !hasSchemaValue) {
            throw new Error('The annotation @schema must have a value. Ex: @schema(Name)');
        }
    
        _.defaults(entityWithConfig, {
            hasSchema: hasSchemaValue,
            entitySchemaName: entityWithConfig.schema,
        });
    }

    /**
     * Use the custom options defined at JDL as a Custom annotations to remove any code comment.
     * Ex:
     * @noCodeComment entity ExampleClasse(ExampleTable) { exampleString String }
     * 
     * @param {*} entityWithConfig 
     */
    _preparingNoCodCommentAnnotationForEntityTemplates(entityWithConfig) {
        if (typeof entityWithConfig.noCodeComment == 'string' && entityWithConfig.noCodeComment.length > 0) {
            throw new Error('The annotation @noCodeComment can not have a value. Ex: @noCodeComment');
        }

        _.defaults(entityWithConfig, {
            noCodeComment: entityWithConfig.noCodeComment == true,
        });
    }

    /**
     * Use the custom options defined at JDL as a Custom annotations to implement 
     * customize Service/Resource/Tests using includes templates from templates/esjtpattern/ folder 
     * and ignoring jhipster templates.
     * Ex:
     * @esjtPattern entity ExampleClasse(ExampleTable) { exampleString String }
     * 
     * @param {*} entityWithConfig 
     * @param {*} generator 
     */
    _preparingEsjtPatternAnnotationForEntityTemplates(entityWithConfig, generator) {
        if (typeof entityWithConfig.esjtPattern == 'string' && entityWithConfig.esjtPattern.length > 0) {
            throw new Error('The annotation @esjtPattern can not have a value. Ex: @esjtPattern');
        }

        _.defaults(entityWithConfig, {
            esjtPattern: entityWithConfig.esjtPattern == true,
        });
    }            
    
    /**
     * Use the custom options defined at JDL as a Custom annotations to set the api version.
     * Ex:
     * @apiVersion(Name) entity ExampleClasse(ExampleTable) { exampleString String }
     * @param {*} entityWithConfig 
     */
    _preparingApiVersionAnnotationForEntityTemplates(entityWithConfig) {
        let hasApiVersionValue = typeof entityWithConfig.apiVersion == 'string' && entityWithConfig.apiVersion.length > 0;
        if (entityWithConfig.apiVersion != undefined && !hasApiVersionValue) {
            throw new Error('The annotation @apiVersion must have a value. Ex: @apiVersion(Name)');
        }        
        _.defaults(entityWithConfig, {
            hasApiVersion: hasApiVersionValue,
            apiVersion: entityWithConfig.apiVersion,
        });
    }

    /**
     * Use the custom options defined at JDL as a Custom annotations to set the api url.
     * Ex:
     * @apiUrl(Name) entity ExampleClasse(ExampleTable) { exampleString String }
     * @param {*} entityWithConfig 
     */
    _preparingApiUrlAnnotationForEntityTemplates(entityWithConfig) {
        let hasApiUrlValue = typeof entityWithConfig.apiUrl == 'string' && entityWithConfig.apiUrl.length > 0;
        if (entityWithConfig.apiUrl != undefined && !hasApiUrlValue) {
            throw new Error('The annotation @apiUrl must have a value. Ex: @apiUrl(Name)');
        }        
        _.defaults(entityWithConfig, {
            hasApiUrl: hasApiUrlValue,
            apiUrl: entityWithConfig.apiUrl,
        });
    }
};