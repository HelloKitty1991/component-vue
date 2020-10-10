<template>
    <div class="tag-item-input">
        <el-cascader
            v-model="currentValue[0]"
            :options="cascaderOptions"
            ref="cascader"
            v-bind="cascaderAttrs"
            placeholder="请输入搜索字段"
            @change="cascaderChange"
            clearable
            filterable
            :size="size"
            :props="{...cascaderAttrs.props,}"
            :show-all-levels="false"
            :disabled="(currentValue[4] && currentValue[4].name) ? currentValue[4].name : false"
        />
        <i class="sperate" />
        <el-select
            v-model="currentValue[1]"
            :size="size"
            clearable
            :disabled="(currentValue[4] && currentValue[4].relation) ? currentValue[4].relation : false"
        >
            <el-option
                v-for="obj in signArr"
                :key="obj.value"
                :value="obj"
                :label="obj.label"
            />
        </el-select>
        <i class="sperate" />
        <el-input
            v-bind="selectedTreeData.attrs"
            :size="size"
            @input="valueInput"
            :value="currentValue[2]"
            v-if="selectedTreeData.type === 'input'"
            class="customer-input"
            clearable
            maxlength="10"
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        >
            <span
                slot="suffix"
                class="el-input__icon"
                v-if="currentValue[3]"
            >{{ currentValue[3].unit }}</span>
        </el-input>
        <el-select
            v-bind="selectedTreeData.attrs"
            :size="size"
            v-model="currentValue[2]"
            v-if="selectedTreeData.type === 'select'"
            clearable
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        >
            <el-option
                v-bind="selectedTreeData.optionAttrs"
                v-for="obj in selectedTreeData.options || []"
                :key="obj.value"
                :value="obj"
                :label="obj.label"
            />
        </el-select>
        <el-date-picker
            class="data-picker"
            :size="size"
            v-bind="selectedTreeData.attrs"
            v-model="currentValue[2]"
            v-if="selectedTreeData.type === 'date'"
            :type="/HH|mm|ss/.test(getDateFormat(selectedTreeData)) ? 'datetime' : 'date'"
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        />
        <el-date-picker
            class="data-picker"
            :size="size"
            v-bind="selectedTreeData.attrs"
            v-model="currentValue[2]"
            v-if="selectedTreeData.type === 'dateRange'"
            :type="/HH|mm|ss/.test(getDateFormat(selectedTreeData)) ? 'datetimerange' : 'daterange'"
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        />
        <Region
            :size="size"
            :attrs="selectedTreeData.attrs"
            :events="selectedTreeData.events"
            v-if="selectedTreeData.type === 'area'"
            v-model="currentValue[2]"
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        />
        <!-- <VehicleBrandAndSerial
            :size="size"
            :attrs="selectedTreeData.attrs"
            :events="selectedTreeData.events"
            v-if="selectedTreeData.type === 'vehicleType'"
            v-model="currentValue[2]"
        /> -->
        <el-select
            v-bind="selectedTreeData.attrs"
            :size="size"
            v-model="currentValue[2]"
            v-if="selectedTreeData.type === 'brands'"
            placeholder="请输入品牌"
            clearable
            filterable
            multiple
            remote
            :remote-method="remoteMethod"
            :loading="loading"
            loading-text="请输入品牌"
            :disabled="(currentValue[4] && currentValue[4].value) ? currentValue[4].value : false"
        >
            <el-option
                v-for="item in brandsList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
            >
            </el-option>
        </el-select>
    </div>
</template>

<script>
import { positiveIntegerNumber, positiveNumber, number } from '@hello/regexp';
import get from 'lodash/get';
// import cloneDeep from 'lodash/cloneDeep';
import Region from '../../Region';
// import VehicleBrandAndSerial from '../../VehicleBrandAndSerial';

export default {
    components: {
        Region,
        // VehicleBrandAndSerial,
    },
    data() {
        return {
            loading: true,
            sign: '=',
            signArr: [],
            signObj: {
                '=': '等于',
                '!=': '不等于',
                '>': '大于',
                '<': '小于',
                '>=': '大于等于',
                '<=': '小于等于',
            },
            currentValue: this.value,
            format: 'YYYY-MM-DD HH:mm:ss',
            brandsList: this.returnBrands,
        };
    },
    props: {
        labelInValue: {
            type: Boolean,
            default: true,
        },
        url: {
            type: String,
            default: '',
        },
        cascaderOptions: {
            type: Array,
            default: () => ([]),
        },
        size: {
            type: String,
            default: 'small',
        },
        value: {
            type: Array,
            default: () => ([]),
        },
        cascaderAttrs: {
            type: Object,
            default: () => ({}),
        },
        returnBrands: {
            type: Array,
            default: () => ([]),
        },
    },
    mounted() {
        this.$nextTick(() => {
            this.handleSign();
            // this.getBrands();
        });
    },
    computed: {
        selectedTreeData() {
            // debugger //eslint-disable-line
            let temp = {
                type: 'input',
            };
            const selectedValue = get(this.currentValue, '[3].widgetInfo');
            if (selectedValue) {
                try {
                    temp = JSON.parse(selectedValue);
                } catch (e) {
                    temp = {};
                }
                return temp;
            }
            return temp;
        },
    },
    watch: {
        currentValue(val) {
            this.$emit('input', val);
        },
        value(val) {
            this.currentValue = val;
        },
    },
    methods: {
        getBrands(query) {
            this.loading = true;
            this.$request('https://resource.hello.com/vehiclemodel/auto/brands', { params: { page_size: 10, search: query }, method: 'GET' }).then((data) => {
                let res = data;
                if (typeof data.code !== 'undefined') {
                    // ({ data } = data);
                    res = data.data;
                }
                if (res && res.results && res.results.length) {
                    this.brandsList = res.results.map(val => ({
                        name: val.name,
                        id: val.id,
                    }));
                    // const arr = [
                    //     ...this.brandsList,
                    //     ...res,
                    // ];
                    // const tmp = new Map();
                    // this.brandsList = arr.filter(val => !tmp.has(val.id) && tmp.set(val.id, 1));
                } else {
                    this.brandsList = this.returnBrands;
                }
            })
                .catch((err) => {
                    this.showErrorMsg(err.message);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        remoteMethod(query) {
            if (query !== '') {
                this.getBrands(query);
                return;
            }
            this.brandsList = this.returnBrands;
        },
        getDateFormat(item) {
            if (item.attrs && item.attrs.format) {
                return item.attrs.format.replace(/Y/g, 'y').replace(/D/g, 'd');
            }
            return this.format.replace(/Y/g, 'y').replace(/D/g, 'd');
        },
        valueInput(value) {
            // value = value.trim();
            let resValue = value.trim();
            if (resValue) {
                if (this.selectedTreeData && this.selectedTreeData.rules && this.selectedTreeData.rules.length) {
                    this.selectedTreeData.rules.forEach((rule) => {
                        switch (rule.type) {
                        case 'positiveIntegerNumber': {
                            const { res } = positiveIntegerNumber(resValue);
                            if (res) {
                                this.$set(this.currentValue, 2, resValue);
                            }
                            break;
                        }
                        case 'positiveNumber': {
                            const { res } = positiveNumber(resValue, rule.decimal);
                            if ((/\.$/.test(resValue) || res) && (resValue.match(/\./g) || []).length <= 1) {
                                this.$set(this.currentValue, 2, resValue);
                            }
                            break;
                        }
                        case 'number': {
                            const { res } = number(resValue, rule.decimal);
                            if ((/^-$/.test(resValue) || /\.$/.test(resValue) || res) && (resValue.match(/\./g) || []).length <= 1) {
                                if (resValue === '-0') {
                                    resValue = '0';
                                }
                                this.$set(this.currentValue, 2, resValue);
                            }
                            break;
                        }
                        case 'int': {
                            const { res } = number(resValue);
                            if ((/^-$/.test(resValue) || /\.$/.test(resValue) || res) && (resValue.match(/\./g) || []).length <= 1) {
                                if (!/[^\-?\d]/g.test(resValue)) {
                                    if (resValue === '-0') {
                                        resValue = '0';
                                    }
                                    this.$set(this.currentValue, 2, resValue);
                                }
                            }
                            break;
                        }
                        case 'oneDecimal': {
                            if (/^([1-9]\d*|0)((\.\d{0,1})?)$/.test(resValue)) {
                                // if (value.substr(value.length - 1) === '.') {
                                //     value = value.substr(0, value.length - 1);
                                // }
                                this.$set(this.currentValue, 2, resValue);
                            }
                            break;
                        }
                        default: {
                            this.$set(this.currentValue, 2, resValue);
                            break;
                        }
                        }
                    });
                } else {
                    this.$set(this.currentValue, 2, resValue);
                }
            } else {
                this.$set(this.currentValue, 2, '');
            }
            this.$emit('input', this.currentValue);
        },
        handleSign() {
            if (this.labelInValue) {
                const nodes = this.$refs.cascader.getCheckedNodes();
                this.signArr = [];
                if (!nodes || nodes.length === 0 || !get(nodes, '[0].data')) return;
                this.$set(this.currentValue, 3, nodes[0].data);
                if (!nodes[0].data.compare) return;
                const signStr = nodes[0].data.compare.split(',');
                signStr.map((v) => {
                    this.signArr.push({
                        value: v,
                        label: this.signObj[v],
                    });
                    return this.signArr;
                });
            }
        },
        cascaderChange() {
            this.currentValue[2] = '';
            this.currentValue[1] = '';
            this.$nextTick(() => {
                this.handleSign();
            });
        },
    },
};
</script>

<style lang="scss">
    .tag-item-input {
        // flex: 1;
        display: flex;
        border: 1px solid rgba(208, 208, 208, 1);
        border-radius: 4px;
        align-items: center;
        .sperate {
            border-left: 1px solid rgba(208, 208, 208, 1);
            height: 20px;
        }
        .el-input__inner {
            border: none;
        }
        .el-cascader, .el-select, .customer-input, .data-picker{
            width: 33.3% !important;
        }
        .el-select__tags{
            padding-left: 6px;
        }
        .el-range-editor.el-input__inner{
            padding-left:15px;
        }
    }
</style>
