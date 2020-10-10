<template>
    <fieldset>
        <legend>大数据标签设计</legend>
        <TagEdit
            :cascaderAttrs="cascaderAttrs"
            v-model="editTags"
            ref="tagEdit"
            @ruleDialog="ruleDialog"
            :canAddTag="canAddTag"
            :canDeleteTag="canDeleteTag"
            :url="url"
            :ruleUrl="ruleUrl"
        />
        <el-button @click="clickView">
            查看
        </el-button>
        <el-button @click="editTagsClick">
            editTags
        </el-button>
        <el-button @click="modelTypeClick">
            modelType
        </el-button>
        <el-button @click="handelSubmit">
            提交
        </el-button>
    </fieldset>
</template>

<script>
import TagEdit from '../components/TagEdit';

export default {
    components: {
        TagEdit,
    },
    data() {
        return {
            url: '/api/saas/tags/rule-tree',
            ruleUrl: '/api/saas/tags/rule-result',
            editTags: [],
            canAddTag: true,
            canDeleteTag: true,
            cascaderAttrs: {
                props: {
                    label: 'name',
                    value: 'id',
                    children: 'child',
                },
            },
        };
    },
    methods: {
        ruleDialog(val) {
            this.showConfirm('error', val.result.message, '校验结果');
        },
        clickView() {
            this.canAddTag = false;
            this.canDeleteTag = false;
            this.editTags = [
                {
                    dimensionId: 26,
                    orgId: null,
                    compare: '>=',
                    compareType: '>=',
                    condition: '1',
                    operate: '',
                    dataType: 'data',
                    tagRuleDisabled: {
                        name: true,
                        relation: true,
                        value: true,
                    },
                },
                {
                    dimensionId: 3,
                    compare: '=',
                    condition: ['2020-04-15T16:00:00.000Z', '2020-05-09T16:00:00.000Z'],
                    operate: '',
                    dataType: 'data',
                    compareType: 'between',
                },
            ];
        },
        editTagsClick() {
            this.canAddTag = true;
            this.canDeleteTag = true;
            /* this.editTags = [
                    {
                        dimensionId: 1,
                        compare: '=',
                        condition: {
                            value: '女',
                            label: '女',
                        },
                        operate: '',
                        dataType: 'data',
                        compareType: '=',
                        tagRuleDisabled: {
                            name: true, // 维度
                            relation: true, // 关系
                            value: true, // 数据取值
                        },
                    },
                    {
                        dimensionId: 1,
                        compare: '=',
                        condition: {
                            value: '男',
                            label: '男',
                        },
                        operate: '',
                        dataType: 'data',
                        compareType: '=',
                        tagRuleDisabled: {
                            name: true,
                            relation: true,
                            value: false,
                        },
                    },
                ]; */
            this.editTags = [
                {
                    dimensionId: 90,
                    condition: 0.5,
                    compareType: '<',
                    dataType: 'data',
                    operate: '',
                    compare: '<',
                    unit: '年',
                },
                {
                    compare: '=',
                    compareType: 'brands',
                    condition: ['Donkervoort'],
                    dataType: 'data',
                    dimensionId: 6,
                    operate: '',
                    unit: '',
                },
            ];
        },
        modelTypeClick() {
            this.canAddTag = false;
            this.canDeleteTag = false;
            window.request('/api/saas/tags/model/90', { method: 'GET' }).then((data) => {
                this.editTags = JSON.parse(data[1].expression) || [];
            });
        },
        async handelSubmit() {
            // const { isPass, tagRule, descContent } = await this.$refs.tagEdit.staticValidate();
            // console.log('handelSubmit', isPass, tagRule, descContent);
        },
    },
};
</script>

<style>

</style>
