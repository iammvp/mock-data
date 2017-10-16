# mock-json-data
前端工程师简单易用的假数据生成器 cli

### 安装
``` bash
$ npm install -g mock-json-data
```

### 使用
``` bash
$ mock <schema-file> <output-file-name>
```
### Schema
schema文件用来定义生成的数据结构.它是一个对象数组.下面是一个简单的例子:
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
`key` 和 `type` 对所有项来说都是必须的. `key` 是数据的属性名, `type` 定义生成什么类型的数据. 目前来说,`type`支持 `['index', 'number', 'exactly', 'enum', 'word', 'sentence', 'date', 'object', 'array']`中的一个, 每种 `type` 还会有一些其他属性.

### Schema 详情
- `index` : 自增长的id属性
    - `start` : 自增长从多少开始, number 类型, 可选, default = 0
- `number` : 生成数字类型数据
    - `range` : 数字的返回, 是一个包含两个数字的数组, 可选, default = [0,10]
    - `decimal`: 小数位数, number 类型, 可选, default = 0
- `exactly` : 生成固定值
    - `value`: 需要生成的值, 必须
- `enum` : 从所给的数组里面随机选取一个
    - `value`: 供选择的数据, 是array类型, 必须, 例如: `["周一","周二","周三","周四","周五"]`
- `word` : 生成随机的 lorem ipsum 文字, powered by [lorem-ipsum.js](https://github.com/knicklabs/lorem-ipsum.js)
    - `length`: 文字长度, number 类型, 可选, default = 10
- `sentence` : 生成随机的 lorem ipsum 句子, powered by [lorem-ipsum.js](https://github.com/knicklabs/lorem-ipsum.js)
    - `length`: 句子长度, number 类型, 可选, default = 5
- `date` : 生成时间类型 
    - `range` 生成时间的范围, 是一个包含两个日期类型的数组, 可选, default = ['1970-0-1',now]
    - `format`: 时间格式, 可选 , default = 'yyyy/mm/dd',  [node-dateformat](https://github.com/felixge/node-dateformat) 查看更多类型
- `object` : 生成对象数据
    - `schema`: 对象的数据格式, 和上面的schema完全一样, 必须
- `array` : 生成数组(列表,集合) 数据
    - `length`: 数组的长度, number 类型, 必须
    - `schema`: 数组的数据格式, 和上面的schema完全一样, 必须

### Todo Lists
- 更多内置的enum类型 (例如: 名字, 月份, 地址 )
- 支持更多的类型
- 图形界面 
