<template>
    <div 
        class="k-tree"
        v-loading="loading"
        element-loading-text="玩命加载中"
    >
        <div class="search-container">
            <slot name="search-left">
            </slot>
            <el-input 
                v-if="showSearch"
                v-bind="searchInputAttrs"
                class="search-input"
                clearable
                v-model.trim="filterText"
                @keydown.enter.native="treeSearch"
            >
            </el-input>
            <el-button 
                v-if="showSearch"
                v-bind="searchButtonAttrs"
                class="search-btn"
                @click="treeSearch"
            >
                {{ buttonText }}
            </el-button>
            <slot name="search-right">
            </slot>
        </div>
        <div 
            class="tree-content" 
            :style="{height: `${treeHeight}px`,}"
            :class="[isScrollX ? 'scroll': 'scrollX']"
        >
            <el-tree
                v-bind="treeAttrs"
                v-events="treeEvents"
                :data="newTreeList"
                node-key="id"
                ref="tree"
                :default-expand-all="isExpand"
                :key="keys"
            >
                <template v-slot="{node, data}">
                    <slot 
                        v-bind="{node, data}"
                    >
                        {{ node.label }}
                    </slot>
                </template>
            </el-tree>
        </div>
    </div>
</template>
<script>
    import searchInTree from '@hello/utils/lib/searchInTree';
    import debounce from 'lodash/debounce';
    import cloneDeep from 'lodash/cloneDeep';
    import get from 'lodash/get';

    export default {
        name: 'Tree',
        props: {
            showSearch: {
                type: Boolean,
                default: true,
            },
            searchInputAttrs: {
                type: Object,
                default: () => ({}),
            },
            searchButtonAttrs: {
                type: Object,
                default: () => ({}),
            },
            buttonText: {
                type: String,
                default: '查询',
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
            // 接口传的数据
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
            treeEvents: {
                type: Object,
                default: () => ({}),
            },
            isScrollX: {
                type: Boolean,
                default: true,
            },
            // 选择器搜索内容
            searchKey: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                loading: false,
                // 截取次数 n+1次
                pageNum: 1,
                keys: 0,
                // 是否展开 默认不展开，搜索后展开
                isExpand: get(this.treeAttrs, 'default-expand-all') ? get(this.treeAttrs, 'default-expand-all') : false,
                filterText: '',
                // 展示的数据
                newTreeList: [],
                // 搜索返回的数据
                cutTreeList: [],
                searchProp: get(this.treeAttrs, 'props.label') ? get(this.treeAttrs, 'props.label') : 'label',
                childrenProp: get(this.treeAttrs, 'props.children') ? get(this.treeAttrs, 'props.children') : 'children',
                // 接口或url返回的所有数据
                treeList: [],
                treeEl: '',
            };
        },
        watch: {
            treeData: {
                handler(oldVal, newVal) {
                    if ((oldVal && oldVal.length) || (newVal && newVal.length)) {
                        this.changeTree();
                    }
                },
                immediate: true,
            },
            url: {
                handler(oldVal, newVal) {
                    if (oldVal || newVal) {
                        this.changeTree();
                    }
                },
                immediate: true,
            },
            searchKey(val) {
                if (!val) return;
                this.filterText = val;
                this.$nextTick(() => {
                    this.treeSearch();
                });
            },
        },
        mounted() {
            if (this.$refs.tree.showCheckbox) {
                this.newTreeList = [
                    {
                        ...this.treeList[0],
                    },
                ];
                return;
            }
            this.treeEl = document.querySelector('.tree-content');
            this.treeEl.addEventListener('scroll', debounce(() => {
                this.scrollTop();
            }, 250));
        },
        methods: {
            async changeTree() {
                this.pageNum = 1;
                this.keys = 0;
                this.filterText = '';
                if (this.url) {
                    this.loading = true;
                    await window.request(this.url).then(data => {
                        if (typeof data.code !== 'undefined') {
                            ({ data } = data);
                        }
                        let tempData = null;
                        if (!data.id) {
                            tempData = {
                                ...data,
                                id: 'ALL',
                            };
                        } else {
                            tempData = cloneDeep(data);
                        }
                        this.treeList = [
                            tempData,
                        ];
                    }) 
                        .catch((err) => {
                            throw new Error(err);
                        })
                        .finally(() => {
                            this.createdTree();
                            this.loading = false;
                        });
                } else {
                    this.treeList = cloneDeep(this.treeData);
                    this.$nextTick(() => {
                        this.createdTree();
                    });
                }
            },
            createdTree() {
                this.newTreeList = [];
                if (!this.treeList || this.treeList.length <= 0) return;
                this.cutTreeList = this.treeList;
                this.newTreeList = [
                    {
                        ...this.treeList[0],
                    },
                ];
                // length> 截取的数量
                if (!this.$refs.tree.showCheckbox && this.treeList && this.treeList.length > 0 && get(this.treeList, `[0].${this.childrenProp}`) && get(this.treeList, `[0].${this.childrenProp}`).length > this.pageSize) {
                    this.newTreeList[0][this.childrenProp] = get(this.treeList, `[0].${this.childrenProp}`).slice(0, this.pageSize);
                }
            },
            treeSearch() {
                const result = [];
                this.newTreeList = [];
                searchInTree(this.filterText, this.treeList, result, { searchProp: this.searchProp, childrenProp: this.childrenProp });
                this.treeEl.scrollTop = '0px';
                this.cutTreeList = result;
                this.isExpand = true;
                this.pageNum = 1;
                this.keys = this.pageNum + 1;
                if (!this.cutTreeList[0]) {
                    this.newTreeList = [];
                    return;
                }
                this.newTreeList = [
                    {
                        ...this.cutTreeList[0],
                    },
                ];
                if (!this.$refs.tree.showCheckbox && get(this.cutTreeList, `[0].${this.childrenProp}`) && get(this.cutTreeList, `[0].${this.childrenProp}`).length > this.pageSize) {
                    this.newTreeList[0][this.childrenProp] = get(this.cutTreeList, `[0].${this.childrenProp}`).slice(0, this.pageSize);
                }
            },
            scrollTop() {
                const { scrollHeight, clientHeight, scrollTop } = this.treeEl;
                if ((scrollTop + clientHeight + this.distance) < scrollHeight) return;
                this.cutTree();
            },
            // 组织树截取
            cutTree() {
                if (!this.cutTreeList[0]) {
                    this.newTreeList = [];
                    return;
                }
                // length <  截取的数量
                if (get(this.cutTreeList, `[0].${this.childrenProp}`) && get(this.cutTreeList, `[0].${this.childrenProp}`).length <= this.pageSize) {
                    this.newTreeList = [
                        {
                            ...this.cutTreeList[0],
                        },
                    ];
                    return;
                }
                // length < 最后一次截取的最大数
                if (get(this.cutTreeList, `[0].${this.childrenProp}`) && get(this.cutTreeList, `[0].${this.childrenProp}`).length < (this.pageNum + 1) * this.pageSize) {
                    get(this.newTreeList, `[0].${this.childrenProp}`).push(...get(this.cutTreeList, `[0].${this.childrenProp}`).slice(this.pageNum * this.pageSize, get(this.cutTreeList, `[0].${this.childrenProp}`).length));
                    this.pageNum++;
                    return;
                }
                get(this.newTreeList, `[0].${this.childrenProp}`).push(...get(this.cutTreeList, `[0].${this.childrenProp}`).slice(this.pageNum * this.pageSize, (this.pageNum + 1) * this.pageSize));
                this.pageNum++;
            },
            closeExpand() {
                this.$nextTick(() => {
                    // eslint-disable-next-line
                    for (let i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
                        // eslint-disable-next-line
                        this.$refs.tree.store._getAllNodes()[i].expanded = false;
                    }
                });
            },
        },
    };
</script>
<style lang="scss" scope>
    .k-tree{
        background-color:#fff;
        .search-container{
            display:flex;
            align-items: center;
            justify-content: flex-start;
            margin: 20px;
            .search-input{
                margin-right: 20px;
            }
        }
        .tree-content{
            width:100%;
        }
        .scrollX{
            overflow-x : hidden;
        }
        .scroll{
            overflow: auto;
        }
        .el-tree{
            min-width:100%;
            display:inline-block;
        }
        /* 滚动条样式 */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }
        ::-webkit-scrollbar-track {
            background-color: transparent;
            border-radius: 3px;
            &:hover {
                background-color: #EEEEEE;
            }
        }
        ::-webkit-scrollbar-thumb {
            width: 32px;
            height: 32px;
            background-color: #D0D0D0;
            border-radius: 3px;
            &:hover {
                background-color: #999999;
            } 
        }
        // 横向滚动条和纵向滚动条相交处尖角的颜色
        ::-webkit-scrollbar-corner {
            background-color: transparent;
        }
    }
</style>
