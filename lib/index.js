const fs = require('fs');
const chalk = require('chalk');
const loremIpsum = require('lorem-ipsum');
const dateFormat = require('dateformat');

class Mock {
    /**
     * pass schema to class
     * @param {object} schema
     */
    constructor(schema) {
        this.schema = schema;
        this.output = ''; // init output
    }
    /**
     * init project
     */
    init() {
        this.parseSchema(this.schema);
        this.writeFile();
    }
    /**
     * parse schema
     * @param {object} schema
     * @param {number} length, default 1
     */
    parseSchema(schema, length = 1) {
        const validateReslut = this.validateSchema(schema);
        if (validateReslut === true) { // schema perfect
            for (let i = 0; i < length; i++) {
                this.output += '{';
                schema.map((field, fielIndex) => {
                    const isLastField = schema.length === fielIndex + 1;
                    this.output += `"${field.key}":`;
                    switch (field.type) {
                        case 'index':
                            this.handleIndexType(field, i);
                            break;
                        case 'number':
                            this.handleNumberType(field);
                            break;
                        case 'exactly':
                            this.handleExactlyType(field);
                            break;
                        case 'enum':
                            this.handleEnumType(field);
                            break;
                        case 'word':
                            this.handleWordType(field);
                            break;
                        case 'sentence':
                            this.handleSentenceType(field);
                            break;
                        case 'date':
                            this.handleDateType(field);
                            break;
                        case 'object':
                            this.parseSchema(field.schema);
                            break;
                        case 'array':
                            this.output += '[';
                            this.parseSchema(field.schema, field.length);
                            this.output += ']';
                            break;
                        default:
                            this.handleUnknownType(field.type);
                            break;
                    }
                    if (isLastField === true) {
                        this.output += '}';
                    } else {
                        this.output += ',';
                    }
                });
                if (i !== length - 1) {
                    this.output += ',';
                }
            }
        } else { // schema has error
            this.handleError(validateReslut);
        }
    }
    /**
     * handle index type
     * @param {object} field
     * @param {number} index
     */
    handleIndexType(field, index) {
        const start = field.start || 1; // default start at 1
        this.output += start + index;
    }
    /**
     * validate index type
     * @param {object} field
     * @return errorMessage if has error or true
     */
    validateIndexType(field) {
        const start = field.start || 1; // default start at 1
        if (Number.isInteger(start) === true) {
            return true;
        }
        const errorMessage = this.getTypeErrorMessage('start', field.type, 'integer', start);
        return errorMessage;
    }
    /**
     * handle number type
     * @param {object} field
     */
    handleNumberType(field) {
        const decimal = field.decimal || 0;
        const min = field.range ? field.range[0] : 1;
        const max = field.range ? field.range[1] : 10;
        this.output += this.random(min, max, decimal);
    }
    /**
     * validate number type
     * @param {object} field
     * @return errorMessage if has error or true
     */
    validateNumberType(field) {
        const decimal = field.decimal || 0;
        const min = field.range ? field.range[0] : 1;
        const max = field.range ? field.range[1] : 10;
        let errorMessage = true;
        if (decimal < 0 || decimal > 20) {
            errorMessage = `The 'decimal' of ${field.type} must be between 0 and 20, but you provide '${decimal}'`;
        } else if (typeof min !== 'number' || typeof max !== 'number') {
            errorMessage = `The 'range' of ${field.type} must array with two number inside, but you provide '${JSON.stringify(field.range)}'`;
        }
        return errorMessage;
    }
    /**
     * handle exactly type, output exactly field.value
     * @param {object} field
     */
    handleExactlyType(field) {
        this.output += JSON.stringify(field.value);
    }
    /**
     * validate exactly type
     * @param {object} field
     * @return errorMessage if has error or true
     */
    validateExactlyType(field) {
        let errorMessage = true;
        if (field.value === undefined) {
            errorMessage = 'value is required for exactly type';
        }
        return errorMessage;
    }
    /**
     * handle emun type
     * @param {object} field
     */
    handleEnumType(field) {
        const enumLength = field.value.length;
        const randomEnumIndex = this.random(0, enumLength - 1);
        this.output += JSON.stringify(field.value[randomEnumIndex]);
    }
    /**
     * handle word type, default length 10
     * @param {object} field
     */
    handleWordType(field) {
        const length = field.length || 10;
        const word = loremIpsum({
            count: length,
            units: 'words',
        });
        this.output += `"${word}"`;
    }
    /**
     * handle setence type, default length 5
     * @param {object} field
     */
    handleSentenceType(field) {
        const length = field.length || 5;
        const sentence = loremIpsum({
            count: length,
            units: 'sentences',
        });
        this.output += `"${sentence}"`;
    }
    /**
     * handle date type, default range 1970 to now
     * @param {object} field
     */
    handleDateType(field) {
        /*  default start 0  default start 0 */
        const start = field.range ? new Date(field.range[0]).getTime() : 0;
        const end = field.range ? new Date(field.range[1]).getTime() : new Date().getTime();
        const format = field.format || 'yyyy/mm/dd';
        const randomTime = dateFormat(this.random(start, end), format);
        this.output += `"${randomTime}"`;
    }
    /**
     * log about unexcept type
     * @param {string} type
     */
    handleUnknownType(type) {
        console.log(chalk.red(`error: unknown schema type '${type}' !`));
        process.exit();
    }
    /**
     * handle error if occur
     * @param {string} info , error message to show
     */
    handleError(info) {
        console.log(chalk.red(`Error:${info}`));
        process.exit();
    }
    /**
     * get schema type error message
     * @param {string} propertyName schema propertyName of such value
     * @param {string} type schema type of such value
     * @param {string} reservedType
     * @param value provide value
     * @return error message
     */
    getTypeErrorMessage(propertyName, type, reservedType, value) {
        const errorMessage = `The '${propertyName}' of '${type}' type should be '${reservedType}', but you provider '${value}'`;
        return errorMessage;
    }
    /**
     * return a random number between min and max , include min and max
     * @param {number} min
     * @param {number} max
     * @param {number} decimal, decimal place default 0
     * @return {number}
     */
    random(min, max, decimal = 0) {
        if (decimal === 0) {
            return Math.floor(Math.random() * ((max - min) + 1)) + min;
        }
        return (Math.random() * ((max - min) + 1) + min).toFixed(decimal);
    }
    /**
     * validate schema
     * @param {Array} schema
     * @return errorMessage if has error or true
     */
    validateSchema(schema) {
        let errorMessage = true;
        if (Array.isArray(schema) !== true) {
            errorMessage = `Schema is array, but you provide ${typeof schema}`;
            return errorMessage;
        }
        const schemaLength = schema.length;
        for (let i = 0; i < schemaLength; i++) {
            if (schema[i].key === undefined || schema[i].type === undefined) {
                errorMessage = 'key and type is required for every field of schema,please check your schema!';
                break;
            } else if (typeof schema[i].key !== 'string' || typeof schema[i].type !== 'string') {
                errorMessage = 'key and type should be String type,please check your schema!';
                break;
            } else {
                switch (schema[i].type) {
                    case 'index':
                        errorMessage = this.validateIndexType(schema[i]);
                        break;
                    case 'number':
                        errorMessage = this.validateNumberType(schema[i]);
                        break;
                    case 'exactly':
                        errorMessage = this.validateExactlyType(schema[i]);
                        break;
                    case 'enum':

                        break;
                    case 'word':

                        break;
                    case 'sentence':

                        break;
                    case 'date':

                        break;
                    case 'object':

                        break;
                    case 'array':

                        break;
                    default:
                        break;
                }
                break;
            }
        }
        return errorMessage;
    }
    /**
     * write output to file
     * @param
     */
    writeFile() {
        fs.writeFile('test.json', JSON.stringify(JSON.parse(this.output), null, 4), (err) => {
            if (err) {
                console.log(chalk.red('err!'));
                throw err;
            }
            console.log(chalk.green('success!'));
        });
    }
}

module.exports = Mock;