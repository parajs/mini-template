module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1571151579513, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
var miniprogram_network_life_cycle_1 = require("miniprogram-network-life-cycle");
exports.CancelToken = miniprogram_network_life_cycle_1.CancelToken;
var http_2 = require("./http");
exports.Http = http_2.Http;
var transform_1 = require("./transform");
exports.transformRequestResponseOkData = transform_1.transformRequestResponseOkData;
exports.transformRequestSendDefault = transform_1.transformRequestSendDefault;
/**
 * 预定义全局 REQUEST 对象
 */
// tslint:disable-next-line: export-name
exports.REQUEST = new http_1.Http();
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./http":1571151579514,"./transform":1571151579515}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1571151579514, function(require, module, exports) {

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var miniprogram_network_life_cycle_1 = require("miniprogram-network-life-cycle");
var transform_1 = require("./transform");
/**
 * 小程序HTTP 请求生命周期封装
 * @example
 *    `const http = new Http({ baseURL: 'https://api.newfuture.cc/', retry: 3 });`
 * @template TExt 扩展参数属性类型
 */
var Http = /** @class */ (function (_super) {
    __extends(Http, _super);
    /**
     * 新建 Http实列
     * @param config 全局默认配置
     * @param request 请求处理方法，默认使用请求队列处理
     * @param listeners 请求事件监听
     */
    function Http(config, request, listeners) {
        return _super.call(this, 
        // tslint:disable-next-line: no-use-before-declare
        request || wx.request, 
        // tslint:disable-next-line: no-object-literal-type-assertion
        config || { transformSend: transform_1.transformRequestSendDefault }, listeners) || this;
    }
    Http.prototype.request = function () {
        var argNum = arguments.length;
        // tslint:disable-next-line: no-unsafe-any
        var options = argNum === 1 ? arguments[0] : (arguments[3] || {});
        if (argNum > 1) {
            options.method = arguments[0];
            options.url = arguments[1];
            if (argNum > 2) {
                // tslint:disable-next-line: no-unsafe-any
                options.data = arguments[2];
            }
        }
        return this.process(options);
    };
    /**
     * GET 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转为query string
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData get query data请求参数的格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    // tslint:disable-next-line: no-reserved-keywords
    Http.prototype.get = function (action, data, config) {
        return this.request('GET', action, data, config);
    };
    /**
     * POST 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData post data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    Http.prototype.post = function (action, data, config) {
        return this.request('POST', action, data, config);
    };
    /**
     * PUT 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData post data数据格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    Http.prototype.put = function (action, data, config) {
        return this.request('PUT', action, data, config);
    };
    /**
     * DELETE 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转为query string
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData put query data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    // tslint:disable-next-line: no-reserved-keywords
    Http.prototype.delete = function (action, data, config) {
        return this.request('DELETE', action, data, config);
    };
    /**
     * HEAD 操作
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 可转为query string
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData head query data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    Http.prototype.head = function (action, data, config) {
        return this.request('HEAD', action, data, config);
    };
    /**
     * Patch 操作
     * 由于小程序不支持PATCH 方法
     * 采用X-HTTP-Method-Override兼容处理，需要服务器端支持
     * @param action 请求操作URL,支持{name}格式参数
     * @param data 操作数据,默认会以json方式上传
     * @param config 可覆盖默认配置
     * @template TReturn Promise 返回的格式类型,默认返回微信原始返回数据格式
     * @template TData patch data参数格式类型,默认 any
     * @template TParams 路径参数(如`/items/{id}`或者`/{0}/{1}`)的格式类型,默认 任意object或数组
     */
    Http.prototype.patch = function (action, data, config) {
        if (!config) {
            // tslint:disable-next-line: no-parameter-reassignment
            config = {
                headers: { 'X-HTTP-Method-Override': 'PATCH' }
            };
        }
        else if (!config.headers) {
            config.headers = { 'X-HTTP-Method-Override': 'PATCH' };
        }
        else {
            config.headers['X-HTTP-Method-Override'] = 'PATCH';
        }
        return this.request('POST', action, data, config);
    };
    return Http;
}(miniprogram_network_life_cycle_1.LifeCycle));
exports.Http = Http;
//# sourceMappingURL=http.js.map
}, function(modId) { var map = {"./transform":1571151579515}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1571151579515, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
// import { RequestData, RequestOptions } from './configuration';
var miniprogram_network_utils_1 = require("miniprogram-network-utils");
/**
 * 构建请求参数
 * @param data - 完整配置参数
 */
function transformRequestSendDefault(data) {
    var wxParam = {
        url: miniprogram_network_utils_1.buildParams(data.url, data.params, data.baseURL),
        header: data.headers
    };
    if (data.responseType === 'arraybuffer') {
        wxParam.responseType = 'arraybuffer';
    }
    else if (data.responseType === 'json') {
        wxParam.dataType = 'json';
    }
    return miniprogram_network_utils_1.getCommonOptions(wxParam, data, ['data', 'method']);
}
exports.transformRequestSendDefault = transformRequestSendDefault;
/**
 * 返回请求成功的响应数据data部分
 * statusCode 2xx 操作成功仅返回data数据
 * 否则抛出错误(rejected)
 * @param res - 返回结果
 * @param config - 完整配置参数
 */
function transformRequestResponseOkData(res, config) {
    if (res.statusCode >= 200 && res.statusCode < 300) {
        return res.data;
    }
    throw res;
}
exports.transformRequestResponseOkData = transformRequestResponseOkData;
//# sourceMappingURL=transform.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1571151579513);
})()
//# sourceMappingURL=index.js.map