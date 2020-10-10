

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

<script>

import get from 'lodash/get';
import KCascader from '../../Cascader';

const queryObj = [
    {
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
    },
];
export default {
    components: {
        KCascader,
    },
    props: {
        labelInValue: {
            type: Boolean,
            default: false,
        },
        attrs: {
            type: Object,
            default: () => ({}),
        },
        events: {
            type: Object,
            default: () => ({}),
        },
        value: {
            type: [String, Number, Array],
            default: null,
        },
    },
    data() {
        return {
            queryObj: Object.freeze(queryObj),
        };
    },
    computed: {
        customEvents() {
            return {
                ...this.events,
            };
        },
        customAttrs() {
            return {
                ...this.attrs,
                clearable: true,
                props: {
                    ...get(this.attrs, 'props', {}),
                    value: 'id',
                    label: 'name',
                },
            };
        },
        currentValue: {
            get() {
                return this.getCurrentValue(this.value);
            },
            set(val) {
                this.$emit('input', val);
            },
        },
        valueKey() {
            return get(this.customAttrs, 'props.value', 'value');
        },
        isMultiple() {
            return get(this.customAttrs, 'props.multiple') === true;
        },
    },
    mounted() {
        if (this.labelInValue) {
            setTimeout(() => {
                const nodes = this.$refs.kcascader.$refs.cascader.getCheckedNodes();
                const res = [];
                nodes.forEach((node) => {
                    res.push((node.pathNodes || []).map(({ label, value }) => ({ id: value, name: label })));
                });
                if (this.isMultiple) {
                    this.$emit('input', res);
                } else {
                    this.$emit('input', res[0]);
                }
            }, 1000);
        } else {
            this.$emit('input', this.currentValue);
        }
    },
    methods: {
        getCurrentValue(value) {
            let val = value;
            if (val) {
                if (typeof val === 'object') {
                    if (get(this.attrs, 'props.multiple')) {
                        return (val || []).map(v => v.map(x => (x[this.valueKey] - 0) || x[this.valueKey] || x));
                    }
                    return (val || []).map(v => (v[this.valueKey] - 0) || v[this.valueKey] || v);
                }
                val += '';
                const province = `${val.slice(0, 2)}0000` - 0;
                const city = `${val.slice(0, 4)}00` - 0;
                const area = val - 0;
                return [province, city, area];
            }
            return [];
        },
    },
};
</script>
