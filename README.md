####  webpack-copy-replace

`做这个插件是因为工作中有 测试环境 预上线环境 正式环境，这样每次打包都要手动去打包，很繁琐，作为一个程序员，能用代码处理的就绝不手动处理`



##### 用途

将webpack打包后的文件再次处理，如果替换文件中的某一些内容，或者直接就是复制一份出来



##### 安装

```javascript
  npm i webpack-copy-replace -D
  or
  yarn add webpack-copy-replace -D
```

```javascript
  // vue.config.js or webpack config
  const webpackCopyReplace = require('webpack-copy-replace')

  module.exports = {
  configureWebpack: {
    plugins: [
      new webpackCopyReplace({/* API */})
    ]
  }
}
```

##### API

* `baseRetain` { Boolean } 是否保留原始打包文件 -- 默认 true
* `basePath` { String } 原始输出文件路径 -- 默认/base  (PS: 输出的文件将会是在原有webpack的输出文件夹下 默认是在 dist/base)
* `error` { Function } 替换错误回调
  * `error({path, content, success})`
    - `path` 对应 `options` 选项中的 `replacePath` 值
    - `content` 文件内容
    - `success` 处理完成回调
      - `success(content)` { content } 回调传参处理后的数据
* `options` { Array[Object] } 复制文件参数配置
  * `replaceFile` { Array[String] } 需要替换的文件类型 -- 如果不传，不会去替换任何内容
  * `replacePath` { String } 替换后的文件输出目录 -- 不传输出路径的话是不会输出替换后的文件
  * `exclude` { Array[String] } 排除替换的文件
  * `rules` { Array[Object] } 排除替换的文件
    - `reg` { RegExp } // 被替换的内容
    - `value` { String } // 替换后的内容


##### 完整配置
``` javaScript
{
    baseRetain: true, // 是否保留原始打包文件 -- 默认 true
    basePath: '/prod', // 原始输出文件路径 -- 默认 /base
    // 替换错误回调
    error: ({ path, content, success }) => {
      success(content)
    },
    // 复制文件配置
    options: [{
      replaceFile: ['js', 'html'], // 需要替换的文件类型 -- 如果不传的话，不会去替换任何内容
      replacePath: '/stag1', // 替换后的文件输出目录 -- 不写输出路径的话是不会输出替换后的文件
      // 排除的文件
      exclude: [
        'abc.js'
      ],
      // 替换规则
      rules: [
        {
          reg: new RegExp('test', 'g'), // 需要替换的内容
          value: 'abc' // 替换后的值
        }
      ]
    }, {
      replaceFile: ['js', 'html'], // 需要替换的文件类型 -- 如果不传的话，不会去替换任何内容
      replacePath: '/stag2', // 替换后的文件输出目录 -- 不写输出路径的话是不会输出替换后的文件// 排除的文件
      exclude: [
        'abcdefg.js'
      ],
      // 替换规则
      rules: [
        {
          reg: new RegExp('abc', 'g'), // 需要替换的内容
          value: 'def' // 替换后的值
        }
      ]
    }]
  }
```