<template>
    <el-form
        v-bind="formAttrs"
        v-events="formEvents"
        ref="form"
        :model="localFormData"
        :rules="rules"
        :label-width="`${labelInset || labelPosition === 'top' ? '' : labelWidth}`"
        :label-position="labelPosition"
        class="k-form"
    >
        <el-row
            :gutter="gutter"
            v-for="(cols, index) in rows"
            :key="index"
        >
            <el-col
                v-for="(item, field) in cols"
                :key="field"
                :span="item.span || (Math.ceil(24 / columns))"
                :style="getColStyle(item)"
                :class="`field-col-${field}`"
            >
                <el-form-item
                    v-bind="Object.assign(formItemAttrs, item.formItemAttrs || {})"
                    v-events="Object.assign(formItemEvents, item.formItemEvents || {})"
                    :label="item.label ? `${item.label}：` : ''"
                    :prop="field"
                    v-if="item.display || item.display === undefined"
                    :class="{'label-inset': labelInset, 'label-top': !labelInset && labelPosition === 'top'}"
                >
                    <el-input
                        v-bind="item.attrs"
                        v-events="item.events"
                        :value="localFormData[field]"
                        v-if="item.type === 'textarea'"
                        type="textarea"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :placeholder="((item.attrs && item.attrs.placeholder) || `请输入${item.label}`)"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        @input="value => valueInput(value, item, field)"
                    />
                    <el-input
                        v-bind="item.attrs"
                        v-events="item.events"
                        :value="localFormData[field]"
                        v-if="item.type === 'input'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :placeholder="((item.attrs && item.attrs.placeholder) || `请输入${item.label}`)"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        @input="value => valueInput(value, item, field)"
                    />
                    <el-select
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'select'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :placeholder="((item.attrs && item.attrs.placeholder) || `请选择${item.label}`)"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        :ref="field"
                        @change="e => selectItemChange(e, item)"
                    >
                        <el-option
                            v-for="opt in (item.options || [])"
                            :key="opt.value"
                            v-bind="opt.attrs"
                            v-events="opt.events"
                            :label="opt.label"
                            :value="opt.value"
                        ></el-option>
                    </el-select>
                    <el-select
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'search'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :placeholder="(item.attrs && item.attrs.placeholder) || '请输入关键字进行搜索'"
                        filterable
                        remote
                        :ref="field"
                        reserve-keyword
                        :remote-method="key => item.search(key, field)"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        @change="e => selectItemChange(e, item)"
                    >
                        <el-option
                            v-for="option in (item.options || [])"
                            :key="option.value"
                            v-bind="option.attrs"
                            v-events="option.events"
                            :label="option.label"
                            :value="option.value"
                        ></el-option>
                    </el-select>
                    <el-date-picker
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'date'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :type="/(HH|mm|ss)/.test(getFormat(item)) ? 'datetime' : 'date'"
                        :placeholder="(item.attrs && item.attrs && item.attrs.placeholder) || `请选择${item.field}`"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        :format="getFormat(item)"
                    ></el-date-picker>
                    <el-date-picker
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'daterange'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :type="/(HH|mm|ss)/.test(getFormat(item)) ? 'datetimerange' : 'daterange'"
                        :start-placeholder="(item.attrs && (item.attrs['start-placeholder'] || item.attrs.startPlaceholder)) || '请选择开始时间'"
                        :end-placeholder="(item.attrs && (item.attrs['end-placeholder'] || item.attrs.endPlaceholder)) || '请选择结束时间'"
                        :range-separator="(item.attrs && item.attrs['range-separator']) || '至'"
                        :size="getItemSize(item)"
                        :clearable="isClearable(item)"
                        :format="getFormat(item)"
                    >
                    </el-date-picker>
                    <el-radio-group
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'radio'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :size="getItemSize(item)"
                    >
                        <el-row :gutter="5">
                            <el-col
                                v-for="option in (item.options || [])"
                                :key="option.value"
                                :span="6"
                                style="margin: 5px 0"
                            >
                                <el-radio
                                    v-bind="option.attrs"
                                    v-events="option.events"
                                    :label="option.value"
                                >
                                    {{ option.label }}
                                </el-radio>
                            </el-col>
                        </el-row>
                    </el-radio-group>
                    <el-checkbox-group
                        v-bind="item.attrs"
                        v-events="item.events"
                        v-model="localFormData[field]"
                        v-if="item.type === 'checkbox'"
                        :class="`field-${field.replace(/\./g, '-')}`"
                        :size="getItemSize(item)"
                    >
                        <el-row :gutter="5">
                            <el-col
                                v-for="option in (item.options || [])"
                                :key="option.value"
                                :span="6"
                                style="margin: 5px 0"
                            >
                                <el-checkbox
                                    v-bind="option.attrs"
                                    v-events="option.events"
                                    :label="option.value"
                                >
                                    {{ option.label }}
                                </el-checkbox>
                            </el-col>
                        </el-row>
                    </el-checkbox-group>
                    <span
                        v-if="item.type === 'text'"
                        :style="Object.assign({height:'32px', lineHeight: '32px'}, item.style)"
                        v-html="item.text"
                        :class="`field-${field.replace(/\./g, '-')}`"
                    />
                    <component
                        v-bind="item.props"
                        v-model="localFormData[field]"
                        v-if="item.type === 'component'"
                        :is="item.component"
                        :class="`field-${field.replace(/\./g, '-')}`"
                    />
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>
<script>
    import {
        mobilePhone, email, ip, port, positiveIntegerNumber, positiveNumber, 
    } from '@hello/regexp';

    export default {
        props: {
            formItems: {
                type: Object,
                default: () => ({}),
            },
            formData: {
                type: Object,
                default: () => ({}),
            },
            columns: {
                type: Number,
                default: 1,
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
                default: 50,
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
                format: 'yyyy-MM-dd HH:mm:ss',
                labelPosition: typeof this.formAttrs['label-position'] === 'undefined' || this.labelInset ? 'right' : this.formAttrs['label-position'],
                labelWidth: typeof this.formAttrs['label-width'] === 'undefined' ? '100px' : this.formAttrs['label-width'],
                localFormData: this.getLocalFormData(this.formData, this.formItems),
            };
        },
        computed: {
            rules() {
                const rules = {};
                for (const field in this.formItems) {
                    rules[field] = [];
                    const opt = this.formItems[field];
                    (opt.rules || []).forEach(rule => {
                        if (rule.required) {
                            rule.message = rule.message || `请输入${opt.label}`;
                        } else if (rule.max) {
                            rule.message = rule.message || `${opt.label}的最大长度为${rule.max}个字符`;
                        } else if (rule.type === 'port') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = port(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        } else if (rule.type === 'ip') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = ip(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        } else if (rule.type === 'positive_number') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = positiveIntegerNumber(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        } else if (rule.type === 'number') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = positiveNumber(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        } else if (rule.type === 'phone') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = mobilePhone(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        } else if (rule.type === 'email') {
                            rule.validator = rule.validator || ((_, value, cb) => {
                                const { res, message } = email(value);
                                if (!value || res) {
                                    cb();
                                } else {
                                    cb(message);
                                }
                            });
                        }
                        rules[field].push(rule);
                    });
                }
                return rules;
            },
            modelData() {
                return field => {
                    let data = this.localFormData;
                    field.split('.').forEach(f => {
                        data = data[f];
                    });
                    return data;
                };
            },
            rows() {
                const rows = [];
                let spanCount = 0;
                let index = 0;
                Object.keys(this.formItems).forEach(field => {
                    const item = this.formItems[field];
                    const span = item.span || Math.ceil(24 / this.columns);
                    spanCount += span;
                    if (spanCount > 24) {
                        index++;
                        spanCount = span;
                    }
                    if (!rows[index]) {
                        rows[index] = {};
                    }
                    rows[index][field] = item;
                });
                return rows;
            },
        },
        watch: {
            formData: {
                deep: true,
                handler(val) {
                    console.log('originFormData: ', val); // eslint-disable-line
                    Object.keys(val).forEach(key => {
                        this.localFormData[key] = val[key];
                    });
                },
            },
            localFormData: {
                deep: true,
                handler(val) {
                    console.log('localFormData: ', val); // eslint-disable-line
                },
            },
            formItems: {
                deep: true,
                handler(val) {
                    console.log('formItems: ', val); // eslint-disable-line
                    if (this.labelInset) {
                        this.setInputPadding(val);
                    }
                },
            },
        },
        mounted() {
            if (this.labelInset) {
                this.setInputPadding(this.formItems);
            }
            const { form } = this.$refs;
            form.setFieldsValue = values => {
                Object.assign(this.localFormData, values);
            };
            form.getFieldsValue = (...fields) => {
                if (!fields.length) {
                    return this.localFormData;
                }
                const values = {};
                fields.map(field => { values[field] = this.localFormData[field]; });
                return values;
            };
            form.getFieldValue = field => {
                return this.localFormData[field];
            };
            this.$emit('createForm', form);
        },
        methods: {
            setInputPadding(formItems) {
                this.$nextTick(() => {
                    for (const field of Object.keys(formItems)) {
                        const obj = formItems[field];
                        const span = document.createElement('span');
                        span.innerHTML = obj.label;
                        span.style.fontSize = '14px';
                        document.body.appendChild(span);
                        const numberrange = this.$el.querySelector(`.number-range.field-${field.replace(/\./g, '-')}`);
                        const customDateRange = this.$el.querySelector(`.date-range.field-${field.replace(/\./g, '-')}`);
                        if (numberrange) {
                            numberrange.style.paddingLeft = `${span.offsetWidth + 20}px`;
                        } else if (customDateRange) {
                            customDateRange.style.paddingLeft = `${span.offsetWidth + 20}px`;
                        } else if (obj.type === 'daterange') {
                            const daterange = this.$el.querySelector(`.field-${field.replace(/\./g, '-')}`);
                            if (daterange) {
                                daterange.style.paddingLeft = `${span.offsetWidth + 20}px`;
                            }
                        } else {
                            // const input = this.$el.querySelector(`.field-${field.replace(/\./g, '-')} input`);
                            // if (input) {
                            //     input.style.paddingLeft = `${span.offsetWidth + 20}px`;
                            // }
                            const input = this.$el.querySelector(`.field-${field.replace(/\./g, '-')}`).getElementsByTagName('input');
                            if (input && input.length > 1) {
                                input[1].style.paddingLeft = `${span.offsetWidth + 20}px`;
                                input[0].style.marginLeft = '0px';
                            } else if (input && input[0]) {
                                input[0].style.paddingLeft = `${span.offsetWidth + 20}px`;
                            }
                            
                            const tags = this.$el.querySelector(`.field-${field.replace(/\./g, '-')} .el-select__tags`);
                            if (tags) {
                                tags.style.paddingLeft = `${span.offsetWidth + 20}px`;
                                tags.style.width = 'auto';
                            }
                        }
                        document.body.removeChild(span);
                    }
                });
            },
            isClearable(item) {
                return (item.attrs && typeof item.attrs.clearable !== 'undefined') ? item.attrs.clearable : true;
            },
            getItemSize(item) {
                return (item.attrs && item.attrs.size) || 'small';
            },
            getFormat(item) {
                if (item.attrs && item.attrs.format) {
                    return item.attrs.format.replace(/Y/g, 'y').replace(/D/g, 'd');
                }
                return this.format;
            },
            async valueInput(value, item, field) {
                const preValue = this.localFormData[field];
                let res = false;
                if (item.validator) {
                    res = await item.validator(value);
                } else {
                    res = true;
                }
                if (res) {
                    this.$set(this.localFormData, field, value && value.trim ? value.trim() : value);
                } else {
                    this.$set(this.localFormData, field, preValue);
                }
            },
            getLocalFormData(formData, formItems) {
                const result = JSON.parse(JSON.stringify(formData || {}));
                Object.keys(formItems).forEach(key => {
                    if (formItems[key] && (formItems[key].value || formItems[key].default)) {
                        result[key] = formItems[key].value || formItems[key].default;
                    } else {
                        result[key] = result[key] || undefined;
                    }
                });
                return result;
            },
            getColStyle(item) {
                if (typeof item.visible === 'undefined' || item.visible) {
                    return item.colStyle || {};
                } 
                return { display: 'none' };
            },
            selectItemChange(e, item) {
                this.$nextTick(() => {
                    this.$refs[item.field][0].blur();
                    const btn = document.body.querySelector('.search_bar .el-button--primary');
                    if (btn) {
                        btn.focus();
                    }
                });
            },
        },
    };
</script>
<style lang="scss">
    .k-form {
        width: 100%;

        .label-inset {
            position: relative;
            display: flex;
            align-items: center;
            .el-form-item__label {
                position: absolute;
                z-index: 1;
                margin-left: 10px;
            }
            .el-icon-time {
                display: none;
            }

            .el-range-editor .el-range-input {
                flex: 1;
            }
        }

        .el-form-item__label {
                line-height: 32px;
        }

        .label-top {
            .el-form-item__label {
                line-height: 1;
            }
        }

        .el-form-item__content {
            line-height: 32px;
            flex: 1 1 50%;

            .el-form-item__error {
                top: auto;
                padding-top: 2px;
            }
        }

        .el-row {
            display: flex;
            // flex-wrap: wrap;

            & > .el-col {
                flex: 0 1 auto;
            }
        }

        .el-radio-group, .el-checkbox-group{
            width: 100%;
            .el-radio, .el-checkbox {
                display: flex;
                align-items: center;

                &__label{
                    flex: 1;
                    width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
</style>
