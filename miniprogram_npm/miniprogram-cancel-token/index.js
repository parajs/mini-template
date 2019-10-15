module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = { exports: {} }; __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); if(typeof m.exports === "object") { __MODS__[modId].m.exports.__proto__ = m.exports.__proto__; Object.keys(m.exports).forEach(function(k) { __MODS__[modId].m.exports[k] = m.exports[k]; Object.defineProperty(m.exports, k, { set: function(val) { __MODS__[modId].m.exports[k] = val; }, get: function() { return __MODS__[modId].m.exports[k]; } }); }); if(m.exports.__esModule) Object.defineProperty(__MODS__[modId].m.exports, "__esModule", { value: true }); } else { __MODS__[modId].m.exports = m.exports; } } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1571151579506, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 为异步Promise和async/await 提供取消接口
 * @example `const cts = CancleToken.source(); cts.cancle()`
 */
var CancelToken = /** @class */ (function () {
    /**
     * 生成CancelToken
     * @param executor - callback
     */
    function CancelToken(executor) {
        var _this = this;
        var resolve;
        // tslint:disable-next-line:promise-must-complete
        this.promise = new Promise(function (res) { resolve = res; });
        executor(function (reason) {
            if (_this.reason === undefined) { // 防止重复执行
                _this.reason = reason === undefined ? 'abort' : reason;
                resolve({ errMsg: _this.reason, cancel: true });
            }
        });
    }
    /**
     * Create TokenSoure
     * @returns 生成一个CancelTokenSource
     */
    CancelToken.source = function () {
        var cancel;
        var token = new CancelToken(function (c) {
            cancel = c;
        });
        ///@ts-ignore
        return { token: token, cancel: cancel };
    };
    /**
     * 是否已取消
     */
    CancelToken.prototype.isCancelled = function () {
        return this.reason !== undefined;
    };
    /**
     * 如果已取消，抛出异常
     * 防止二次取消
     * @throws { errMsg: string }
     */
    CancelToken.prototype.throwIfRequested = function () {
        if (this.reason !== undefined) {
            throw typeof this.reason === 'string' ? { errMsg: this.reason, cancel: true, source: CancelToken.name } : this.reason;
        }
    };
    return CancelToken;
}());
exports.CancelToken = CancelToken;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1571151579506);
})()
//# sourceMappingURL=index.js.map