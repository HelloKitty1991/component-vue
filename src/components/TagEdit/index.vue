<template>
    <div class="tag-edit">
        <div
            class="tag-top-container"
            v-if="canAddTag"
        >
            <div class="tag-top-wrapper">
                <TagItemInput
                    v-model="tagItem"
                    :cascaderAttrs="cascaderAttrs"
                    :cascaderOptions="cascaderOptions"
                />
                <div
                    class="logical-sign"
                >
                    <span
                        @click="addSign($event, obj)"
                        v-for="(obj, index) in logicalArr"
                        :key="index"
                        :class="{'logical-sign__disabled': !obj.enabledStatus}"
                    >{{ obj.text }}</span>
                </div>
            </div>
            <el-button
                round
                type="primary"
                :size="size"
                style="height: 32px; margin-left: 20px"
                @click="addTagItem"
                :disabled="isAddDisabled || addDisabled"
            >
                添加到下方
            </el-button>
        </div>
        <div
            class="hr"
            v-if="canAddTag"
        ></div>
        <TagItemInput
            v-for="(obj, index) in tagItemsWithNoLogicalSign"
            :key="index"
            v-model="tagItemsWithNoLogicalSign[index]"
            style="margin-bottom: 10px"
            :cascaderAttrs="cascaderAttrs"
            :cascaderOptions="cascaderOptions"
            :returnBrands="returnBrands"
        />
        <div class="result-panel">
            <div class="item-container">
                <div
                    class="result-item"
                    v-for="(item, index) in tagItems"
                    :key="index"
                >
                    <div
                        v-if="Array.isArray(item)"
                        class="result-tag-item"
                    >
                        <span>{{ item[3].name }}</span>
                        <span class="compare">&emsp;{{ item[1].label }}&emsp;</span>
                        <span>{{ getThirdValue(item) }}</span>
                        <span v-if="item[3].unit">{{ item[3].unit }}</span>
                    </div>
                    <span
                        v-else
                        class="result-logical-sign"
                    >{{ item }}</span>
                    <img
                        src="./images/delete.svg"
                        class="delete"
                        v-if="canDeleteTag && index === tagItems.length - 1"
                        @click="deleteTagItem(index)"
                    />
                </div>
            </div>
            <el-button
                class="validate-btn"
                round
                :size="size"
                @click="dynamicValidate"
                :disabled="expDisabled"
                :loading="loading"
            >
                查看校验结果
            </el-button>
        </div>
        <span class="err-msg">{{ errMsg }}</span>
    </div>
</template>

<script>
import dayjs from 'dayjs';
import get from 'lodash/get';
import TagItemInput from './components/TagItemInput';

export default {
    components: {
        TagItemInput,
    },
    props: {
        cascaderAttrs: {
            type: Object,
            default: () => ({
                props: {
                    label: 'label',
                    value: 'value',
                    children: 'children',
                },
            }),
        },
        url: {
            type: String,
            default: '',
        },
        ruleUrl: {
            type: String,
            default: '',
        },
        // 自定义弹窗
        customDialog: {
            type: Boolean,
            default: false,
        },
        // 提交时需要前后端均校验，抛出校验结果，传递给后端的值
        isDynamicValidate: {
            type: Boolean,
            default: false,
        },
        value: {
            type: Array,
            default: () => [],
        },
        // 是否可以添加标签
        canAddTag: {
            type: Boolean,
            default: true,
        },
        // 是否可以删除标签
        canDeleteTag: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            loading: false,
            isAddDisabled: true,
            expDisabled: true,
            size: 'small',
            tagItems: [],
            tagItem: [],
            defaultLogicalArr: [
                {
                    text: '(',
                    enabledStatus: true,
                }, {
                    text: ')',
                    enabledStatus: true,
                }, {
                    text: '和',
                    enabledStatus: true,
                }, {
                    text: '或者',
                    enabledStatus: true,
                },
            ],
            errMsg: '',
            operateList: {
                和: '&',
                或者: '|',
                '(': '(',
                ')': ')',
                非: '!',
            },
            cascaderOptions: [],
            signObj: {
                '=': '等于',
                '!=': '不等于',
                '>': '大于',
                '<': '小于',
                '>=': '大于等于',
                '<=': '小于等于',
            },
            resOperateList: {
                '&': '和',
                '|': '或者',
                '(': '(',
                ')': ')',
                '!': '非',
            },
            brandsStr: [],
            returnBrands: [],
        };
    },
    mounted() {
        if (this.url) {
            window.request(this.url, { method: 'GET' }).then((data) => {
                let res = data;
                if (typeof data.code !== 'undefined') {
                    // ({ data } = data);
                    res = data.data;
                }
                this.cascaderOptions = res;
                this.editValue();
            });
        }
    },
    computed: {
        tagItemsWithNoLogicalSign() {
            return this.tagItems.filter(v => Array.isArray(v));
        },
        logicalArr() {
            const logicalArr = JSON.parse(JSON.stringify(this.defaultLogicalArr));
            const lastItem = this.tagItems[this.tagItems.length - 1];
            let temp = [];
            if (this.tagItems.length >= 20) {
                temp = [0, 1, 2, 3];
            } else if (this.tagItems.length <= 0 || lastItem === '(' || lastItem === '和' || lastItem === '或者') {
                temp = [1, 2, 3];
            } else if (lastItem === ')') {
                if (this.leftBracketCount <= this.righBracketCount) {
                    temp = [0, 1];
                } else {
                    temp = [0];
                }
            } else if (Array.isArray(lastItem)) {
                if (this.tagItems.length === 1 || this.leftBracketCount <= this.righBracketCount) {
                    temp = [0, 1];
                } else {
                    temp = [0];
                }
            }
            temp.forEach((v) => {
                logicalArr[v].enabledStatus = false;
            });
            return logicalArr;
        },
        leftBracketCount() {
            return this.tagItems.filter(v => v === '(').length;
        },
        righBracketCount() {
            return this.tagItems.filter(v => v === ')').length;
        },
        addDisabled() {
            const lastItem = this.tagItems[this.tagItems.length - 1];
            return Array.isArray(lastItem) || lastItem === ')' || this.tagItems.length >= 20;
        },
        viewContent() {
            if (!this.tagItems || this.tagItems.length === 0) return null;
            const contentList = [];
            const contentObj = {};
            this.tagItems.forEach((item) => {
                if (Array.isArray(item)) {
                    contentObj.value = `${get(item, '[3].name')}${get(item, '[1].label')}${this.getThirdValue(item)}${get(item, '[3].unit')}`;
                    contentObj.type = 'text';
                } else {
                    contentObj.value = item;
                    contentObj.type = 'button';
                }
                contentList.push({ ...contentObj });
            });
            return contentList;
        },
    },
    methods: {
        addTagItem() {
            if (this.tagItems.length < 20) {
                this.tagItems.push(JSON.parse(JSON.stringify(this.tagItem)));
            }
            this.tagItem = [];
        },
        addSign(e, logicalSign) {
            if (e.target.className.indexOf('logical-sign__disabled') >= 0) return;
            this.tagItems.push(logicalSign.text);
        },
        deleteTagItem(index) {
            this.tagItems.splice(index, 1);
        },
        staticValidate() {
            return new Promise((resolve) => {
                const errMsg = '标签逻辑格式不正确。请检查后调整';
                const lastItem = this.tagItems[this.tagItems.length - 1];
                if (this.leftBracketCount !== this.righBracketCount) {
                    this.errMsg = errMsg;
                } else if (['(', '和', '或者'].includes(lastItem)) {
                    this.errMsg = errMsg;
                } else {
                    this.errMsg = '';
                }
                this.tagItems.forEach((item) => {
                    if (Array.isArray(item) && !get(item, '[1]')) {
                        this.errMsg = errMsg;
                        return;
                    }
                    if (Array.isArray(item) && !get(item, '[2]')) {
                        this.errMsg = errMsg;
                        return;
                    }
                    if (Array.isArray(get(item, '[2]')) && get(item, '[2]').length === 0) {
                        this.errMsg = errMsg;
                        return;
                    }
                    if (get(item, '[2]')) {
                        const widgetInfo = get(item, '[3].widgetInfo');
                        let labelInfo = {};
                        if (widgetInfo) {
                            try {
                                labelInfo = JSON.parse(widgetInfo);
                            } catch (error) {
                                labelInfo = {};
                            }
                        }
                        if (labelInfo && labelInfo.rules) {
                            for (let i = 0; i < labelInfo.rules.length; i++) {
                                if (labelInfo.rules[i] && (labelInfo.rules[i].type === 'number' || labelInfo.rules[i].type === 'int')) {
                                    if (get(item, '[2]') === '-') {
                                        this.errMsg = errMsg;
                                        return;
                                    }
                                }
                            }
                        }
                    }
                });
                if (this.errMsg) {
                    resolve({ isPass: false });
                    return;
                }
                const tagRule = this.handleTagRule();
                resolve({ isPass: true, tagRule, descContent: this.viewContent });
            });
        },
        dynamicValidate() {
            return new Promise((resolve, reject) => {
                let tagRules = [];
                this.staticValidate().then((res) => {
                    if (res.isPass) {
                        tagRules = res.tagRule;
                    }
                    try {
                        resolve(this.ruleResult(tagRules));
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        },
        getThirdValue(item) {
            const widgetInfo = get(item, '[3].widgetInfo');
            let labelInfo = {};
            if (widgetInfo) {
                try {
                    labelInfo = JSON.parse(widgetInfo);
                } catch (error) {
                    labelInfo = {};
                }
            }
            // const brandsType = get(labelInfo, 'attrs.props.label', 'label');
            const labelKey = get(labelInfo, 'attrs.props.label', 'label');
            let value = '';
            if (Array.isArray(item[2])) {
                value = item[2].map(v => this.getValueLabel(item, v, labelKey)).join(',');
            } else {
                value = this.getValueLabel(item, item[2], labelKey);
            }
            return value;
        },
        getValueLabel(item, value, labelKey) {
            if (!get(item, '[2]')) {
                return '';
            }
            let temp = '';
            let typeObj = null;
            if (typeof value === 'object') {
                temp = value[labelKey];
            } else {
                temp = value;
            }
            const newFormat = get(item, '[3].widgetInfo');
            if (newFormat) {
                try {
                    typeObj = JSON.parse(newFormat);
                } catch (error) {
                    typeObj = null;
                }
                if (typeObj.type === 'dateRange' || typeObj.type === 'date') {
                    let formatItem = '';
                    if (!typeObj.attrs || !typeObj.attrs.format) {
                        formatItem = 'YYYY-MM-DD HH:mm:ss';
                    } else {
                        formatItem = typeObj.attrs.format.replace(/y/g, 'Y').replace(/d/g, 'D');
                    }
                    temp = dayjs(value).format(formatItem);
                }
            }
            return temp;
        },
        ruleResult(tagRule) {
            return new Promise(async (resolve, reject) => {
                if (!this.ruleUrl || this.errMsg) return;
                try {
                    this.loading = true;
                    await window.request(this.ruleUrl, { params: tagRule, method: 'POST', headers: { 'Cancel-Message': true } }).then((data) => {
                        let res = data;
                        if (typeof data.code !== 'undefined') {
                            // ({ data } = data);
                            res = data.data;
                        }
                        if (this.isDynamicValidate) {
                            resolve({ isPass: true, result: { tagRule, res, descContent: this.viewContent } });
                            return;
                        }
                        if (this.customDialog) {
                            this.$emit('ruleDialog', { isPass: true, result: res });
                            return;
                        }
                        let message = '';
                        if (res === 0) {
                            message = `当前共有${res}个客户满足此标签，请确认规则是否合理`;
                        } else {
                            message = `当前共有${res}个客户满足此标签`;
                        }
                        this.showConfirm('warning', message, '校验结果');
                    })
                        .catch((err) => {
                            let error = err;
                            if (typeof err.code !== 'undefined') {
                                // ({ err } = err);
                                error = err.err;
                            }
                            if (this.isDynamicValidate) {
                                resolve({ isPass: false, result: { error } });
                                return;
                            }
                            if (this.customDialog) {
                                this.$emit('ruleDialog', { isPass: false, result: error });
                                return;
                            }
                            this.showConfirm('error', error.message, '校验结果');
                        });
                } catch (error) {
                    reject(error);
                } finally {
                    this.loading = false;
                }
            });
        },
        getFatherId(value, options, prop, children) {
            const arrRes = [];
            let nodeRes = {};
            const rev = (data, nodeId) => {
                for (let i = 0, { length } = data; i < length; i++) {
                    const node = data[i];
                    if (node[prop] === nodeId) {
                        nodeRes = node;
                        arrRes.unshift(node[prop]);
                        return true;
                    }
                    if (node[children] && node[children].length) {
                        if (rev(node[children], nodeId)) {
                            arrRes.unshift(node[prop]);
                            return true;
                        }
                    }
                }
                return false;
            };
            rev(options, value);
            return { arrRes, nodeRes };
        },
        handleTagRule() {
            const tagRule = [];
            this.tagItems.forEach((item) => {
                let tagObj = {};
                if (Array.isArray(item)) {
                    // 单位为年的，中台处理
                    tagObj = {
                        dimensionId: get(item, '[3].id'),
                        compare: get(item, '[1].value'),
                        condition: get(item, '[2]'),
                        operate: '',
                        dataType: 'data',
                        unit: get(item, '[3].unit'),
                    };
                    const widgetInfo = get(item, '[3].widgetInfo');
                    let labelInfo = {};
                    if (widgetInfo) {
                        try {
                            labelInfo = JSON.parse(widgetInfo);
                        } catch (error) {
                            labelInfo = {};
                        }
                    }
                    if (labelInfo.type === 'dateRange') {
                        // 后端处理，只传月日到中台
                        if (labelInfo.attrs && labelInfo.attrs.noyear) {
                            tagObj.compareType = 'between';
                        } else {
                            // 后端不处理，传年月日到中台
                            tagObj.compareType = 'between_all';
                        }
                    } else if (labelInfo.type === 'area') {
                        // 省市区，后端处理只取最后一个值
                        tagObj.compareType = 'end';
                    } else if (labelInfo.type === 'select' && labelInfo.attrs && labelInfo.attrs.multiple) {
                        // 多选
                        tagObj.compareType = 'in';
                    } else if (labelInfo.type === 'brands') {
                        // 品牌
                        tagObj.compareType = 'brands';
                    } else {
                        tagObj.compareType = get(item, '[1].value');
                    }
                    /* let widgetInfo = get(item, '[3].widgetInfo');
                        let labelInfo = {};
                        if (widgetInfo) {
                            try {
                                labelInfo = JSON.parse(widgetInfo);
                            } catch (error) {
                                labelInfo = {};
                            }
                        }
                        let value = '';
                        if (labelInfo.type === 'dateRange' || labelInfo.type === 'date') {
                            const labelKey = get(labelInfo, 'attrs.props.label', 'label');
                            if (Array.isArray(item[2])) {
                                value = item[2].map(v => this.getValueLabel(item, v, labelKey)).join(',');
                            } else {
                                value = this.getValueLabel(item, item[2], labelKey);
                            }
                        }
                        if (Array.isArray(get(item, '[2]')) && get(item, '[2]').length > 0) {
                            if (labelInfo.type === 'brands') {
                                tagObj.compare = get(item, '[1].value');
                                tagObj.condition = '';
                                if (get(item, '[2]')) {
                                    let brandsId = [];
                                    get(item, '[2]').forEach(item => {
                                        brandsId.push(item.id);
                                    })
                                    tagObj.condition = brandsId.join();
                                }
                                if (get(item, '[2]').length > 1) {
                                    tagObj.compare = 'in';
                                }
                            } else if (labelInfo.type === 'dateRange') {
                                tagObj.compare = 'between';
                                tagObj.condition = value;
                            } else if (labelInfo.type === 'select') {
                                if (Array.isArray(get(item, '[2]'))) {
                                    if (get(item, '[2]').length > 1) {
                                        tagObj.compare = 'in';
                                    } else {
                                        tagObj.compare = get(item, '[1].value');
                                    }
                                    let selectValue = [];
                                    get(item, '[2]').forEach(v => {
                                        selectValue.push(v.value);
                                    });
                                    tagObj.condition = selectValue.join();
                                } else {
                                    tagObj.compare = get(item, '[1].value');
                                    tagObj.condition = get(item, '[2].value');
                                }
                            } else if (labelInfo.type === 'area') {
                                tagObj.compare = get(item, '[1].value');
                                tagObj.condition = get(item, '[2][2].id');
                            } else {
                                tagObj.compare = get(item, '[1].value');
                                tagObj.condition = get(item, '[2]');
                            }
                        } else if(labelInfo.type === 'date') {
                            tagObj.compare = get(item, '[1].value');
                            tagObj.condition = value;
                        } else if (labelInfo.type === 'select' && !labelInfo.attrs.multiple) {
                            tagObj.compare = get(item, '[1].value');
                            tagObj.condition = get(item, '[2].value');
                        } else {
                            tagObj.compare = get(item, '[1].value');
                            tagObj.condition = get(item, '[2]');
                        } */
                } else {
                    tagObj = {
                        dimensionId: '',
                        compare: '',
                        condition: '',
                        operate: this.operateList[item],
                        dataType: 'operate',
                        unit: '',
                    };
                }
                tagRule.push(tagObj);
            });
            return tagRule;
        },
        editValue() {
            this.errMsg = '';
            if (!this.value || this.value.length === 0) {
                this.tagItems = [];
                return;
            }
            if (!this.cascaderOptions || this.cascaderOptions.length === 0) {
                this.tagItems = [];
                return;
            }
            this.tagItems = [];
            let showItem = null;
            this.value.forEach((v) => {
                if (v.dataType === 'operate') {
                    showItem = this.resOperateList[v.operate];
                } else if (v.dataType === 'data') {
                    showItem = [];
                    const resItem = this.getFatherId(v.dimensionId, this.cascaderOptions, get(this.cascaderAttrs, 'props.value', 'value'), get(this.cascaderAttrs, 'props.children', 'children'));
                    const compare = {
                        value: v.compare,
                        label: this.signObj[v.compare],
                    };
                    showItem.push(resItem.arrRes, compare, v.condition, resItem.nodeRes, v.tagRuleDisabled);
                }
                this.tagItems.push(showItem);
            });
        },
    },
    watch: {
        tagItem(val) {
            this.isAddDisabled = true;
            if (val && val[0] && val[1] && val[2]) {
                this.isAddDisabled = false;
            }
        },
        tagItems(val) {
            if (!val || val.length === 0) {
                this.expDisabled = true;
                return;
            }
            this.expDisabled = false;
        },
        value() {
            this.editValue();
        },
    },
};
</script>

<style lang="scss">
    .tag-edit {
        .tag-top-container {
            display: flex;
            .tag-top-wrapper {
                flex: 1;
                display: flex;
                flex-direction: column;
                .logical-sign {
                    flex: 1;
                    margin-top: 10px;
                    display: flex;
                    justify-content: space-between;
                    span {
                        width: 20%;
                        background-color: rgba(232, 239, 255, 1);
                        height: 32px;
                        text-align: center;
                        line-height: 32px;
                        border-radius: 4px;
                        color: rgba(72, 119, 244, 1);
                        cursor: pointer;
                    }
                    .logical-sign__disabled {
                        background-color: #ddd;
                        color: gray;
                        cursor:not-allowed;
                    }
                }
            }
        }
        .hr {
            width: 100%;
            border-top: 1px solid rgba(238, 238, 238, 1);
            height: 0px;
            margin: 15px 0;
        }
        .result-panel {
            border: 1px solid rgba(208, 208, 208, 1);
            text-align: right;
            border-radius: 4px;
            .item-container {
                display: flex;
                border-radius: 4px;
                padding: 20px;
                flex-wrap: wrap;
                min-height: 73px;
                box-sizing: border-box;
                .result-item {
                    box-sizing: border-box;
                    border-radius: 4px;
                    background-color: rgba(245, 245, 245, 1);
                    color: rgba(51, 51, 51, 1);
                    font-size: 14px;
                    min-height: 33px;
                    text-align: left;
                    line-height: 33px;
                    padding: 0 10px;
                    margin-bottom: 10px;
                    margin-right: 6px;
                    position: relative;
                    .delete {
                        position: absolute;
                        right: -8px;
                        top: -8px;
                        display: none;
                        cursor: pointer;
                    }

                    &:hover .delete {
                        display: block;
                    }

                    .result-logical-sign {
                        color: rgba(72, 119, 244, 1);
                    }
                }
            }
            .validate-btn {
                margin: 0 10px 10px 0;
            }

        }
        .err-msg {
            color: rgba(243, 46, 46, 1);
            font-size: 14px;
        }
    }

</style>
