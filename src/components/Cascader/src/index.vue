<template>
    <div class="k-cascader">
        <el-cascader
            v-bind="attrs"
            v-events="events"
            v-model="currentValue"
            :props="customProps"
            :popper-class="customClass"
            @expand-change="expandChange"
            @visible-change="visibleChange"
            @change="valueChange"
            ref="cascader"
            filterable
            :filter-method="filterMethod"
        >
        </el-cascader>
    </div>
</template>

<script>
import debounce from 'lodash/debounce';
import get from 'lodash/get';

export default {
    name: 'k-cascader',
    props: {
        attrs: {
            type: Object,
            default: () => ({}),
        },
        events: {
            type: Object,
            default: () => ({}),
        },
        labelInValue: {
            type: Boolean,
            default: false,
        },
        pageSize: {
            type: Number,
            default: 10,
        },
        value: {
            type: [String, Array, Number],
        },
        level: {
            type: Number,
            default: 1,
        },
        queryObj: {
            type: Array,
            default: () => [],
        },
        isServerPage: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            randomClass: `k-cascader_${Math.random().toString(32).slice(2)}`,
            resolves: [],
            datas: [],
            pageTotal: [],
            pageNumbers: [],
            nodeDatas: [],
            searchResult: null,
            hasInitSearch: false,
            isInit: true,
        };
    },
    mounted() {
        const inst = this.$refs.cascader;
        const { getSuggestions } = inst;
        const { panel } = inst.$refs;
        inst.getSuggestions = () => {
            this.$emit('search', {
                panel,
                keyWord: inst.inputValue,
                resolves: this.resolves,
                getSuggestions,
            });
        };
    },
    watch: {
    },
    computed: {
        customProps() {
            return {
                ...get(this.attrs, 'props', {}),
                lazyLoad: this.lazyLoad,
                lazy: true,
            };
        },
        customClass() {
            let cls = get(this.attrs, 'popper-class', '') || get(this.attrs, 'popperClass', '');
            cls = cls.split(' ');
            cls.push(this.randomClass);
            return cls.join(' ');
        },
        valueProp() {
            return get(this.attrs, 'props.value', 'value');
        },
        labelProp() {
            return get(this.attrs, 'props.label', 'label');
        },
        currentValue: {
            get() {
                return this.getCurrentValue();
            },
            set(val) {
                if (this.labelInValue) {
                    if (val && val[0] && Object.prototype.hasOwnProperty.call(val[0], this.labelProp)) {
                        this.$emit('input', val);
                    }
                } else {
                    this.$emit('input', val);
                }
            },
        },
        isMultiple() {
            return get(this.attrs, 'props.multiple') === true;
        },
    },
    methods: {
        getCurrentValue() {
            if (this.isServerPage) {
                if (this.isMultiple) {
                    return (this.value || []).map(item => (Array.isArray(item) ? item.map(v => v[this.valueProp] || v) : item));
                }
                return (this.value || []).map(v => v[this.valueProp] || v);
            }
            return this.value;
        },
        findObj(index) {
            return (v) => {
                try {
                    return v[this.valueProp] === (this.value && this.value[index] ? this.value[index][this.valueProp] || this.value[index] : null);
                } catch (e) {
                    console.log(JSON.stringify(v), JSON.stringify(this.value), index, e.message);
                }
                return null;
            };
        },
        async lazyLoad(node, resolve) {
            const { level } = node;
            this.resolves[level] = resolve;
            this.nodeDatas[level] = node;
            if (this.isMultiple && this.isInit) return;
            try {
                const { queryObj } = this;
                if (!queryObj[level]) {
                    resolve();
                    return;
                }
                const { results, total } = await this.$request(queryObj[level].url, { params: queryObj[level].params(node, { page_size: this.isMultiple ? 0 : this.pageSize }), method: 'GET' });
                if (!results.length) {
                    resolve();
                    return;
                }
                this.datas[level] = results;
                const len = total > 0 ? total : results.length;
                this.pageTotal[level] = this.isMultiple ? 1 : Math.ceil(len / this.pageSize);
                const list = results.slice(0, this.pageSize);
                if (this.value && !this.isMultiple) {
                    let obj = list.find(this.findObj(level));
                    if (!obj) {
                        if (this.isServerPage && this.isInit) {
                            if (this.isMultiple) {
                                list.unshift(this.value[0][level]);
                            } else {
                                list.unshift(this.value[level]);
                            }
                        } else {
                            const j = results.findIndex(this.findObj(level));
                            if (j >= 0) {
                                obj = results[j];
                                list.unshift(obj);
                                results.splice(j, 1);
                            }
                        }
                    }
                }
                // console.log(list);
                resolve(list.map(({
                    id,
                    name,
                }) => ({
                    id,
                    name,
                    leaf: level === this.level - 1 ? true : undefined,
                })));
            } catch (error) {
                console.log(error);
                throw new Error(error);
            }
        },
        valueChange(value) {
            this.$nextTick(() => {
                if (this.labelInValue) {
                    const temp = [];
                    const nodes = this.$refs.cascader.getCheckedNodes();
                    (nodes || []).forEach((node, nodeIndex) => {
                        temp[nodeIndex] = [];
                        (node.path || []).forEach((path, pathIndex) => {
                            temp[nodeIndex].push({ [get(this.attrs, 'props.label', 'label')]: node.pathLabels[pathIndex], [get(this.attrs, 'props.value', 'value')]: path });
                        });
                    });
                    this.currentValue = this.isMultiple ? temp : temp[0];
                } else {
                    this.currentValue = value;
                }
            });
        },
        visibleChange() {
            this.isInit = false;
            this.bindScrollEvent();
        },
        expandChange() {
            this.bindScrollEvent();
        },
        bindScrollEvent() {
            this.$nextTick(() => {
                document.querySelectorAll(`.${this.randomClass} .el-cascader-menu__wrap`).forEach((node, index) => {
                    node.onscroll = debounce(() => {
                        if (!this.resolves[index]) return;
                        let current = this.pageNumbers[index] || 1;
                        if (this.pageTotal[index] <= current) return;
                        if (node.scrollTop + node.clientHeight >= node.scrollHeight - 70) {
                            current++;
                            this.pageNumbers[index] = current;
                            if (!this.convert) {
                                this.convert = i => ({
                                    id,
                                    name,
                                }) => ({
                                    id,
                                    name,
                                    leaf: this.level - 1 === i ? true : undefined,
                                });
                            }
                            if (this.isServerPage) {
                                const { queryObj } = this;
                                this.$request(queryObj[index].url, { params: queryObj[index].params(this.nodeDatas[index], { page_num: current, page_size: this.pageSize }), method: 'GET' }).then(({ results }) => {
                                    this.resolves[index](results.map(this.convert(index)));
                                });
                            } else {
                                const start = (current - 1) * this.pageSize;
                                const end = current * this.pageSize;
                                this.resolves[index](this.datas[index].slice(start, end).map(this.convert(index)));
                            }
                        }
                    }, 200);
                });
            });
        },
        filterMethod(node, keyWord) {
            return node.text.indexOf(keyWord) >= 0;
        },
    },
};
</script>
