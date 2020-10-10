/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import elementUI from 'element-ui';
import DateRange from '../src/components/DateRange/src/index.vue';
import directives from '../src/directive';

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

describe('daterange test', () => {
    let wrapper;
    describe('prop test', () => {
        describe('options prop test', () => {
            it('the default value of options prop is empty object', () => {
                wrapper = shallowMount(DateRange, { ...mountOptions });
                expect(wrapper.vm.options).deep.equal({});
            });
        });
        describe('value prop test', () => {
            it('when the value is not empty , the clear btn should be shown when hover', async () => {
                 wrapper = mount(DateRange, {
                     ...mountOptions,
                     propsData: {
                         value: [new Date()],
                     },
                 });
                 wrapper.find('.date-range').trigger('mouseover');
                 await wrapper.vm.$nextTick();
                 expect(wrapper.find('.el-icon-circle-close').isVisible()).to.be.true;
            });
        });
    });
    describe('format test', () => {
        it('the default format is yyyy-MM-dd HH:mm:ss', () => {
            wrapper = shallowMount(DateRange, { ...mountOptions });
            expect(wrapper.vm.format).equal('yyyy-MM-dd HH:mm:ss');
        });
        it('the format can change by options prop', () => {
            wrapper = shallowMount(DateRange, {
                ...mountOptions,
                propsData: {
                    options: {
                        attrs: {
                            format: 'yyyy-MM-dd',
                        },
                    },
                },
            });
            expect(wrapper.vm.format).equal('yyyy-MM-dd');
        });
    });
    describe('placeholder test', () => {
        it('the default value of start placeholder is 开始时间 and end placeholder is 结束时间', () => {
            wrapper = shallowMount(DateRange, { ...mountOptions });
            expect(wrapper.vm.startPlaceholder).equal('开始时间');
            expect(wrapper.vm.endPlaceholder).equal('结束时间');
        });
        it('you can assign a placeholder by options.attrs', () => {
            wrapper = shallowMount(DateRange, {
                ...mountOptions,
                propsData: {
                    options: {
                        attrs: {
                            placeholder: 'select time',
                        },
                    },
                },
            });
            expect(wrapper.vm.startPlaceholder).equal('select time');
            expect(wrapper.vm.endPlaceholder).equal('select time');
        });
        it('when the options.attrs.placeholder and options.startAttrs.placeholder are exists both, the options.attrs.placeholder will be override', () => {
            wrapper = shallowMount(DateRange, {
                ...mountOptions,
                propsData: {
                    options: {
                        attrs: {
                            placeholder: 'select time',
                        },
                        startAttrs: {
                            placeholder: 'select date',
                        },
                    },
                },
            });
            expect(wrapper.vm.startPlaceholder).equal('select date');
            expect(wrapper.vm.endPlaceholder).equal('select time');
        });
    });
});
