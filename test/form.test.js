/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import cloneDeep from 'lodash/cloneDeep';
import { expect } from 'chai';
import sinon from 'sinon';
import elementUI from 'element-ui';
import Form from '../src/components/Form/src/index.vue';
import directives from '../src/directive';
import formItems from './data/formitem.data';

const localVue = createLocalVue();
localVue.directive('events', directives.events);
localVue.use(elementUI);

const { log } = console;
// console.log = () => { };

const mountOptions = {
    localVue,
    stubs: {
        transition: false,
    },
};

describe('form test', () => {
    let wrapper;
    describe('form instance test', () => {
        it('form instance should not be empty', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.$refs.form).not.to.be.empty;
        });
        it('form instance has custom method', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            const { form } = wrapper.vm.$refs;
            expect(form).has.property('getFieldsValue').with.instanceOf(Function);
            expect(form).has.property('setFieldsValue').with.instanceOf(Function);
            expect(form).has.property('getFieldValue').with.instanceOf(Function);
        });
        it('form custom method test', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            const { form } = wrapper.vm.$refs;
            form.setFieldsValue({ name: 'peter', sex: 1 });
            expect(wrapper.vm.localFormData).have.property('sex').with.equals(1);
            expect(wrapper.vm.localFormData).have.property('name').with.equals('peter');
            let values = form.getFieldsValue();
            expect(values).have.property('sex').equals(1);
            values = form.getFieldsValue('name', 'sex');
            expect(values).have.property('name').equals('peter');
            const name = form.getFieldValue('name');
            expect(name).equals('peter');
            const sex = form.getFieldValue();
            expect(sex).to.be.undefined;
        });
    });
    describe('formItems prop test', () => {
        it('The default formItems is an object', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.formItems).instanceOf(Object);
        });
        it('assign the formItems prop', () => {
            wrapper = shallowMount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                },
            });
            expect(wrapper.vm.formItems).to.have.property('name').with.to.have.property('type').with.to.equals('input');
            expect(wrapper.vm.formItems).to.have.property('name').with.to.have.property('label').with.to.equals('姓名');
        });
    });
    describe('formData prop test', () => {
        it('The default formData is an object', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.formData).instanceOf(Object);
        });
        it('set field default value by formData', async () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                    formData: {
                        name: 'peter',
                    },
                },
            });
            expect(wrapper.vm.formData).to.have.property('name').with.equals('peter');
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.$refs.form.getFieldsValue()).to.have.property('name').with.equal('peter');
        });
        it('set field default value by formItems', async () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems: {
                        name: {
                            ...formItems.name,
                            value: 'defaultValue',
                        },
                        sex: {
                            type: 'radio',
                            label: '性别',
                        },
                    },
                    formData: {
                        name: 'override',
                    },
                },
            });
            await wrapper.vm.$nextTick();
            const values = wrapper.vm.$refs.form.getFieldsValue();
            expect(values).to.have.property('name').with.equals('defaultValue');
            expect(values).have.property('sex').is.undefined;
        });
        it('when the default value of the same field are exists both in formItems and formData, the formItems will override the formData', async () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems: {
                        name: {
                            ...formItems.name,
                            value: 'override',
                        },
                    },
                    formData: {
                        name: 'defaultValue',
                    },
                },
            });
            await wrapper.vm.$nextTick();
            const values = wrapper.vm.$refs.form.getFieldsValue();
            expect(values).to.have.property('name').with.equals('override');
        });
    });
    describe('columns prop test', () => {
        it('the default columns is 1', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.columns).equals(1);
        });
        it('assign the column prop to 4', async () => {
            wrapper = mount(Form, { 
                ...mountOptions,
                propsData: {
                    formItems,
                    columns: 4,
                },
            });
            expect(wrapper.vm.columns).equals(4);
            expect(wrapper.find('.el-col').classes('el-col-6')).to.be.true;
            wrapper = mount(Form, { 
                ...mountOptions,
                propsData: {
                    formItems,
                    columns: 5,
                },
            });
            expect(wrapper.find('.el-col').classes('el-col-5')).to.be.true;
        });
    });
    describe('labelInset prop test', () => {
        it('the default labelInset is false', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.labelInset).to.be.false;
        });
        it('assign the labelInset prop to true', () => {
            const setInputPaddingStub = sinon.stub();
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    labelInset: true,
                    formItems,
                },
                methods: {
                    setInputPadding: setInputPaddingStub,
                },
            });
            expect(wrapper.vm.labelInset).to.be.true;
            expect(wrapper.vm.labelPosition).equals('right');
            expect(setInputPaddingStub.calledOnce).to.be.true;
            expect(wrapper.find('.el-form-item').classes('label-inset')).to.be.true;
            expect(wrapper.find('.el-form-item').classes('label-top')).to.be.false;
        });
    });
    describe('gutter prop test', () => {
        it('the default gutter is 20', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.gutter).equal(20);
        });
        it('assign the gutter prop to 10', () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                    gutter: 10,
                },
            });
            expect(wrapper.vm.gutter).to.be.equals(10);
            expect(wrapper.find('.el-col').attributes('style')).contain('padding-left: 5px; padding-right: 5px;');
        });
    });
    describe('lineHeight prop test', () => {
        it('the default lineHeight is 50', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.lineHeight).to.be.equals(50);
        });

        it('assign lineHeight props to 45', () => {
            wrapper = mount(Form, { 
                ...mountOptions,
                propsData: {
                    formItems,
                    lineHeight: 45,
                },
            });
            expect(wrapper.vm.lineHeight).equals(45);
        });
    });
    describe('labelPosition test', () => {
        it('when the labelInset prop is false and the label-position of formAttrs is undefined, the labelPosition is should be right', () => {
            wrapper = shallowMount(Form, { ...mountOptions });
            expect(wrapper.vm.labelPosition).to.equals('right');
        });
        it('when the labelInset prop is false and the label-position of formAttrs is top, the labelPosition is should be top', () => {
            wrapper = shallowMount(Form, { 
                ...mountOptions,
                propsData: {
                    formAttrs: {
                        'label-position': 'top',
                    },
                },
            });
            expect(wrapper.vm.labelPosition).to.equals('top');
        });
        it('when the labelInset prop is true, the value should always be right', () => {
            wrapper = shallowMount(Form, {
                ...mountOptions,
                propsData: {
                    labelInset: true,
                },
            });
            expect(wrapper.vm.labelPosition).to.be.equal('right');
            wrapper = shallowMount(Form, {
                ...mountOptions,
                propsData: {
                    labelInset: true,
                    formAttrs: {
                        'label-position': 'top',
                    },
                },
            });
            expect(wrapper.vm.labelPosition).to.be.equal('right');
        });
    });
    describe('labelWidth test', () => {
        it('the default value of labelWidth is 100px', () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                },
            });
            expect(wrapper.vm.labelWidth).to.be.equals('100px');
            expect(wrapper.find('.el-form-item__label').attributes('style')).contain('width: 100px');
        });
        it('assign the labelWidth value to 150', () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                    formAttrs: {
                        'label-width': '150px',
                    },
                },
            });
            expect(wrapper.vm.labelWidth).to.equals('150px');
            expect(wrapper.find('.el-form-item__label').attributes('style')).contain('width: 150px');
        });
    });
    describe('rows test', () => {
        it('the rows should be 5', () => {
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems,
                    columns: 4,
                },
            });
            expect(wrapper.vm.rows.length).equals(3);
        });
        it('when the range field has custom span, the rows should be 4', () => {
            const temp = cloneDeep(formItems);
            temp.range.span = 12;
            wrapper = mount(Form, {
                ...mountOptions,
                propsData: {
                    formItems: temp,
                    columns: 4,
                },
            });
            expect(wrapper.vm.rows.length).equals(4);
        });
    });
});
