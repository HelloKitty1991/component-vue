<template>
    <el-select
        v-model="currentValue"
        placeholder="请输入品牌"
        clearable
        :size="size"
        filterable
        multiple
        remote
        :remote-method="remoteMethod"
        :loading="loading"
    >
        <el-option
            v-for="item in brandsList"
            :key="item.id"
            :label="item.name"
            :value="item.name"
        >
        </el-option>
    </el-select>
</template>
<script>
export default {
    props: {
        size: {
            type: String,
            default: 'small',
        },
        value: {
            type: [String, Number, Array, Object],
            default: () => ({}),
        },
    },
    data() {
        return {
            loading: true,
            currentValue: this.value,
            brandsList: [],
            brandsId: [],
        };
    },
    created() {
        this.getBrands();
    },
    watch: {
        value(val) {
            this.currentValue = val;
        },
    },
    methods: {
        getBrands(query) {
            this.loading = true;
            window.request('/boom-rms/vehiclemodel/auto/brands', { params: { page_size: 10, search: query }, methods: 'GET' }).then((data) => {
                // console.log('data', data.results);
                if (data.results.length) {
                    this.brandsList = data.results;
                } else {
                    this.brandsList = [];
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
            // console.log('query', query);
            if (query !== '') {
                this.getBrands(query);
            } else {
                this.brandsList = [];
            }
        },
    },
};
</script>
<style lang="sass" scoped>

</style>
