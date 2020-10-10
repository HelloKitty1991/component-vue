<template>
    <el-select
        popper-class="select-tree"
        v-model="selectValue"
        filterable
        :filter-method="filterMethod"
        clearable
        @visible-change="visibleChange($event)"
    >
        <el-option
            v-show="ShowSelect" 
            :value="statusValue"
            style="height: auto"
        >
            <Tree
                :showSearch="showSearch"
                :treeData="treeData"
                :treeAttrs="treeAttrs"
                :treeEvents="treeEvents"
                :searchKey="searchKey"
                :url="url"
                ref="tree"
                :isScrollX="isScrollX"
                :pageSize="pageSize"
                :treeHeight="treeHeight"
            />
        </el-option>
    </el-select>
</template>
<script>
    import Tree from '../../Tree';

    export default {
        name: 'SelectTree',
        components: {
            Tree,
        },
        props: {
            // 接口返回的数据
            treeData: {
                type: Array,
                default: () => ([]),
            },
            // url
            url: {
                type: String,
                default: '',
            },
            treeAttrs: {
                type: Object,
                default: () => ({}),
            },
            selectTreeEvents: {
                type: Object,
                default: () => ({}),
            },
            treeHeight: {
                type: Number,
                default: 656,
            },
            // 截取的数量
            pageSize: {
                type: Number,
                default: 50,
            },
            // 距离底部多远开始展示下一次的数据
            distance: {
                type: Number,
                default: 50,
            },
            isScrollX: {
                type: Boolean,
                default: true,
            },
        },
        data() {
            return {
                ShowSelect: true,
                selectValue: '',
                statusValue: [],
                showSearch: false,
                searchKey: '',
                treeEvents: {
                    ...this.selectTreeEvents,
                    'node-click': value => {
                        const node = this.getNode(value);
                        if (typeof this.selectTreeEvents['node-click'] === 'function') {
                            this.selectTreeEvents['node-click'](node);
                        }
                    },
                },
            };
        },
        watch: {
            selectValue(val) {
                // this.ShowSelect = false;
                if (!val) {
                    this.$emit('getValue', val);
                }
            },
        },
        methods: {
            filterMethod(value) {
                this.ShowSelect = true;
                this.searchKey = value;
            },
            getNode(value) {
                this.labelProp = this.treeAttrs && this.treeAttrs.props && this.treeAttrs.props.label ? this.treeAttrs.props.label : 'label';
                this.childrenProp = this.treeAttrs && this.treeAttrs.props && this.treeAttrs.props.children ? this.treeAttrs.props.children : 'children';
                this.selectValue = value[this.labelProp];
                this.statusValue = [value[this.labelProp]];
                this.$emit('getValue', value);
                if (!value[this.childrenProp] || value[this.childrenProp].length === 0) {
                    this.ShowSelect = false;
                }
                return value;
            },
            visibleChange(event) {
                this.ShowSelect = event;
            },
        },
    };
</script>
<style lang="scss">
    .select-tree{
        .el-select-dropdown__item {
            padding: 0;
        }
        .el-select-dropdown__list{
            margin-top: -40px;
        }
    }
</style>
