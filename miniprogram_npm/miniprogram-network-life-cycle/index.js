module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1571151579507, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var listeners_1 = require("./listeners");
exports.Listeners = listeners_1.Listeners;
var life_cycle_1 = require("./life-cycle");
exports.LifeCycle = life_cycle_1.LifeCycle;
var miniprogram_cancel_token_1 = require("miniprogram-cancel-token");
exports.CancelToken = miniprogram_cancel_token_1.CancelToken;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./listeners":1571151579508,"./life-cycle":1571151579509}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1571151579508, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 监听事件列表
 */
var Listeners = /** @class */ (function () {
    function Listeners() {
        /**
         * 发送之前事件监听列表
         * 回调函数参数为`完整配置`(只读,不应修改)
         */
        this.onSend = [];
        /**
         * 收到数据响应后事件监听列表
         * 回调函数参数为`返回结果`和`完整配置`(只读,不应修改)
         */
        this.onResponse = [];
        /**
         * 请求完成时事件监听列表
         * 回调函数参数为`操作结果`和`完整配置`(只读,不应修改)
         */
        this.onComplete = [];
        /**
         * 处理失败事件监听列表
         * 回调函数参数为`失败原因`和`完整配置`(只读,不应修改)
         */
        this.onRejected = [];
        /**
         * 请求取消事件监听列表
         * 回调函数参数为`取消原因`和`完整配置`(只读,不应修改)
         */
        this.onAbort = [];
    }
    return Listeners;
}());
exports.Listeners = Listeners;
//# sourceMappingURL=listeners.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1571151579509, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
var configuration_1 = require("./configuration");
var listeners_1 = require("./listeners");
/**
 * 在结果中主人timeout 标记
 * @param res 原始结果
 */
function timeoutMsg(res, time) {
    res.errMsg = res.errMsg ? res.errMsg.replace(':fail abort', ":fail timeout " + time) : "network::fail timeout " + time;
    res.timeout = true;
    return res;
}
/**
 * 网络请求的完整生命周期
 * @template TWxOptions 微信操作函数参数类型 // 微信操作函数
 * @template TWxTask 微信操作函数返回值类型 // 微信操作的任务类型
 * @template TInitConfig LifeCycle的初始默认配置项(Defaults)类型 //初始化配置项
 * @template TFullOptions 一个操作完整配置项(全部可接收参数)类型
 */
var LifeCycle = /** @class */ (function () {
    /**
     * 新建实列
     * @param operator 操作
     * @param config 全局默认配置
     * @param listeners 事件监听
     */
    function LifeCycle(operator, config, listeners) {
        if (listeners === void 0) { listeners = new listeners_1.Listeners(); }
        this.handle = operator;
        this.Defaults = config;
        this.Listeners = listeners;
        if (config.retry === undefined) {
            this.Defaults.retry = 1;
        }
        if (!config.headers) {
            this.Defaults.headers = {};
        }
    }
    /**
     * 处理请求
     * @param options - 请求参数,不包括默认参数
     */
    LifeCycle.prototype.process = function (options) {
        var _this = this;
        // tslint:disable-next-line: no-parameter-reassignment
        options = configuration_1.mergeConfig(options, this.Defaults);
        return this._onSend(options)
            .then(function (param) {
            // 记录发送时间戳
            if (options.timestamp) {
                if (typeof options.timestamp === 'object') {
                    // 记录于传入的参数中
                    options.timestamp.send = Date.now();
                }
                else {
                    options.__sendTime = Date.now();
                }
            }
            return _this._send(param, options);
        });
    };
    /**
     * 请求发送之前处理数据
     * @param options - 完整参数
     */
    LifeCycle.prototype._onSend = function (options) {
        this.Listeners.onSend.forEach(function (f) { f(options); });
        return Promise.resolve(options)
            .then(options.transformSend);
    };
    /**
     * 发送网络请求,并自动重试
     * @param data - 发送微信参数
     * @param options - 全部配置
     */
    LifeCycle.prototype._send = function (data, options) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            /**
             * 是否结束
             */
            var completed = false;
            /**
             * 超时定时器
             * * undefined 表示未启用
             * * 0 表示已经触发超时
             * * 正数 表示真在计时中(未超时)
             */
            var timeoutHandle;
            var cancelToken = options.cancelToken;
            if (cancelToken) {
                cancelToken.throwIfRequested();
            }
            data.success = function (res) {
                completed = true;
                _this._response(res, options)
                    .then(resolve, reject);
            };
            // retry on fail
            data.fail = function (res) {
                if (timeoutHandle === 0) {
                    timeoutMsg(res, options.timeout); // 触发自定义超时,注入timeout
                }
                if (cancelToken && cancelToken.isCancelled()) {
                    // 用户主动取消,直接结束不再重试
                    res.cancel = true;
                }
                else if (typeof options.retry === 'function') {
                    // 自定义retry 函数
                    Promise.resolve()
                        .then(function () { return options.retry(data, res); })
                        .then(
                    // 继续重试
                    function (retryData) {
                        _this._send(retryData, options)
                            .then(resolve, reject);
                    }, 
                    // 放弃重试
                    function (reason) {
                        _this._onFail(reason, options)
                            .then(reject, reject);
                        _this._complete(reason, options);
                    });
                    return;
                }
                else if (options.retry-- > 0) {
                    // 还有重试次数
                    _this._send(data, options)
                        .then(resolve, reject);
                    return;
                }
                // 结束请求
                completed = true;
                _this._onFail(res, options)
                    .then(reject, reject);
            };
            data.complete = function (res) {
                if (timeoutHandle) {
                    // 清理计时器
                    clearTimeout(timeoutHandle);
                    timeoutHandle = undefined; // 置空
                }
                else if (timeoutHandle === 0 && !res.timeout) {
                    // 触发过自定义超时,并且尚未注入timeout
                    timeoutMsg(res, options.timeout);
                }
                if (completed) {
                    // 结束
                    _this._complete(res, options);
                }
            };
            var task = _this.handle(data);
            if (options.timeout > 0) {
                // 计时器 自定义超时
                // 超时触发 计时器标志置0, 终止操作
                timeoutHandle = setTimeout(function () { timeoutHandle = 0; task.abort(); }, options.timeout);
            }
            if (options.onHeadersReceived) {
                task.onHeadersReceived(options.onHeadersReceived); // 响应头回调
            }
            if (options.onProgressUpdate && task.onProgressUpdate) {
                task.onProgressUpdate(options.onProgressUpdate); // 进度回调
            }
            if (cancelToken) {
                cancelToken.promise
                    .then(function (reason) { task.abort(); _this._onAbort(reason, options); }, reject);
            }
        });
    };
    /**
     * 处理服务器返回数据
     * @param res - 返回参数
     * @param options - 全部配置
     */
    LifeCycle.prototype._response = function (res, options) {
        var _this = this;
        this.Listeners.onResponse.forEach(function (f) { f(res, options); });
        if (options.transformResponse) {
            return Promise
                .resolve(res)
                .then(
            // tslint:disable-next-line: no-unsafe-any
            function (result) { return options.transformResponse(result, options); })
                .catch(function (reason) { return _this._onFail(reason, options); });
        }
        else {
            return Promise.resolve(res);
        }
    };
    /**
     * complete 结束操作 按需注入时间
     * @param res - result
     * @param options - all options
     */
    LifeCycle.prototype._complete = function (res, options) {
        if (options.timestamp) {
            //记录时间戳
            if (typeof options.timestamp === 'object') {
                options.timestamp.response = Date.now();
                res.time = options.timestamp;
            }
            else {
                res.time = {
                    send: options.__sendTime,
                    response: Date.now()
                };
            }
        }
        this._onComplete(res, options);
    };
    /**
     * 请求发送失败
     * @param res - 返回参数
     * @param options - 全部配置
     */
    LifeCycle.prototype._onFail = function (res, options) {
        this.Listeners.onRejected.forEach(function (f) { f(res, options); });
        return Promise.reject(res);
    };
    /**
     * 请求完成
     * @param res - 返回参数
     * @param options - 全部配置
     */
    LifeCycle.prototype._onComplete = function (res, options) {
        this.Listeners.onComplete.forEach(function (f) { f(res, options); });
    };
    /**
     * 请求完成
     * @param res - 返回参数
     * @param options - 全部配置
     */
    LifeCycle.prototype._onAbort = function (reason, options) {
        // tslint:disable-next-line: no-unsafe-any
        this.Listeners.onAbort.forEach(function (f) { f(reason, options); });
    };
    return LifeCycle;
}());
exports.LifeCycle = LifeCycle;
//# sourceMappingURL=life-cycle.js.map
}, function(modId) { var map = {"./configuration":1571151579510,"./listeners":1571151579508}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1571151579510, function(require, module, exports) {

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 合并配置
 * @param customize 自定义配置，未定义的将被设置为默认值
 * @param defaults 默认值
 */
function mergeConfig(customize, defaults) {
    var config = __assign({}, defaults, customize);
    if (defaults.headers && customize.headers) {
        // 合并headers
        config.headers = __assign({}, defaults.headers, customize.headers);
    }
    return config;
}
exports.mergeConfig = mergeConfig;
//# sourceMappingURL=configuration.js.map
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1571151579507);
})()
//# sourceMappingURL=index.js.map