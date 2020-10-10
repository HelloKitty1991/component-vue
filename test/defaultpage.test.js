/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { shallowMount, createLocalVue } from '@vue/test-utils';
import { expect } from 'chai';
import elementUI from 'element-ui';
import EmptyPage from '../src/components/EmptyPage';


const localVue = createLocalVue();
localVue.use(elementUI);

describe('EmptyPage test', () => {
    let wrapper;
    [{
        prop: 'text',
        defaultValue: '暂无数据',
        assignValue: '快去领取任务吧',
    }, {
        prop: 'icon',
        defaultValue: 'search',
        assignValue: 'add',
    }, {
        prop: 'flexDirection',
        defaultValue: 'column',
        assignValue: 'row',
    }].forEach((obj) => {
        describe(`${obj.prop} prop test`, () => {
            // 默认数据
            it(`the default value of ${obj.prop} prop is ${obj.defaultValue}`, () => {
                wrapper = shallowMount(EmptyPage, { localVue });
                expect(wrapper.vm[obj.prop]).deep.equal(obj.defaultValue);
            });
            // 验证传入数据
            it(`assign the ${obj.prop} value`, () => {
                wrapper = shallowMount(EmptyPage, {
                    localVue,
                    propsData: {
                        [obj.prop]: obj.assignValue,
                    },
                });
                expect(wrapper.vm[obj.prop]).deep.equal(obj.assignValue);
            });
        });
    });
});
