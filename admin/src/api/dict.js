import fetch from 'src/utils/fetch';
import {interfaceUrl} from 'src/global-var.js';

//得到字典
export const getTypeCode=(typeCode)=>fetch(`${interfaceUrl}/api-app/user/findDictList?typeCode=${typeCode}`)
