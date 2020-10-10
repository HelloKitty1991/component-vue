<template>
    <el-select
        :size="size"
        v-model="selectData"
        class="select-tree"
        :value-key="'value'"
        :popper-append-to-body="false"
        filterable
        :filter-method="debounce(search, 500)"
    >
        <el-option value="">
            <div>
                <el-tree
                    :data="currentData"
                    :props="defaultProps"
                    @node-click="handleNodeClick"
                    default-expand-all
                ></el-tree>
            </div>
        </el-option>
        <el-option
            v-for="(obj, index) in values"
            :key="index"
            :label="obj.label"
            :value="obj"
            class="hidden-option"
        />
    </el-select>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

let filterTreeData = [];

export default {
    props: {
        url: {
            type: String,
            default: '',
        },
        treeData: {
            type: Array,
            default: () => [{
                label: '一级 1',
                children: [{
                    label: '二级 1-1',
                    children: [{
                        label: '三级 1-1-1',
                        value: '1',
                    }],
                }],
            }, {
                label: '一级 2',
                children: [{
                    label: '二级 2-1',
                    children: [{
                        label: '三级 2-1-1',
                        value: 2,
                    }],
                }, {
                    label: '二级 2-2',
                    children: [{
                        label: '三级 2-2-1',
                        value: 3,
                    }],
                }],
            }, {
                label: '一级 3',
                children: [{
                    label: '二级 3-1',
                    children: [{
                        label: '三级 3-1-1',
                        value: 4,
                    }],
                }, {
                    label: '二级 3-2',
                    children: [{
                        label: '三级 3-2-1',
                        value: 5,
                    }],
                }],
            }],
        },
        size: {
            type: String,
            default: 'small',
        },
        value: {
            type: Object,
            default: () => ({}),
        },
    },
    data() {
        const treeData = cloneDeep(this.treeData);
        return {
            originTreeData: treeData,
            selectData: this.value,
            defaultProps: {
                children: 'children',
                label: 'label',
            },
            debounce,
            currentData: treeData,
            values: [this.value],
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
                this.treeData = res;
            })
                .catch((err) => {
                    this.showErrorMsg(err.message);
                });
        }
    },
    watch: {
        selectData(val) {
            this.$emit('input', val);
        },
        value(val) {
            // console.log(val);
            this.selectData = val;
        },
    },
    methods: {
        handleNodeClick(data) {
            if (data.children && data.children.length) {
                return;
            }
            this.values = [data];
            this.$nextTick(() => {
                this.selectData = data;
            });
        },
        search(searchKey) {
            const temp = cloneDeep(this.originTreeData);
            filterTreeData = [];
            this.findInTree(searchKey, temp, filterTreeData);
            this.currentData = filterTreeData;
        },
        findInTree(searchKey, treeData, arr) {
            let exists = false;
            this.searchKey = searchKey;
            treeData.forEach((item) => {
                if (item.label.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0) {
                    arr.push(item);
                    exists = true;
                } else if (item.children && item.children.length) {
                    const temp = {};
                    // for (const key of Object.keys(item)) {
                    //     if (key !== 'children') {
                    //         temp[key] = item[key];
                    //     }
                    // }
                    Object.keys(item).forEach((key) => {
                        if (key !== 'children') {
                            temp[key] = item[key];
                        }
                    });
                    temp.children = [];
                    arr.push(temp);
                    const result = this.findInTree(searchKey, item.children, temp.children);
                    if (!result) {
                        arr.pop();
                    } else {
                        exists = true;
                    }
                }
            });
            return exists;
        },
    },
};
</script>

<style lang="scss">
    .select-tree {
        .el-select-dropdown__item {
            height: auto;

            &.hidden-option {
                display: none;
            }
        }
    }
</style>
