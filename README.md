# mock-json-data [(中文)](README_CN.md)
A easy use mock json data generator npm cli tool for front-end engineer.

### Installation
``` bash
$ npm install -g mock-json-data
```

### Usage
``` bash
$ mock <schema-file> <output-file-name>
```
### Schema
A schema file defines the structure of data. It is a object array. A simple schema looks like this:
``` json
[
    {
        "key":"code",
        "type":"enum",
        "value":[-1,1,0]
    },
    {
        "key":"message",
        "type":"exactly",
        "value": "success" 
    },
    {
        "key":"lists",
        "type":"array",
        "length":10,
        "schema":[
            {
                "key":"id",
                "type":"index",
                "start":100,
            },
            {
                "key":"Week",
                "type":"enum",
                "value":["Mon","Tue","Wen","Thu","Fri"]
            }
        ]
    }
]
``` 
`key` and `type` is required for every object. `key` is the property name of data and type tells how to generate data. Currently, type is one of `['index', 'number', 'exactly', 'enum', 'word', 'sentence', 'date', 'object', 'array']`, each type can have some other property.

### Schema Detail
- `index` : auto increase for index purpose
    - `start` : the start index, should be a number, optional, default = 0
- `number` : generate number data
    - `range` : the range of generate number, array with two number inside, optional, default = [0,10]
    - `decimal`: the decimal of number, should be a number, optional, default = 0
- `exactly` : generate an exactly given value
    - `value`: the value need to generate, required
- `enum` : choose one from given array value randomly
    - `value`: the collection of enum, should be an array, required, eg: `["Mon","Tue","Wen","Thu","Fri"]`
- `word` : generate some lorem ipsum words, powered by [lorem-ipsum.js](https://github.com/knicklabs/lorem-ipsum.js)
    - `length`: the amount of words, should be a number, optional, default = 10
- `sentence` : generate some lorem ipsum sentence, powered by [lorem-ipsum.js](https://github.com/knicklabs/lorem-ipsum.js)
    - `length`: the amount of sentence, should be a number, optional, default = 5
- `date` : generate date type data 
    - `range` the range of generate date, array with two date inside, optional, default = ['1970-0-1',now]
    - `format`: format of date, optional , default = 'yyyy/mm/dd', check [node-dateformat](https://github.com/felixge/node-dateformat) for more types of format
- `object` : generate object data
    - `schema`: the sub-schema of object, the rule is same as schema, required
- `array` : generate array(list,collection) data
    - `length`: the length of array, should be number, required
    - `schema`: the sub-schema of array, the rule is same as schema, required

### Todo Lists
- build-in enum (eg: name, month, address )
- more types support
- GUI 
