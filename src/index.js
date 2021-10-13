class webpackCopyReplace {
  /**
   * @param { Object } parameter
   * @param { Boolean } parameter.baseRetain 是否保留原始打包文件 -- 默认 true
   * @param { String } parameter.basePath 原始输出文件路径 -- 默认/base
   * @param { Array } parameter.options 复制文件参数
   */
  constructor(options) {
    if (typeof options === 'object') {
      this.parameter = {
        ...this.parameter,
        ...options
      }
    } else {
      console.error(`传入的参数不是一个 Object 类型, 而是一个 ${Array.isArray(options) ? 'Array' : (typeof options)} 类型`)
    }
  }

  parameter = {
    baseRetain: true,
    basePath: '/base',
    options: []
  }

  apply(compiler) {
    // 没有配置任何东西就不做任何处理
    if (!this.parameter.options || !this.parameter.options.length === 0) return
    compiler.hooks.emit.tapAsync('ProdCopyStag', (compilation, callback) => {
      let arr = Object.keys(compilation.assets || {})
      // 先处理原始文件  -- 如果配置了保留原始文件
      if (this.parameter.baseRetain) {
        for (let index = 0, leng = arr.length; index < leng; index++) {
          // 先拿到路径
          const name = arr[index]
          // 在拿到原文件内容
          const source = compilation.assets[name].source()
          // 根据配置的文件路径输出文件
          compilation.assets[this.parameter.basePath + '/' + name] = {
            source() {
              return source
            },
            size() {
              return this.source().length
            }
          }
        }
      }
      let options = this.parameter.options || []
      for (let i = 0, leng = options.length; i < leng; i++) {
        const option = options[i]
        let tyleFile = '';
        (option.replaceFile || []).forEach((item, index) => {
          if (index === 0) {
            tyleFile += `.${item}$`
          } else {
            tyleFile += `|.${item}$`
          }
        })
        tyleFile = new RegExp(tyleFile)

        for (let j = 0, leng = arr.length; j < leng; j++) {
          // 先拿到路径
          const name = arr[j]
          // 在拿到原文件内容
          let copySource = compilation.assets[name].source()

          // 排除文件
          let excludeFlag = true
          if (
            option.exclude &&
            option.exclude.length &&
            option.exclude.includes(name.replace(/.*\//, ''))
          ) {
            excludeFlag = false
          }

          // 处理复制文件
          if (tyleFile.test(name) && option.rules && option.rules.length && excludeFlag) {
            option.rules.forEach(item => {
              try {
                copySource = copySource.replace(item.reg, item.value)
              } catch (error) {
                if (this.parameter.error) {
                  this.parameter.error({
                    path: option.replacePath,
                    content: copySource,
                    success: (content) => {
                      copySource = content
                    }
                  })
                } else {
                  console.log('\r\n')
                  console.log('\x1B[31m%s\x1B[0m', 'ERROR:')
                  console.log('\x1B[33m%s\x1B[0m', `输出路径为 ${option.replacePath} 的配置触发错误`)
                  console.log('\x1B[33m%s\x1B[0m', `错误文件:${name}`)
                  console.log('\x1B[33m%s\x1B[0m', '可以尝试配置排除当前文件，示例: exclude: ["windowErrorCatch.js"]')
                  console.log('\x1B[33m%s\x1B[0m', '或者加入错误回调函数自行处理, 示例 error: ({ path, content, success }) => {}')
                  console.log('\r\n')
                  throw new Error(name)
                }
              }
            })
          }
          // 根据配置的文件路径输出文件
          if (option.replacePath) {
            compilation.assets[option.replacePath + '/' + name] = {
              source() {
                return copySource
              },
              size() {
                return this.source().length
              }
            }
          }
        }
      }
      // 删除原始打包文件
      for (let index = 0, leng = arr.length; index < leng; index++) {
        const name = arr[index]
        delete compilation.assets[name]
      }
      callback()
    })
  }
}

module.exports = webpackCopyReplace
