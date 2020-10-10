import deepAssign from '@hello/utils/lib/deepAssign';
import showComponent from './showComponent';
import showConfirm from './showConfirm';
import showAlert from './showAlert';
import showMsg from './showMsg';
import showLoading from './showLoading';

export {
    showComponent,
    showConfirm,
    showAlert,
    showMsg,
    showLoading,
};

export default deepAssign(showComponent, showConfirm, showAlert, showMsg, showLoading);
