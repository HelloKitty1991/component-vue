/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import elementUI from 'element-ui';
import TextItem from '../src/components/TextItem/src/index.vue';
import textData from './data/textitem.data';


const localVue = createLocalVue();
localVue.use(elementUI);

const { log } = console;
console.log = () => { };

describe('TextItem component test cases', () => {
    let wrapper;
    [
        {
            prop: 'wrap',
            defaultValue: false,
            assignValue: true,
        },
        {
            prop: 'gutter',
            defaultValue: 5,
            assignValue: 10,
        },
        {
            prop: 'labelWidth',
            defaultValue: 85,
            assignValue: 100,
        },
        {
            prop: 'columns',
            defaultValue: 4,
            assignValue: 6,
        },
        {
            prop: 'textData',
            defaultValue: [],
            assignValue: textData,
        },
        {
            prop: 'margin',
            defaultValue: 10,
            assignValue: 15,
        },
    ].forEach(obj => {
        describe(`${obj.prop} prop test`, () => {
            it(`the default value of ${obj.prop} prop is ${obj.defaultValue}`, () => {
                wrapper = shallowMount(TextItem, { localVue });
                expect(wrapper.vm[obj.prop]).deep.equal(obj.defaultValue);
            });
            it(`assign the ${obj.prop} value`, () => {
                wrapper = shallowMount(TextItem, {
                    localVue,
                    propsData: {
                        [obj.prop]: obj.assignValue,
                    },
                });
                expect(wrapper.vm[obj.prop]).deep.equals(obj.assignValue);
            });
        });
    });
    describe('currentData test', () => {
        it('the currentData should be created by textData which has filtered the falsely data', () => {
            wrapper = shallowMount(TextItem, {
                localVue,
                propsData: {
                    textData,
                },
            });
            expect(wrapper.vm.currentData).deep.equals(textData.filter(v => !!v));
        });
    });
    describe('showTooltip test', () => {
        it('the showTooltip should be an array and the length is 4', async () => {
            wrapper = mount(TextItem, {
                localVue,
                propsData: {
                    textData,
                },
            });
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.showTooltip).instanceOf(Array)
                .lengthOf(4);
        });
    });
    describe('textData wrap prop test', () => {
        it('the default wrap option of textData is undefined', () => {
            
        });
    });
});
