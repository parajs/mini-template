import { REQUEST, transformRequestResponseOkData, transformRequestSendDefault } from 'miniprogram-request';
import { baseURL } from './config';
import { getStorageSync } from './util';
REQUEST.Defaults.baseURL = baseURL;
REQUEST.Listeners.onResponse.push(console.log);
REQUEST.Defaults.responseType = 'json';
REQUEST.Defaults.headers = {};

REQUEST.Defaults.transformSend = (options) => {
    const token = getStorageSync();
    options.headers["token"] = token;
   
    // options.headers["Authorization"] = `brearer ${getStorageSync()}`; 
    return transformRequestSendDefault(options); 
};

REQUEST.Defaults.transformResponse = (res,config)=>{
    try {
        /** 
        backEndData:{
            code: 200,
            data: null,
            msg: 'ok'
        }
        **/
       const backEndData =  transformRequestResponseOkData(res,config);
       if(backEndData.code !== 200){
            wx.showToast({
                title: res.msg,
                icon: 'none'
            }) 
        } else {
            return backEndData.data;
        }
    } catch (error) {
        wx.showToast({
            title: '网络请求错误',
            icon: 'none'
        })
    }
}

export default REQUEST;

