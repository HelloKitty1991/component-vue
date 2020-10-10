<template>
    <KCascader
        v-if="showCascader"
        v-model="currentValue"
        :events="events"
        :attrs="customAttrs"
        :level="level"
        :isServerPage="true"
        :queryObj="queryObj"
        :labelInValue="true"
        @search="search"
    />
</template>

<script>
import get from 'lodash/get';
import KCascader from '../../Cascader';

const queryObj = [
    {
        url: 'https://resource.hello.com/vehiclemodel/auto/brands',
        params: (node, params) => ({ page_num: 1, ...params }),
    },
    {
        url: 'https://resource.hello.com/vehiclemodel/auto/serials',
        params: (node, params) => ({ page_num: 1, brand_id: node ? node.data.id : undefined, ...params }),
    },
    {
        url: 'https://resource.hello.com/vehiclemodel/auto/models',
        params: (node, params) => ({ page_num: 1, serial_id: node ? node.data.id : undefined, ...params }),
    },
];
export default {
    components: {
        KCascader,
    },
    props: {
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
            currentValue: null,
            showCascader: false,
            level: 3,
            options: [],
        };
    },
    computed: {
        customAttrs() {
            return {
                ...this.attrs,
                options: this.options,
                props: {
                    ...(this.attrs.props || {}),
                    value: 'id',
                    label: 'name',
                },
            };
        },
        isMultiple() {
            return get(this.attrs, 'props.multiple') === true;
        },
    },
    watch: {
        value: {
            async handler(val) {
                let currentValue;
                if (typeof val === 'string') {
                    currentValue = await this.getCurrentValue(val);
                    this.currentValue = currentValue.value;
                } else if (Array.isArray(val)) {
                    const promises = [];
                    val.forEach((v) => {
                        if (typeof v === 'string') {
                            promises.push(this.getCurrentValue(v));
                        }
                    });
                    if (promises.length) {
                        const res = await Promise.all(promises);
                        currentValue = [];
                        let options = [];
                        res.forEach((v) => {
                            currentValue.push(v.value[0]);
                            options.push(v.originObj);
                        });
                        this.currentValue = currentValue;
                        if (this.isMultiple) {
                            options = this.convertToTree(options);
                            for (let index = 0; index < currentValue.length; index++) {
                                const value = currentValue[index];
                                // 加载选中品牌下面的所有车系
                                const { results: serials } = await this.$request(queryObj[1].url, { // eslint-disable-line
                                    params: queryObj[1].params({ data: value[0] }, { page_size: 0 }),
                                });
                                    // 加载选中车系下面的所有车型
                                const { results: models } = await this.$request(queryObj[2].url, { // eslint-disable-line
                                    params: queryObj[2].params({ data: value[1] }, { page_size: 0 }),
                                });
                                for (let i = 0; i < serials.length; i++) {
                                    const serial = serials[i];
                                    if (serial.id === value[1].id) {
                                        serial.children = models.map(({ id, name }) => ({ id, name, leaf: true }));
                                        break;
                                    }
                                }
                                options[index].children = serials;
                                if (options.length < 10) {
                                    // 分页加载品牌
                                    const { results: brands } = await this.$request(queryObj[0].url, { // eslint-disable-line
                                        params: queryObj[0].params(null, {
                                            page_size: 10,
                                        }),
                                    });
                                    options = options.concat(brands);
                                }
                            }
                            this.options = options;
                        }
                    }
                }
                this.showCascader = true;
            },
            immediate: true,
            deep: true,
        },
        currentValue(val) {
            this.$emit('input', val);
        },
    },
    mounted() {
    },
    methods: {
        async getCurrentValue(value) {
            if (value) {
                if (typeof value !== 'string') return value;
                const res = await this.$request(this.queryObj[this.level - 1].url, { params: this.queryObj[this.level - 1].params(null, { page_size: 1, search: value }) });
                if (res.results && res.results.length) {
                    const [obj] = res.results;
                    const temp = [
                        {
                            id: obj.brand_id,
                            name: obj.brand_name,
                        },
                        {
                            id: obj.serial_id,
                            name: obj.serial_name,
                        },
                        {
                            id: obj.id,
                            name: obj.name,
                        },
                    ];
                    return {
                        value: this.isMultiple ? [temp] : temp,
                        originObj: obj,
                    };
                }
                return value;
            }
            return null;
        },
        async search({
            keyWord, panel, getSuggestions,
        }) {
            panel.activePath = [];
            const { results } = await this.$request(this.queryObj[this.level - 1].url, { params: this.queryObj[this.level - 1].params(null, { page_size: 50, search: keyWord }) });
            const res = this.convertToTree(results);
            if (this.isMultiple) {
                this.options = this.options.concat(res);
            } else {
                this.options = res;
            }
            this.$nextTick(() => {
                getSuggestions();
            });
        },
        convertToTree(results) {
            const res = [];
            (results || []).forEach((item) => {
                let brandIndex = res.findIndex(v => v.id === item.brand_id);
                if (brandIndex < 0) {
                    res.push({
                        id: item.brand_id,
                        name: item.brand_name,
                        children: [],
                    });
                    brandIndex = 0;
                }
                let serialIndex = res[brandIndex].children.findIndex(v => v.id === item.serial_id);
                if (serialIndex < 0) {
                    res[brandIndex].children.push({
                        id: item.serial_id,
                        name: item.serial_name,
                        children: [],
                    });
                    serialIndex = 0;
                }
                res[brandIndex].children[serialIndex].children.push({
                    id: item.id,
                    name: item.name,
                    leaf: true,
                });
            });
            return res;
        },
    },
};
</script>
