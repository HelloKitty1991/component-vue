/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { createLocalVue, mount, shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import elementUI from 'element-ui';
import SearchBar from '../src/components/SearchBar/src/index.vue';
import directives from '../src/directive';
import options from './data/searchbar.data';


const localVue = createLocalVue();
localVue.directive('events', directives.events);
localVue.use(elementUI);

const { log } = console;
console.log = () => { };

const mountOptions = {
    localVue,
    stubs: {
        transition: false,
    },
};

describe('Searchbar test cases', () => {
    let wrapper;
    describe('columns prop test', () => {
        it('default columns prop is 0', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.columns).equals(0);
        });
        it('assign columns props', () => {
            wrapper = shallowMount(SearchBar, { 
                ...mountOptions,
                propsData: {
                    columns: 4,
                },
            });
            expect(wrapper.vm.columns).to.be.equal(4);
            expect(wrapper.vm.span).to.be.equal(6);
            wrapper.setProps({ columns: 5 });
            expect(wrapper.vm.columns).to.be.equal(5);
            expect(wrapper.vm.span).to.be.equal(5);
        });
    });
    describe('lineHeight prop test', () => {
        it('default lineHeight prop is 45', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.lineHeight).equals(45);
        });
        it('assign lineHeight prop to 50', () => {
            wrapper = mount(SearchBar, { 
                ...mountOptions,
                propsData: {
                    options,
                    lineHeight: 50,
                },
            });
            expect(wrapper.vm.lineHeight).equals(50);
        });
    });
    describe('buttonNewLine prop test', () => {
        it('default buttonNewLine prop is false', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.buttonNewLine).to.be.equal(false);
        });
    });
    describe('options prop test', () => {
        it('default options prop is empty array', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.options).have.property('length').equals(0);
            expect(wrapper.vm.searchItems).have.property('length').equals(0);
        });
        it('assign option value', () => {
            wrapper = shallowMount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            expect(wrapper.vm.options).have.property('length').equals(11);
            expect(wrapper.vm.searchItems).have.property('length').equals(11);
        });
    });
    describe('buttonSize prop test', () => {
        it('default buttonSize prop is small', () => {
            wrapper = mount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.buttonSize).to.be.equals('small');
            expect(wrapper.find('button').classes('el-button--small')).to.be.true;
        });
        it('assign buttonSize prop to medium', async () => {
            wrapper = mount(SearchBar, { 
                ...mountOptions,
                propsData: {
                    buttonSize: 'medium',
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.find('button').classes('el-button--small')).to.be.false;
            expect(wrapper.find('button').classes('el-button--medium')).to.be.true;
        });
    });
    describe('buttonAlign prop test', () => {
        it('default buttonAlign prop is right', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.buttonAlign).to.be.equals('right');
        });
    });
    describe('setInitParams prop test', () => {
        it('no params called', () => {
            const setInitParamsStub = sinon.stub();
            wrapper = shallowMount(SearchBar, {
                propsData: {
                    setInitParams: setInitParamsStub,
                },
            });
            expect(setInitParamsStub.called).to.be.true;
        });
        it('set default value for some field via setInitParams method', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    setInitParams: done => {
                        done({
                            status: ['2'],
                        });
                    },
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.form.getFieldsValue()).has.property('status').deep.equals(['2']);
        });
        it('the default value will be override by the setInitParams default value when the option default field and setInitParams method are both exists', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    setInitParams: done => {
                        done({
                            status: ['3'],
                        });
                    },
                },
            });
            await wrapper.vm.$nextTick();
            const values = wrapper.vm.form.getFieldsValue();
            expect(values).to.have.property('status').deep.equals(['3']);
        });
    });
    describe('labelInset prop test', () => {
        it('default labelInset prop is false', () => {
            wrapper = mount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.labelInset).to.be.false;
        });
        it('when the labelInset is true, the labelPosition is right', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    labelInset: true,
                },
            });
            expect(wrapper.vm.labelInset).to.be.true;
            expect(wrapper.vm.form.labelPosition).to.be.equal('right');
            expect(wrapper.find('.k-form').classes('el-form--label-right')).to.be.true;
            expect(wrapper.find('.el-form-item').classes('label-inset')).to.be.true;
        });
    });
    describe('buttons prop test', () => {
        it('the default buttons is ["reset", "search"]', () => {
            wrapper = shallowMount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.buttons).to.be.deep.equals(['reset', 'search']);
        });
        it('the buttons only contain search button', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    buttons: ['search'],
                },
            });
            expect(wrapper.vm.buttons).to.be.deep.equals(['search']);
            expect(wrapper.findAll('button')).to.have.lengthOf(1);
            expect(wrapper.find('button').html()).to.contain('查询');
        });
        it('the buttons only contain reset button', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    buttons: ['reset'],
                },
            });
            expect(wrapper.vm.buttons).to.be.deep.equals(['reset']);
            expect(wrapper.findAll('button')).to.have.lengthOf(1);
            expect(wrapper.find('button').html()).to.contain('重置');
        });
    });
    // describe('style test', () => {
    //     it('the el-row should be shown with block instead of flex', () => {
    //         wrapper = mount(SearchBar, {
    //             ...mountOptions,
    //             propsData: {
    //                 options,
    //             },
    //         });
    //         expect(window.getComputedStyle(wrapper.find('.el-row').element).getPropertyValue('display')).to.be.equals('flex');
    //     });
    // });
    describe('url test', () => {
        it('the loadOptions will be called when the url prop is not empty', () => {
            const loadOptionsStub = sinon.stub();
            wrapper = shallowMount(SearchBar, {
                methods: {
                    loadOptions: loadOptionsStub,
                },
                propsData: {
                    url: '/abc/',
                },
            });
            expect(loadOptionsStub.called).to.be.true;
        });
    });
    describe('form instance test', () => {
        it('the form instance as a prop of Searchbar Component should not be empty', () => {
            const createFormStub = sinon.stub();
            wrapper = mount(SearchBar, {
                ...mountOptions,
                methods: {
                    createForm: createFormStub,
                },
            });
            expect(createFormStub.called).to.be.true;
            wrapper = mount(SearchBar, { ...mountOptions });
            expect(wrapper.vm.form).not.to.be.undefined;
            expect(wrapper.vm.form.getFieldsValue).instanceOf(Function);
            expect(wrapper.vm.form.getFieldsValue()).to.have.property('button');
        });
    });
    describe('default value test', () => {
        it('set default value by default field of options', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            await wrapper.vm.$nextTick();
            const values = wrapper.vm.form.getFieldsValue();
            expect(values).have.property('status').deep.equals(['1']);
            expect(values).have.property('amount').deep.equals([5, 6]);
        });
    });
    describe('mounted test', () => {
        it('the search event will be emitted when the component mounted', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().search.length).equals(1);
            expect(wrapper.emitted().search[0][0]).have.property('status').deep.equals(['1']);
            expect(wrapper.emitted().search[0][0]).have.property('amount').deep.equals([5, 6]);
        });
    });
    describe('this.maxItems test', () => {
        [
            {
                value: true,
                expect: 6,
            },
            {
                value: false,
                expect: 5,
            },
        ].forEach(buttonNewLine => {
            it(`this.buttonNewLine=${buttonNewLine.value}`, () => {
                wrapper = shallowMount(SearchBar, { propsData: { options, columns: 4, buttonNewLine: buttonNewLine.value } });
                expect(wrapper.vm.maxItems).to.be.equal(buttonNewLine.expect);
            });
        });
    });
    describe('this.spanCount test', () => {
        [
            {
                value: true,
                expect: 48,
            },
            {
                value: false,
                expect: 36,
            },
        ].forEach(buttonNewLine => {
            it(`this.buttonNewLine=${buttonNewLine.value}`, () => {
                wrapper = shallowMount(SearchBar, { propsData: { options, columns: 4, buttonNewLine: buttonNewLine.value } });
                expect(wrapper.vm.spanCount(wrapper.vm.searchItems.slice(0, wrapper.vm.maxItems))).to.be.equal(buttonNewLine.expect);
            });
        });
    });
    describe('this.buttonSpan test', () => {
        [
            {
                value: true,
                expect: 24,
            },
            {
                value: false,
                expect: 12,
            },
        ].forEach(buttonNewLine => {
            it(`this.buttonNewLine=${buttonNewLine.value}`, () => {
                wrapper = shallowMount(SearchBar, { propsData: { options, columns: 4, buttonNewLine: buttonNewLine.value } });
                expect(wrapper.vm.buttonSpan).to.be.equal(buttonNewLine.expect);
            });
        });
    });
    describe('this.avaliableSearchItems test', () => {
        [
            {
                value: true,
                buttonPositionExpect: 11,
                buttonCountExpect: 1,
            },
            {
                value: false,
                buttonPositionExpect: 5,
                buttonCountExpect: 1,
            },
        ].forEach(expand => {
            it(`this.expand=${expand.value}`, () => {
                wrapper = shallowMount(SearchBar, { propsData: { options, columns: 4, expand: expand.value } });
                expect(wrapper.vm.avaliableSearchItems.findIndex(v => v.field === 'button')).to.be.equal(expand.buttonPositionExpect);
                expect(wrapper.vm.avaliableSearchItems.filter(v => v.field === 'button')).to.have.lengthOf(expand.buttonCountExpect);
            });
        });

        it('the avaliableSearchItems should be deeped clone from searchItems', () => {
            wrapper = shallowMount(SearchBar, {
                propsData: {
                    options,
                },
            });
            expect(wrapper.vm.searchItems).to.have.lengthOf(11);
            expect(wrapper.vm.avaliableSearchItems).to.have.lengthOf(12);
            expect(wrapper.vm.searchItems.filter(v => v.field === 'button')).to.have.lengthOf(0);
            expect(wrapper.vm.avaliableSearchItems.filter(v => v.field === 'button')).to.have.lengthOf(1);
        });
        it('the visible of item which the index is lager than the maxItems prop should be false', () => {
            [
                {
                    value: true,
                },
                {
                    value: false,
                },
            ].forEach(buttonNewLine => {
                wrapper = shallowMount(SearchBar, {
                    ...mountOptions,
                    propsData: {
                        options,
                        columns: 4,
                        buttonNewLine: buttonNewLine.value,
                    },
                });
                wrapper.vm.avaliableSearchItems.slice(wrapper.vm.maxItems).forEach(v => {
                    if (v.field === 'button') return;
                    expect(v).have.deep.property('visible').to.be.false;
                });
            });
        });
        it('when the expand is true, all items in availableSearchItems are visible', () => {
            wrapper = shallowMount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    columns: 4,
                    expand: true,
                },
            });
            wrapper.vm.avaliableSearchItems.forEach(v => {
                if (v.field === 'button') return;
                expect(v.visible).oneOf([true, undefined]);
            });
        });
    });
    describe('this.showToggleBtn test', () => {
        it('the toggle button should be shown when the spanCount is larger than 48', () => {
            wrapper = shallowMount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    columns: 6,
                    buttonNewLine: true,
                },
            });
            expect(wrapper.vm.spanCount(wrapper.vm.searchItems)).above(48);
            expect(wrapper.vm.showToggleBtn).to.be.true;
            wrapper.setProps({ columns: 4 });
            expect(wrapper.vm.showToggleBtn).to.be.true;
        });
        it('the toggle button should not be shown when the spanCount is less than 48', () => {
            wrapper = shallowMount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: options.slice(0, 2),
                    columns: 4,
                    buttonNewLine: true,
                },
            });
            expect(wrapper.vm.spanCount(wrapper.vm.searchItems)).below(48);
            expect(wrapper.vm.showToggleBtn).to.be.false;
            wrapper.setProps({ columns: 1 });
            expect(wrapper.vm.showToggleBtn).to.be.false;
        });
    });
    describe('click search button test', () => {
        it('when click the search button after mounted, the submitForm methods will be called', () => {
            const submitFormStub = sinon.stub();
            wrapper = mount(SearchBar, {
                ...mountOptions,
                methods: {
                    submitForm: submitFormStub,
                },
                propsData: {
                    options,
                },
            });
            wrapper.find('button.el-button--primary').trigger('click');
            expect(submitFormStub.calledOnce).to.be.true;
        });
        it('when click the search button after mounted, the search events will be emitted', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            wrapper.find('button.el-button--primary').trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).to.be.equals(1);
            expect(searchEmit[0][0]).have.property('status').deep.equals(['1']);
        });
    });
    describe('click reset button test', () => {
        it('when click reset button, the field value will be restored to default value and the reset event will be emitd', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'select',
                            field: 'status',
                            options: [
                                {
                                    value: 1,
                                    label: 1,
                                },
                                {
                                    value: 2,
                                    label: 2,
                                },
                            ],
                            default: 1,
                        },
                    ],
                },
            });
            const { form } = wrapper.vm;
            form.setFieldsValue({ status: 2 });
            expect(form.getFieldsValue()).have.property('status').deep.equals(2);
            const btn = wrapper.find('button.el-button--default');
            btn.trigger('click');
            await wrapper.vm.$nextTick();
            expect(form.getFieldsValue()).have.property('status').deep.equals(1);
            expect(wrapper.emitted().reset.length).equals(1);
            expect(wrapper.emitted().search.length).equals(2);
        });
        it('when the field is hidden, the reset operate should be valid', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    expand: true,
                },
            });
            const { form } = wrapper.vm;
            form.setFieldsValue({ text2: 'text2' });
            expect(form.getFieldsValue()).have.property('text2').equals('text2');
            let btn = wrapper.find('.toggle');
            btn.trigger('click');
            expect(wrapper.vm.currentExpand).to.be.false;
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.field-col-text2').attributes('style')).contains('display: none');
            btn = wrapper.find('button.el-button--default');
            btn.trigger('click');
            await wrapper.vm.$nextTick();
            expect(form.getFieldsValue()).have.property('text2').to.be.undefined;
        });
    });
    describe('the prefix test for range field', () => {
        it('the default prefix for range field is begin and end', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('beginamount').with.equals(5);
            expect(searchEmit[0][0]).have.property('endamount').with.equals(6);
        });
        it('assing the prefix for range field', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            wrapper.vm.form.setFieldsValue({
                range: [new Date('2020-06-12'), new Date('2020-06-15')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('start').equals('2020-06-12 08:00:00');
            expect(searchEmit[0][0]).have.property('end').equals('2020-06-15 08:00:00');
        });
        it('assing the suffix for daterange1 field, type is daterange', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'daterange',
                            field: 'daterange1',
                            attrs: {
                                format: 'yyyy-MM-dd HH:mm:ss',
                            },
                        },
                    ],
                },
            });
            wrapper.vm.form.setFieldsValue({
                daterange1: [new Date('2020-06-12'), new Date('2020-06-15')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begindaterange1').equals('2020-06-12 08:00:00');
            expect(searchEmit[0][0]).have.property('enddaterange1').equals('2020-06-15 08:00:00');
        });
        it('assing the suffix for daterange field, type is date_range', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'date_range',
                            field: 'daterange',
                        },
                    ],
                },
            });
            wrapper.vm.form.setFieldsValue({
                daterange: [new Date('2020-06-12'), new Date('2020-06-15')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begindaterange').equals('2020-06-12 08:00:00');
            expect(searchEmit[0][0]).have.property('enddaterange').equals('2020-06-15 08:00:00');
        });
        it('assing the suffix for defaultRange field, type is date_range with startFieldName and endFieldName', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'daterange',
                            label: '日期区间',
                            field: 'defaultRange',
                            spanTimes: 1,
                            startFieldName: 'start',
                            endFieldName: 'end',
                            attrs: {
                                placeholder: '请输入',
                            },
                        },
                    ],
                },
            });
            wrapper.vm.form.setFieldsValue({
                defaultRange: [new Date('2020-06-12'), new Date('2020-06-15')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('start').equals('2020-06-12 08:00:00');
            expect(searchEmit[0][0]).have.property('end').equals('2020-06-15 08:00:00');
        });
    });
    describe('daterange format test', () => {
        it('the default format of DateRange component is yyyy-MM-dd HH:mm:ss', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'date_range',
                            field: 'testField',
                        },
                    ],
                },
            });
            wrapper.vm.form.setFieldsValue({
                testField: [new Date('2020-02-02')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begintestField').equals('2020-02-02 08:00:00');
        });
        it('assign format of DateRange component to yyyy/MM/dd', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'date_range',
                            field: 'testField',
                            attrs: {
                                format: 'yyyy/MM/dd',
                            },
                        },
                    ],
                },
            });
            wrapper.vm.form.setFieldsValue({
                testField: [new Date('2020-02-02')],
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begintestField').equals('2020/02/02');
        });
    });
    describe('click expand test', () => {
        it('the default expand is false', () => {
            wrapper = shallowMount(SearchBar);
            expect(wrapper.vm.expand).to.be.false;
        });
        it('the expand should change to true after click the toggle button', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                },
            });
            expect(wrapper.vm.currentExpand).to.be.false;
            const btn = wrapper.find('.toggle');
            btn.trigger('click');
            expect(wrapper.vm.currentExpand).to.be.true;
        });
    });
    describe('missing the startTime or endTime test', () => {
        it('missing the startTime, the fist value of field is null', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'date_range',
                            field: 'daterange',
                            default: [null, new Date('2020-02-09')],
                        },
                    ],
                },
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begindaterange').is.null;
            expect(searchEmit[0][0]).have.property('enddaterange').equals('2020-02-09 08:00:00');
        });
        it('missing the endTime, the last value of field is null', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [
                        {
                            type: 'date_range',
                            field: 'daterange',
                            default: [new Date('2020-02-09'), null],
                        },
                    ],
                },
            });
            const btn = wrapper.find('button.el-button--primary');
            btn.trigger('click');
            const searchEmit = wrapper.emitted().search;
            expect(searchEmit.length).equals(1);
            expect(searchEmit[0][0]).have.property('begindaterange').equals('2020-02-09 08:00:00');
            expect(searchEmit[0][0]).have.property('enddaterange').is.null;
        });
    });
    describe('the rows test', () => {
        it('the rows should be 4', () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options,
                    columns: 4,
                },
            });
            expect(wrapper.vm.rows.length).equal(4);
        });
    });
    describe('the select filterable and multiple', () => {
        it('the input second child should be have attrs padding-left', async () => {
            wrapper = mount(SearchBar, {
                ...mountOptions,
                propsData: {
                    options: [{
                        type: 'select',
                        label: '店铺名称',
                        field: 'orgList',
                        spanTimes: 1,
                        attrs: {
                            placeholder: '请选择',
                            clearable: true,
                            filterable: true,
                            multiple: true,
                            'collapse-tags': true,
                        },
                        options: [
                            {
                                label: '成都路行通信息技术有限公司',
                                value: 'PARTICIPANT',
                            },
                            {
                                label: '成都路行通信息技术有限公司4S店',
                                value: 'ORDINARY',
                            },
                            {
                                label: '成都路行通信息技术有限公司4S店综合示范店',
                                value: 'ALL',
                            },
                            {
                                label: '安徽统一',
                                value: 'ALL1',
                            },
                        ],
                    }],
                    labelInset: true,
                },
            });
            
            await wrapper.vm.$nextTick();
            expect(wrapper.find('.field-orgList .el-input input').attributes('style')).contain('padding-left');
        });
    });
    describe('the search type test', () => {
         // TODO
         // it('the custom search method will be called', () => {
         //     wrapper = mount(SearchBar, {
         //         ...mountOptions,
         //         propsData: {
         //             options: [
         //                 {
         //                     type: 'search',
         //                     field: 'test',
         //                     search() {
         //
         //                     },
         //                 },
         //             ],
         //         },
         //     });
         // });
    });
});
