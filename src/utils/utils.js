/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path) => reg.test(path);

export function getDeviceUUID() {
  const deviceId = localStorage.getItem('uni_deviceId') ||
    `${navigator.platform}_${Math.random().toString(36).substr(2)}`;

  localStorage.setItem('uni_deviceId', deviceId);
  return deviceId;
}
