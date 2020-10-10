<template>
    <div
        class="search_bar"
        :style="{maxHeight: height}"
    >
        <Form
            :columns="columns || (24 / span)"
            :formItems="formItems"
            :formData="formData"
            :labelInset="labelInset"
            :gutter="gutter"
            @keyup.native="handleKeyUp"
            @createForm="createForm"
            :lineHeight="lineHeight"
            :formAttrs="formAttrs"
            :formItemAttrs="formItemAttrs"
            :formEvents="formEvents"
            :formItemEvents="formItemEvents"
        />
        <i
            :class="`toggle ${currentExpand ? 'fold' : 'expand'}`" 
            @click="toggleExpand"
            v-if="showToggleBtn"
        >
            <i
                class="el-icon-arrow-down"
                style="font-weight: bolder"
                v-if="!currentExpand"
            ></i>
            <i
                class="el-icon-arrow-up"
                style="font-weight: bolder"
                v-if="currentExpand"
            ></i>
        </i>
    </div>
</template>
<script>
    import dayjs from 'dayjs';
    import cloneDeep from 'lodash/cloneDeep';
    import Form from '../../Form';
    import CustomDateRange from '../../DateRange';
    import FormButtonGroup from './components/FormButtonGroup';
    import NumberRange from './components/NumberRange.vue';

    export default {
        name: 'SearchBar',
        components: {
            Form,
        },
        props: {
            url: {
                type: String,
                default: '',
            },
            labelWidth: {
                type: Number,
                default: 72,
            },
            setInitParams: {
                type: Function,
                default: undefined,
            },
            columns: {
                type: Number,
                default: 0,
            },
            options: {
                type: Array,
                default: () => [],
            },
            shouldDateFormat: {
                type: Boolean,
                default: true,
            },
            labelInset: {
                type: Boolean,
                default: false,
            },
            gutter: {
                type: Number,
                default: 20,
            },
            lineHeight: {
                type: Number,
                default: 45,
            },
            buttonNewLine: {
                type: Boolean,
                default: false,
            },
            buttons: {
                type: Array,
                default: () => ['reset', 'search'],
            },
            buttonAlign: {
                type: String,
                default: 'right',
            },
            buttonSize: {
                type: String,
                default: 'small',
            },
            expand: {
                type: Boolean,
                default: false,
            },
            formAttrs: {
                type: Object,
                default: () => ({}),
            },
            formItemAttrs: {
                type: Object,
                default: () => ({}),
            },
            formEvents: {
                type: Object,
                default: () => ({}),
            },
            formItemEvents: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                searchItems: this.options || [],
                currentUrl: this.url,
                formData: {},
                formItems: {},
                currentExpand: this.expand,
                loading: false,
                initValue: {},
                formButton: {
                    type: 'component',
                    component: FormButtonGroup,
                    field: 'button',
                    props: {
                        submit: this.submitForm,
                        reset: this.resetForm,
                        buttons: this.buttons,
                        buttonSize: this.buttonSize,
                    },
                    colStyle: this.buttonNewLine ? { textAlign: 'right' } : { textAlign: this.buttonAlign, flex: 1 },
                },
            };
        },
        computed: {
            showToggleBtn() {
                return this.rows.length > 2;
            },
            maxItems() {
                let count = 0;
                let spanCount = 0;
                for (const v of this.searchItems) {
                    if (v.field !== 'button') {
                        spanCount += this.getItemSpan(v);
                        if (spanCount <= 48) {
                            if (spanCount < 48) {
                                count++;
                            } else if (this.buttonNewLine) {
                                count++;
                            }
                        }
                    }
                }
                // console.log('count: ', count);
                return count;
            },
            height() {
                if (this.currentExpand) {
                    return '1000px';
                }
                return '500px';
            },
            span() {
                const { clientWidth } = document.body;
                if (this.columns) {
                    return Math.ceil(24 / this.columns);
                }
                if (clientWidth <= 1240) {
                    return 24 / 3;
                }
                if (clientWidth <= 1500) {
                    return 24 / 4;
                }
                if (clientWidth <= 1900) {
                    return Math.ceil(24 / 5);
                }
                return 24 / 6;
            },
            spanCount() {
                return items => {
                    let spanCount = 0;
                    items.forEach(v => {
                        spanCount += this.getItemSpan(v);
                    });
                    return spanCount;
                };
            },
            rows() {
                const rows = [];
                let spanCount = 0;
                let index = 0;
                (this.searchItems || []).forEach(item => {
                    const span = this.getItemSpan(item);
                    spanCount += span;
                    if (spanCount > 24) {
                        index++;
                        spanCount = span;
                    }
                    if (!rows[index]) {
                        rows[index] = [];
                    }
                    rows[index].push({ ...item, span });
                });
                return rows;
            },
            buttonSpan() {
                if (this.buttonNewLine) {
                    return 24;
                }
                let sum = 0;
                let targetRow;
                if (this.showToggleBtn) {
                    if (this.currentExpand) {
                        targetRow = this.rows[this.rows.length - 1];
                    } else {
                        [, targetRow] = this.rows;
                        return (targetRow[targetRow.length - 1] || {}).span || 24;
                    }
                } else {
                    targetRow = this.rows[this.rows.length - 1];
                }
                (targetRow || []).forEach(v => { sum += v.span; });
                if (sum === 24) {
                    return 24;
                }
                return 24 - sum;
            },
            avaliableSearchItems() {
                const temp = cloneDeep(this.searchItems);
                const formButton = { ...this.formButton, span: this.buttonSpan };
                // console.log('expand: ', this.currentExpand);
                temp.forEach((k, i) => {
                    if (k.field === 'button') {
                        temp.splice(i, 1);
                    }
                    if (this.currentExpand) {
                        k.visible = true;
                    } else if (i >= this.maxItems) {
                        k.visible = false;
                    }
                });
                if (this.currentExpand) {
                    temp.push(formButton);
                    // console.log(this.searchItems.map(v => v.label + v.field).join(' '));
                    return temp;
                }
                temp.splice(this.maxItems, 0, formButton);
                // console.log(this.searchItems.map(v => v.label + v.field).join(' '));
                return temp;
            },
        },
        created() {
            if (this.currentUrl) {
                this.loadOptions();
            } else {
                this.generateFormItems(true);
            }
        },
        methods: {
            getItemSpan(item) {
                let span = item.span || this.span;
                if (item.span) {
                    ({ span } = item);
                } else if (item.spanTimes) {
                    span = this.span * item.spanTimes; 
                } else if (['date_range', 'daterange', 'numberrange'].includes(item.type)) {
                    span = this.span * 2; 
                } else {
                    ({ span } = this);
                }
                return span;
            },
            loadOptions() {
                if (!this.currentUrl) return;
                window.request(this.currentUrl).then(data => {
                    if (data && data.length) {
                        const arr = [];
                        data.forEach(item => {
                            const temp = { attrs: {} };
                            temp.type = item.type || item.method;
                            temp.label = item.label || item.name;
                            temp.field = item.field || item.key;
                            temp.default = item.default;
                            temp.attrs.placeholder = item.placeholder;
                            if (temp.type === 'api_search') {
                                temp.url = item.url || (item.info && item.info.url);
                                temp.searchKey = item.searchKey || (item.info && item.info.search_key);
                            } else if (temp.type === 'dropdown') {
                                temp.options = item.options || (item.info && item.info.map(v => ({ label: v[1], value: v[0] })));
                                temp.attrs.multiple = item.multiple;
                            } else if (temp.type === 'date_range' || item.type === 'date') {
                                temp.attrs.format = item.format;
                            }
                            arr.push(temp);
                        });
                        this.searchItems = arr;
                    }
                    this.generateFormItems(true);
                })
                    .catch(err => {
                        this.showErrorMsg(err.message);
                        this.$emit('search', {});
                    });
            },
            generateFormItems(shouldSearch) {
                const formItems = {};
                this.avaliableSearchItems.forEach((item) => {
                    const labelName = item.name || item.label;
                    const type = item.method || item.type;
                    const field = item.key || item.field;
                    switch (type) {
                        case 'input': {
                            formItems[field] = {
                                ...item, 
                                type: 'input',
                                span: item.span || (this.span * (item.spanTimes || 1)),
                            };
                            break;
                        }
                        case 'date': {
                            formItems[field] = {
                                ...item,
                                attrs: {
                                    ...item.attrs,
                                    format: item.attrs && item.attrs.format,
                                },
                                type: 'date',
                                span: item.span || (this.span * (item.spanTimes || 1)),
                            };
                            break;
                        }
                        case 'date_range': {
                            formItems[field] = {
                                ...item,
                                type: 'component',
                                component: CustomDateRange,
                                span: item.span || (this.span * (item.spanTimes || 2)),
                                props: {
                                    options: item,
                                },
                            };
                            break;
                        }
                        case 'daterange': {
                            formItems[field] = {
                                ...item,
                                attrs: {
                                    ...item.attrs,
                                    format: item.attrs && item.attrs.format,
                                },
                                type: 'daterange',
                                span: item.span || (this.span * (item.spanTimes || 2)), 
                            };
                            break;
                        }
                        case 'select': 
                        case 'dropdown':
                        case 'multi_dropdown': {
                            let options = [];
                            if (item.info) {
                                options = item.info.map(v => ({ label: v[1], value: v[0] }));
                            } else {
                                ({ options } = item);
                            }
                            formItems[field] = {
                                ...item,
                                attrs: {
                                    ...item.attrs,
                                    multiple: item.attrs && typeof item.attrs.multiple !== 'undefined' ? item.attrs.multiple : type === 'multi_dropdown',
                                },
                                type: 'select',
                                options: options.map(v => ({ ...v, label: v[item.labelField || 'label'], value: v[item.valueField || 'value'] })),
                                span: item.span || (this.span * (item.spanTimes || 1)),
                            };
                            break;
                        }
                        case 'search': 
                        case 'api_search': {
                            formItems[field] = {
                                ...item,
                                type: 'search',
                                options: item.options || [],
                                span: item.span || (this.span * (item.spanTimes || 1)),
                                search: async (key, field) => { // eslint-disable-line
                                    let options;
                                    if (!this.formItems[field].attrs) {
                                        this.$set(this.formItems[field], 'attrs', {});
                                    }
                                    this.$set(this.formItems[field].attrs, 'loading', true);
                                    if (item.search && typeof item.search === 'function') {
                                        options = await item.search(key, field);
                                    } else {
                                        const url = (item.info && item.info.url) || item.url || '';
                                        if (!url) {
                                            return [];
                                        }
                                        const searchKey = (item.info && item.info.search_key) || item.searchKey || '';
                                        if (!searchKey) {
                                            return [];
                                        }
                                        let data = await window.request(url, { params: { [searchKey]: key }, method: 'GET' });
                                        if (typeof data.code !== 'undefined') {
                                            ({ data } = data);
                                        }
                                        options = ((data && data.length ? data : false) || data.result || data.results || data.data || data.list || []).map(v => ({ label: v[item.labelField || 'label'], value: v[item.valueField || 'value'] }));
                                    }
                                    this.$set(this.formItems[field], 'options', options || []);
                                    this.$nextTick(() => {
                                        this.$set(this.formItems[field].attrs, 'loading', false);
                                    });
                                    const obj = this.searchItems.find(v => v.field === field);
                                    if (obj) {
                                        obj.options = options;
                                    }
                                },
                            };
                            break;
                        }
                        case 'numberrange': {
                            formItems[field] = {
                                ...item,
                                type: 'component',
                                component: NumberRange,
                                span: item.span || (this.span * (item.spanTimes || 2)), 
                                props: {
                                    item,
                                },
                            };
                            break;
                        }
                        case 'component': {
                            formItems[field] = {
                                ...item,
                                type: 'component',
                                component: item.component,
                                span: item.span || (this.span * (item.spanTimes || 1)),
                                props: Object.assign(item.props || {}, { validator: item.validator }),
                            };
                            break;
                        }
                        default: break;
                    }
                    if (formItems[field]) {
                        const label = this.labelWidth > 0 ? labelName : '';
                        let placeholder;
                        switch (type) {
                            case 'input': {
                                placeholder = `请输入${label}`;
                                break;
                            }
                            case 'search': {
                                placeholder = '输入关键字搜索';
                                break;
                            }
                            default: {
                                placeholder = `请选择${label}`;
                            }
                        }
                        formItems[field].placeholder = (item.attrs && item.attrs.placeholder) || placeholder;
                        formItems[field].label = label;
                    }
                });
                this.formItems = formItems;
                if (this.setInitParams && shouldSearch) {
                    this.setInitParams(params => {
                        this.initValue = params || {};
                        this.$nextTick(() => {
                            if (this.form) {
                                this.form.setFieldsValue(params);
                            }
                            this.emitSearch();
                        });
                    });
                } else if (shouldSearch) {
                    this.emitSearch();
                }
            },
            handleKeyUp(e) {
                if (e.keyCode === 13 && document.activeElement.tagName.toUpperCase() !== 'BUTTON') {
                    this.submitForm();
                }
            },
            submitForm() {
                this.form.validate(valid => {
                    if (valid) {
                        const formData = {};
                        const temp = this.form.getFieldsValue();
                        for (const item of this.searchItems) {
                            let value = temp[item.field];
                            if (typeof value !== 'undefined' && !this.isEmptyObject(value)) {
                                if (value === null) value = '';
                                let format = (item.attrs && item.attrs.format) || 'YYYY-MM-DD HH:mm:ss';
                                format = format.replace(/y/g, 'Y').replace(/d/g, 'D');
                                if (item.type === 'daterange' || item.type === 'date_range') {
                                    if (this.shouldDateFormat) {
                                        value = (value || []).map(v => (v ? dayjs(v).format(format) : null));
                                    }
                                    [
                                        formData[item.startFieldName || `begin${item.field}`], 
                                        formData[item.endFieldName || `end${item.field}`],
                                    ] = value;
                                    delete formData[item.field];
                                } else if (item.type === 'numberrange') {
                                    [formData[item.startFieldName || `begin${item.field}`], formData[item.endFieldName || `end${item.field}`]] = value;
                                    delete formData[item.field];
                                } else if (item.type === 'date') {
                                    if (this.shouldDateFormat) {
                                        formData[item.field] = dayjs(value).format(format);
                                    }
                                } else {
                                    formData[item.field] = value;
                                }
                            }
                        }
                        this.$emit('search', formData);
                    }
                });
            },
            toggleExpand() {
                this.currentExpand = !this.currentExpand;
                this.generateFormItems(false);
            },
            createForm(form) {
                this.form = form;
                this.$emit('getFormInstance', form);
            },
            resetForm() {
                // this.form.resetFields();
                const initValue = {};
                this.avaliableSearchItems.forEach(item => {
                    if (item.events && item.events.change) {
                        item.events.change(this.formData[item.field]);
                    }
                    initValue[item.field] = item.default;
                });
                this.formData = Object.assign({}, initValue, this.initValue);
                this.$emit('reset');
                this.$nextTick(() => {
                    this.submitForm();
                });
            },
            isEmptyObject(obj) {
                if (Array.isArray(obj)) {
                    return obj.filter(v => !!v).length <= 0;
                } 
                if (Object.prototype.toString.call(obj) === '[Object object]') {
                    const keys = Object.keys(obj);
                    if (keys.length <= 0) {
                        return true;
                    }
                    for (const key of keys) {
                        if (!obj[key]) {
                            delete obj[key];
                        }
                    }
                    return Object.keys(obj).length <= 0;
                }
                return false;
            },
            emitSearch() {
                this.$nextTick(() => {
                    let fieldsValue = {};
                    if (this.form) {
                        fieldsValue = this.form.getFieldsValue() || {};
                    } 
                    this.$emit('search', fieldsValue);
                });
            },
        },
        watch: {
            options: {
                deep: true,
                handler(val) {
                    console.log('searchbar options watch', val);
                    this.searchItems = val || [];
                    this.generateFormItems(false);
                },
            },
            url(val) {
                this.currentUrl = val;
                this.loadOptions();
            },
        },
    };
</script>
<style lang="scss">

    .search_bar {
        overflow: hidden;
        transition: all 0.3s;
        width: 100%;
        position: relative;
        padding-bottom: 5px;

        .toggle {
            width: 120px;
            height: 15px;
            border-radius: 14px 14px 0 0;
            background: #EEF2F8;
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            margin: auto;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;

        }

        .field-col-button {
            .el-form-item__content {
                margin-left: 0!important;
            }
        }

        // .fold {
        //     background: url('./images/fold.png') center center no-repeat;
        //     background-size: contain;
        // }

        // .expand {
        //     background: url('./images/expand.png') center center no-repeat;
        //     background-size: contain;
        // }

        .el-form-item {
            margin-bottom: 15px;
        }
    }

</style>
