# @hello/component-vue
公司Vue项目中的公用组件及Mixin集合

# Install
```bash
    npm install @hello/component-vue --save #在安装之前请确保npm的仓库地址已经指向了公司内部私有npm仓库地址
```

# 如何新增一个公共组件

> 下面以一个test组件为例   
* 在src/components目录下新增`New`文件夹,`New`文件夹里的目录结构如下：
``` javascript
    -- src
       |-- components
           |-- New
               |-- src
                   |--index.vue 
               |--index.js 
```
* 在index.vue中编写组件
* 在项目根目录下的`test`文件夹下新增`new.test.js`
* 编写测试用例，在控制台运行npm run test可以看到其结果
* 测试用例通过之后，在README.md里增加使用文档
* 修改package.json中的版本号
* 在CHANGELOG.md中增加版本日志
* 提交代码，发起合并申请
* 合并通过之后，在本地发布

# Example Usage
```javascript
    import Vue from 'vue';
    import { BaseMixin, MessageBox } from '@hello/component-vue';
    Vue.mixin(BaseMixin);
    Vue.use(MessageBox);
```

# BaseMixin
提供组件中常用的方法的封装
## BaseMixin方法列表
方法名 | 说明 | 参数 | 返回值 | 备注  
-|-|-|-|-
showComponent | 以对话框的方式打开组件 |(component, options)[参数说明](#showcomponent) | -- | --
closeDialog | 关闭通过showComponent方法打开的对话框 | -- | -- | -- 
showConfirm | 打开确认框 | [参数说明](#showconfirm) | Promise | --
showWarningConfirm | 打开警告确认框 | 详见showConfirm[参数说明](#showconfirm) | -- | --
showErrorConfirm | 打开错误确认框 | 详见showConfirm[参数说明](#showconfirm) | -- | -- 
showMsg | 显示Toast消息 | [参数说明](#showmsg) | -- | --
showInfoMsg | 显示普通toast消息 | (message) | -- | --
showSuccessMsg | 成功Toast消息 | (message) | -- | --
showWarningMsg | 警告Toast消息  | (message) | -- | --
showErrorMsg | 错误Toast消息 | (message) | -- | --
showAlert | 弹出Alert框 | [参数说明](#showalert) | -- | --
showLoading | 显示loading | (message或者option) | -- | --
hideLoading | 隐藏loading | -- | -- | --

### 参数说明
<div id="showcomponent"></div>

#### showComponent参数说明

参数名称 | 参数类型 | 可选值 | 默认值
-|-|-|-
component| VueCompnent | -- | --
options | Object | -- | {}

#### showComponent options列表

选项名称 | 选项类型 | 可选值 | 默认值
-|-|-|-
width | string | -- | 'auto'
title | string | -- | ''
customClass | string | -- | ''
params | Object | -- | {}
showTitle | Boolean | true/false | true
showClose | Boolean | true/false | true
showFooter | Boolean | true/false | false
cancelText | string | -- | '取消'
confirmText | string | -- | '确认'
closeOnClickModal | Boolean | true/false | false
closeOnPressEscape | Boolean | true/false | false
cancelHandle | Function | -- | --
confirmHandle | Function | -- | --

#### usage

```javascript
    // 以固定宽度的方式打开
    this.showComponent(Login, {
        width: '500px',
        params: {
            username: 'jack-cheng',
            password: 123456
        }
    });
    
    // 以带标题的方式打开
    this.showComponent(Login, {
        width: '500px',
        title: '用户登录',
        params: {
            username: 'jack park',
            password: 123456
        }
    });
```

##### 特殊说明
在showFooter选项为true的情况下，如果我们传递了confirmHandle选项，那么“确定”按钮的控制权将交由confirmHandle函数实现，否则，我们会在点击“确定”按钮的时候默认执行component里面的handleSubmit函数。

<div id="showconfirm"></div>

#### showConfirm参数说明

参数名称 | 参数类型 | 可选值
-|-|-
type | string | warning, error
content | string | --
title | string | --
confirmButtonText | string | --
cancelButtonText | string | --
confirmHandle | function | --
cancelHandle | function | --

#### usage

```javascript
    // 基础使用方法
    this.showConfirm('warning', '打开确认框');
    // 自定义标题
    this.showConfirm('warning', '这是正文', '这是标题');
    // 自定义事件方法(此处省略标题)
    this.showConfirm('warning', '这是正文', () => alert('点击确认'), () => alert('点击取消'));
    // 以对象的方式调用(仅此方式调用可以自定义按钮文案)
    this.showConfirm('warning', {
        content: '这是正文',
        title: '这是标题',
        confirmButtonText: '是',
        cancelButtonText: '否',
        confirmHandle: () => alert('点击确认'),
        cancelHandle: () => alert('点击取消')
    });
    // 快捷方式调用（除了可以省略type字段外，其他字段相同）
    this.showWarningConfirm('打开确认框');
    this.showErrorConfirm('warning', '这是正文', '这是标题');
```
<div id="showmsg"></div>

#### showMsg参数说明

参数名称 | 参数类型 | 可选值
-|-|-
type | string | info, error, success, warning
message | string | --

#### useage

```javascript
    // 普通调用方式
    this.showMsg('info', '这是一个普通的消息');
    // 快捷方式
    this.showInfoMsg('这是一个普通的消息');
    this.showWarningMsg('这是一个警告消息');
    this.showErrorMsg('这是一个错误的消息');
    this.showSuccessMsg('这是一个成功的消息');
```

<div id="showalert"></div>

#### showAlert参数说明

参数名称 | 参数类型 | 可选值
-|-|-
content | string | --
title | string | --
callback | function | --
countdown | Number | --

#### usage

```javascript
    // 简单用法
    this.showAlert('简单弹窗消息');

    // 自定义标题
    this.showAlert('弹窗消息正文', '标题');

    // 自定义确定按钮事件
    this.showAlert('弹窗消息正文', '标题', () => alert('确定按钮'))

    // 以对象方式调用（仅此方法可以修改按钮文案以及定义按钮倒计时功能）
    this.showAlert({
        title: '这是标题',
        content: '这里是标题正文',
        callback: (...params) => console.log(params),
        confirmButtonText: '知道了',
        countdown: 5
    })
```

#### 特别说明
在原版本的element-ui中，MessageBox不支持倒计时功能。所以，为了支持该功能，我们重写了MessageBox组件。如果在项目中有需求需要用到的话，请特别声明使用我们提供的MessageBox，如下：
``` javascript
    import Vue from 'vue';
    import { MessageBox } from '@hello/component-vue';
    Vue.use(MessageBox);
```
# SearchBar组件
## 用途
用于生成列表页上面的搜索框并自动拼装搜索参数。
## useage(使用options)
``` javascript
    <template>
        <searchbar 
            :option="searchOption"
            @search="search"
        />
    </template>
    <script>
        export default {
            data() {
                return {
                    searchOption: [
                        {
                            type: 'input',
                            label: '车架号',
                            field: 'vin'
                        }
                    ]
                }
            },
            methods: {
                search(params) {
                    console.log(params); // {vin: 123456}
                }
            }
        }
    </script>
```
## useage(使用url)
``` javascript
    <template>
        <searchbar 
            :url="url"
        />
    </template>
    <script>
        export default {
            data() {
                return {
                    url: 'http://www.hello.com/example/'
                }
            }
        }
    </script>
```


### searchbar 参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
options | Array | 需要显示的搜索框列表, 和url参数互斥 | -- | []
expand | Boolean | 是否默认展开搜索项列表 | true, false | false
url | String | 获取搜索框列表的链接，和options参数互斥，如果同时存在，优先使用url | -- | --
setInitParams | Function | 用于设置搜索框默认值，接受done方法作为参数 | -- | --
columns | Number | 用于设置搜索框列表展示的列数，如果不设置，则根据浏览器宽度自动设置 | -- | 0
shouldDateFormat | Boolean | 用于指定是否在进行搜索的时候需要格式化日期 | true, false | true
labelInset | Boolean | 用于指定是否将搜索框的label字段显示在组件内部 | true, false | false
gutter | Number | 用于指定搜索框之间的间距 | -- | 20
lineHeight | Number | 用于指定每行搜索框的行高 | -- | 50
buttonNewLine | Boolean | 设置充值和查询按钮是否单独占一行 | true, false |  false
buttonAlign | String | 指定button的水平对其方式, 仅在buttonNewLine为false的情况下生效 | left, right | right 
buttonSize | String | 指定button的大小 | 详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档中的size属性可选值 | -- 
buttons | Array | 指定searchbar中的按钮列表 | ['reset', 'search'] | ['reset', 'search']
search | Event | 点击搜索按钮的事件回调，回调参数为搜索的参数 | -- | --
reset | Event | 重置事件回调 | -- | --
getFormInstance | Event | 获取表单实例 | -- | --
formAttrs | Object | el-form组件属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formEvents | Object | el-form组件事件，详见 [Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formItemAttrs | Object | el-form-item组件属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formItemEvents | Object | el-form-item组件事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --

### searchbar options参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
type | string | 搜索框类型  |[search, input, select, date_range, daterange, numberrange, component] | --
label | string | 搜索框显示的名称 | -- | --
field | string | 搜索框对应的字段名字 |-- | --
span | Number | 搜索框在栅栏布局中所占长度 | --
spanTimes | Number | 搜索框在栅栏格式中所占个数 | -- | 1
default | Object | 字段默认值 | -- | --
url | String | 当type=search的时候生效， 指定搜索接口的url |  -- | --
searchKey | String | 在type为search的时候， 搜索接口对应的搜索字段 | -- | -- 
labelField | String | 当type为search select的时候，指定搜索接口中展示字段的字段名 | -- | label
valueField | String | 当type为search select的时候，指定搜索接口中值字段的字段名 | -- | value
colStyle | Object | 指定某一个搜索框的样式 | -- | --
startFieldName | String | 当type为daterange和date_range的时候，指定用于搜索接口的开始时间的字段名 | -- |  默认值`start${field}`
endFieldName | String | 当type为daterange和date_range的时候，指定用于搜索接口的结束时间的字段名 | -- | 默认值`end${field}` 
options | Array | 当type为search或select的时候，指定下拉框列表中的内容，形如[{label: 'xxx', value: 'xxx', attrs: {xxx: xxx}, events: {xxx: xxx}}], 其中attrs和events中支持el-options组件属性和事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | []
search | Function | 当type为search的时候的自定义搜索方法 | -- | --
attrs | Object | 对应控件的属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
events | Object | 对应控件的事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formItemAttrs | Object | el-form-item组件属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
validator | Function | 在type=input或者type=numberrange时生效,该方法使用输入校验，不会出现表单错误提示，不符合规则的数据将不能输入。当type=numberrange时，已内置数字校验 | -- | --

# Form组件
## 用途
封装el-form组件，通过对象的方式形成想要的表单
## useage
``` javascript
    <template>
        <Form 
            :formItems="formItems"
            :formData="formData"
            @createForm="form => this.form = form"
        />
    </template>
    <script>
        export default {
            data() {
                return {
                    formItems: {
                        vin: {
                            type: 'input',
                            label: '车架号',
                        }
                    },
                    formData: {}
                }
            }
        }
    </script>
```
## Form 参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
formItems | Object | 生成表单所需要的字段列表 | -- | {}
formData | Object | 表单值存储对象 | -- | {}
columns | Number | 表单字段一行展示的列数 | -- | 1
labelInset | Boolean | 是否将表单字段的label显示在表单控件内部 | true, false | false
gutter | Number | 设置表单字段之间的间隙 | -- | 20
lineHeight | Number | 设置表单行高 | -- | 50
createForm | Event | 创建表单的事件回调，回调参数为当前表单的实例 | -- | --
formAttrs | Object | el-form组件属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formEvents | Object | el-form组件事件，详见 [Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --

## Form新增自定义方法
方法名称 | 参数 | 方法说明 | 可选值 | 默认值
-|-|-|-|-
setFieldsValue | Object | 用于设置表单一个或多个字段的值 | -- | {}
getFieldsValue | 字段名列表 | 获取表单一个或多个字段的值 | -- | {}
getFieldValue | 字段名 | 获取表单指定字段的值 | -- | {}

## Form formItems参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
type | String | 字段显示的类型 | input,select,search,component,date,daterange,radio,textarea | --
label | String | 字段显示的名称 | -- | --
rules | Array | 当前字段的验证规则【类antd的验证规则】 | -- | --
options | Array | 当type为select或search的时候，设置下拉列表中的选项 | -- | [],
multiple | Boolean | 当type为Select或Search的时候，设置该字段是否为多选 | true, false | false
span | Number | 设置当前字段所占用的宽度 | -- | --
component | Object | 当type为component的时候生效，用于设置自定义的表单选项 | -- | --
display | Boolean | 设置当前字段是否可见 | -- | true
format | String | 当type为date或daterange的时候生效，设置当前字段的日期格式 | -- | YYYY-MM-DD HH:mm:ss
onChange | Function | 当前字段值发生变化的回调函数 | -- | --
search | Function | 当type为search的时候生效，为搜索事件的回调函数 | -- | --
formItemAttrs | Object | el-form-item组件属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
formItemEvents | Object | el-form-item组件事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
validator | Function | 在type=input或者type=textarea组件中生效，不同于rules中的validator,该方法使用输入校验，不会出现表单错误提示，不符合规则的数据将不能输入 | -- | --


# TextItem组件
## 用途
通过数据的方式，展示数据详情。多用于展示数据详情页面
## usage
``` javascript
    <template>
        <textItem
            :textData="textData"
        />
    </template>
    <script>
        export default {
            data() {
                textData: [
                    {
                        label: '用户名',
                        content: 'jack'
                    },
                    {
                        label: '备注',
                        content: 'abcdef',
                        span: 24
                    },
                    {
                        label: '今日计划',
                        type: 'component',
                        content: Plan,
                        params: {
                            date: new Date()
                        }
                        span: 24
                    }
                ]
            }
        }
    </script>
```
## TextItem 参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
textData | Array | 需要展示的数据列表 | -- | []
columns | Number | 设置一行展示多少列 | -- | 4
labelWidth | Number | 设置label的展示宽度 | -- | 85
gutter | Number | 设置字段之间的间距 | -- | 5
wrap | Boolean | 设置数据是否换行展示(优先级小于在textData中设置的wrap) | true, false | false

## TextItem textData参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
label | String|  字段名称 | -- | --
content | String, Component | 字段值 | -- | --
span | Number | 字段在一行中所占用的宽度 | -- | --
type | String | 字段值的类型 | -- | String
params | Object | 当type=Component的时候，该值将作为参数传给对应的组件 | -- | {}
wrap | Boolean | 设置某一项是否需要换行展示 | true,false | false

## PageFooter参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
description | String|  传入的公司描述 | -- | Copyright © 1999-${new Date().getFullYear()} 成都路行通信息技术有限公司版权所有
target | String | 链接打开方式 | _blank, _parent, _self, _top | _blank
record | String | 蜀ICP备号 | -- | 蜀ICP备08110633号-2
license | String | 增值电信业务经营许可证 | -- | 增值电信业务经营许可证
pageStyle | Object | 页面样式 | -- | --
hoveredColor | String | a标签未hover的颜色 | -- | #999
hoverColor | String | a标签hover的颜色 | -- | #4877F4

## TagEdit参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
cascaderAttrs|Object|传入的cascader属性,详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档|--|{props: {label: 'label', value: 'value', children: 'children',}}
url|String|大数据标签请求url|--|''
ruleUrl|String|查看校验结果请求url|--|''
customDialog|Boolean|自定义校验结果弹窗|true, false|false
ruleDialog|Object|抛出的后端校验结果，仅customDialog为true时生效|--|--
value|Array|编辑时回显的数据|--|[]
isDynamicValidate|Boolean|提交时需要前后端均校验，抛出校验结果，传递给后端的值|true, false|false
dynamicValidate|Function|前端、后端均校验的方法，仅isDynamicValidate为true时抛出校验结果，传递给后端的值|--|{}
staticValidate|Function|仅前端校验的方法，抛出校验结果,传递给后端的值|--|--
editTags|Array|回显的数据结构|--|--
canAddTag|Boolean|是否可以添加标签|true, false|true
canDeleteTag|Boolean|是否可以删除标签|true, false|true
## usage
``` javascript
    <template>
        <TagEdit 
            :url="url"
            :ruleUrl="ruleUrl"
            v-model="editTags"
            :cascaderAttrs="cascaderAttrs"
            :customDialog="true"
        />
    </template>
    <script>
        export default {
            data() {
                return {
                    url: '/api/saas/tags/rule-tree',
                    ruleUrl: '/api/saas/tags/rule-result',
                    editTags: [],
                    cascaderAttrs: {
                        props: {
                            label: 'name', 
                            value: 'id', 
                            children: 'child',
                        },
                    },
                }
            },
        }
    </script>
```
## Tree参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
showSearch|Boolean|是否显示搜索框、搜索按钮|true：显示，false:隐藏|true
searchInputAttrs|Object|input输入框的属性|详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档|{}
searchButtonAttrs|Object|button按钮的属性|详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档|{}
buttonText | String | 指定button的内容 | -- | 查询
treeHeight | Number | 树的默认高度 | -- | 656
pageSize | Number | 截取的数量 | -- | 50
distance | Number | 距离底部多远开始展示下一次的数据 | -- | 50
treeData | Array | 接口返回的数据(treeData和url选传1个) | -- | []
url | String | 搜索接口的url(treeData和url选传1个) | -- | ''
treeAttrs | Object | el-tree组件属性 | 详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | {}
treeEvents | Object | el-tree组件事件 | 详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | {}
isScrollX | Boolean | 是否横向滚动 | true, false | true
searchKey | String | 选择器搜索内容(设置searchs为[]) | -- | ''
closeExpand | Function | 抛出的事件，用于关闭树节点展示 | -- | --

## 用途
用于树形控件带搜索框和分页展示，可被选择状态下不能分页展示。
## useage(使用options)
``` javascript
    <template>
        <Tree
            :treeData="treeData"
            :pageSize="30"
            :treeAttrs="treeAttrs"
            :treeEvents="treeEvents"
            ref="kTree"
            :treeHeight="300"
            :showSearch="false"
            :key="isKey"
        >
            <template slot="search-left">
                <span> 请选择系统: </span>
                <el-select
                    class="search-select"
                    size="small"
                    v-model="byText"
                >
                    <el-option 
                        v-for="(item, index) in selectOptions"
                        :key="index"
                        :label="item.alias"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
                <el-button 
                    class="search-btn"
                    type="primary"
                    size="small" 
                    @click="treeSearch"
                > 
                    查询
                </el-button>
            </template>
        </Tree>
    </template>
    <script>
        export default {
            data() {
                return {
                    treeData: [],
                    treeAttrs: {
                        props: {
                            children: 'children',
                            label: 'title',
                        },
                        'default-expand-all': false,
                    },
                    treeEvents: {
                        'node-click': val => this.getNode(val),
                    },
                    isKey: 0,
                    byText: '',
                }
            },
            methods: {
                getNode(val) {
                },
                treeSearch() {
                    this.isKey++;
                    window.request(`/api/admin/menu/tree?systemId=${this.byText}`).then(data => {
                        this.treeData = this.getTreeData(data.tree);
                    });
                },
                getTreeData(data) {
                    // 处理接口返回的数据
                },
            },
        };
    </script>
```

## SelectTree参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
treeData | Array | 接口返回的数据(传参后需调用子组件的changeTree方法,更新视图渲染的数据源) | -- | []
url | String | 搜索接口的url(传参后需调用子组件的changeTree方法,更新视图渲染的数据源) | -- | ''
treeAttrs | Object | el-tree组件属性 | 详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | {}
selectTreeEvents | Object | el-tree组件事件(默认定义了el-tree的'node-click'事件，再传'node-click'事件会先执行默认定义，再执行外部传入的) | 详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | {}
treeHeight | Number | 树的默认高度 | -- | 656
pageSize | Number | 截取的数量 | -- | 50
distance | Number | 距离底部多远开始展示下一次的数据 | -- | 50
isScrollX | Boolean | 是否横向滚动 | true, false | true
getValue | [Object,String] | 抛出选中值的节点信息，清空时为空 | -- | --

# DateRange
## 用途
不同于element-ui自带的日期范围控件，该组件支持单独选择开始时间或者结束时间。
## useage
``` javascript
  <template>
     <DateRange :options="options" v-model="xxx" />
  </template>
```
## options属性参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值
-|-|-|-|-
attrs | Object | 对应控件的属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
startAttrs | Object | 开始日期控件对应的属性，如果attrs和startAttrs同时存在，则startAttrs将会覆盖attrs的同名属性 | -- | --
endAttrs | Object | 结束日期控件对应的属性，如果attrs和endAttrs同时存在，则endAttrs将会覆盖attrs的同名属性 | -- | --
events | Object | 对应控件的事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
startEvents | Object | 开始日期控件对应的事件，如果events和startEvents同时存在，则startEvents将会覆盖events的同名事件 | -- | --
endEvents | Object | 结束日期控件对应的事件，如果events和endEvents同时存在，则endEvents将会覆盖events的同名事件 | -- | --
value | Array | 组件对应的值，数组，value[0]为开始时间，value[1]为结束时间 | -- | --

# SvgIcon组件
## 用途
用于展示svg图标，可以自定义样式
## useage
``` javascript
<template>
    <svg-icon
        :icon-name="icon"
    />
</template>
```
## options属性参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值  
-|-|-|-|-
iconName | String | 图标名称 | -- | search
className | String | 用于重写样式的class | -- | --

# EmptyPage组件
## 用途
用于展示无数据的页面，有数据的时候隐藏默认页，可以增加默认插槽和text插槽 
默认插槽的加在组件最后，text插槽加在text文本内容之后

## useage
``` javascript
    <template>
        <EmptyPage
            :text="text"
            :icon="icon"
            :flexDirection="flexDirection"
        >
          <template v-slot:text>
              <el-button>text</el-button>
          </template>
          <template>
              <el-button>default</el-button>
          </template>  
        </EmptyPage>
    </template>
    <script>
    import EmptyPage from '../components/EmptyPage';
    export default {
        components: {
            EmptyPage,
        },
        data() {
            return {
                text: '快来领取任务吧',
                icon: 'search',
                flexDirection: 'column'
            };
        },
        methods: {
        },
    };
    </script>
```
## options属性参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值  
-|-|-|-|-  
text | String | 默认显示的提示文字 | -- | 暂无数据
icon | String | 需要显示的svg图标的名称 | -- | search
flexDirection | String | 控制组件子元素布局方式，同css中的flexDirection | row,row-reverse,column,column-reverse | column

# Cascader可异步搜索组件

## 用途
可支持从服务器异步加载数据到cascader组件中，避免一次性加载大量数据造成页面卡顿，同时支持下拉异步分页加载数据。

## useage
``` javascript
    <template>
        <KCascader
            :attrs="customAttrs"
            :events="customEvents"
            :level="3"
            :labelInValue="labelInValue"
            :queryObj="queryObj"
            v-model="currentValue"
            ref="kcascader"
        />
    </template>
```

## 参数说明
参数名称 | 参数类型 | 参数说明 | 可选值 | 默认值  
-|-|-|-|-
attrs | Object | 对应控件的属性，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
events | Object | 对应控件的事件，详见[Element UI](https://element.eleme.cn/#/zh-CN/component/installation)文档 | -- | --
level | Number | 数据层级 | -- | 3
labelInValue | boolean | 在返回值的时候是否需要包含对应的label | -- | false
queryObj | object | 请求每一层数据的请求对象 | -- | -- 
pageSize | Number | 每一次请求的数量 | -- | 10 
isServerPage | boolean | 是否为服务器分页 | -- | false

### queryObj参数说明
形如：
```javascript
    [{
        url: 'https://resource.hello.com/area',
        params: () => ({ level: 'province' }),
    },
    {
        url: 'https://resource.hello.com/area',
        params: node => ({ level: 'city', province_code: node.data.id }),
    },
    {
        url: 'https://resource.hello.com/area',
        params: node => ({ level: 'county', city_code: node.data.id }),
    }]
```
其中，url为每层请求的url, params为一个函数，参数为上一层选中的node。

## 已有组件
组件库中已经根据Cascader组件封装了VehicleBrandAndSerial和Region组件，各位同学可以直接使用即可。
``` javascript
    // VehicleBrandAndSerial
    <Vehicle v-model="vehicle" />
```

``` javascript
    // Region
    <Region v-model="region" :labelInValue="true" />
```

