/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */

import { shallowMount } from '@vue/test-utils';
import { expect } from 'chai';
import SvgIcon from '../src/components/SvgIcon';

describe('svgicon test', () => {
    let wrapper;
    /* 验证入参 */
    describe('props test', () => {
        describe('iconName prop test', () => {
            it('the default value of iconName is #icon-search ', () => {
                wrapper = shallowMount(SvgIcon);
                expect(wrapper.vm.xlinkHref).equal('#icon-search');
            });
        });
        describe('className prop test', () => {
            it('the default value of className is k-svg-icon ', () => {
                wrapper = shallowMount(SvgIcon);
                expect(wrapper.vm.svgClass).equal('k-svg-icon');
            });
        });
    });
});
