/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { mount, createLocalVue } from '@vue/test-utils';
// import cloneDeep from 'lodash/cloneDeep';
import { expect } from 'chai';
// import sinon from 'sinon';
import elementUI from 'element-ui';
import request from '@hello/utils/lib/request';
import Region from '../src/components/Region/src/index.vue';
import Vehicle from '../src/components/VehicleBrandAndSerial/src/index.vue';
import directives from '../src/directive';

const localVue = createLocalVue();
localVue.directive('events', directives.events);
localVue.use(elementUI);
localVue.prototype.$request = request({
    // interceptors: {
    //     request: {
    //
    //     }
    // }
});


// const { log } = console;
// console.log = () => { };

const mountOptions = {
    localVue,
    stubs: {
        transition: false,
    },
};

const wait = time => new Promise((resolve) => {
    setTimeout(resolve, time);
});

describe('cascader test', () => {
    let wrapper;
    describe('initialValue test', () => {
        it('when the initialValue is 420381, the text of cascader should be 湖北省 / 十堰市 / 丹江口市 (static page for Region)', (done) => {
            wrapper = mount(Region, {
                ...mountOptions,
                propsData: {
                    value: 420381,
                },
            });
            setTimeout(() => {
                const inputEvent = wrapper.emitted().input;
                expect(inputEvent).not.to.be.undefined;
                expect(inputEvent[0][0]).not.to.be.undefined;
                expect(wrapper.find('.el-input .el-input__inner').element.value).equal('湖北省 / 十堰市 / 丹江口市');
                done();
            }, 2000);
        });
        it('when the initialValue is 2015款 18T 双离合运动旗舰型, the text of cascader should be 别克 / 英朗 / 2015款 18T 双离合运动旗舰型 (dynamic page for Vehicle)', (done) => {
            wrapper = mount(Vehicle, {
                ...mountOptions,
                propsData: {
                    value: '2015款 18T 双离合运动旗舰型',
                },
            });
            setTimeout(() => {
                const inputEvent = wrapper.emitted().input;
                expect(inputEvent).not.to.be.empty;
                expect(inputEvent[0][0]).not.to.be.empty;
                expect(wrapper.find('.el-input .el-input__inner').element.value).equal('别克 / 英朗 / 2015款 18T 双离合运动旗舰型');
                done();
            }, 2000);
        });
        it('when the initialValue is an Array, the text of cascader should be tag (dynamic page for Vehicle and the mode is multiple)', (done) => {
            wrapper = mount(Vehicle, {
                ...mountOptions,
                propsData: {
                    value: ['2013款 Cabriolet 40 TFSI风尚版', '2015款 2.4L 豪华商务尊享版'],
                    attrs: {
                        props: {
                            multiple: true,
                        },
                    },
                },
            });
            setTimeout(() => {
                const inputEvent = wrapper.emitted().input;
                expect(inputEvent).not.to.be.empty;
                expect(inputEvent[0][0]).not.to.be.empty;
                const dom = wrapper.find('.el-cascader__tags');
                expect(dom.exists()).to.be.true;
                const tags = dom.findAll('.el-tag');
                expect(tags).lengthOf(2);
                const texts = [];
                [0, 1].forEach((v) => {
                    texts.push(tags.at(v).text());
                });
                expect(texts).deep.equals(['奥迪 / A5 / 2013款 Cabriolet 40 TFSI风尚版', '别克 / GL8 / 2015款 2.4L 豪华商务尊享版']);
                done();
            }, 4000);
        });
    });
    describe('lazy load test', () => {
        // it('lazy load by scroll', async (done) => {
        //     wrapper = mount(Region, {
        //         ...mountOptions,
        //         propsData: {
        //             value: 420381,
        //         },
        //     });
        //     await wrapper.vm.$nextTick();
        //     wrapper.find('.el-cascader').trigger('click');
        //     await wrapper.vm.$nextTick();
        //     const wrap = document.body.querySelector(`.${wrapper.vm.$refs.cascader.randomClass} .el-cascader-menu__wrap`);
        //     expect(wrap.onscroll).not.to.be.undefined;
        //     setTimeout(() => {
        //         const beforeLen = wrap.querySelectorAll('li').length;
        //         console.log(document.scrollTo, wrap.onscroll);
        //         wrap.scrollTo(0, 500);
        //         setTimeout(() => {
        //             const afterLen = wrap.querySelectorAll('li').length;
        //             expect(afterLen).above(beforeLen);
        //             done();
        //         }, 1000);
        //     }, 1000);
        // });
        it('lazy load by click', (done) => {
            wrapper = mount(Region, {
                ...mountOptions,
            });
            wrapper.find('.el-cascader').trigger('click');
            setTimeout(() => {
                const { popper } = wrapper.vm.$refs.kcascader.$refs.cascader.$refs;
                let wrap = popper.querySelector('.el-cascader-menu__wrap');
                const items = wrap.querySelectorAll('li');
                expect(items.length).above(0);
                const target = items[2];
                target && target.click && target.click();
                setTimeout(() => {
                    [, wrap] = popper.querySelectorAll('.el-cascader-menu__wrap');
                    expect(wrap.querySelectorAll('li').length).equals(10);
                    done();
                }, 1000);
            }, 1000);
        });
    });
    describe('filter search test', () => {
        it('filter test', (done) => {
            wrapper = mount(Vehicle, {
                ...mountOptions,
            });
            const input = wrapper.find('input');
            input.element.value = '宝马';
            input.trigger('input');
            setTimeout(() => {
                const list = document.body.querySelector('.el-cascader__suggestion-list');
                expect(list).exist;
                expect(document.body.querySelectorAll('.el-cascader__suggestion-item').length).above(0);
                done && done();
            }, 1000);
        });
    });
    describe('labeInValue prop test', () => {
        [true, false].forEach((v) => {
            it(`labeInValue is ${v}`, async () => {
                wrapper = mount(Region, {
                    ...mountOptions,
                    propsData: {
                        labelInValue: v,
                    },
                });
                wrapper.find('input').trigger('click');
                const { popper } = wrapper.vm.$refs.kcascader.$refs.cascader.$refs;
                await wait(500);
                popper.querySelector('.el-cascader-menu__wrap li').click();
                await wait(500);
                popper.querySelectorAll('.el-cascader-menu__wrap')[1].querySelector('li').click();
                await wait(500);
                popper.querySelectorAll('.el-cascader-menu__wrap')[2].querySelector('li').click();
                await wait(500);
                let res = wrapper.emitted().input;
                [res] = res[res.length - 1];
                expect(res && res[0] && Object.prototype.hasOwnProperty.call(res[0], 'name')).to.be[v];
            });
        });
    });
});
