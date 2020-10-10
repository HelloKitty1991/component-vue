import Vue from 'vue';
import request from '@hello/utils/lib/request';
import BaseMixin from './mixins';
import MessageBox from './components/MessageBox';
import SearchBar from './components/SearchBar';
import Form from './components/Form';
import TextItem from './components/TextItem';
import PageFooter from './components/PageFooter';
import TagEdit from './components/TagEdit';
import Tree from './components/Tree';
import SelectTree from './components/SelectTree';
import directive from './directive';
import EmptyPage from './components/EmptyPage';
import SvgIcon from './components/SvgIcon';
import Cascader from './components/Cascader';
import Region from './components/Region';
import VehicleBrandAndSerial from './components/VehicleBrandAndSerial';

import './index.scss';

Vue.directive('events', directive.events);
Vue.prototype.$request = request();

export {
    BaseMixin,
    MessageBox,
    SearchBar,
    Form,
    TextItem,
    PageFooter,
    TagEdit,
    Tree,
    SelectTree,
    directive,
    EmptyPage,
    SvgIcon,
    Cascader,
    Region,
    VehicleBrandAndSerial,
};
