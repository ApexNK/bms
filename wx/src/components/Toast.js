import { Toast } from 'mint-ui';
function showToast (opts) {
  let defaultOpt = {
    duration: 1500
  };
  Toast(Object.assign(defaultOpt, opts));
}
export default showToast;
