
<template>
    <fieldset style="background: #EEF2F8">
        <legend>searchbar测试</legend>
        <div style="background-color: white; padding: 20px 20px 0px 20px;">
            <SearchBar
                :options="searchOptions"
                :formAttrs="formAttrs"
                :labelInset="true"
                :buttonAlign="'right'"
                :buttonSize="'small'"
                :buttonNewLine="false"
                :expand="true"
                @search="search"
                :columns="4"
                @getFormInstance="form => this.form = form"
            />
        </div>
    </fieldset>
</template>

<script>

import SearchBar from '../components/SearchBar';

import data from '../../test/data/searchbar.data';

export default {
    components: {
        SearchBar,
    },
    data() {
        return {
            formAttrs: {
                'label-width': '150px',
            },
            searchOptions: data.concat([
                {
                    type: 'api_search',
                    field: 'aes',
                    label: '搜索',
                    searchKey: 'orgName',
                    url: '/api/admin/organization/list/org',
                    labelField: 'name',
                    valueField: 'id',
                    search() {
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                resolve([
                                    {
                                        label: 'a',
                                        value: 'a',
                                    },
                                    {
                                        label: 'b',
                                        value: 'b',
                                    },
                                ]);
                            }, 1000);
                        });
                    },
                },
                {
                    type: 'select',
                    field: 'ac',
                    label: '选择',
                    options: [
                        {
                            value: 1,
                            label: 'abcdefg',
                        },
                        {
                            value: 2,
                            label: '33333',
                        },
                    ],
                    events: {
                        change(e) {
                            console.log(e);
                        },
                    },
                },
            ]),
        };
    },
    mounted() {
        this.form.setFieldsValue({
        });
    },
    methods: {
        search(params) {
            console.log('emit search params: ', params);
        },
    },
};
</script>

<style>

</style>
