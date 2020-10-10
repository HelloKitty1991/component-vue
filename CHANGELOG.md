## V1.0.1
* this.showComponent(component, options)方法中，添加confirmHandle和handleSubmit方法的异步支持。

## V1.0.2

* this.showComponent(component, options)方法中，添加onUpdate回调选项。
* 为了兼容Linux平台，修改Index.vue文件名为index.vue

## V1.0.3
* 控制onUpdate的调用顺序，保证能在handleSubmit方法中能够在用户需要的位置手动通过事件触发的方式调用：this.$emit('onUpdate');

## V1.0.4
* 修改core-js的版本到2.x，以便兼容工具包

## V1.0.5
* 修改Dialog/Index.vue文件名为Dialog/index.vue

## V1.1.0
* 新增SearchBar组件和Form表单组件

## V1.2.0
* 新增TextItem组件

## V1.2.1
* 在Form表单和searchBar组件中新增labelAlign属性

## V1.2.2
* 修改Searchbar组件中非真值不能传递的bug
* 修改TextItem组件中root节点100%展开，去掉lineHeight属性。
* 新增TextItem组件中margin属性，用于设置行之间的上下间距。
* 新增TextItem组件中wrap和textData中的wrap属性，用于控制显示的文本是否需要换行。

## V1.2.3
* Searchbar组件中新增回车响应事件
* 修改TextItem组件中，对于纯数字的换行设置，新增换行的word-break:break-all属性。

## V1.2.4
* 修改Seachbar组件中numberrange的组件的样式。
* 修改Searchbar组件bug。
* 修改searchbar组件中重置按钮对自定义组件的影响。

## V1.2.5
* 新增Form组件中label-position属性支持。

## V1.2.6
* 表单日期逐渐新增editable属性。
* searchBar组件暴露resetForm方法。
* searchBar组件中新增options属性和url属性的监听。
* 修改searchBar和Form组件bug

## V1.3.0
* 修复以下bug
1. 没有清空按钮
2. 没有限制前后空格
3. 最大输入长度没有限制
4. 重置后有默认值的被清除了
* 新增Form表单中checkbox类型和text类型的支持

## V2.0.0
* 添加SearchBar和Form组件中的formAttrs属性和FormItemAttrs属性，以支持el-form和el-form-item组件相关属性。
* 添加SearchBar和Form组件中的formEvents属性和FormItemEvents属性，以支持el-form和el-form-item组件相关事件。
* 添加SearchBar组件中option属性中的attrs选项，以支持对应组件中的相关属性。
* 添加SearchBar组件中option属性中的events选项，以支持对应组件中的相关事件。

## V2.0.1
* 修复在labelInset模式下，清空按钮被隐藏的bug
* 修复在labelInset模式下，多选框按钮不能点击的bug

## V2.0.2
* 修复在labelInset模式下，daterange样式不能对其的bug

## V2.1.0
* 新增PageFooter组件

## V2.1.1
* 新增searchBar中的numberrange组件的validator方法。
* 新增Form表单中input数据框的自定义校验规则。
* 新增Form表单中select组件中option的属性支持。
* 修改清空时间范围控件搜索报错的bug
* 修复numberrange组件在labelInset模式下的样式问题。
* 修复daterange组件在labelInset模式下的样式问题。

## V2.1.2
* 新增SearchBar组件的buttons属性，用于指定按钮列表
* 新增SearchBar组件中的buttonSize属性，用于指定按钮的大小
* 新增SearchBar组件中的buttonAlign属性，用于指定按钮的水平对其方式

## V2.1.3
* 新增SearchBar组件的reset事件，在表单重置的时候触发
* 修复searchBar组件中联动bug
* 新增SearchBar组件中的Numberrange组件的清空功能

## V2.1.4
* 修复Searchbar组件在收起状态下无法清除已经被收起的字段的值。
* 修复Numberrange中addonAfter属性的样式问题。
* 新增SearchBar组件中的getFormInstance事件， 用于获取表单实例。

## V2.1.5
* SearchBar组件中当type=search的时候，新增search回调方法，用于支持自定义搜索。
* Numberrange组件的clear图标样式重合问题

## V2.1.6
* SearchBar组件中伸缩bug。

## V2.1.7
* SearchBar组件中date_range组件的样式修改。

## V2.1.8
* SearchBar组件中api-search中兼容后端data为数组的情况。

## V2.1.9
* SearchBar组件中Numberrange中手动删除后查询参数仍然存在的问题
* 修改Numberrange组件中删除按钮和输入内容重复的样式问题

## V2.1.10
* 新增Form表单中在form表单实例上面新增setFieldsValue方法

## V2.1.11
* 修改Searchbar组件中daterange类型和date_range类型中placeholder属性

## V2.1.12
* 修复Numberrange组件中清空按钮没有垂直居中的bug

## V2.1.13
* 新增daterange和date_range控件的默认placeholder

## V2.1.14
* 修复searchBar组件中type为search的时候，修改options后显示id的问题。

## V2.2.0
* 修改组件库中发布版本代码的打包方式

## V2.3.0
* 新增表单组件的自定义方法
* 修改searchbar组件中默认值的赋值方式 


## V2.3.1
* 修改searchBar的行高为默认值45

## V2.3.2
* 表单获取值的时候不传参数不能获取到任何值

## V2.4.0
* 新增TagEdit组件

## V2.4.1
* TagEdit组件添加vehicleType

## V2.4.2
* 修改PageFooter组件的间距

## V2.4.3
* TagEdit组件添加品牌

## V2.4.4
* TagEdit组件接口请求添加请求方式

## V2.4.5
* TagEdit组件中品牌修改为远程搜索

## V2.4.6
* TagEdit组件中修改事件抛出

## V2.4.7
* TagEdit组件中添加前端校验抛出事件

## V2.4.8
* TagEdit组件中添加抛出查看的标签规则事件

## V2.4.10
* TagEdit组件中省市区、品牌接口修改为线上环境

## V2.4.11
* TagEdit组件中修改抛出的信息

## V2.4.12
* TagEdit组件中修改品牌传值

## V2.4.13
* TagEdit组件中修改回显

## V2.4.14
* TagEdit组件中修改回显bug

## V2.4.15
* TagEdit组件中修改多选换行的样式

## V2.4.16
* TagEdit组件中修改样式

## V2.4.17
* TagItemInput修改级联只显示最后一级
* TagItemInput修改品牌下拉只展示本次后端返回的数据
* TagEdit组件中前端校验添加运算符
* TagEdit组件中数字输入框添加type为int

## V2.4.18
* TagItemInput中校验或提交时传给后端的值添加单位

## V2.4.19
* TagItemInput中查看校验加loading

## V2.5.0
* 新增Tree组件
* 新增SelectTree组件

## V2.5.1
* 修改SelectTree组件样式引起的其他select的样式问题

## V2.5.2
* TagEdit组件修改为是否可以添加标签
* TagEdit组件修改为是否可以删除标签
* TagEdit组件标签选项添加禁用

## v2.5.3
* searchbar组件新增expand属性控制搜索组件初始化的展开状态。
* 将DateRange组件从searchbar组件中抽离，以便在其他地方可以使用。
* 修改searchbar组件的排列方式为多行展示方式，去掉height的自动计算。
* 修复searchbar组件在苹果设备下样式错乱的问题。
* 修复daterange组件和numberrange组件在苹果设备下样式错乱的问题。
* 新增searchbar组件的测试用例。
* 新增form组件的测试用例。
* 新增textItem组件的测试用例。

## v2.5.4
* searchbar组件中，type为daterange和date_range的时候，默认格式为`start${field}`和`end${field}` 

## v2.5.5
* 修改DateRange组件在非Searchbar组件中的显示错乱的问题。
* 修复searchbar组件中dayjs格式化日期错误的bug 

## v2.5.6
* 修复searchbar组件中由于使用JSON.parse(JSON.stringify(xxx))的方式深拷贝导致外部自定义组件报错的问题。

## v2.5.7
* 修复searchbar组件中时间范围组件中没有选择某一个日期而被默认为今天的bug。

## V2.5.8
* 更改searchbar和form组件中行数的计算方式，以修复某些情况下行数计算错误导致页面错乱的问题。
* 更改DateRange组件的样式问题。
* 更改Searchbar组件的展开和伸缩按钮样式

## V2.5.9
* 修复searchbar组件在收起状态下的buttonSpan的值

## V2.5.10
* 修复searchbar组件中字段被收起后无法重置的bug
* 修复form表单中下拉框选择后不能自动失焦的，导致按回车键后会重新打开下拉框的bug
* 修复searchbar组件中下拉框组件在收起后重新展开变成了id的bug

## V2.5.11
* 修复searchbar组件中焦点定位的问题。


## V2.5.12
* 修复searchbar组件在select情况下不能自定义labelField 和 valueField。
* 修复searchbar组件的select选择label insert时lable与placeholder重叠。

## V2.5.13
* TagEdit组件标签添加购车时长（车龄）--input支持输入小数点后1位和0的情况

## V2.5.14
* TagEdit组件标签中品牌修改为修改结果为空时，不保留上一次搜索结果的值。

## V2.5.15
* 新增缺省页组件
* 新增SvgIcon组件
* 修复test bug
* 修复安装node-sass模块报错的问题 
* 增加新增组件的目录规范和步骤
* 修复其他组件的目录结构

## V2.6.0
* 新增cascader异步加载组件
* 新增基于cascader的Region省市区联动组件
* 新增基于cascader的VehicleBrandAndSerial车型车系组件
