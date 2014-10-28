/**
 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
 *
 * @version 1.0.1
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All Rights Reserved]
 * @license MIT License (see LICENSE.txt)
 */
function FastClick(e, t) {
        "use strict";

        function n(e, t) {
            return function() {
                return e.apply(t, arguments)
            }
        }
        var r;
        if (t = t || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = t.touchBoundary || 10, this.layer = e, this.tapDelay = t.tapDelay || 200, !FastClick.notNeeded(e)) {
            for (var i = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], o = this, a = 0, s = i.length; s > a; a++) o[i[a]] = n(o[i[a]], o);
            deviceIsAndroid && (e.addEventListener("mouseover", this.onMouse, !0), e.addEventListener("mousedown", this.onMouse, !0), e.addEventListener("mouseup", this.onMouse, !0)), e.addEventListener("click", this.onClick, !0), e.addEventListener("touchstart", this.onTouchStart, !1), e.addEventListener("touchmove", this.onTouchMove, !1), e.addEventListener("touchend", this.onTouchEnd, !1), e.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, r) {
                var i = Node.prototype.removeEventListener;
                "click" === t ? i.call(e, t, n.hijacked || n, r) : i.call(e, t, n, r)
            }, e.addEventListener = function(t, n, r) {
                var i = Node.prototype.addEventListener;
                "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function(e) {
                    e.propagationStopped || n(e)
                }), r) : i.call(e, t, n, r)
            }), "function" == typeof e.onclick && (r = e.onclick, e.addEventListener("click", function(e) {
                r(e)
            }, !1), e.onclick = null)
        }
    }(function() {
        var e, t, n, r, i;
        null == window.GitHub && (window.GitHub = {}), e = document.createElement("input"), t = document.createElement("textarea"), window.GitHub.support = {
            emoji: function() {
                var e, t, n;
                return n = document.createElement("canvas"), e = n.getContext("2d"), e.fillStyle = "#f00", e.textBaseline = "top", e.font = "32px Arial", t = String.fromCharCode(55357) + String.fromCharCode(56360), e.fillText(t, 0, 0), 0 !== e.getImageData(16, 16, 1, 1).data[0]
            }(),
            registerElement: "registerElement" in document,
            requestAnimationFrame: "requestAnimationFrame" in window,
            setImmediate: "setImmediate" in window,
            Promise: "Promise" in window,
            URL: "URL" in window,
            WeakMap: "WeakMap" in window,
            placeholder_input: "placeholder" in e,
            placeholder_textarea: "placeholder" in t,
            performanceNow: !!(null != (n = window.performance) ? n.now : void 0),
            performanceMark: !!(null != (r = window.performance) ? r.mark : void 0),
            performanceGetEntries: !!(null != (i = window.performance) ? i.getEntries : void 0)
        }, GitHub.support.classList = "classList" in e, GitHub.support.classListMultiArg = GitHub.support.classList && function() {
            return e.classList.add("a", "b"), e.classList.contains("b")
        }(), GitHub.performanceEnabled = function() {
            var e, t, n, r, i, o, a, s;
            return null != (null != (t = window.performance) ? t.now : void 0) && null != (null != (n = window.performance) ? n.timing : void 0) && null != (null != (r = window.performance) ? r.clearMarks : void 0) && null != (null != (i = window.performance) ? i.clearMeasures : void 0) && null != (null != (o = window.performance) ? o.mark : void 0) && null != (null != (a = window.performance) ? a.measure : void 0) && null != (null != (s = window.performance) ? s.getEntriesByName : void 0) && null != (null != (e = window.performance) ? e.getEntriesByType : void 0)
        }
    }).call(this),
    function(global, undefined) {
        "use strict";

        function canUseNextTick() {
            return "object" == typeof process && "[object process]" === Object.prototype.toString.call(process)
        }

        function canUseMessageChannel() {
            return !!global.MessageChannel
        }

        function canUsePostMessage() {
            if (!global.postMessage || global.importScripts) return !1;
            var e = !0,
                t = global.onmessage;
            return global.onmessage = function() {
                e = !1
            }, global.postMessage("", "*"), global.onmessage = t, e
        }

        function canUseReadyStateChange() {
            return "document" in global && "onreadystatechange" in global.document.createElement("script")
        }

        function installNextTickImplementation(e) {
            e.setImmediate = function() {
                var e = tasks.addFromSetImmediateArguments(arguments);
                return process.nextTick(function() {
                    tasks.runIfPresent(e)
                }), e
            }
        }

        function installMessageChannelImplementation(e) {
            var t = new global.MessageChannel;
            t.port1.onmessage = function(e) {
                var t = e.data;
                tasks.runIfPresent(t)
            }, e.setImmediate = function() {
                var e = tasks.addFromSetImmediateArguments(arguments);
                return t.port2.postMessage(e), e
            }
        }

        function installPostMessageImplementation(e) {
            function t(e, t) {
                return "string" == typeof e && e.substring(0, t.length) === t
            }

            function n(e) {
                if (e.source === global && t(e.data, r)) {
                    var n = e.data.substring(r.length);
                    tasks.runIfPresent(n)
                }
            }
            var r = "com.bn.NobleJS.setImmediate" + Math.random();
            global.addEventListener ? global.addEventListener("message", n, !1) : global.attachEvent("onmessage", n), e.setImmediate = function() {
                var e = tasks.addFromSetImmediateArguments(arguments);
                return global.postMessage(r + e, "*"), e
            }
        }

        function installReadyStateChangeImplementation(e) {
            e.setImmediate = function() {
                var e = tasks.addFromSetImmediateArguments(arguments),
                    t = global.document.createElement("script");
                return t.onreadystatechange = function() {
                    tasks.runIfPresent(e), t.onreadystatechange = null, t.parentNode.removeChild(t), t = null
                }, global.document.documentElement.appendChild(t), e
            }
        }

        function installSetTimeoutImplementation(e) {
            e.setImmediate = function() {
                var e = tasks.addFromSetImmediateArguments(arguments);
                return global.setTimeout(function() {
                    tasks.runIfPresent(e)
                }, 0), e
            }
        }
        var tasks = function() {
            function Task(e, t) {
                this.handler = e, this.args = t
            }
            Task.prototype.run = function() {
                if ("function" == typeof this.handler) this.handler.apply(undefined, this.args);
                else {
                    var scriptSource = "" + this.handler;
                    eval(scriptSource)
                }
            };
            var nextHandle = 1,
                tasksByHandle = {},
                currentlyRunningATask = !1;
            return {
                addFromSetImmediateArguments: function(e) {
                    var t = e[0],
                        n = Array.prototype.slice.call(e, 1),
                        r = new Task(t, n),
                        i = nextHandle++;
                    return tasksByHandle[i] = r, i
                },
                runIfPresent: function(e) {
                    if (currentlyRunningATask) global.setTimeout(function() {
                        tasks.runIfPresent(e)
                    }, 0);
                    else {
                        var t = tasksByHandle[e];
                        if (t) {
                            currentlyRunningATask = !0;
                            try {
                                t.run()
                            } finally {
                                delete tasksByHandle[e], currentlyRunningATask = !1
                            }
                        }
                    }
                },
                remove: function(e) {
                    delete tasksByHandle[e]
                }
            }
        }();
        if (!global.setImmediate) {
            var attachTo = "function" == typeof Object.getPrototypeOf && "setTimeout" in Object.getPrototypeOf(global) ? Object.getPrototypeOf(global) : global;
            canUseNextTick() ? installNextTickImplementation(attachTo) : canUsePostMessage() ? installPostMessageImplementation(attachTo) : canUseMessageChannel() ? installMessageChannelImplementation(attachTo) : canUseReadyStateChange() ? installReadyStateChangeImplementation(attachTo) : installSetTimeoutImplementation(attachTo), attachTo.clearImmediate = tasks.remove
        }
    }("object" == typeof global && global ? global : this),
    function() {
        var e, t, n, r;
        ! function() {
            var i = {},
                o = {};
            e = function(e, t, n) {
                i[e] = {
                    deps: t,
                    callback: n
                }
            }, r = n = t = function(e) {
                function n(t) {
                    if ("." !== t.charAt(0)) return t;
                    for (var n = t.split("/"), r = e.split("/").slice(0, -1), i = 0, o = n.length; o > i; i++) {
                        var a = n[i];
                        if (".." === a) r.pop();
                        else {
                            if ("." === a) continue;
                            r.push(a)
                        }
                    }
                    return r.join("/")
                }
                if (r._eak_seen = i, o[e]) return o[e];
                if (o[e] = {}, !i[e]) throw new Error("Could not find module " + e);
                for (var a, s = i[e], c = s.deps, l = s.callback, u = [], f = 0, d = c.length; d > f; f++) u.push("exports" === c[f] ? a = {} : t(n(c[f])));
                var h = l.apply(this, u);
                return o[e] = a || h
            }
        }(), e("promise/all", ["./utils", "exports"], function(e, t) {
            "use strict";

            function n(e) {
                var t = this;
                if (!r(e)) throw new TypeError("You must pass an array to all.");
                return new t(function(t, n) {
                    function r(e) {
                        return function(t) {
                            o(e, t)
                        }
                    }

                    function o(e, n) {
                        s[e] = n, 0 === --c && t(s)
                    }
                    var a, s = [],
                        c = e.length;
                    0 === c && t([]);
                    for (var l = 0; l < e.length; l++) a = e[l], a && i(a.then) ? a.then(r(l), n) : o(l, a)
                })
            }
            var r = e.isArray,
                i = e.isFunction;
            t.all = n
        }), e("promise/asap", ["exports"], function(e) {
            "use strict";

            function t() {
                return function() {
                    process.nextTick(i)
                }
            }

            function n() {
                var e = 0,
                    t = new c(i),
                    n = document.createTextNode("");
                return t.observe(n, {
                        characterData: !0
                    }),
                    function() {
                        n.data = e = ++e % 2
                    }
            }

            function r() {
                return function() {
                    l.setTimeout(i, 1)
                }
            }

            function i() {
                for (var e = 0; e < u.length; e++) {
                    var t = u[e],
                        n = t[0],
                        r = t[1];
                    n(r)
                }
                u = []
            }

            function o(e, t) {
                var n = u.push([e, t]);
                1 === n && a()
            }
            var a, s = "undefined" != typeof window ? window : {},
                c = s.MutationObserver || s.WebKitMutationObserver,
                l = "undefined" != typeof global ? global : void 0 === this ? window : this,
                u = [];
            a = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? t() : c ? n() : r(), e.asap = o
        }), e("promise/config", ["exports"], function(e) {
            "use strict";

            function t(e, t) {
                return 2 !== arguments.length ? n[e] : void(n[e] = t)
            }
            var n = {
                instrument: !1
            };
            e.config = n, e.configure = t
        }), e("promise/polyfill", ["./promise", "./utils", "exports"], function(e, t, n) {
            "use strict";

            function r() {
                var e;
                e = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self;
                var t = "Promise" in e && "resolve" in e.Promise && "reject" in e.Promise && "all" in e.Promise && "race" in e.Promise && function() {
                    var t;
                    return new e.Promise(function(e) {
                        t = e
                    }), o(t)
                }();
                t || (e.Promise = i)
            }
            var i = e.Promise,
                o = t.isFunction;
            n.polyfill = r
        }), e("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(e, t, n, r, i, o, a, s) {
            "use strict";

            function c(e) {
                if (!x(e)) throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof c)) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                this._subscribers = [], l(e, this)
            }

            function l(e, t) {
                function n(e) {
                    p(t, e)
                }

                function r(e) {
                    v(t, e)
                }
                try {
                    e(n, r)
                } catch (i) {
                    r(i)
                }
            }

            function u(e, t, n, r) {
                var i, o, a, s, c = x(n);
                if (c) try {
                    i = n(r), a = !0
                } catch (l) {
                    s = !0, o = l
                } else i = r, a = !0;
                h(t, i) || (c && a ? p(t, i) : s ? v(t, o) : e === A ? p(t, i) : e === D && v(t, i))
            }

            function f(e, t, n, r) {
                var i = e._subscribers,
                    o = i.length;
                i[o] = t, i[o + A] = n, i[o + D] = r
            }

            function d(e, t) {
                for (var n, r, i = e._subscribers, o = e._detail, a = 0; a < i.length; a += 3) n = i[a], r = i[a + t], u(t, n, r, o);
                e._subscribers = null
            }

            function h(e, t) {
                var n, r = null;
                try {
                    if (e === t) throw new TypeError("A promises callback cannot return that same promise.");
                    if (w(t) && (r = t.then, x(r))) return r.call(t, function(r) {
                        return n ? !0 : (n = !0, void(t !== r ? p(e, r) : m(e, r)))
                    }, function(t) {
                        return n ? !0 : (n = !0, void v(e, t))
                    }), !0
                } catch (i) {
                    return n ? !0 : (v(e, i), !0)
                }
                return !1
            }

            function p(e, t) {
                e === t ? m(e, t) : h(e, t) || m(e, t)
            }

            function m(e, t) {
                e._state === S && (e._state = N, e._detail = t, b.async(g, e))
            }

            function v(e, t) {
                e._state === S && (e._state = N, e._detail = t, b.async(y, e))
            }

            function g(e) {
                d(e, e._state = A)
            }

            function y(e) {
                d(e, e._state = D)
            }
            var b = e.config,
                w = (e.configure, t.objectOrFunction),
                x = t.isFunction,
                T = (t.now, n.all),
                E = r.race,
                _ = i.resolve,
                C = o.reject,
                k = a.asap;
            b.async = k;
            var S = void 0,
                N = 0,
                A = 1,
                D = 2;
            c.prototype = {
                constructor: c,
                _state: void 0,
                _detail: void 0,
                _subscribers: void 0,
                then: function(e, t) {
                    var n = this,
                        r = new this.constructor(function() {});
                    if (this._state) {
                        var i = arguments;
                        b.async(function() {
                            u(n._state, r, i[n._state - 1], n._detail)
                        })
                    } else f(this, r, e, t);
                    return r
                },
                "catch": function(e) {
                    return this.then(null, e)
                }
            }, c.all = T, c.race = E, c.resolve = _, c.reject = C, s.Promise = c
        }), e("promise/race", ["./utils", "exports"], function(e, t) {
            "use strict";

            function n(e) {
                var t = this;
                if (!r(e)) throw new TypeError("You must pass an array to race.");
                return new t(function(t, n) {
                    for (var r, i = 0; i < e.length; i++) r = e[i], r && "function" == typeof r.then ? r.then(t, n) : t(r)
                })
            }
            var r = e.isArray;
            t.race = n
        }), e("promise/reject", ["exports"], function(e) {
            "use strict";

            function t(e) {
                var t = this;
                return new t(function(t, n) {
                    n(e)
                })
            }
            e.reject = t
        }), e("promise/resolve", ["exports"], function(e) {
            "use strict";

            function t(e) {
                if (e && "object" == typeof e && e.constructor === this) return e;
                var t = this;
                return new t(function(t) {
                    t(e)
                })
            }
            e.resolve = t
        }), e("promise/utils", ["exports"], function(e) {
            "use strict";

            function t(e) {
                return n(e) || "object" == typeof e && null !== e
            }

            function n(e) {
                return "function" == typeof e
            }

            function r(e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }
            var i = Date.now || function() {
                return (new Date).getTime()
            };
            e.objectOrFunction = t, e.isFunction = n, e.isArray = r, e.now = i
        }), t("promise/polyfill").polyfill()
    }(),
    function() {
        "use strict";

        function e(t) {
            this.map = {};
            var n = this;
            t instanceof e ? t.forEach(function(e, t) {
                t.forEach(function(t) {
                    n.append(e, t)
                })
            }) : t && Object.getOwnPropertyNames(t).forEach(function(e) {
                n.append(e, t[e])
            })
        }

        function t(e) {
            return e.bodyUsed ? Promise.reject(new TypeError("Body already consumed")) : void(e.bodyUsed = !0)
        }

        function n() {
            return this.body = null, this.bodyUsed = !1, this.arrayBuffer = function() {
                throw new Error("Not implemented yet")
            }, this.blob = function() {
                var e = t(this);
                return e ? e : Promise.resolve(new Blob([this.body]))
            }, this.formData = function() {
                return Promise.resolve(o(this.body))
            }, this.json = function() {
                var e = t(this);
                if (e) return e;
                var n = this.body;
                return new Promise(function(e, t) {
                    try {
                        e(JSON.parse(n))
                    } catch (r) {
                        t(r)
                    }
                })
            }, this.text = function() {
                var e = t(this);
                return e ? e : Promise.resolve(this.body)
            }, this
        }

        function r(t, n) {
            n = n || {}, this.url = t, this.body = n.body, this.credentials = n.credentials || null, this.headers = new e(n.headers), this.method = n.method || "GET", this.mode = n.mode || null, this.referrer = null
        }

        function i(e) {
            return Object.getOwnPropertyNames(e).filter(function(t) {
                return void 0 !== e[t]
            }).map(function(t) {
                var n = null === e[t] ? "" : e[t];
                return encodeURIComponent(t) + "=" + encodeURIComponent(n)
            }).join("&").replace(/%20/g, "+")
        }

        function o(e) {
            var t = new FormData;
            return e.trim().split("&").forEach(function(e) {
                if (e) {
                    var n = e.split("="),
                        r = n.shift().replace(/\+/g, " "),
                        i = n.join("=").replace(/\+/g, " ");
                    t.append(decodeURIComponent(r), decodeURIComponent(i))
                }
            }), t
        }

        function a(e) {
            try {
                return Object.getPrototypeOf(e) === Object.prototype
            } catch (t) {
                return !1
            }
        }

        function s(t) {
            var n = new e,
                r = t.getAllResponseHeaders().trim().split("\n");
            return r.forEach(function(e) {
                var t = e.trim().split(":"),
                    r = t.shift().trim(),
                    i = t.join(":").trim();
                n.append(r, i)
            }), n
        }

        function c(e, t) {
            this.body = e, this.type = "default", this.url = null, this.status = t.status, this.statusText = t.statusText, this.headers = t.headers
        }
        window.fetch || (e.prototype.append = function(e, t) {
            var n = this.map[e];
            n || (n = [], this.map[e] = n), n.push(t)
        }, e.prototype.delete = function(e) {
            delete this.map[e]
        }, e.prototype.get = function(e) {
            var t = this.map[e];
            return t ? t[0] : null
        }, e.prototype.getAll = function(e) {
            return this.map[e] || []
        }, e.prototype.has = function(e) {
            return this.map.hasOwnProperty(e)
        }, e.prototype.set = function(e, t) {
            this.map[e] = [t]
        }, e.prototype.forEach = function(e) {
            var t = this;
            Object.getOwnPropertyNames(this.map).forEach(function(n) {
                e(n, t.map[n])
            })
        }, r.prototype.fetch = function() {
            var e = this;
            return new Promise(function(t, n) {
                var r = new XMLHttpRequest;
                r.onload = function() {
                    var e = {
                        status: r.status,
                        statusText: r.statusText,
                        headers: s(r)
                    };
                    t(new c(r.responseText, e))
                }, r.onerror = function() {
                    n()
                }, r.open(e.method, e.url), e.headers.forEach(function(e, t) {
                    t.forEach(function(t) {
                        r.setRequestHeader(e, t)
                    })
                });
                var o = e.body;
                a(e.body) && (r.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"), o = i(e.body)), r.send(o)
            })
        }, n.call(r.prototype), n.call(c.prototype), window.fetch = function(e, t) {
            return new r(e, t).fetch()
        })
    }(),
    /*
     * Copyright 2012 The Polymer Authors. All rights reserved.
     * Use of this source code is governed by a BSD-style
     * license that can be found in the LICENSE file.
     */
    "undefined" == typeof WeakMap && ! function() {
        var e = Object.defineProperty,
            t = Date.now() % 1e9,
            n = function() {
                this.name = "__st" + (1e9 * Math.random() >>> 0) + (t++ +"__")
            };
        n.prototype = {
            set: function(t, n) {
                var r = t[this.name];
                r && r[0] === t ? r[1] = n : e(t, this.name, {
                    value: [t, n],
                    writable: !0
                })
            },
            get: function(e) {
                var t;
                return (t = e[this.name]) && t[0] === e ? t[1] : void 0
            },
            "delete": function(e) {
                this.set(e, void 0)
            }
        }, window.WeakMap = n
    }(),
    /*
     * Copyright 2012 The Polymer Authors. All rights reserved.
     * Use of this source code is goverened by a BSD-style
     * license that can be found in the LICENSE file.
     */
    function(e) {
        function t(e) {
            w.push(e), b || (b = !0, v(r))
        }

        function n(e) {
            return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e
        }

        function r() {
            b = !1;
            var e = w;
            w = [], e.sort(function(e, t) {
                return e.uid_ - t.uid_
            });
            var t = !1;
            e.forEach(function(e) {
                var n = e.takeRecords();
                i(e), n.length && (e.callback_(n, e), t = !0)
            }), t && r()
        }

        function i(e) {
            e.nodes_.forEach(function(t) {
                var n = m.get(t);
                n && n.forEach(function(t) {
                    t.observer === e && t.removeTransientObservers()
                })
            })
        }

        function o(e, t) {
            for (var n = e; n; n = n.parentNode) {
                var r = m.get(n);
                if (r)
                    for (var i = 0; i < r.length; i++) {
                        var o = r[i],
                            a = o.options;
                        if (n === e || a.subtree) {
                            var s = t(a);
                            s && o.enqueue(s)
                        }
                    }
            }
        }

        function a(e) {
            this.callback_ = e, this.nodes_ = [], this.records_ = [], this.uid_ = ++x
        }

        function s(e, t) {
            this.type = e, this.target = t, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null
        }

        function c(e) {
            var t = new s(e.type, e.target);
            return t.addedNodes = e.addedNodes.slice(), t.removedNodes = e.removedNodes.slice(), t.previousSibling = e.previousSibling, t.nextSibling = e.nextSibling, t.attributeName = e.attributeName, t.attributeNamespace = e.attributeNamespace, t.oldValue = e.oldValue, t
        }

        function l(e, t) {
            return T = new s(e, t)
        }

        function u(e) {
            return E ? E : (E = c(T), E.oldValue = e, E)
        }

        function f() {
            T = E = void 0
        }

        function d(e) {
            return e === E || e === T
        }

        function h(e, t) {
            return e === t ? e : E && d(e) ? E : null
        }

        function p(e, t, n) {
            this.observer = e, this.target = t, this.options = n, this.transientObservedNodes = []
        }
        var m = new WeakMap,
            v = window.msSetImmediate;
        if (!v) {
            var g = [],
                y = String(Math.random());
            window.addEventListener("message", function(e) {
                if (e.data === y) {
                    var t = g;
                    g = [], t.forEach(function(e) {
                        e()
                    })
                }
            }), v = function(e) {
                g.push(e), window.postMessage(y, "*")
            }
        }
        var b = !1,
            w = [],
            x = 0;
        a.prototype = {
            observe: function(e, t) {
                if (e = n(e), !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData) throw new SyntaxError;
                var r = m.get(e);
                r || m.set(e, r = []);
                for (var i, o = 0; o < r.length; o++)
                    if (r[o].observer === this) {
                        i = r[o], i.removeListeners(), i.options = t;
                        break
                    }
                i || (i = new p(this, e, t), r.push(i), this.nodes_.push(e)), i.addListeners()
            },
            disconnect: function() {
                this.nodes_.forEach(function(e) {
                    for (var t = m.get(e), n = 0; n < t.length; n++) {
                        var r = t[n];
                        if (r.observer === this) {
                            r.removeListeners(), t.splice(n, 1);
                            break
                        }
                    }
                }, this), this.records_ = []
            },
            takeRecords: function() {
                var e = this.records_;
                return this.records_ = [], e
            }
        };
        var T, E;
        p.prototype = {
            enqueue: function(e) {
                var n = this.observer.records_,
                    r = n.length;
                if (n.length > 0) {
                    var i = n[r - 1],
                        o = h(i, e);
                    if (o) return void(n[r - 1] = o)
                } else t(this.observer);
                n[r] = e
            },
            addListeners: function() {
                this.addListeners_(this.target)
            },
            addListeners_: function(e) {
                var t = this.options;
                t.attributes && e.addEventListener("DOMAttrModified", this, !0), t.characterData && e.addEventListener("DOMCharacterDataModified", this, !0), t.childList && e.addEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this, !0)
            },
            removeListeners: function() {
                this.removeListeners_(this.target)
            },
            removeListeners_: function(e) {
                var t = this.options;
                t.attributes && e.removeEventListener("DOMAttrModified", this, !0), t.characterData && e.removeEventListener("DOMCharacterDataModified", this, !0), t.childList && e.removeEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this, !0)
            },
            addTransientObserver: function(e) {
                if (e !== this.target) {
                    this.addListeners_(e), this.transientObservedNodes.push(e);
                    var t = m.get(e);
                    t || m.set(e, t = []), t.push(this)
                }
            },
            removeTransientObservers: function() {
                var e = this.transientObservedNodes;
                this.transientObservedNodes = [], e.forEach(function(e) {
                    this.removeListeners_(e);
                    for (var t = m.get(e), n = 0; n < t.length; n++)
                        if (t[n] === this) {
                            t.splice(n, 1);
                            break
                        }
                }, this)
            },
            handleEvent: function(e) {
                switch (e.stopImmediatePropagation(), e.type) {
                    case "DOMAttrModified":
                        var t = e.attrName,
                            n = e.relatedNode.namespaceURI,
                            r = e.target,
                            i = new l("attributes", r);
                        i.attributeName = t, i.attributeNamespace = n;
                        var a = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                        o(r, function(e) {
                            return !e.attributes || e.attributeFilter && e.attributeFilter.length && -1 === e.attributeFilter.indexOf(t) && -1 === e.attributeFilter.indexOf(n) ? void 0 : e.attributeOldValue ? u(a) : i
                        });
                        break;
                    case "DOMCharacterDataModified":
                        var r = e.target,
                            i = l("characterData", r),
                            a = e.prevValue;
                        o(r, function(e) {
                            return e.characterData ? e.characterDataOldValue ? u(a) : i : void 0
                        });
                        break;
                    case "DOMNodeRemoved":
                        this.addTransientObserver(e.target);
                    case "DOMNodeInserted":
                        var s, c, r = e.relatedNode,
                            d = e.target;
                        "DOMNodeInserted" === e.type ? (s = [d], c = []) : (s = [], c = [d]);
                        var h = d.previousSibling,
                            p = d.nextSibling,
                            i = l("childList", r);
                        i.addedNodes = s, i.removedNodes = c, i.previousSibling = h, i.nextSibling = p, o(r, function(e) {
                            return e.childList ? i : void 0
                        })
                }
                f()
            }
        }, e.JsMutationObserver = a, e.MutationObserver || (e.MutationObserver = a)
    }(this),
    /*
    Copyright 2013 The Polymer Authors. All rights reserved.
    Use of this source code is governed by a BSD-style
    license that can be found in the LICENSE file.
    */
    window.CustomElements = window.CustomElements || {
        flags: {}
    },
    /*
    Copyright 2013 The Polymer Authors. All rights reserved.
    Use of this source code is governed by a BSD-style
    license that can be found in the LICENSE file.
    */
    function(e) {
        function t(e, n, r) {
            var i = e.firstElementChild;
            if (!i)
                for (i = e.firstChild; i && i.nodeType !== Node.ELEMENT_NODE;) i = i.nextSibling;
            for (; i;) n(i, r) !== !0 && t(i, n, r), i = i.nextElementSibling;
            return null
        }

        function n(e, t) {
            for (var n = e.shadowRoot; n;) r(n, t), n = n.olderShadowRoot
        }

        function r(e, r) {
            t(e, function(e) {
                return r(e) ? !0 : void n(e, r)
            }), n(e, r)
        }

        function i(e) {
            return s(e) ? (c(e), !0) : void f(e)
        }

        function o(e) {
            r(e, function(e) {
                return i(e) ? !0 : void 0
            })
        }

        function a(e) {
            return i(e) || o(e)
        }

        function s(t) {
            if (!t.__upgraded__ && t.nodeType === Node.ELEMENT_NODE) {
                var n = t.getAttribute("is") || t.localName,
                    r = e.registry[n];
                if (r) return k.dom && console.group("upgrade:", t.localName), e.upgrade(t), k.dom && console.groupEnd(), !0
            }
        }

        function c(e) {
            f(e), g(e) && r(e, function(e) {
                f(e)
            })
        }

        function l(e) {
            if (D.push(e), !A) {
                A = !0;
                var t = window.Platform && window.Platform.endOfMicrotask || setTimeout;
                t(u)
            }
        }

        function u() {
            A = !1;
            for (var e, t = D, n = 0, r = t.length; r > n && (e = t[n]); n++) e();
            D = []
        }

        function f(e) {
            N ? l(function() {
                d(e)
            }) : d(e)
        }

        function d(e) {
            (e.attachedCallback || e.detachedCallback || e.__upgraded__ && k.dom) && (k.dom && console.group("inserted:", e.localName), g(e) && (e.__inserted = (e.__inserted || 0) + 1, e.__inserted < 1 && (e.__inserted = 1), e.__inserted > 1 ? k.dom && console.warn("inserted:", e.localName, "insert/remove count:", e.__inserted) : e.attachedCallback && (k.dom && console.log("inserted:", e.localName), e.attachedCallback())), k.dom && console.groupEnd())
        }

        function h(e) {
            p(e), r(e, function(e) {
                p(e)
            })
        }

        function p(e) {
            N ? l(function() {
                m(e)
            }) : m(e)
        }

        function m(e) {
            (e.attachedCallback || e.detachedCallback || e.__upgraded__ && k.dom) && (k.dom && console.group("removed:", e.localName), g(e) || (e.__inserted = (e.__inserted || 0) - 1, e.__inserted > 0 && (e.__inserted = 0), e.__inserted < 0 ? k.dom && console.warn("removed:", e.localName, "insert/remove count:", e.__inserted) : e.detachedCallback && e.detachedCallback()), k.dom && console.groupEnd())
        }

        function v(e) {
            return window.ShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(e) : e
        }

        function g(e) {
            for (var t = e, n = v(document); t;) {
                if (t == n) return !0;
                t = t.parentNode || t.host
            }
        }

        function y(e) {
            if (e.shadowRoot && !e.shadowRoot.__watched) {
                k.dom && console.log("watching shadow-root for: ", e.localName);
                for (var t = e.shadowRoot; t;) b(t), t = t.olderShadowRoot
            }
        }

        function b(e) {
            e.__watched || (T(e), e.__watched = !0)
        }

        function w(e) {
            if (k.dom) {
                var t = e[0];
                if (t && "childList" === t.type && t.addedNodes && t.addedNodes) {
                    for (var n = t.addedNodes[0]; n && n !== document && !n.host;) n = n.parentNode;
                    var r = n && (n.URL || n._URL || n.host && n.host.localName) || "";
                    r = r.split("/?").shift().split("/").pop()
                }
                console.group("mutations (%d) [%s]", e.length, r || "")
            }
            e.forEach(function(e) {
                "childList" === e.type && (P(e.addedNodes, function(e) {
                    e.localName && a(e)
                }), P(e.removedNodes, function(e) {
                    e.localName && h(e)
                }))
            }), k.dom && console.groupEnd()
        }

        function x() {
            w(j.takeRecords()), u()
        }

        function T(e) {
            j.observe(e, {
                childList: !0,
                subtree: !0
            })
        }

        function E(e) {
            T(e)
        }

        function _(e) {
            k.dom && console.group("upgradeDocument: ", e.baseURI.split("/").pop()), a(e), k.dom && console.groupEnd()
        }

        function C(e) {
            e = v(e);
            for (var t, n = e.querySelectorAll("link[rel=" + S + "]"), r = 0, i = n.length; i > r && (t = n[r]); r++) t.import && t.import.__parsed && C(t.import);
            _(e)
        }
        var k = window.logFlags || {},
            S = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : "none",
            N = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;
        e.hasPolyfillMutations = N;
        var A = !1,
            D = [],
            j = new MutationObserver(w),
            P = Array.prototype.forEach.call.bind(Array.prototype.forEach);
        e.IMPORT_LINK_TYPE = S, e.watchShadow = y, e.upgradeDocumentTree = C, e.upgradeAll = a, e.upgradeSubtree = o, e.insertedNode = c, e.observeDocument = E, e.upgradeDocument = _, e.takeRecords = x
    }(window.CustomElements),
    /*
     * Copyright 2013 The Polymer Authors. All rights reserved.
     * Use of this source code is governed by a BSD-style
     * license that can be found in the LICENSE file.
     */
    function(e) {
        function t(t, a) {
            var s = a || {};
            if (!t) throw new Error("document.registerElement: first argument `name` must not be empty");
            if (t.indexOf("-") < 0) throw new Error("document.registerElement: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(t) + "'.");
            if (n(t)) throw new Error("Failed to execute 'registerElement' on 'Document': Registration failed for type '" + String(t) + "'. The type name is invalid.");
            if (h(t)) throw new Error("DuplicateDefinitionError: a type with name '" + String(t) + "' is already registered");
            if (!s.prototype) throw new Error("Options missing required prototype property");
            return s.__name = t.toLowerCase(), s.lifecycle = s.lifecycle || {}, s.ancestry = r(s.extends), i(s), o(s), f(s.prototype), p(s.__name, s), s.ctor = m(s), s.ctor.prototype = s.prototype, s.prototype.constructor = s.ctor, e.ready && e.upgradeDocumentTree(document), s.ctor
        }

        function n(e) {
            for (var t = 0; t < _.length; t++)
                if (e === _[t]) return !0
        }

        function r(e) {
            var t = h(e);
            return t ? r(t.extends).concat([t]) : []
        }

        function i(e) {
            for (var t, n = e.extends, r = 0; t = e.ancestry[r]; r++) n = t.is && t.tag;
            e.tag = n || e.__name, n && (e.is = e.__name)
        }

        function o(e) {
            if (!Object.__proto__) {
                var t = HTMLElement.prototype;
                if (e.is) {
                    var n = document.createElement(e.tag),
                        r = Object.getPrototypeOf(n);
                    r === e.prototype && (t = r)
                }
                for (var i, o = e.prototype; o && o !== t;) i = Object.getPrototypeOf(o), o.__proto__ = i, o = i;
                e.native = t
            }
        }

        function a(e) {
            return s(S(e.tag), e)
        }

        function s(t, n) {
            return n.is && t.setAttribute("is", n.is), t.removeAttribute("unresolved"), c(t, n), t.__upgraded__ = !0, u(t), e.insertedNode(t), e.upgradeSubtree(t), t
        }

        function c(e, t) {
            Object.__proto__ ? e.__proto__ = t.prototype : (l(e, t.prototype, t.native), e.__proto__ = t.prototype)
        }

        function l(e, t, n) {
            for (var r = {}, i = t; i !== n && i !== HTMLElement.prototype;) {
                for (var o, a = Object.getOwnPropertyNames(i), s = 0; o = a[s]; s++) r[o] || (Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(i, o)), r[o] = 1);
                i = Object.getPrototypeOf(i)
            }
        }

        function u(e) {
            e.createdCallback && e.createdCallback()
        }

        function f(e) {
            if (!e.setAttribute._polyfilled) {
                var t = e.setAttribute;
                e.setAttribute = function(e, n) {
                    d.call(this, e, n, t)
                };
                var n = e.removeAttribute;
                e.removeAttribute = function(e) {
                    d.call(this, e, null, n)
                }, e.setAttribute._polyfilled = !0
            }
        }

        function d(e, t, n) {
            var r = this.getAttribute(e);
            n.apply(this, arguments);
            var i = this.getAttribute(e);
            this.attributeChangedCallback && i !== r && this.attributeChangedCallback(e, r, i)
        }

        function h(e) {
            return e ? C[e.toLowerCase()] : void 0
        }

        function p(e, t) {
            C[e] = t
        }

        function m(e) {
            return function() {
                return a(e)
            }
        }

        function v(e, t, n) {
            return e === k ? g(t, n) : N(e, t)
        }

        function g(e, t) {
            var n = h(t || e);
            if (n) {
                if (e == n.tag && t == n.is) return new n.ctor;
                if (!t && !n.is) return new n.ctor
            }
            if (t) {
                var r = g(e);
                return r.setAttribute("is", t), r
            }
            var r = S(e);
            return e.indexOf("-") >= 0 && c(r, HTMLElement), r
        }

        function y(e) {
            if (!e.__upgraded__ && e.nodeType === Node.ELEMENT_NODE) {
                var t = e.getAttribute("is"),
                    n = h(t || e.localName);
                if (n) {
                    if (t && n.tag == e.localName) return s(e, n);
                    if (!t && !n.extends) return s(e, n)
                }
            }
        }

        function b(t) {
            var n = A.call(this, t);
            return e.upgradeAll(n), n
        }
        e || (e = window.CustomElements = {
            flags: {}
        });
        var w = e.flags,
            x = Boolean(document.registerElement),
            T = !w.register && x && !window.ShadowDOMPolyfill;
        if (T) {
            var E = function() {};
            e.registry = {}, e.upgradeElement = E, e.watchShadow = E, e.upgrade = E, e.upgradeAll = E, e.upgradeSubtree = E, e.observeDocument = E, e.upgradeDocument = E, e.upgradeDocumentTree = E, e.takeRecords = E, e.reservedTagList = []
        } else {
            var _ = ["annotation-xml", "color-profile", "font-face", "font-face-src", "font-face-uri", "font-face-format", "font-face-name", "missing-glyph"],
                C = {},
                k = "http://www.w3.org/1999/xhtml",
                S = document.createElement.bind(document),
                N = document.createElementNS.bind(document),
                A = Node.prototype.cloneNode;
            document.registerElement = t, document.createElement = g, document.createElementNS = v, Node.prototype.cloneNode = b, e.registry = C, e.upgrade = y
        }
        var D;
        D = Object.__proto__ || T ? function(e, t) {
            return e instanceof t
        } : function(e, t) {
            for (var n = e; n;) {
                if (n === t.prototype) return !0;
                n = n.__proto__
            }
            return !1
        }, e.instanceof = D, e.reservedTagList = _, document.register = document.registerElement, e.hasNative = x, e.useNative = T
    }(window.CustomElements),
    /*
     * Copyright 2013 The Polymer Authors. All rights reserved.
     * Use of this source code is governed by a BSD-style
     * license that can be found in the LICENSE file.
     */
    function(e) {
        function t(e) {
            return "link" === e.localName && e.getAttribute("rel") === n
        }
        var n = e.IMPORT_LINK_TYPE,
            r = {
                selectors: ["link[rel=" + n + "]"],
                map: {
                    link: "parseLink"
                },
                parse: function(e) {
                    if (!e.__parsed) {
                        e.__parsed = !0;
                        var t = e.querySelectorAll(r.selectors);
                        i(t, function(e) {
                            r[r.map[e.localName]](e)
                        }), CustomElements.upgradeDocument(e), CustomElements.observeDocument(e)
                    }
                },
                parseLink: function(e) {
                    t(e) && this.parseImport(e)
                },
                parseImport: function(e) {
                    e.import && r.parse(e.import)
                }
            },
            i = Array.prototype.forEach.call.bind(Array.prototype.forEach);
        e.parser = r, e.IMPORT_LINK_TYPE = n
    }(window.CustomElements),
    /*
     * Copyright 2013 The Polymer Authors. All rights reserved.
     * Use of this source code is governed by a BSD-style
     * license that can be found in the LICENSE file.
     */
    function(e) {
        function t() {
            CustomElements.parser.parse(document), CustomElements.upgradeDocument(document);
            var e = window.Platform && Platform.endOfMicrotask ? Platform.endOfMicrotask : setTimeout;
            e(function() {
                CustomElements.ready = !0, CustomElements.readyTime = Date.now(), window.HTMLImports && (CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime), document.dispatchEvent(new CustomEvent("WebComponentsReady", {
                    bubbles: !0
                })), window.HTMLImports && (HTMLImports.__importsParsingHook = function(e) {
                    CustomElements.parser.parse(e.import)
                })
            })
        }
        if ("function" != typeof window.CustomEvent && (window.CustomEvent = function(e) {
                var t = document.createEvent("HTMLEvents");
                return t.initEvent(e, !0, !0), t
            }), "complete" === document.readyState || e.flags.eager) t();
        else if ("interactive" !== document.readyState || window.attachEvent || window.HTMLImports && !window.HTMLImports.ready) {
            var n = window.HTMLImports && !HTMLImports.ready ? "HTMLImportsLoaded" : "DOMContentLoaded";
            window.addEventListener(n, t)
        } else t()
    }(window.CustomElements), "document" in self && ("classList" in document.createElement("_") ? ! function() {
        "use strict";
        var e = document.createElement("_");
        if (e.classList.add("c1", "c2"), !e.classList.contains("c2")) {
            var t = function(e) {
                var t = DOMTokenList.prototype[e];
                DOMTokenList.prototype[e] = function(e) {
                    var n, r = arguments.length;
                    for (n = 0; r > n; n++) e = arguments[n], t.call(this, e)
                }
            };
            t("add"), t("remove")
        }
        if (e.classList.toggle("c3", !1), e.classList.contains("c3")) {
            var n = DOMTokenList.prototype.toggle;
            DOMTokenList.prototype.toggle = function(e, t) {
                return 1 in arguments && !this.contains(e) == !t ? t : n.call(this, e)
            }
        }
        e = null
    }() : ! function(e) {
        "use strict";
        if ("Element" in e) {
            var t = "classList",
                n = "prototype",
                r = e.Element[n],
                i = Object,
                o = String[n].trim || function() {
                    return this.replace(/^\s+|\s+$/g, "")
                },
                a = Array[n].indexOf || function(e) {
                    for (var t = 0, n = this.length; n > t; t++)
                        if (t in this && this[t] === e) return t;
                    return -1
                },
                s = function(e, t) {
                    this.name = e, this.code = DOMException[e], this.message = t
                },
                c = function(e, t) {
                    if ("" === t) throw new s("SYNTAX_ERR", "An invalid or illegal string was specified");
                    if (/\s/.test(t)) throw new s("INVALID_CHARACTER_ERR", "String contains an invalid character");
                    return a.call(e, t)
                },
                l = function(e) {
                    for (var t = o.call(e.getAttribute("class") || ""), n = t ? t.split(/\s+/) : [], r = 0, i = n.length; i > r; r++) this.push(n[r]);
                    this._updateClassName = function() {
                        e.setAttribute("class", this.toString())
                    }
                },
                u = l[n] = [],
                f = function() {
                    return new l(this)
                };
            if (s[n] = Error[n], u.item = function(e) {
                    return this[e] || null
                }, u.contains = function(e) {
                    return e += "", -1 !== c(this, e)
                }, u.add = function() {
                    var e, t = arguments,
                        n = 0,
                        r = t.length,
                        i = !1;
                    do e = t[n] + "", -1 === c(this, e) && (this.push(e), i = !0); while (++n < r);
                    i && this._updateClassName()
                }, u.remove = function() {
                    var e, t, n = arguments,
                        r = 0,
                        i = n.length,
                        o = !1;
                    do
                        for (e = n[r] + "", t = c(this, e); - 1 !== t;) this.splice(t, 1), o = !0, t = c(this, e); while (++r < i);
                    o && this._updateClassName()
                }, u.toggle = function(e, t) {
                    e += "";
                    var n = this.contains(e),
                        r = n ? t !== !0 && "remove" : t !== !1 && "add";
                    return r && this[r](e), t === !0 || t === !1 ? t : !n
                }, u.toString = function() {
                    return this.join(" ")
                }, i.defineProperty) {
                var d = {
                    get: f,
                    enumerable: !0,
                    configurable: !0
                };
                try {
                    i.defineProperty(r, t, d)
                } catch (h) {
                    -2146823252 === h.number && (d.enumerable = !1, i.defineProperty(r, t, d))
                }
            } else i[n].__defineGetter__ && r.__defineGetter__(t, f)
        }
    }(self)),
    /**
     * requestAnimationFrame version: "0.0.17" Copyright (c) 2011-2012, Cyril Agosta ( cyril.agosta.dev@gmail.com) All Rights Reserved.
     * Available via the MIT license.
     * see: http://github.com/cagosta/requestAnimationFrame for details
     *
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
     * requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
     * MIT license
     *
     */
    function() {
        if ("undefined" != typeof window) {
            if (window.requestAnimationFrame) return window.requestAnimationFrame;
            if (window.webkitRequestAnimationFrame) return window.requestAnimationFrame = window.webkitRequestAnimationFrame, window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame, window.requestAnimationFrame;
            var e = 0;
            window.requestAnimationFrame = function(t) {
                var n = (new Date).getTime(),
                    r = Math.max(0, 16 - (n - e)),
                    i = window.setTimeout(function() {
                        t(n + r)
                    }, r);
                return e = n + r, i
            }, window.cancelAnimationFrame = function(e) {
                clearTimeout(e)
            }, "function" == typeof define && define(function() {
                return window.requestAnimationFrame
            })
        }
    }(),
    /* Any copyright is dedicated to the Public Domain.
     * http://creativecommons.org/publicdomain/zero/1.0/ */
    function(e) {
        "use strict";

        function t(e) {
            return void 0 !== d[e]
        }

        function n() {
            s.call(this), this._isInvalid = !0
        }

        function r(e) {
            return "" == e && n.call(this), e.toLowerCase()
        }

        function i(e) {
            var t = e.charCodeAt(0);
            return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 63, 96].indexOf(t) ? e : encodeURIComponent(e)
        }

        function o(e) {
            var t = e.charCodeAt(0);
            return t > 32 && 127 > t && -1 == [34, 35, 60, 62, 96].indexOf(t) ? e : encodeURIComponent(e)
        }

        function a(e, a, s) {
            function c(e) {
                b.push(e)
            }
            var l = a || "scheme start",
                u = 0,
                f = "",
                g = !1,
                y = !1,
                b = [];
            e: for (;
                (e[u - 1] != p || 0 == u) && !this._isInvalid;) {
                var w = e[u];
                switch (l) {
                    case "scheme start":
                        if (!w || !m.test(w)) {
                            if (a) {
                                c("Invalid scheme.");
                                break e
                            }
                            f = "", l = "no scheme";
                            continue
                        }
                        f += w.toLowerCase(), l = "scheme";
                        break;
                    case "scheme":
                        if (w && v.test(w)) f += w.toLowerCase();
                        else {
                            if (":" != w) {
                                if (a) {
                                    if (p == w) break e;
                                    c("Code point not allowed in scheme: " + w);
                                    break e
                                }
                                f = "", u = 0, l = "no scheme";
                                continue
                            }
                            if (this._scheme = f, f = "", a) break e;
                            t(this._scheme) && (this._isRelative = !0), l = "file" == this._scheme ? "relative" : this._isRelative && s && s._scheme == this._scheme ? "relative or authority" : this._isRelative ? "authority first slash" : "scheme data"
                        }
                        break;
                    case "scheme data":
                        "?" == w ? (query = "?", l = "query") : "#" == w ? (this._fragment = "#", l = "fragment") : p != w && "	" != w && "\n" != w && "\r" != w && (this._schemeData += i(w));
                        break;
                    case "no scheme":
                        if (s && t(s._scheme)) {
                            l = "relative";
                            continue
                        }
                        c("Missing scheme."), n.call(this);
                        break;
                    case "relative or authority":
                        if ("/" != w || "/" != e[u + 1]) {
                            c("Expected /, got: " + w), l = "relative";
                            continue
                        }
                        l = "authority ignore slashes";
                        break;
                    case "relative":
                        if (this._isRelative = !0, "file" != this._scheme && (this._scheme = s._scheme), p == w) {
                            this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query;
                            break e
                        }
                        if ("/" == w || "\\" == w) "\\" == w && c("\\ is an invalid code point."), l = "relative slash";
                        else if ("?" == w) this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = "?", l = "query";
                        else {
                            if ("#" != w) {
                                var x = e[u + 1],
                                    T = e[u + 2];
                                ("file" != this._scheme || !m.test(w) || ":" != x && "|" != x || p != T && "/" != T && "\\" != T && "?" != T && "#" != T) && (this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._path.pop()), l = "relative path";
                                continue
                            }
                            this._host = s._host, this._port = s._port, this._path = s._path.slice(), this._query = s._query, this._fragment = "#", l = "fragment"
                        }
                        break;
                    case "relative slash":
                        if ("/" != w && "\\" != w) {
                            "file" != this._scheme && (this._host = s._host, this._port = s._port), l = "relative path";
                            continue
                        }
                        "\\" == w && c("\\ is an invalid code point."), l = "file" == this._scheme ? "file host" : "authority ignore slashes";
                        break;
                    case "authority first slash":
                        if ("/" != w) {
                            c("Expected '/', got: " + w), l = "authority ignore slashes";
                            continue
                        }
                        l = "authority second slash";
                        break;
                    case "authority second slash":
                        if (l = "authority ignore slashes", "/" != w) {
                            c("Expected '/', got: " + w);
                            continue
                        }
                        break;
                    case "authority ignore slashes":
                        if ("/" != w && "\\" != w) {
                            l = "authority";
                            continue
                        }
                        c("Expected authority, got: " + w);
                        break;
                    case "authority":
                        if ("@" == w) {
                            g && (c("@ already seen."), f += "%40"), g = !0;
                            for (var E = 0; E < f.length; E++) {
                                var _ = f[E];
                                if ("	" != _ && "\n" != _ && "\r" != _)
                                    if (":" != _ || null !== this._password) {
                                        var C = i(_);
                                        null !== this._password ? this._password += C : this._username += C
                                    } else this._password = "";
                                else c("Invalid whitespace in authority.")
                            }
                            f = ""
                        } else {
                            if (p == w || "/" == w || "\\" == w || "?" == w || "#" == w) {
                                u -= f.length, f = "", l = "host";
                                continue
                            }
                            f += w
                        }
                        break;
                    case "file host":
                        if (p == w || "/" == w || "\\" == w || "?" == w || "#" == w) {
                            2 != f.length || !m.test(f[0]) || ":" != f[1] && "|" != f[1] ? 0 == f.length ? l = "relative path start" : (this._host = r.call(this, f), f = "", l = "relative path start") : l = "relative path";
                            continue
                        }
                        "	" == w || "\n" == w || "\r" == w ? c("Invalid whitespace in file host.") : f += w;
                        break;
                    case "host":
                    case "hostname":
                        if (":" != w || y) {
                            if (p == w || "/" == w || "\\" == w || "?" == w || "#" == w) {
                                if (this._host = r.call(this, f), f = "", l = "relative path start", a) break e;
                                continue
                            }
                            "	" != w && "\n" != w && "\r" != w ? ("[" == w ? y = !0 : "]" == w && (y = !1), f += w) : c("Invalid code point in host/hostname: " + w)
                        } else if (this._host = r.call(this, f), f = "", l = "port", "hostname" == a) break e;
                        break;
                    case "port":
                        if (/[0-9]/.test(w)) f += w;
                        else {
                            if (p == w || "/" == w || "\\" == w || "?" == w || "#" == w || a) {
                                if ("" != f) {
                                    var k = parseInt(f, 10);
                                    k != d[this._scheme] && (this._port = k + ""), f = ""
                                }
                                if (a) break e;
                                l = "relative path start";
                                continue
                            }
                            "	" == w || "\n" == w || "\r" == w ? c("Invalid code point in port: " + w) : n.call(this)
                        }
                        break;
                    case "relative path start":
                        if ("\\" == w && c("'\\' not allowed in path."), l = "relative path", "/" != w && "\\" != w) continue;
                        break;
                    case "relative path":
                        if (p != w && "/" != w && "\\" != w && (a || "?" != w && "#" != w)) "	" != w && "\n" != w && "\r" != w && (f += i(w));
                        else {
                            "\\" == w && c("\\ not allowed in relative path.");
                            var S;
                            (S = h[f.toLowerCase()]) && (f = S), ".." == f ? (this._path.pop(), "/" != w && "\\" != w && this._path.push("")) : "." == f && "/" != w && "\\" != w ? this._path.push("") : "." != f && ("file" == this._scheme && 0 == this._path.length && 2 == f.length && m.test(f[0]) && "|" == f[1] && (f = f[0] + ":"), this._path.push(f)), f = "", "?" == w ? (this._query = "?", l = "query") : "#" == w && (this._fragment = "#", l = "fragment")
                        }
                        break;
                    case "query":
                        a || "#" != w ? p != w && "	" != w && "\n" != w && "\r" != w && (this._query += o(w)) : (this._fragment = "#", l = "fragment");
                        break;
                    case "fragment":
                        p != w && "	" != w && "\n" != w && "\r" != w && (this._fragment += w)
                }
                u++
            }
        }

        function s() {
            this._scheme = "", this._schemeData = "", this._username = "", this._password = null, this._host = "", this._port = "", this._path = [], this._query = "", this._fragment = "", this._isInvalid = !1, this._isRelative = !1
        }

        function c(e, t) {
            void 0 === t || t instanceof c || (t = new c(String(t))), this._url = e, s.call(this);
            var n = e.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, "");
            a.call(this, n, null, t)
        }
        var l = !1;
        if (!e.forceJURL) try {
            var u = new URL("b", "http://a");
            l = "http://a/b" === u.href
        } catch (f) {}
        if (!l) {
            var d = Object.create(null);
            d.ftp = 21, d.file = 0, d.gopher = 70, d.http = 80, d.https = 443, d.ws = 80, d.wss = 443;
            var h = Object.create(null);
            h["%2e"] = ".", h[".%2e"] = "..", h["%2e."] = "..", h["%2e%2e"] = "..";
            var p = void 0,
                m = /[a-zA-Z]/,
                v = /[a-zA-Z0-9\+\-\.]/;
            c.prototype = {get href() {
                    if (this._isInvalid) return this._url;
                    var e = "";
                    return ("" != this._username || null != this._password) && (e = this._username + (null != this._password ? ":" + this._password : "") + "@"), this.protocol + (this._isRelative ? "//" + e + this.host : "") + this.pathname + this._query + this._fragment
                },
                set href(e) {
                    s.call(this), a.call(this, e)
                },
                get protocol() {
                    return this._scheme + ":"
                },
                set protocol(e) {
                    this._isInvalid || a.call(this, e + ":", "scheme start")
                },
                get host() {
                    return this._isInvalid ? "" : this._port ? this._host + ":" + this._port : this._host
                },
                set host(e) {
                    !this._isInvalid && this._isRelative && a.call(this, e, "host")
                },
                get hostname() {
                    return this._host
                },
                set hostname(e) {
                    !this._isInvalid && this._isRelative && a.call(this, e, "hostname")
                },
                get port() {
                    return this._port
                },
                set port(e) {
                    !this._isInvalid && this._isRelative && a.call(this, e, "port")
                },
                get pathname() {
                    return this._isInvalid ? "" : this._isRelative ? "/" + this._path.join("/") : this._schemeData
                },
                set pathname(e) {
                    !this._isInvalid && this._isRelative && (this._path = [], a.call(this, e, "relative path start"))
                },
                get search() {
                    return this._isInvalid || !this._query || "?" == this._query ? "" : this._query
                },
                set search(e) {
                    !this._isInvalid && this._isRelative && (this._query = "?", "?" == e[0] && (e = e.slice(1)), a.call(this, e, "query"))
                },
                get hash() {
                    return this._isInvalid || !this._fragment || "#" == this._fragment ? "" : this._fragment
                },
                set hash(e) {
                    this._isInvalid || (this._fragment = "#", "#" == e[0] && (e = e.slice(1)), a.call(this, e, "fragment"))
                }
            }, e.URL = c
        }
    }(window),
    /*!
     * jQuery JavaScript Library v2.1.1 -ajax/jsonp,-deprecated,-exports/amd,-wrap
     * http://jquery.com/
     *
     * Includes Sizzle.js
     * http://sizzlejs.com/
     *
     * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
     * Released under the MIT license
     * http://jquery.org/license
     *
     * Date: 2014-05-02T17:09Z
     */
    function(e, t) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
            if (!e.document) throw new Error("jQuery requires a window with a document");
            return t(e)
        } : t(e)
    }("undefined" != typeof window ? window : this, function(e, t) {
        function n(e) {
            var t = e.length,
                n = Z.type(e);
            return "function" === n || Z.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
        }

        function r(e, t, n) {
            if (Z.isFunction(t)) return Z.grep(e, function(e, r) {
                return !!t.call(e, r, e) !== n
            });
            if (t.nodeType) return Z.grep(e, function(e) {
                return e === t !== n
            });
            if ("string" == typeof t) {
                if (st.test(t)) return Z.filter(t, e, n);
                t = Z.filter(t, e)
            }
            return Z.grep(e, function(e) {
                return V.call(t, e) >= 0 !== n
            })
        }

        function i(e, t) {
            for (;
                (e = e[t]) && 1 !== e.nodeType;);
            return e
        }

        function o(e) {
            var t = pt[e] = {};
            return Z.each(e.match(ht) || [], function(e, n) {
                t[n] = !0
            }), t
        }

        function a() {
            J.removeEventListener("DOMContentLoaded", a, !1), e.removeEventListener("load", a, !1), Z.ready()
        }

        function s() {
            Object.defineProperty(this.cache = {}, 0, {
                get: function() {
                    return {}
                }
            }), this.expando = Z.expando + Math.random()
        }

        function c(e, t, n) {
            var r;
            if (void 0 === n && 1 === e.nodeType)
                if (r = "data-" + t.replace(wt, "-$1").toLowerCase(), n = e.getAttribute(r), "string" == typeof n) {
                    try {
                        n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : bt.test(n) ? Z.parseJSON(n) : n
                    } catch (i) {}
                    yt.set(e, t, n)
                } else n = void 0;
            return n
        }

        function l() {
            return !0
        }

        function u() {
            return !1
        }

        function f() {
            try {
                return J.activeElement
            } catch (e) {}
        }

        function d(e, t) {
            return Z.nodeName(e, "table") && Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
        }

        function h(e) {
            return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
        }

        function p(e) {
            var t = Mt.exec(e.type);
            return t ? e.type = t[1] : e.removeAttribute("type"), e
        }

        function m(e, t) {
            for (var n = 0, r = e.length; r > n; n++) gt.set(e[n], "globalEval", !t || gt.get(t[n], "globalEval"))
        }

        function v(e, t) {
            var n, r, i, o, a, s, c, l;
            if (1 === t.nodeType) {
                if (gt.hasData(e) && (o = gt.access(e), a = gt.set(t, o), l = o.events)) {
                    delete a.handle, a.events = {};
                    for (i in l)
                        for (n = 0, r = l[i].length; r > n; n++) Z.event.add(t, i, l[i][n])
                }
                yt.hasData(e) && (s = yt.access(e), c = Z.extend({}, s), yt.set(t, c))
            }
        }

        function g(e, t) {
            var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
            return void 0 === t || t && Z.nodeName(e, t) ? Z.merge([e], n) : n
        }

        function y(e, t) {
            var n = t.nodeName.toLowerCase();
            "input" === n && _t.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
        }

        function b(t, n) {
            var r, i = Z(n.createElement(t)).appendTo(n.body),
                o = e.getDefaultComputedStyle && (r = e.getDefaultComputedStyle(i[0])) ? r.display : Z.css(i[0], "display");
            return i.detach(), o
        }

        function w(e) {
            var t = J,
                n = Ut[e];
            return n || (n = b(e, t), "none" !== n && n || (Rt = (Rt || Z("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = Rt[0].contentDocument, t.write(), t.close(), n = b(e, t), Rt.detach()), Ut[e] = n), n
        }

        function x(e, t, n) {
            var r, i, o, a, s = e.style;
            return n = n || qt(e), n && (a = n.getPropertyValue(t) || n[t]), n && ("" !== a || Z.contains(e.ownerDocument, e) || (a = Z.style(e, t)), zt.test(a) && Ht.test(t) && (r = s.width, i = s.minWidth, o = s.maxWidth, s.minWidth = s.maxWidth = s.width = a, a = n.width, s.width = r, s.minWidth = i, s.maxWidth = o)), void 0 !== a ? a + "" : a
        }

        function T(e, t) {
            return {
                get: function() {
                    return e() ? void delete this.get : (this.get = t).apply(this, arguments)
                }
            }
        }

        function E(e, t) {
            if (t in e) return t;
            for (var n = t[0].toUpperCase() + t.slice(1), r = t, i = Gt.length; i--;)
                if (t = Gt[i] + n, t in e) return t;
            return r
        }

        function _(e, t, n) {
            var r = Wt.exec(t);
            return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
        }

        function C(e, t, n, r, i) {
            for (var o = n === (r ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > o; o += 2) "margin" === n && (a += Z.css(e, n + Tt[o], !0, i)), r ? ("content" === n && (a -= Z.css(e, "padding" + Tt[o], !0, i)), "margin" !== n && (a -= Z.css(e, "border" + Tt[o] + "Width", !0, i))) : (a += Z.css(e, "padding" + Tt[o], !0, i), "padding" !== n && (a += Z.css(e, "border" + Tt[o] + "Width", !0, i)));
            return a
        }

        function k(e, t, n) {
            var r = !0,
                i = "width" === t ? e.offsetWidth : e.offsetHeight,
                o = qt(e),
                a = "border-box" === Z.css(e, "boxSizing", !1, o);
            if (0 >= i || null == i) {
                if (i = x(e, t, o), (0 > i || null == i) && (i = e.style[t]), zt.test(i)) return i;
                r = a && (K.boxSizingReliable() || i === e.style[t]), i = parseFloat(i) || 0
            }
            return i + C(e, t, n || (a ? "border" : "content"), r, o) + "px"
        }

        function S(e, t) {
            for (var n, r, i, o = [], a = 0, s = e.length; s > a; a++) r = e[a], r.style && (o[a] = gt.get(r, "olddisplay"), n = r.style.display, t ? (o[a] || "none" !== n || (r.style.display = ""), "" === r.style.display && Et(r) && (o[a] = gt.access(r, "olddisplay", w(r.nodeName)))) : (i = Et(r), "none" === n && i || gt.set(r, "olddisplay", i ? n : Z.css(r, "display"))));
            for (a = 0; s > a; a++) r = e[a], r.style && (t && "none" !== r.style.display && "" !== r.style.display || (r.style.display = t ? o[a] || "" : "none"));
            return e
        }

        function N(e, t, n, r, i) {
            return new N.prototype.init(e, t, n, r, i)
        }

        function A() {
            return setTimeout(function() {
                Kt = void 0
            }), Kt = Z.now()
        }

        function D(e, t) {
            var n, r = 0,
                i = {
                    height: e
                };
            for (t = t ? 1 : 0; 4 > r; r += 2 - t) n = Tt[r], i["margin" + n] = i["padding" + n] = e;
            return t && (i.opacity = i.width = e), i
        }

        function j(e, t, n) {
            for (var r, i = (nn[t] || []).concat(nn["*"]), o = 0, a = i.length; a > o; o++)
                if (r = i[o].call(n, t, e)) return r
        }

        function P(e, t, n) {
            var r, i, o, a, s, c, l, u, f = this,
                d = {},
                h = e.style,
                p = e.nodeType && Et(e),
                m = gt.get(e, "fxshow");
            n.queue || (s = Z._queueHooks(e, "fx"), null == s.unqueued && (s.unqueued = 0, c = s.empty.fire, s.empty.fire = function() {
                s.unqueued || c()
            }), s.unqueued++, f.always(function() {
                f.always(function() {
                    s.unqueued--, Z.queue(e, "fx").length || s.empty.fire()
                })
            })), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [h.overflow, h.overflowX, h.overflowY], l = Z.css(e, "display"), u = "none" === l ? gt.get(e, "olddisplay") || w(e.nodeName) : l, "inline" === u && "none" === Z.css(e, "float") && (h.display = "inline-block")), n.overflow && (h.overflow = "hidden", f.always(function() {
                h.overflow = n.overflow[0], h.overflowX = n.overflow[1], h.overflowY = n.overflow[2]
            }));
            for (r in t)
                if (i = t[r], Qt.exec(i)) {
                    if (delete t[r], o = o || "toggle" === i, i === (p ? "hide" : "show")) {
                        if ("show" !== i || !m || void 0 === m[r]) continue;
                        p = !0
                    }
                    d[r] = m && m[r] || Z.style(e, r)
                } else l = void 0;
            if (Z.isEmptyObject(d)) "inline" === ("none" === l ? w(e.nodeName) : l) && (h.display = l);
            else {
                m ? "hidden" in m && (p = m.hidden) : m = gt.access(e, "fxshow", {}), o && (m.hidden = !p), p ? Z(e).show() : f.done(function() {
                    Z(e).hide()
                }), f.done(function() {
                    var t;
                    gt.remove(e, "fxshow");
                    for (t in d) Z.style(e, t, d[t])
                });
                for (r in d) a = j(p ? m[r] : 0, r, f), r in m || (m[r] = a.start, p && (a.end = a.start, a.start = "width" === r || "height" === r ? 1 : 0))
            }
        }

        function $(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (r = Z.camelCase(n), i = t[r], o = e[n], Z.isArray(o) && (i = o[1], o = e[n] = o[0]), n !== r && (e[r] = o, delete e[n]), a = Z.cssHooks[r], a && "expand" in a) {
                    o = a.expand(o), delete e[r];
                    for (n in o) n in e || (e[n] = o[n], t[n] = i)
                } else t[r] = i
        }

        function L(e, t, n) {
            var r, i, o = 0,
                a = tn.length,
                s = Z.Deferred().always(function() {
                    delete c.elem
                }),
                c = function() {
                    if (i) return !1;
                    for (var t = Kt || A(), n = Math.max(0, l.startTime + l.duration - t), r = n / l.duration || 0, o = 1 - r, a = 0, c = l.tweens.length; c > a; a++) l.tweens[a].run(o);
                    return s.notifyWith(e, [l, o, n]), 1 > o && c ? n : (s.resolveWith(e, [l]), !1)
                },
                l = s.promise({
                    elem: e,
                    props: Z.extend({}, t),
                    opts: Z.extend(!0, {
                        specialEasing: {}
                    }, n),
                    originalProperties: t,
                    originalOptions: n,
                    startTime: Kt || A(),
                    duration: n.duration,
                    tweens: [],
                    createTween: function(t, n) {
                        var r = Z.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                        return l.tweens.push(r), r
                    },
                    stop: function(t) {
                        var n = 0,
                            r = t ? l.tweens.length : 0;
                        if (i) return this;
                        for (i = !0; r > n; n++) l.tweens[n].run(1);
                        return t ? s.resolveWith(e, [l, t]) : s.rejectWith(e, [l, t]), this
                    }
                }),
                u = l.props;
            for ($(u, l.opts.specialEasing); a > o; o++)
                if (r = tn[o].call(l, e, u, l.opts)) return r;
            return Z.map(u, j, l), Z.isFunction(l.opts.start) && l.opts.start.call(e, l), Z.fx.timer(Z.extend(c, {
                elem: e,
                anim: l,
                queue: l.opts.queue
            })), l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always)
        }

        function O(e) {
            return function(t, n) {
                "string" != typeof t && (n = t, t = "*");
                var r, i = 0,
                    o = t.toLowerCase().match(ht) || [];
                if (Z.isFunction(n))
                    for (; r = o[i++];) "+" === r[0] ? (r = r.slice(1) || "*", (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
            }
        }

        function M(e, t, n, r) {
            function i(s) {
                var c;
                return o[s] = !0, Z.each(e[s] || [], function(e, s) {
                    var l = s(t, n, r);
                    return "string" != typeof l || a || o[l] ? a ? !(c = l) : void 0 : (t.dataTypes.unshift(l), i(l), !1)
                }), c
            }
            var o = {},
                a = e === Tn;
            return i(t.dataTypes[0]) || !o["*"] && i("*")
        }

        function I(e, t) {
            var n, r, i = Z.ajaxSettings.flatOptions || {};
            for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
            return r && Z.extend(!0, e, r), e
        }

        function F(e, t, n) {
            for (var r, i, o, a, s = e.contents, c = e.dataTypes;
                "*" === c[0];) c.shift(), void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
            if (r)
                for (i in s)
                    if (s[i] && s[i].test(r)) {
                        c.unshift(i);
                        break
                    }
            if (c[0] in n) o = c[0];
            else {
                for (i in n) {
                    if (!c[0] || e.converters[i + " " + c[0]]) {
                        o = i;
                        break
                    }
                    a || (a = i)
                }
                o = o || a
            }
            return o ? (o !== c[0] && c.unshift(o), n[o]) : void 0
        }

        function R(e, t, n, r) {
            var i, o, a, s, c, l = {},
                u = e.dataTypes.slice();
            if (u[1])
                for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
            for (o = u.shift(); o;)
                if (e.responseFields[o] && (n[e.responseFields[o]] = t), !c && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)), c = o, o = u.shift())
                    if ("*" === o) o = c;
                    else if ("*" !== c && c !== o) {
                if (a = l[c + " " + o] || l["* " + o], !a)
                    for (i in l)
                        if (s = i.split(" "), s[1] === o && (a = l[c + " " + s[0]] || l["* " + s[0]])) {
                            a === !0 ? a = l[i] : l[i] !== !0 && (o = s[0], u.unshift(s[1]));
                            break
                        }
                if (a !== !0)
                    if (a && e["throws"]) t = a(t);
                    else try {
                        t = a(t)
                    } catch (f) {
                        return {
                            state: "parsererror",
                            error: a ? f : "No conversion from " + c + " to " + o
                        }
                    }
            }
            return {
                state: "success",
                data: t
            }
        }

        function U(e, t, n, r) {
            var i;
            if (Z.isArray(t)) Z.each(t, function(t, i) {
                n || kn.test(e) ? r(e, i) : U(e + "[" + ("object" == typeof i ? t : "") + "]", i, n, r)
            });
            else if (n || "object" !== Z.type(t)) r(e, t);
            else
                for (i in t) U(e + "[" + i + "]", t[i], n, r)
        }

        function H(e) {
            return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
        }
        var z = [],
            q = z.slice,
            B = z.concat,
            W = z.push,
            V = z.indexOf,
            X = {},
            Y = X.toString,
            G = X.hasOwnProperty,
            K = {},
            J = e.document,
            Q = "2.1.1 -ajax/jsonp,-deprecated,-exports/amd,-wrap",
            Z = function(e, t) {
                return new Z.fn.init(e, t)
            },
            et = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
            tt = /^-ms-/,
            nt = /-([\da-z])/gi,
            rt = function(e, t) {
                return t.toUpperCase()
            };
        Z.fn = Z.prototype = {
            jquery: Q,
            constructor: Z,
            selector: "",
            length: 0,
            toArray: function() {
                return q.call(this)
            },
            get: function(e) {
                return null != e ? 0 > e ? this[e + this.length] : this[e] : q.call(this)
            },
            pushStack: function(e) {
                var t = Z.merge(this.constructor(), e);
                return t.prevObject = this, t.context = this.context, t
            },
            each: function(e, t) {
                return Z.each(this, e, t)
            },
            map: function(e) {
                return this.pushStack(Z.map(this, function(t, n) {
                    return e.call(t, n, t)
                }))
            },
            slice: function() {
                return this.pushStack(q.apply(this, arguments))
            },
            first: function() {
                return this.eq(0)
            },
            last: function() {
                return this.eq(-1)
            },
            eq: function(e) {
                var t = this.length,
                    n = +e + (0 > e ? t : 0);
                return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
            },
            end: function() {
                return this.prevObject || this.constructor(null)
            },
            push: W,
            sort: z.sort,
            splice: z.splice
        }, Z.extend = Z.fn.extend = function() {
            var e, t, n, r, i, o, a = arguments[0] || {},
                s = 1,
                c = arguments.length,
                l = !1;
            for ("boolean" == typeof a && (l = a, a = arguments[s] || {}, s++), "object" == typeof a || Z.isFunction(a) || (a = {}), s === c && (a = this, s--); c > s; s++)
                if (null != (e = arguments[s]))
                    for (t in e) n = a[t], r = e[t], a !== r && (l && r && (Z.isPlainObject(r) || (i = Z.isArray(r))) ? (i ? (i = !1, o = n && Z.isArray(n) ? n : []) : o = n && Z.isPlainObject(n) ? n : {}, a[t] = Z.extend(l, o, r)) : void 0 !== r && (a[t] = r));
            return a
        }, Z.extend({
            expando: "jQuery" + (Q + Math.random()).replace(/\D/g, ""),
            isReady: !0,
            error: function(e) {
                throw new Error(e)
            },
            noop: function() {},
            isFunction: function(e) {
                return "function" === Z.type(e)
            },
            isArray: Array.isArray,
            isWindow: function(e) {
                return null != e && e === e.window
            },
            isNumeric: function(e) {
                return !Z.isArray(e) && e - parseFloat(e) >= 0
            },
            isPlainObject: function(e) {
                return "object" !== Z.type(e) || e.nodeType || Z.isWindow(e) ? !1 : e.constructor && !G.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
            },
            isEmptyObject: function(e) {
                var t;
                for (t in e) return !1;
                return !0
            },
            type: function(e) {
                return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? X[Y.call(e)] || "object" : typeof e
            },
            globalEval: function(e) {
                var t, n = eval;
                e = Z.trim(e), e && (1 === e.indexOf("use strict") ? (t = J.createElement("script"), t.text = e, J.head.appendChild(t).parentNode.removeChild(t)) : n(e))
            },
            camelCase: function(e) {
                return e.replace(tt, "ms-").replace(nt, rt)
            },
            nodeName: function(e, t) {
                return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
            },
            each: function(e, t, r) {
                var i, o = 0,
                    a = e.length,
                    s = n(e);
                if (r) {
                    if (s)
                        for (; a > o && (i = t.apply(e[o], r), i !== !1); o++);
                    else
                        for (o in e)
                            if (i = t.apply(e[o], r), i === !1) break
                } else if (s)
                    for (; a > o && (i = t.call(e[o], o, e[o]), i !== !1); o++);
                else
                    for (o in e)
                        if (i = t.call(e[o], o, e[o]), i === !1) break; return e
            },
            trim: function(e) {
                return null == e ? "" : (e + "").replace(et, "")
            },
            makeArray: function(e, t) {
                var r = t || [];
                return null != e && (n(Object(e)) ? Z.merge(r, "string" == typeof e ? [e] : e) : W.call(r, e)), r
            },
            inArray: function(e, t, n) {
                return null == t ? -1 : V.call(t, e, n)
            },
            merge: function(e, t) {
                for (var n = +t.length, r = 0, i = e.length; n > r; r++) e[i++] = t[r];
                return e.length = i, e
            },
            grep: function(e, t, n) {
                for (var r, i = [], o = 0, a = e.length, s = !n; a > o; o++) r = !t(e[o], o), r !== s && i.push(e[o]);
                return i
            },
            map: function(e, t, r) {
                var i, o = 0,
                    a = e.length,
                    s = n(e),
                    c = [];
                if (s)
                    for (; a > o; o++) i = t(e[o], o, r), null != i && c.push(i);
                else
                    for (o in e) i = t(e[o], o, r), null != i && c.push(i);
                return B.apply([], c)
            },
            guid: 1,
            proxy: function(e, t) {
                var n, r, i;
                return "string" == typeof t && (n = e[t], t = e, e = n), Z.isFunction(e) ? (r = q.call(arguments, 2), i = function() {
                    return e.apply(t || this, r.concat(q.call(arguments)))
                }, i.guid = e.guid = e.guid || Z.guid++, i) : void 0
            },
            now: Date.now,
            support: K
        }), Z.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(e, t) {
            X["[object " + t + "]"] = t.toLowerCase()
        });
        var it =
            /*!
             * Sizzle CSS Selector Engine v1.10.19
             * http://sizzlejs.com/
             *
             * Copyright 2013 jQuery Foundation, Inc. and other contributors
             * Released under the MIT license
             * http://jquery.org/license
             *
             * Date: 2014-04-18
             */
            function(e) {
                function t(e, t, n, r) {
                    var i, o, a, s, c, l, f, h, p, m;
                    if ((t ? t.ownerDocument || t : U) !== P && j(t), t = t || P, n = n || [], !e || "string" != typeof e) return n;
                    if (1 !== (s = t.nodeType) && 9 !== s) return [];
                    if (L && !r) {
                        if (i = yt.exec(e))
                            if (a = i[1]) {
                                if (9 === s) {
                                    if (o = t.getElementById(a), !o || !o.parentNode) return n;
                                    if (o.id === a) return n.push(o), n
                                } else if (t.ownerDocument && (o = t.ownerDocument.getElementById(a)) && F(t, o) && o.id === a) return n.push(o), n
                            } else {
                                if (i[2]) return Z.apply(n, t.getElementsByTagName(e)), n;
                                if ((a = i[3]) && x.getElementsByClassName && t.getElementsByClassName) return Z.apply(n, t.getElementsByClassName(a)), n
                            }
                        if (x.qsa && (!O || !O.test(e))) {
                            if (h = f = R, p = t, m = 9 === s && e, 1 === s && "object" !== t.nodeName.toLowerCase()) {
                                for (l = C(e), (f = t.getAttribute("id")) ? h = f.replace(wt, "\\$&") : t.setAttribute("id", h), h = "[id='" + h + "'] ", c = l.length; c--;) l[c] = h + d(l[c]);
                                p = bt.test(e) && u(t.parentNode) || t, m = l.join(",")
                            }
                            if (m) try {
                                return Z.apply(n, p.querySelectorAll(m)), n
                            } catch (v) {} finally {
                                f || t.removeAttribute("id")
                            }
                        }
                    }
                    return S(e.replace(ct, "$1"), t, n, r)
                }

                function n() {
                    function e(n, r) {
                        return t.push(n + " ") > T.cacheLength && delete e[t.shift()], e[n + " "] = r
                    }
                    var t = [];
                    return e
                }

                function r(e) {
                    return e[R] = !0, e
                }

                function i(e) {
                    var t = P.createElement("div");
                    try {
                        return !!e(t)
                    } catch (n) {
                        return !1
                    } finally {
                        t.parentNode && t.parentNode.removeChild(t), t = null
                    }
                }

                function o(e, t) {
                    for (var n = e.split("|"), r = e.length; r--;) T.attrHandle[n[r]] = t
                }

                function a(e, t) {
                    var n = t && e,
                        r = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || Y) - (~e.sourceIndex || Y);
                    if (r) return r;
                    if (n)
                        for (; n = n.nextSibling;)
                            if (n === t) return -1;
                    return e ? 1 : -1
                }

                function s(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return "input" === n && t.type === e
                    }
                }

                function c(e) {
                    return function(t) {
                        var n = t.nodeName.toLowerCase();
                        return ("input" === n || "button" === n) && t.type === e
                    }
                }

                function l(e) {
                    return r(function(t) {
                        return t = +t, r(function(n, r) {
                            for (var i, o = e([], n.length, t), a = o.length; a--;) n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                        })
                    })
                }

                function u(e) {
                    return e && typeof e.getElementsByTagName !== X && e
                }

                function f() {}

                function d(e) {
                    for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
                    return r
                }

                function h(e, t, n) {
                    var r = t.dir,
                        i = n && "parentNode" === r,
                        o = z++;
                    return t.first ? function(t, n, o) {
                        for (; t = t[r];)
                            if (1 === t.nodeType || i) return e(t, n, o)
                    } : function(t, n, a) {
                        var s, c, l = [H, o];
                        if (a) {
                            for (; t = t[r];)
                                if ((1 === t.nodeType || i) && e(t, n, a)) return !0
                        } else
                            for (; t = t[r];)
                                if (1 === t.nodeType || i) {
                                    if (c = t[R] || (t[R] = {}), (s = c[r]) && s[0] === H && s[1] === o) return l[2] = s[2];
                                    if (c[r] = l, l[2] = e(t, n, a)) return !0
                                }
                    }
                }

                function p(e) {
                    return e.length > 1 ? function(t, n, r) {
                        for (var i = e.length; i--;)
                            if (!e[i](t, n, r)) return !1;
                        return !0
                    } : e[0]
                }

                function m(e, n, r) {
                    for (var i = 0, o = n.length; o > i; i++) t(e, n[i], r);
                    return r
                }

                function v(e, t, n, r, i) {
                    for (var o, a = [], s = 0, c = e.length, l = null != t; c > s; s++)(o = e[s]) && (!n || n(o, r, i)) && (a.push(o), l && t.push(s));
                    return a
                }

                function g(e, t, n, i, o, a) {
                    return i && !i[R] && (i = g(i)), o && !o[R] && (o = g(o, a)), r(function(r, a, s, c) {
                        var l, u, f, d = [],
                            h = [],
                            p = a.length,
                            g = r || m(t || "*", s.nodeType ? [s] : s, []),
                            y = !e || !r && t ? g : v(g, d, e, s, c),
                            b = n ? o || (r ? e : p || i) ? [] : a : y;
                        if (n && n(y, b, s, c), i)
                            for (l = v(b, h), i(l, [], s, c), u = l.length; u--;)(f = l[u]) && (b[h[u]] = !(y[h[u]] = f));
                        if (r) {
                            if (o || e) {
                                if (o) {
                                    for (l = [], u = b.length; u--;)(f = b[u]) && l.push(y[u] = f);
                                    o(null, b = [], l, c)
                                }
                                for (u = b.length; u--;)(f = b[u]) && (l = o ? tt.call(r, f) : d[u]) > -1 && (r[l] = !(a[l] = f))
                            }
                        } else b = v(b === a ? b.splice(p, b.length) : b), o ? o(null, a, b, c) : Z.apply(a, b)
                    })
                }

                function y(e) {
                    for (var t, n, r, i = e.length, o = T.relative[e[0].type], a = o || T.relative[" "], s = o ? 1 : 0, c = h(function(e) {
                            return e === t
                        }, a, !0), l = h(function(e) {
                            return tt.call(t, e) > -1
                        }, a, !0), u = [function(e, n, r) {
                            return !o && (r || n !== N) || ((t = n).nodeType ? c(e, n, r) : l(e, n, r))
                        }]; i > s; s++)
                        if (n = T.relative[e[s].type]) u = [h(p(u), n)];
                        else {
                            if (n = T.filter[e[s].type].apply(null, e[s].matches), n[R]) {
                                for (r = ++s; i > r && !T.relative[e[r].type]; r++);
                                return g(s > 1 && p(u), s > 1 && d(e.slice(0, s - 1).concat({
                                    value: " " === e[s - 2].type ? "*" : ""
                                })).replace(ct, "$1"), n, r > s && y(e.slice(s, r)), i > r && y(e = e.slice(r)), i > r && d(e))
                            }
                            u.push(n)
                        }
                    return p(u)
                }

                function b(e, n) {
                    var i = n.length > 0,
                        o = e.length > 0,
                        a = function(r, a, s, c, l) {
                            var u, f, d, h = 0,
                                p = "0",
                                m = r && [],
                                g = [],
                                y = N,
                                b = r || o && T.find.TAG("*", l),
                                w = H += null == y ? 1 : Math.random() || .1,
                                x = b.length;
                            for (l && (N = a !== P && a); p !== x && null != (u = b[p]); p++) {
                                if (o && u) {
                                    for (f = 0; d = e[f++];)
                                        if (d(u, a, s)) {
                                            c.push(u);
                                            break
                                        }
                                    l && (H = w)
                                }
                                i && ((u = !d && u) && h--, r && m.push(u))
                            }
                            if (h += p, i && p !== h) {
                                for (f = 0; d = n[f++];) d(m, g, a, s);
                                if (r) {
                                    if (h > 0)
                                        for (; p--;) m[p] || g[p] || (g[p] = J.call(c));
                                    g = v(g)
                                }
                                Z.apply(c, g), l && !r && g.length > 0 && h + n.length > 1 && t.uniqueSort(c)
                            }
                            return l && (H = w, N = y), m
                        };
                    return i ? r(a) : a
                }
                var w, x, T, E, _, C, k, S, N, A, D, j, P, $, L, O, M, I, F, R = "sizzle" + -new Date,
                    U = e.document,
                    H = 0,
                    z = 0,
                    q = n(),
                    B = n(),
                    W = n(),
                    V = function(e, t) {
                        return e === t && (D = !0), 0
                    },
                    X = "undefined",
                    Y = 1 << 31,
                    G = {}.hasOwnProperty,
                    K = [],
                    J = K.pop,
                    Q = K.push,
                    Z = K.push,
                    et = K.slice,
                    tt = K.indexOf || function(e) {
                        for (var t = 0, n = this.length; n > t; t++)
                            if (this[t] === e) return t;
                        return -1
                    },
                    nt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    rt = "[\\x20\\t\\r\\n\\f]",
                    it = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                    ot = it.replace("w", "w#"),
                    at = "\\[" + rt + "*(" + it + ")(?:" + rt + "*([*^$|!~]?=)" + rt + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ot + "))|)" + rt + "*\\]",
                    st = ":(" + it + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + at + ")*)|.*)\\)|)",
                    ct = new RegExp("^" + rt + "+|((?:^|[^\\\\])(?:\\\\.)*)" + rt + "+$", "g"),
                    lt = new RegExp("^" + rt + "*," + rt + "*"),
                    ut = new RegExp("^" + rt + "*([>+~]|" + rt + ")" + rt + "*"),
                    ft = new RegExp("=" + rt + "*([^\\]'\"]*?)" + rt + "*\\]", "g"),
                    dt = new RegExp(st),
                    ht = new RegExp("^" + ot + "$"),
                    pt = {
                        ID: new RegExp("^#(" + it + ")"),
                        CLASS: new RegExp("^\\.(" + it + ")"),
                        TAG: new RegExp("^(" + it.replace("w", "w*") + ")"),
                        ATTR: new RegExp("^" + at),
                        PSEUDO: new RegExp("^" + st),
                        CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + rt + "*(even|odd|(([+-]|)(\\d*)n|)" + rt + "*(?:([+-]|)" + rt + "*(\\d+)|))" + rt + "*\\)|)", "i"),
                        bool: new RegExp("^(?:" + nt + ")$", "i"),
                        needsContext: new RegExp("^" + rt + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + rt + "*((?:-\\d)?\\d*)" + rt + "*\\)|)(?=[^-]|$)", "i")
                    },
                    mt = /^(?:input|select|textarea|button)$/i,
                    vt = /^h\d$/i,
                    gt = /^[^{]+\{\s*\[native \w/,
                    yt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    bt = /[+~]/,
                    wt = /'|\\/g,
                    xt = new RegExp("\\\\([\\da-f]{1,6}" + rt + "?|(" + rt + ")|.)", "ig"),
                    Tt = function(e, t, n) {
                        var r = "0x" + t - 65536;
                        return r !== r || n ? t : 0 > r ? String.fromCharCode(r + 65536) : String.fromCharCode(r >> 10 | 55296, 1023 & r | 56320)
                    };
                try {
                    Z.apply(K = et.call(U.childNodes), U.childNodes), K[U.childNodes.length].nodeType
                } catch (Et) {
                    Z = {
                        apply: K.length ? function(e, t) {
                            Q.apply(e, et.call(t))
                        } : function(e, t) {
                            for (var n = e.length, r = 0; e[n++] = t[r++];);
                            e.length = n - 1
                        }
                    }
                }
                x = t.support = {}, _ = t.isXML = function(e) {
                    var t = e && (e.ownerDocument || e).documentElement;
                    return t ? "HTML" !== t.nodeName : !1
                }, j = t.setDocument = function(e) {
                    var t, n = e ? e.ownerDocument || e : U,
                        r = n.defaultView;
                    return n !== P && 9 === n.nodeType && n.documentElement ? (P = n, $ = n.documentElement, L = !_(n), r && r !== r.top && (r.addEventListener ? r.addEventListener("unload", function() {
                        j()
                    }, !1) : r.attachEvent && r.attachEvent("onunload", function() {
                        j()
                    })), x.attributes = i(function(e) {
                        return e.className = "i", !e.getAttribute("className")
                    }), x.getElementsByTagName = i(function(e) {
                        return e.appendChild(n.createComment("")), !e.getElementsByTagName("*").length
                    }), x.getElementsByClassName = gt.test(n.getElementsByClassName) && i(function(e) {
                        return e.innerHTML = "<div class='a'></div><div class='a i'></div>", e.firstChild.className = "i", 2 === e.getElementsByClassName("i").length
                    }), x.getById = i(function(e) {
                        return $.appendChild(e).id = R, !n.getElementsByName || !n.getElementsByName(R).length
                    }), x.getById ? (T.find.ID = function(e, t) {
                        if (typeof t.getElementById !== X && L) {
                            var n = t.getElementById(e);
                            return n && n.parentNode ? [n] : []
                        }
                    }, T.filter.ID = function(e) {
                        var t = e.replace(xt, Tt);
                        return function(e) {
                            return e.getAttribute("id") === t
                        }
                    }) : (delete T.find.ID, T.filter.ID = function(e) {
                        var t = e.replace(xt, Tt);
                        return function(e) {
                            var n = typeof e.getAttributeNode !== X && e.getAttributeNode("id");
                            return n && n.value === t
                        }
                    }), T.find.TAG = x.getElementsByTagName ? function(e, t) {
                        return typeof t.getElementsByTagName !== X ? t.getElementsByTagName(e) : void 0
                    } : function(e, t) {
                        var n, r = [],
                            i = 0,
                            o = t.getElementsByTagName(e);
                        if ("*" === e) {
                            for (; n = o[i++];) 1 === n.nodeType && r.push(n);
                            return r
                        }
                        return o
                    }, T.find.CLASS = x.getElementsByClassName && function(e, t) {
                        return typeof t.getElementsByClassName !== X && L ? t.getElementsByClassName(e) : void 0
                    }, M = [], O = [], (x.qsa = gt.test(n.querySelectorAll)) && (i(function(e) {
                        e.innerHTML = "<select msallowclip=''><option selected=''></option></select>", e.querySelectorAll("[msallowclip^='']").length && O.push("[*^$]=" + rt + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || O.push("\\[" + rt + "*(?:value|" + nt + ")"), e.querySelectorAll(":checked").length || O.push(":checked")
                    }), i(function(e) {
                        var t = n.createElement("input");
                        t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && O.push("name" + rt + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || O.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), O.push(",.*:")
                    })), (x.matchesSelector = gt.test(I = $.matches || $.webkitMatchesSelector || $.mozMatchesSelector || $.oMatchesSelector || $.msMatchesSelector)) && i(function(e) {
                        x.disconnectedMatch = I.call(e, "div"), I.call(e, "[s!='']:x"), M.push("!=", st)
                    }), O = O.length && new RegExp(O.join("|")), M = M.length && new RegExp(M.join("|")), t = gt.test($.compareDocumentPosition), F = t || gt.test($.contains) ? function(e, t) {
                        var n = 9 === e.nodeType ? e.documentElement : e,
                            r = t && t.parentNode;
                        return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
                    } : function(e, t) {
                        if (t)
                            for (; t = t.parentNode;)
                                if (t === e) return !0;
                        return !1
                    }, V = t ? function(e, t) {
                        if (e === t) return D = !0, 0;
                        var r = !e.compareDocumentPosition - !t.compareDocumentPosition;
                        return r ? r : (r = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & r || !x.sortDetached && t.compareDocumentPosition(e) === r ? e === n || e.ownerDocument === U && F(U, e) ? -1 : t === n || t.ownerDocument === U && F(U, t) ? 1 : A ? tt.call(A, e) - tt.call(A, t) : 0 : 4 & r ? -1 : 1)
                    } : function(e, t) {
                        if (e === t) return D = !0, 0;
                        var r, i = 0,
                            o = e.parentNode,
                            s = t.parentNode,
                            c = [e],
                            l = [t];
                        if (!o || !s) return e === n ? -1 : t === n ? 1 : o ? -1 : s ? 1 : A ? tt.call(A, e) - tt.call(A, t) : 0;
                        if (o === s) return a(e, t);
                        for (r = e; r = r.parentNode;) c.unshift(r);
                        for (r = t; r = r.parentNode;) l.unshift(r);
                        for (; c[i] === l[i];) i++;
                        return i ? a(c[i], l[i]) : c[i] === U ? -1 : l[i] === U ? 1 : 0
                    }, n) : P
                }, t.matches = function(e, n) {
                    return t(e, null, null, n)
                }, t.matchesSelector = function(e, n) {
                    if ((e.ownerDocument || e) !== P && j(e), n = n.replace(ft, "='$1']"), !(!x.matchesSelector || !L || M && M.test(n) || O && O.test(n))) try {
                        var r = I.call(e, n);
                        if (r || x.disconnectedMatch || e.document && 11 !== e.document.nodeType) return r
                    } catch (i) {}
                    return t(n, P, null, [e]).length > 0
                }, t.contains = function(e, t) {
                    return (e.ownerDocument || e) !== P && j(e), F(e, t)
                }, t.attr = function(e, t) {
                    (e.ownerDocument || e) !== P && j(e);
                    var n = T.attrHandle[t.toLowerCase()],
                        r = n && G.call(T.attrHandle, t.toLowerCase()) ? n(e, t, !L) : void 0;
                    return void 0 !== r ? r : x.attributes || !L ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }, t.error = function(e) {
                    throw new Error("Syntax error, unrecognized expression: " + e)
                }, t.uniqueSort = function(e) {
                    var t, n = [],
                        r = 0,
                        i = 0;
                    if (D = !x.detectDuplicates, A = !x.sortStable && e.slice(0), e.sort(V), D) {
                        for (; t = e[i++];) t === e[i] && (r = n.push(i));
                        for (; r--;) e.splice(n[r], 1)
                    }
                    return A = null, e
                }, E = t.getText = function(e) {
                    var t, n = "",
                        r = 0,
                        i = e.nodeType;
                    if (i) {
                        if (1 === i || 9 === i || 11 === i) {
                            if ("string" == typeof e.textContent) return e.textContent;
                            for (e = e.firstChild; e; e = e.nextSibling) n += E(e)
                        } else if (3 === i || 4 === i) return e.nodeValue
                    } else
                        for (; t = e[r++];) n += E(t);
                    return n
                }, T = t.selectors = {
                    cacheLength: 50,
                    createPseudo: r,
                    match: pt,
                    attrHandle: {},
                    find: {},
                    relative: {
                        ">": {
                            dir: "parentNode",
                            first: !0
                        },
                        " ": {
                            dir: "parentNode"
                        },
                        "+": {
                            dir: "previousSibling",
                            first: !0
                        },
                        "~": {
                            dir: "previousSibling"
                        }
                    },
                    preFilter: {
                        ATTR: function(e) {
                            return e[1] = e[1].replace(xt, Tt), e[3] = (e[3] || e[4] || e[5] || "").replace(xt, Tt), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
                        },
                        CHILD: function(e) {
                            return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
                        },
                        PSEUDO: function(e) {
                            var t, n = !e[6] && e[2];
                            return pt.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && dt.test(n) && (t = C(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
                        }
                    },
                    filter: {
                        TAG: function(e) {
                            var t = e.replace(xt, Tt).toLowerCase();
                            return "*" === e ? function() {
                                return !0
                            } : function(e) {
                                return e.nodeName && e.nodeName.toLowerCase() === t
                            }
                        },
                        CLASS: function(e) {
                            var t = q[e + " "];
                            return t || (t = new RegExp("(^|" + rt + ")" + e + "(" + rt + "|$)")) && q(e, function(e) {
                                return t.test("string" == typeof e.className && e.className || typeof e.getAttribute !== X && e.getAttribute("class") || "")
                            })
                        },
                        ATTR: function(e, n, r) {
                            return function(i) {
                                var o = t.attr(i, e);
                                return null == o ? "!=" === n : n ? (o += "", "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && o.indexOf(r) > -1 : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? (" " + o + " ").indexOf(r) > -1 : "|=" === n ? o === r || o.slice(0, r.length + 1) === r + "-" : !1) : !0
                            }
                        },
                        CHILD: function(e, t, n, r, i) {
                            var o = "nth" !== e.slice(0, 3),
                                a = "last" !== e.slice(-4),
                                s = "of-type" === t;
                            return 1 === r && 0 === i ? function(e) {
                                return !!e.parentNode
                            } : function(t, n, c) {
                                var l, u, f, d, h, p, m = o !== a ? "nextSibling" : "previousSibling",
                                    v = t.parentNode,
                                    g = s && t.nodeName.toLowerCase(),
                                    y = !c && !s;
                                if (v) {
                                    if (o) {
                                        for (; m;) {
                                            for (f = t; f = f[m];)
                                                if (s ? f.nodeName.toLowerCase() === g : 1 === f.nodeType) return !1;
                                            p = m = "only" === e && !p && "nextSibling"
                                        }
                                        return !0
                                    }
                                    if (p = [a ? v.firstChild : v.lastChild], a && y) {
                                        for (u = v[R] || (v[R] = {}), l = u[e] || [], h = l[0] === H && l[1], d = l[0] === H && l[2], f = h && v.childNodes[h]; f = ++h && f && f[m] || (d = h = 0) || p.pop();)
                                            if (1 === f.nodeType && ++d && f === t) {
                                                u[e] = [H, h, d];
                                                break
                                            }
                                    } else if (y && (l = (t[R] || (t[R] = {}))[e]) && l[0] === H) d = l[1];
                                    else
                                        for (;
                                            (f = ++h && f && f[m] || (d = h = 0) || p.pop()) && ((s ? f.nodeName.toLowerCase() !== g : 1 !== f.nodeType) || !++d || (y && ((f[R] || (f[R] = {}))[e] = [H, d]), f !== t)););
                                    return d -= i, d === r || d % r === 0 && d / r >= 0
                                }
                            }
                        },
                        PSEUDO: function(e, n) {
                            var i, o = T.pseudos[e] || T.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                            return o[R] ? o(n) : o.length > 1 ? (i = [e, e, "", n], T.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                                for (var r, i = o(e, n), a = i.length; a--;) r = tt.call(e, i[a]), e[r] = !(t[r] = i[a])
                            }) : function(e) {
                                return o(e, 0, i)
                            }) : o
                        }
                    },
                    pseudos: {
                        not: r(function(e) {
                            var t = [],
                                n = [],
                                i = k(e.replace(ct, "$1"));
                            return i[R] ? r(function(e, t, n, r) {
                                for (var o, a = i(e, null, r, []), s = e.length; s--;)(o = a[s]) && (e[s] = !(t[s] = o))
                            }) : function(e, r, o) {
                                return t[0] = e, i(t, null, o, n), !n.pop()
                            }
                        }),
                        has: r(function(e) {
                            return function(n) {
                                return t(e, n).length > 0
                            }
                        }),
                        contains: r(function(e) {
                            return function(t) {
                                return (t.textContent || t.innerText || E(t)).indexOf(e) > -1
                            }
                        }),
                        lang: r(function(e) {
                            return ht.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(xt, Tt).toLowerCase(),
                                function(t) {
                                    var n;
                                    do
                                        if (n = L ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
                                    while ((t = t.parentNode) && 1 === t.nodeType);
                                    return !1
                                }
                        }),
                        target: function(t) {
                            var n = e.location && e.location.hash;
                            return n && n.slice(1) === t.id
                        },
                        root: function(e) {
                            return e === $
                        },
                        focus: function(e) {
                            return e === P.activeElement && (!P.hasFocus || P.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                        },
                        enabled: function(e) {
                            return e.disabled === !1
                        },
                        disabled: function(e) {
                            return e.disabled === !0
                        },
                        checked: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && !!e.checked || "option" === t && !!e.selected
                        },
                        selected: function(e) {
                            return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
                        },
                        empty: function(e) {
                            for (e = e.firstChild; e; e = e.nextSibling)
                                if (e.nodeType < 6) return !1;
                            return !0
                        },
                        parent: function(e) {
                            return !T.pseudos.empty(e)
                        },
                        header: function(e) {
                            return vt.test(e.nodeName)
                        },
                        input: function(e) {
                            return mt.test(e.nodeName)
                        },
                        button: function(e) {
                            var t = e.nodeName.toLowerCase();
                            return "input" === t && "button" === e.type || "button" === t
                        },
                        text: function(e) {
                            var t;
                            return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                        },
                        first: l(function() {
                            return [0]
                        }),
                        last: l(function(e, t) {
                            return [t - 1]
                        }),
                        eq: l(function(e, t, n) {
                            return [0 > n ? n + t : n]
                        }),
                        even: l(function(e, t) {
                            for (var n = 0; t > n; n += 2) e.push(n);
                            return e
                        }),
                        odd: l(function(e, t) {
                            for (var n = 1; t > n; n += 2) e.push(n);
                            return e
                        }),
                        lt: l(function(e, t, n) {
                            for (var r = 0 > n ? n + t : n; --r >= 0;) e.push(r);
                            return e
                        }),
                        gt: l(function(e, t, n) {
                            for (var r = 0 > n ? n + t : n; ++r < t;) e.push(r);
                            return e
                        })
                    }
                }, T.pseudos.nth = T.pseudos.eq;
                for (w in {
                        radio: !0,
                        checkbox: !0,
                        file: !0,
                        password: !0,
                        image: !0
                    }) T.pseudos[w] = s(w);
                for (w in {
                        submit: !0,
                        reset: !0
                    }) T.pseudos[w] = c(w);
                return f.prototype = T.filters = T.pseudos, T.setFilters = new f, C = t.tokenize = function(e, n) {
                    var r, i, o, a, s, c, l, u = B[e + " "];
                    if (u) return n ? 0 : u.slice(0);
                    for (s = e, c = [], l = T.preFilter; s;) {
                        (!r || (i = lt.exec(s))) && (i && (s = s.slice(i[0].length) || s), c.push(o = [])), r = !1, (i = ut.exec(s)) && (r = i.shift(), o.push({
                            value: r,
                            type: i[0].replace(ct, " ")
                        }), s = s.slice(r.length));
                        for (a in T.filter) !(i = pt[a].exec(s)) || l[a] && !(i = l[a](i)) || (r = i.shift(), o.push({
                            value: r,
                            type: a,
                            matches: i
                        }), s = s.slice(r.length));
                        if (!r) break
                    }
                    return n ? s.length : s ? t.error(e) : B(e, c).slice(0)
                }, k = t.compile = function(e, t) {
                    var n, r = [],
                        i = [],
                        o = W[e + " "];
                    if (!o) {
                        for (t || (t = C(e)), n = t.length; n--;) o = y(t[n]), o[R] ? r.push(o) : i.push(o);
                        o = W(e, b(i, r)), o.selector = e
                    }
                    return o
                }, S = t.select = function(e, t, n, r) {
                    var i, o, a, s, c, l = "function" == typeof e && e,
                        f = !r && C(e = l.selector || e);
                    if (n = n || [], 1 === f.length) {
                        if (o = f[0] = f[0].slice(0), o.length > 2 && "ID" === (a = o[0]).type && x.getById && 9 === t.nodeType && L && T.relative[o[1].type]) {
                            if (t = (T.find.ID(a.matches[0].replace(xt, Tt), t) || [])[0], !t) return n;
                            l && (t = t.parentNode), e = e.slice(o.shift().value.length)
                        }
                        for (i = pt.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i], !T.relative[s = a.type]);)
                            if ((c = T.find[s]) && (r = c(a.matches[0].replace(xt, Tt), bt.test(o[0].type) && u(t.parentNode) || t))) {
                                if (o.splice(i, 1), e = r.length && d(o), !e) return Z.apply(n, r), n;
                                break
                            }
                    }
                    return (l || k(e, f))(r, t, !L, n, bt.test(e) && u(t.parentNode) || t), n
                }, x.sortStable = R.split("").sort(V).join("") === R, x.detectDuplicates = !!D, j(), x.sortDetached = i(function(e) {
                    return 1 & e.compareDocumentPosition(P.createElement("div"))
                }), i(function(e) {
                    return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
                }) || o("type|href|height|width", function(e, t, n) {
                    return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
                }), x.attributes && i(function(e) {
                    return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
                }) || o("value", function(e, t, n) {
                    return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
                }), i(function(e) {
                    return null == e.getAttribute("disabled")
                }) || o(nt, function(e, t, n) {
                    var r;
                    return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
                }), t
            }(e);
        Z.find = it, Z.expr = it.selectors, Z.expr[":"] = Z.expr.pseudos, Z.unique = it.uniqueSort, Z.text = it.getText, Z.isXMLDoc = it.isXML, Z.contains = it.contains;
        var ot = Z.expr.match.needsContext,
            at = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
            st = /^.[^:#\[\.,]*$/;
        Z.filter = function(e, t, n) {
            var r = t[0];
            return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === r.nodeType ? Z.find.matchesSelector(r, e) ? [r] : [] : Z.find.matches(e, Z.grep(t, function(e) {
                return 1 === e.nodeType
            }))
        }, Z.fn.extend({
            find: function(e) {
                var t, n = this.length,
                    r = [],
                    i = this;
                if ("string" != typeof e) return this.pushStack(Z(e).filter(function() {
                    for (t = 0; n > t; t++)
                        if (Z.contains(i[t], this)) return !0
                }));
                for (t = 0; n > t; t++) Z.find(e, i[t], r);
                return r = this.pushStack(n > 1 ? Z.unique(r) : r), r.selector = this.selector ? this.selector + " " + e : e, r
            },
            filter: function(e) {
                return this.pushStack(r(this, e || [], !1))
            },
            not: function(e) {
                return this.pushStack(r(this, e || [], !0))
            },
            is: function(e) {
                return !!r(this, "string" == typeof e && ot.test(e) ? Z(e) : e || [], !1).length
            }
        });
        var ct, lt = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
            ut = Z.fn.init = function(e, t) {
                var n, r;
                if (!e) return this;
                if ("string" == typeof e) {
                    if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : lt.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || ct).find(e) : this.constructor(t).find(e);
                    if (n[1]) {
                        if (t = t instanceof Z ? t[0] : t, Z.merge(this, Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : J, !0)), at.test(n[1]) && Z.isPlainObject(t))
                            for (n in t) Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
                        return this
                    }
                    return r = J.getElementById(n[2]), r && r.parentNode && (this.length = 1, this[0] = r), this.context = J, this.selector = e, this
                }
                return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : Z.isFunction(e) ? "undefined" != typeof ct.ready ? ct.ready(e) : e(Z) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), Z.makeArray(e, this))
            };
        ut.prototype = Z.fn, ct = Z(J);
        var ft = /^(?:parents|prev(?:Until|All))/,
            dt = {
                children: !0,
                contents: !0,
                next: !0,
                prev: !0
            };
        Z.extend({
            dir: function(e, t, n) {
                for (var r = [], i = void 0 !== n;
                    (e = e[t]) && 9 !== e.nodeType;)
                    if (1 === e.nodeType) {
                        if (i && Z(e).is(n)) break;
                        r.push(e)
                    }
                return r
            },
            sibling: function(e, t) {
                for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
                return n
            }
        }), Z.fn.extend({
            has: function(e) {
                var t = Z(e, this),
                    n = t.length;
                return this.filter(function() {
                    for (var e = 0; n > e; e++)
                        if (Z.contains(this, t[e])) return !0
                })
            },
            closest: function(e, t) {
                for (var n, r = 0, i = this.length, o = [], a = ot.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; i > r; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && Z.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
                return this.pushStack(o.length > 1 ? Z.unique(o) : o)
            },
            index: function(e) {
                return e ? "string" == typeof e ? V.call(Z(e), this[0]) : V.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
            },
            add: function(e, t) {
                return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))))
            },
            addBack: function(e) {
                return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
            }
        }), Z.each({
            parent: function(e) {
                var t = e.parentNode;
                return t && 11 !== t.nodeType ? t : null
            },
            parents: function(e) {
                return Z.dir(e, "parentNode")
            },
            parentsUntil: function(e, t, n) {
                return Z.dir(e, "parentNode", n)
            },
            next: function(e) {
                return i(e, "nextSibling")
            },
            prev: function(e) {
                return i(e, "previousSibling")
            },
            nextAll: function(e) {
                return Z.dir(e, "nextSibling")
            },
            prevAll: function(e) {
                return Z.dir(e, "previousSibling")
            },
            nextUntil: function(e, t, n) {
                return Z.dir(e, "nextSibling", n)
            },
            prevUntil: function(e, t, n) {
                return Z.dir(e, "previousSibling", n)
            },
            siblings: function(e) {
                return Z.sibling((e.parentNode || {}).firstChild, e)
            },
            children: function(e) {
                return Z.sibling(e.firstChild)
            },
            contents: function(e) {
                return e.contentDocument || Z.merge([], e.childNodes)
            }
        }, function(e, t) {
            Z.fn[e] = function(n, r) {
                var i = Z.map(this, t, n);
                return "Until" !== e.slice(-5) && (r = n), r && "string" == typeof r && (i = Z.filter(r, i)), this.length > 1 && (dt[e] || Z.unique(i), ft.test(e) && i.reverse()), this.pushStack(i)
            }
        });
        var ht = /\S+/g,
            pt = {};
        Z.Callbacks = function(e) {
            e = "string" == typeof e ? pt[e] || o(e) : Z.extend({}, e);
            var t, n, r, i, a, s, c = [],
                l = !e.once && [],
                u = function(o) {
                    for (t = e.memory && o, n = !0, s = i || 0, i = 0, a = c.length, r = !0; c && a > s; s++)
                        if (c[s].apply(o[0], o[1]) === !1 && e.stopOnFalse) {
                            t = !1;
                            break
                        }
                    r = !1, c && (l ? l.length && u(l.shift()) : t ? c = [] : f.disable())
                },
                f = {
                    add: function() {
                        if (c) {
                            var n = c.length;
                            ! function o(t) {
                                Z.each(t, function(t, n) {
                                    var r = Z.type(n);
                                    "function" === r ? e.unique && f.has(n) || c.push(n) : n && n.length && "string" !== r && o(n)
                                })
                            }(arguments), r ? a = c.length : t && (i = n, u(t))
                        }
                        return this
                    },
                    remove: function() {
                        return c && Z.each(arguments, function(e, t) {
                            for (var n;
                                (n = Z.inArray(t, c, n)) > -1;) c.splice(n, 1), r && (a >= n && a--, s >= n && s--)
                        }), this
                    },
                    has: function(e) {
                        return e ? Z.inArray(e, c) > -1 : !(!c || !c.length)
                    },
                    empty: function() {
                        return c = [], a = 0, this
                    },
                    disable: function() {
                        return c = l = t = void 0, this
                    },
                    disabled: function() {
                        return !c
                    },
                    lock: function() {
                        return l = void 0, t || f.disable(), this
                    },
                    locked: function() {
                        return !l
                    },
                    fireWith: function(e, t) {
                        return !c || n && !l || (t = t || [], t = [e, t.slice ? t.slice() : t], r ? l.push(t) : u(t)), this
                    },
                    fire: function() {
                        return f.fireWith(this, arguments), this
                    },
                    fired: function() {
                        return !!n
                    }
                };
            return f
        }, Z.extend({
            Deferred: function(e) {
                var t = [
                        ["resolve", "done", Z.Callbacks("once memory"), "resolved"],
                        ["reject", "fail", Z.Callbacks("once memory"), "rejected"],
                        ["notify", "progress", Z.Callbacks("memory")]
                    ],
                    n = "pending",
                    r = {
                        state: function() {
                            return n
                        },
                        always: function() {
                            return i.done(arguments).fail(arguments), this
                        },
                        then: function() {
                            var e = arguments;
                            return Z.Deferred(function(n) {
                                Z.each(t, function(t, o) {
                                    var a = Z.isFunction(e[t]) && e[t];
                                    i[o[1]](function() {
                                        var e = a && a.apply(this, arguments);
                                        e && Z.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[o[0] + "With"](this === r ? n.promise() : this, a ? [e] : arguments)
                                    })
                                }), e = null
                            }).promise()
                        },
                        promise: function(e) {
                            return null != e ? Z.extend(e, r) : r
                        }
                    },
                    i = {};
                return r.pipe = r.then, Z.each(t, function(e, o) {
                    var a = o[2],
                        s = o[3];
                    r[o[1]] = a.add, s && a.add(function() {
                        n = s
                    }, t[1 ^ e][2].disable, t[2][2].lock), i[o[0]] = function() {
                        return i[o[0] + "With"](this === i ? r : this, arguments), this
                    }, i[o[0] + "With"] = a.fireWith
                }), r.promise(i), e && e.call(i, i), i
            },
            when: function(e) {
                var t, n, r, i = 0,
                    o = q.call(arguments),
                    a = o.length,
                    s = 1 !== a || e && Z.isFunction(e.promise) ? a : 0,
                    c = 1 === s ? e : Z.Deferred(),
                    l = function(e, n, r) {
                        return function(i) {
                            n[e] = this, r[e] = arguments.length > 1 ? q.call(arguments) : i, r === t ? c.notifyWith(n, r) : --s || c.resolveWith(n, r)
                        }
                    };
                if (a > 1)
                    for (t = new Array(a), n = new Array(a), r = new Array(a); a > i; i++) o[i] && Z.isFunction(o[i].promise) ? o[i].promise().done(l(i, r, o)).fail(c.reject).progress(l(i, n, t)) : --s;
                return s || c.resolveWith(r, o), c.promise()
            }
        });
        var mt;
        Z.fn.ready = function(e) {
            return Z.ready.promise().done(e), this
        }, Z.extend({
            isReady: !1,
            readyWait: 1,
            holdReady: function(e) {
                e ? Z.readyWait++ : Z.ready(!0)
            },
            ready: function(e) {
                (e === !0 ? --Z.readyWait : Z.isReady) || (Z.isReady = !0, e !== !0 && --Z.readyWait > 0 || (mt.resolveWith(J, [Z]), Z.fn.triggerHandler && (Z(J).triggerHandler("ready"), Z(J).off("ready"))))
            }
        }), Z.ready.promise = function(t) {
            return mt || (mt = Z.Deferred(), "complete" === J.readyState ? setTimeout(Z.ready) : (J.addEventListener("DOMContentLoaded", a, !1), e.addEventListener("load", a, !1))), mt.promise(t)
        }, Z.ready.promise();
        var vt = Z.access = function(e, t, n, r, i, o, a) {
            var s = 0,
                c = e.length,
                l = null == n;
            if ("object" === Z.type(n)) {
                i = !0;
                for (s in n) Z.access(e, t, s, n[s], !0, o, a)
            } else if (void 0 !== r && (i = !0, Z.isFunction(r) || (a = !0), l && (a ? (t.call(e, r), t = null) : (l = t, t = function(e, t, n) {
                    return l.call(Z(e), n)
                })), t))
                for (; c > s; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
            return i ? e : l ? t.call(e) : c ? t(e[0], n) : o
        };
        Z.acceptData = function(e) {
            return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
        }, s.uid = 1, s.accepts = Z.acceptData, s.prototype = {
            key: function(e) {
                if (!s.accepts(e)) return 0;
                var t = {},
                    n = e[this.expando];
                if (!n) {
                    n = s.uid++;
                    try {
                        t[this.expando] = {
                            value: n
                        }, Object.defineProperties(e, t)
                    } catch (r) {
                        t[this.expando] = n, Z.extend(e, t)
                    }
                }
                return this.cache[n] || (this.cache[n] = {}), n
            },
            set: function(e, t, n) {
                var r, i = this.key(e),
                    o = this.cache[i];
                if ("string" == typeof t) o[t] = n;
                else if (Z.isEmptyObject(o)) Z.extend(this.cache[i], t);
                else
                    for (r in t) o[r] = t[r];
                return o
            },
            get: function(e, t) {
                var n = this.cache[this.key(e)];
                return void 0 === t ? n : n[t]
            },
            access: function(e, t, n) {
                var r;
                return void 0 === t || t && "string" == typeof t && void 0 === n ? (r = this.get(e, t), void 0 !== r ? r : this.get(e, Z.camelCase(t))) : (this.set(e, t, n), void 0 !== n ? n : t)
            },
            remove: function(e, t) {
                var n, r, i, o = this.key(e),
                    a = this.cache[o];
                if (void 0 === t) this.cache[o] = {};
                else {
                    Z.isArray(t) ? r = t.concat(t.map(Z.camelCase)) : (i = Z.camelCase(t), t in a ? r = [t, i] : (r = i, r = r in a ? [r] : r.match(ht) || [])), n = r.length;
                    for (; n--;) delete a[r[n]]
                }
            },
            hasData: function(e) {
                return !Z.isEmptyObject(this.cache[e[this.expando]] || {})
            },
            discard: function(e) {
                e[this.expando] && delete this.cache[e[this.expando]]
            }
        };
        var gt = new s,
            yt = new s,
            bt = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            wt = /([A-Z])/g;
        Z.extend({
            hasData: function(e) {
                return yt.hasData(e) || gt.hasData(e)
            },
            data: function(e, t, n) {
                return yt.access(e, t, n)
            },
            removeData: function(e, t) {
                yt.remove(e, t)
            },
            _data: function(e, t, n) {
                return gt.access(e, t, n)
            },
            _removeData: function(e, t) {
                gt.remove(e, t)
            }
        }), Z.fn.extend({
            data: function(e, t) {
                var n, r, i, o = this[0],
                    a = o && o.attributes;
                if (void 0 === e) {
                    if (this.length && (i = yt.get(o), 1 === o.nodeType && !gt.get(o, "hasDataAttrs"))) {
                        for (n = a.length; n--;) a[n] && (r = a[n].name, 0 === r.indexOf("data-") && (r = Z.camelCase(r.slice(5)), c(o, r, i[r])));
                        gt.set(o, "hasDataAttrs", !0)
                    }
                    return i
                }
                return "object" == typeof e ? this.each(function() {
                    yt.set(this, e)
                }) : vt(this, function(t) {
                    var n, r = Z.camelCase(e);
                    if (o && void 0 === t) {
                        if (n = yt.get(o, e), void 0 !== n) return n;
                        if (n = yt.get(o, r), void 0 !== n) return n;
                        if (n = c(o, r, void 0), void 0 !== n) return n
                    } else this.each(function() {
                        var n = yt.get(this, r);
                        yt.set(this, r, t), -1 !== e.indexOf("-") && void 0 !== n && yt.set(this, e, t)
                    })
                }, null, t, arguments.length > 1, null, !0)
            },
            removeData: function(e) {
                return this.each(function() {
                    yt.remove(this, e)
                })
            }
        }), Z.extend({
            queue: function(e, t, n) {
                var r;
                return e ? (t = (t || "fx") + "queue", r = gt.get(e, t), n && (!r || Z.isArray(n) ? r = gt.access(e, t, Z.makeArray(n)) : r.push(n)), r || []) : void 0
            },
            dequeue: function(e, t) {
                t = t || "fx";
                var n = Z.queue(e, t),
                    r = n.length,
                    i = n.shift(),
                    o = Z._queueHooks(e, t),
                    a = function() {
                        Z.dequeue(e, t)
                    };
                "inprogress" === i && (i = n.shift(), r--), i && ("fx" === t && n.unshift("inprogress"), delete o.stop, i.call(e, a, o)), !r && o && o.empty.fire()
            },
            _queueHooks: function(e, t) {
                var n = t + "queueHooks";
                return gt.get(e, n) || gt.access(e, n, {
                    empty: Z.Callbacks("once memory").add(function() {
                        gt.remove(e, [t + "queue", n])
                    })
                })
            }
        }), Z.fn.extend({
            queue: function(e, t) {
                var n = 2;
                return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? Z.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                    var n = Z.queue(this, e, t);
                    Z._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && Z.dequeue(this, e)
                })
            },
            dequeue: function(e) {
                return this.each(function() {
                    Z.dequeue(this, e)
                })
            },
            clearQueue: function(e) {
                return this.queue(e || "fx", [])
            },
            promise: function(e, t) {
                var n, r = 1,
                    i = Z.Deferred(),
                    o = this,
                    a = this.length,
                    s = function() {
                        --r || i.resolveWith(o, [o])
                    };
                for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = gt.get(o[a], e + "queueHooks"), n && n.empty && (r++, n.empty.add(s));
                return s(), i.promise(t)
            }
        });
        var xt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
            Tt = ["Top", "Right", "Bottom", "Left"],
            Et = function(e, t) {
                return e = t || e, "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
            },
            _t = /^(?:checkbox|radio)$/i;
        ! function() {
            var e = J.createDocumentFragment(),
                t = e.appendChild(J.createElement("div")),
                n = J.createElement("input");
            n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), K.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", K.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
        }();
        var Ct = "undefined";
        K.focusinBubbles = "onfocusin" in e;
        var kt = /^key/,
            St = /^(?:mouse|pointer|contextmenu)|click/,
            Nt = /^(?:focusinfocus|focusoutblur)$/,
            At = /^([^.]*)(?:\.(.+)|)$/;
        Z.event = {
            global: {},
            add: function(e, t, n, r, i) {
                var o, a, s, c, l, u, f, d, h, p, m, v = gt.get(e);
                if (v)
                    for (n.handler && (o = n, n = o.handler, i = o.selector), n.guid || (n.guid = Z.guid++), (c = v.events) || (c = v.events = {}), (a = v.handle) || (a = v.handle = function(t) {
                            return typeof Z !== Ct && Z.event.triggered !== t.type ? Z.event.dispatch.apply(e, arguments) : void 0
                        }), t = (t || "").match(ht) || [""], l = t.length; l--;) s = At.exec(t[l]) || [], h = m = s[1], p = (s[2] || "").split(".").sort(), h && (f = Z.event.special[h] || {}, h = (i ? f.delegateType : f.bindType) || h, f = Z.event.special[h] || {}, u = Z.extend({
                        type: h,
                        origType: m,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && Z.expr.match.needsContext.test(i),
                        namespace: p.join(".")
                    }, o), (d = c[h]) || (d = c[h] = [], d.delegateCount = 0, f.setup && f.setup.call(e, r, p, a) !== !1 || e.addEventListener && e.addEventListener(h, a, !1)), f.add && (f.add.call(e, u), u.handler.guid || (u.handler.guid = n.guid)), i ? d.splice(d.delegateCount++, 0, u) : d.push(u), Z.event.global[h] = !0)
            },
            remove: function(e, t, n, r, i) {
                var o, a, s, c, l, u, f, d, h, p, m, v = gt.hasData(e) && gt.get(e);
                if (v && (c = v.events)) {
                    for (t = (t || "").match(ht) || [""], l = t.length; l--;)
                        if (s = At.exec(t[l]) || [], h = m = s[1], p = (s[2] || "").split(".").sort(), h) {
                            for (f = Z.event.special[h] || {}, h = (r ? f.delegateType : f.bindType) || h, d = c[h] || [], s = s[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = o = d.length; o--;) u = d[o], !i && m !== u.origType || n && n.guid !== u.guid || s && !s.test(u.namespace) || r && r !== u.selector && ("**" !== r || !u.selector) || (d.splice(o, 1), u.selector && d.delegateCount--, f.remove && f.remove.call(e, u));
                            a && !d.length && (f.teardown && f.teardown.call(e, p, v.handle) !== !1 || Z.removeEvent(e, h, v.handle), delete c[h])
                        } else
                            for (h in c) Z.event.remove(e, h + t[l], n, r, !0);
                    Z.isEmptyObject(c) && (delete v.handle, gt.remove(e, "events"))
                }
            },
            trigger: function(t, n, r, i) {
                var o, a, s, c, l, u, f, d = [r || J],
                    h = G.call(t, "type") ? t.type : t,
                    p = G.call(t, "namespace") ? t.namespace.split(".") : [];
                if (a = s = r = r || J, 3 !== r.nodeType && 8 !== r.nodeType && !Nt.test(h + Z.event.triggered) && (h.indexOf(".") >= 0 && (p = h.split("."), h = p.shift(), p.sort()), l = h.indexOf(":") < 0 && "on" + h, t = t[Z.expando] ? t : new Z.Event(h, "object" == typeof t && t), t.isTrigger = i ? 2 : 3, t.namespace = p.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = r), n = null == n ? [t] : Z.makeArray(n, [t]), f = Z.event.special[h] || {}, i || !f.trigger || f.trigger.apply(r, n) !== !1)) {
                    if (!i && !f.noBubble && !Z.isWindow(r)) {
                        for (c = f.delegateType || h, Nt.test(c + h) || (a = a.parentNode); a; a = a.parentNode) d.push(a), s = a;
                        s === (r.ownerDocument || J) && d.push(s.defaultView || s.parentWindow || e)
                    }
                    for (o = 0;
                        (a = d[o++]) && !t.isPropagationStopped();) t.type = o > 1 ? c : f.bindType || h, u = (gt.get(a, "events") || {})[t.type] && gt.get(a, "handle"), u && u.apply(a, n), u = l && a[l], u && u.apply && Z.acceptData(a) && (t.result = u.apply(a, n), t.result === !1 && t.preventDefault());
                    return t.type = h, i || t.isDefaultPrevented() || f._default && f._default.apply(d.pop(), n) !== !1 || !Z.acceptData(r) || l && Z.isFunction(r[h]) && !Z.isWindow(r) && (s = r[l], s && (r[l] = null), Z.event.triggered = h, r[h](), Z.event.triggered = void 0, s && (r[l] = s)), t.result
                }
            },
            dispatch: function(e) {
                e = Z.event.fix(e);
                var t, n, r, i, o, a = [],
                    s = q.call(arguments),
                    c = (gt.get(this, "events") || {})[e.type] || [],
                    l = Z.event.special[e.type] || {};
                if (s[0] = e, e.delegateTarget = this, !l.preDispatch || l.preDispatch.call(this, e) !== !1) {
                    for (a = Z.event.handlers.call(this, e, c), t = 0;
                        (i = a[t++]) && !e.isPropagationStopped();)
                        for (e.currentTarget = i.elem, n = 0;
                            (o = i.handlers[n++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(o.namespace)) && (e.handleObj = o, e.data = o.data, r = ((Z.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s), void 0 !== r && (e.result = r) === !1 && (e.preventDefault(), e.stopPropagation()));
                    return l.postDispatch && l.postDispatch.call(this, e), e.result
                }
            },
            handlers: function(e, t) {
                var n, r, i, o, a = [],
                    s = t.delegateCount,
                    c = e.target;
                if (s && c.nodeType && (!e.button || "click" !== e.type))
                    for (; c !== this; c = c.parentNode || this)
                        if (c.disabled !== !0 || "click" !== e.type) {
                            for (r = [], n = 0; s > n; n++) o = t[n], i = o.selector + " ", void 0 === r[i] && (r[i] = o.needsContext ? Z(i, this).index(c) >= 0 : Z.find(i, this, null, [c]).length), r[i] && r.push(o);
                            r.length && a.push({
                                elem: c,
                                handlers: r
                            })
                        }
                return s < t.length && a.push({
                    elem: this,
                    handlers: t.slice(s)
                }), a
            },
            props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(e, t) {
                    return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(e, t) {
                    var n, r, i, o = t.button;
                    return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || J, r = n.documentElement, i = n.body, e.pageX = t.clientX + (r && r.scrollLeft || i && i.scrollLeft || 0) - (r && r.clientLeft || i && i.clientLeft || 0), e.pageY = t.clientY + (r && r.scrollTop || i && i.scrollTop || 0) - (r && r.clientTop || i && i.clientTop || 0)), e.which || void 0 === o || (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0), e
                }
            },
            fix: function(e) {
                if (e[Z.expando]) return e;
                var t, n, r, i = e.type,
                    o = e,
                    a = this.fixHooks[i];
                for (a || (this.fixHooks[i] = a = St.test(i) ? this.mouseHooks : kt.test(i) ? this.keyHooks : {}), r = a.props ? this.props.concat(a.props) : this.props, e = new Z.Event(o), t = r.length; t--;) n = r[t], e[n] = o[n];
                return e.target || (e.target = J), 3 === e.target.nodeType && (e.target = e.target.parentNode), a.filter ? a.filter(e, o) : e
            },
            special: {
                load: {
                    noBubble: !0
                },
                focus: {
                    trigger: function() {
                        return this !== f() && this.focus ? (this.focus(), !1) : void 0
                    },
                    delegateType: "focusin"
                },
                blur: {
                    trigger: function() {
                        return this === f() && this.blur ? (this.blur(), !1) : void 0
                    },
                    delegateType: "focusout"
                },
                click: {
                    trigger: function() {
                        return "checkbox" === this.type && this.click && Z.nodeName(this, "input") ? (this.click(), !1) : void 0
                    },
                    _default: function(e) {
                        return Z.nodeName(e.target, "a")
                    }
                },
                beforeunload: {
                    postDispatch: function(e) {
                        void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                    }
                }
            },
            simulate: function(e, t, n, r) {
                var i = Z.extend(new Z.Event, n, {
                    type: e,
                    isSimulated: !0,
                    originalEvent: {}
                });
                r ? Z.event.trigger(i, null, t) : Z.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
            }
        }, Z.removeEvent = function(e, t, n) {
            e.removeEventListener && e.removeEventListener(t, n, !1)
        }, Z.Event = function(e, t) {
            return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? l : u) : this.type = e, t && Z.extend(this, t), this.timeStamp = e && e.timeStamp || Z.now(), void(this[Z.expando] = !0)) : new Z.Event(e, t)
        }, Z.Event.prototype = {
            isDefaultPrevented: u,
            isPropagationStopped: u,
            isImmediatePropagationStopped: u,
            preventDefault: function() {
                var e = this.originalEvent;
                this.isDefaultPrevented = l, e && e.preventDefault && e.preventDefault()
            },
            stopPropagation: function() {
                var e = this.originalEvent;
                this.isPropagationStopped = l, e && e.stopPropagation && e.stopPropagation()
            },
            stopImmediatePropagation: function() {
                var e = this.originalEvent;
                this.isImmediatePropagationStopped = l, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
            }
        }, Z.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout",
            pointerenter: "pointerover",
            pointerleave: "pointerout"
        }, function(e, t) {
            Z.event.special[e] = {
                delegateType: t,
                bindType: t,
                handle: function(e) {
                    var n, r = this,
                        i = e.relatedTarget,
                        o = e.handleObj;
                    return (!i || i !== r && !Z.contains(r, i)) && (e.type = o.origType, n = o.handler.apply(this, arguments), e.type = t), n
                }
            }
        }), K.focusinBubbles || Z.each({
            focus: "focusin",
            blur: "focusout"
        }, function(e, t) {
            var n = function(e) {
                Z.event.simulate(t, e.target, Z.event.fix(e), !0)
            };
            Z.event.special[t] = {
                setup: function() {
                    var r = this.ownerDocument || this,
                        i = gt.access(r, t);
                    i || r.addEventListener(e, n, !0), gt.access(r, t, (i || 0) + 1)
                },
                teardown: function() {
                    var r = this.ownerDocument || this,
                        i = gt.access(r, t) - 1;
                    i ? gt.access(r, t, i) : (r.removeEventListener(e, n, !0), gt.remove(r, t))
                }
            }
        }), Z.fn.extend({
            on: function(e, t, n, r, i) {
                var o, a;
                if ("object" == typeof e) {
                    "string" != typeof t && (n = n || t, t = void 0);
                    for (a in e) this.on(a, t, n, e[a], i);
                    return this
                }
                if (null == n && null == r ? (r = t, n = t = void 0) : null == r && ("string" == typeof t ? (r = n, n = void 0) : (r = n, n = t, t = void 0)), r === !1) r = u;
                else if (!r) return this;
                return 1 === i && (o = r, r = function(e) {
                    return Z().off(e), o.apply(this, arguments)
                }, r.guid = o.guid || (o.guid = Z.guid++)), this.each(function() {
                    Z.event.add(this, e, r, n, t)
                })
            },
            one: function(e, t, n, r) {
                return this.on(e, t, n, r, 1)
            },
            off: function(e, t, n) {
                var r, i;
                if (e && e.preventDefault && e.handleObj) return r = e.handleObj, Z(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler), this;
                if ("object" == typeof e) {
                    for (i in e) this.off(i, t, e[i]);
                    return this
                }
                return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = u), this.each(function() {
                    Z.event.remove(this, e, n, t)
                })
            },
            trigger: function(e, t) {
                return this.each(function() {
                    Z.event.trigger(e, t, this)
                })
            },
            triggerHandler: function(e, t) {
                var n = this[0];
                return n ? Z.event.trigger(e, t, n, !0) : void 0
            }
        });
        var Dt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
            jt = /<([\w:]+)/,
            Pt = /<|&#?\w+;/,
            $t = /<(?:script|style|link)/i,
            Lt = /checked\s*(?:[^=]|=\s*.checked.)/i,
            Ot = /^$|\/(?:java|ecma)script/i,
            Mt = /^true\/(.*)/,
            It = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
            Ft = {
                option: [1, "<select multiple='multiple'>", "</select>"],
                thead: [1, "<table>", "</table>"],
                col: [2, "<table><colgroup>", "</colgroup></table>"],
                tr: [2, "<table><tbody>", "</tbody></table>"],
                td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                _default: [0, "", ""]
            };
        Ft.optgroup = Ft.option, Ft.tbody = Ft.tfoot = Ft.colgroup = Ft.caption = Ft.thead, Ft.th = Ft.td, Z.extend({
            clone: function(e, t, n) {
                var r, i, o, a, s = e.cloneNode(!0),
                    c = Z.contains(e.ownerDocument, e);
                if (!(K.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e)))
                    for (a = g(s), o = g(e), r = 0, i = o.length; i > r; r++) y(o[r], a[r]);
                if (t)
                    if (n)
                        for (o = o || g(e), a = a || g(s), r = 0, i = o.length; i > r; r++) v(o[r], a[r]);
                    else v(e, s);
                return a = g(s, "script"), a.length > 0 && m(a, !c && g(e, "script")), s
            },
            buildFragment: function(e, t, n, r) {
                for (var i, o, a, s, c, l, u = t.createDocumentFragment(), f = [], d = 0, h = e.length; h > d; d++)
                    if (i = e[d], i || 0 === i)
                        if ("object" === Z.type(i)) Z.merge(f, i.nodeType ? [i] : i);
                        else if (Pt.test(i)) {
                    for (o = o || u.appendChild(t.createElement("div")), a = (jt.exec(i) || ["", ""])[1].toLowerCase(), s = Ft[a] || Ft._default, o.innerHTML = s[1] + i.replace(Dt, "<$1></$2>") + s[2], l = s[0]; l--;) o = o.lastChild;
                    Z.merge(f, o.childNodes), o = u.firstChild, o.textContent = ""
                } else f.push(t.createTextNode(i));
                for (u.textContent = "", d = 0; i = f[d++];)
                    if ((!r || -1 === Z.inArray(i, r)) && (c = Z.contains(i.ownerDocument, i), o = g(u.appendChild(i), "script"), c && m(o), n))
                        for (l = 0; i = o[l++];) Ot.test(i.type || "") && n.push(i);
                return u
            },
            cleanData: function(e) {
                for (var t, n, r, i, o = Z.event.special, a = 0; void 0 !== (n = e[a]); a++) {
                    if (Z.acceptData(n) && (i = n[gt.expando], i && (t = gt.cache[i]))) {
                        if (t.events)
                            for (r in t.events) o[r] ? Z.event.remove(n, r) : Z.removeEvent(n, r, t.handle);
                        gt.cache[i] && delete gt.cache[i]
                    }
                    delete yt.cache[n[yt.expando]]
                }
            }
        }), Z.fn.extend({
            text: function(e) {
                return vt(this, function(e) {
                    return void 0 === e ? Z.text(this) : this.empty().each(function() {
                        (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
                    })
                }, null, e, arguments.length)
            },
            append: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = d(this, e);
                        t.appendChild(e)
                    }
                })
            },
            prepend: function() {
                return this.domManip(arguments, function(e) {
                    if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                        var t = d(this, e);
                        t.insertBefore(e, t.firstChild)
                    }
                })
            },
            before: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this)
                })
            },
            after: function() {
                return this.domManip(arguments, function(e) {
                    this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
                })
            },
            remove: function(e, t) {
                for (var n, r = e ? Z.filter(e, this) : this, i = 0; null != (n = r[i]); i++) t || 1 !== n.nodeType || Z.cleanData(g(n)), n.parentNode && (t && Z.contains(n.ownerDocument, n) && m(g(n, "script")), n.parentNode.removeChild(n));
                return this
            },
            empty: function() {
                for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (Z.cleanData(g(e, !1)), e.textContent = "");
                return this
            },
            clone: function(e, t) {
                return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function() {
                    return Z.clone(this, e, t)
                })
            },
            html: function(e) {
                return vt(this, function(e) {
                    var t = this[0] || {},
                        n = 0,
                        r = this.length;
                    if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
                    if ("string" == typeof e && !$t.test(e) && !Ft[(jt.exec(e) || ["", ""])[1].toLowerCase()]) {
                        e = e.replace(Dt, "<$1></$2>");
                        try {
                            for (; r > n; n++) t = this[n] || {}, 1 === t.nodeType && (Z.cleanData(g(t, !1)), t.innerHTML = e);
                            t = 0
                        } catch (i) {}
                    }
                    t && this.empty().append(e)
                }, null, e, arguments.length)
            },
            replaceWith: function() {
                var e = arguments[0];
                return this.domManip(arguments, function(t) {
                    e = this.parentNode, Z.cleanData(g(this)), e && e.replaceChild(t, this)
                }), e && (e.length || e.nodeType) ? this : this.remove()
            },
            detach: function(e) {
                return this.remove(e, !0)
            },
            domManip: function(e, t) {
                e = B.apply([], e);
                var n, r, i, o, a, s, c = 0,
                    l = this.length,
                    u = this,
                    f = l - 1,
                    d = e[0],
                    m = Z.isFunction(d);
                if (m || l > 1 && "string" == typeof d && !K.checkClone && Lt.test(d)) return this.each(function(n) {
                    var r = u.eq(n);
                    m && (e[0] = d.call(this, n, r.html())), r.domManip(e, t)
                });
                if (l && (n = Z.buildFragment(e, this[0].ownerDocument, !1, this), r = n.firstChild, 1 === n.childNodes.length && (n = r), r)) {
                    for (i = Z.map(g(n, "script"), h), o = i.length; l > c; c++) a = n, c !== f && (a = Z.clone(a, !0, !0), o && Z.merge(i, g(a, "script"))), t.call(this[c], a, c);
                    if (o)
                        for (s = i[i.length - 1].ownerDocument, Z.map(i, p), c = 0; o > c; c++) a = i[c], Ot.test(a.type || "") && !gt.access(a, "globalEval") && Z.contains(s, a) && (a.src ? Z._evalUrl && Z._evalUrl(a.src) : Z.globalEval(a.textContent.replace(It, "")))
                }
                return this
            }
        }), Z.each({
            appendTo: "append",
            prependTo: "prepend",
            insertBefore: "before",
            insertAfter: "after",
            replaceAll: "replaceWith"
        }, function(e, t) {
            Z.fn[e] = function(e) {
                for (var n, r = [], i = Z(e), o = i.length - 1, a = 0; o >= a; a++) n = a === o ? this : this.clone(!0), Z(i[a])[t](n), W.apply(r, n.get());
                return this.pushStack(r)
            }
        });
        var Rt, Ut = {},
            Ht = /^margin/,
            zt = new RegExp("^(" + xt + ")(?!px)[a-z%]+$", "i"),
            qt = function(e) {
                return e.ownerDocument.defaultView.getComputedStyle(e, null)
            };
        ! function() {
            function t() {
                a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", a.innerHTML = "", i.appendChild(o);
                var t = e.getComputedStyle(a, null);
                n = "1%" !== t.top, r = "4px" === t.width, i.removeChild(o)
            }
            var n, r, i = J.documentElement,
                o = J.createElement("div"),
                a = J.createElement("div");
            a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", K.clearCloneStyle = "content-box" === a.style.backgroundClip, o.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", o.appendChild(a), e.getComputedStyle && Z.extend(K, {
                pixelPosition: function() {
                    return t(), n
                },
                boxSizingReliable: function() {
                    return null == r && t(), r
                },
                reliableMarginRight: function() {
                    var t, n = a.appendChild(J.createElement("div"));
                    return n.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", n.style.marginRight = n.style.width = "0", a.style.width = "1px", i.appendChild(o), t = !parseFloat(e.getComputedStyle(n, null).marginRight), i.removeChild(o), t
                }
            }))
        }(), Z.swap = function(e, t, n, r) {
            var i, o, a = {};
            for (o in t) a[o] = e.style[o], e.style[o] = t[o];
            i = n.apply(e, r || []);
            for (o in t) e.style[o] = a[o];
            return i
        };
        var Bt = /^(none|table(?!-c[ea]).+)/,
            Wt = new RegExp("^(" + xt + ")(.*)$", "i"),
            Vt = new RegExp("^([+-])=(" + xt + ")", "i"),
            Xt = {
                position: "absolute",
                visibility: "hidden",
                display: "block"
            },
            Yt = {
                letterSpacing: "0",
                fontWeight: "400"
            },
            Gt = ["Webkit", "O", "Moz", "ms"];
        Z.extend({
            cssHooks: {
                opacity: {
                    get: function(e, t) {
                        if (t) {
                            var n = x(e, "opacity");
                            return "" === n ? "1" : n
                        }
                    }
                }
            },
            cssNumber: {
                columnCount: !0,
                fillOpacity: !0,
                flexGrow: !0,
                flexShrink: !0,
                fontWeight: !0,
                lineHeight: !0,
                opacity: !0,
                order: !0,
                orphans: !0,
                widows: !0,
                zIndex: !0,
                zoom: !0
            },
            cssProps: {
                "float": "cssFloat"
            },
            style: function(e, t, n, r) {
                if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                    var i, o, a, s = Z.camelCase(t),
                        c = e.style;
                    return t = Z.cssProps[s] || (Z.cssProps[s] = E(c, s)), a = Z.cssHooks[t] || Z.cssHooks[s], void 0 === n ? a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : c[t] : (o = typeof n, "string" === o && (i = Vt.exec(n)) && (n = (i[1] + 1) * i[2] + parseFloat(Z.css(e, t)), o = "number"), null != n && n === n && ("number" !== o || Z.cssNumber[s] || (n += "px"), K.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (c[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, r)) || (c[t] = n)), void 0)
                }
            },
            css: function(e, t, n, r) {
                var i, o, a, s = Z.camelCase(t);
                return t = Z.cssProps[s] || (Z.cssProps[s] = E(e.style, s)), a = Z.cssHooks[t] || Z.cssHooks[s], a && "get" in a && (i = a.get(e, !0, n)), void 0 === i && (i = x(e, t, r)), "normal" === i && t in Yt && (i = Yt[t]), "" === n || n ? (o = parseFloat(i), n === !0 || Z.isNumeric(o) ? o || 0 : i) : i
            }
        }), Z.each(["height", "width"], function(e, t) {
            Z.cssHooks[t] = {
                get: function(e, n, r) {
                    return n ? Bt.test(Z.css(e, "display")) && 0 === e.offsetWidth ? Z.swap(e, Xt, function() {
                        return k(e, t, r)
                    }) : k(e, t, r) : void 0
                },
                set: function(e, n, r) {
                    var i = r && qt(e);
                    return _(e, n, r ? C(e, t, r, "border-box" === Z.css(e, "boxSizing", !1, i), i) : 0)
                }
            }
        }), Z.cssHooks.marginRight = T(K.reliableMarginRight, function(e, t) {
            return t ? Z.swap(e, {
                display: "inline-block"
            }, x, [e, "marginRight"]) : void 0
        }), Z.each({
            margin: "",
            padding: "",
            border: "Width"
        }, function(e, t) {
            Z.cssHooks[e + t] = {
                expand: function(n) {
                    for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; 4 > r; r++) i[e + Tt[r] + t] = o[r] || o[r - 2] || o[0];
                    return i
                }
            }, Ht.test(e) || (Z.cssHooks[e + t].set = _)
        }), Z.fn.extend({
            css: function(e, t) {
                return vt(this, function(e, t, n) {
                    var r, i, o = {},
                        a = 0;
                    if (Z.isArray(t)) {
                        for (r = qt(e), i = t.length; i > a; a++) o[t[a]] = Z.css(e, t[a], !1, r);
                        return o
                    }
                    return void 0 !== n ? Z.style(e, t, n) : Z.css(e, t)
                }, e, t, arguments.length > 1)
            },
            show: function() {
                return S(this, !0)
            },
            hide: function() {
                return S(this)
            },
            toggle: function(e) {
                return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                    Et(this) ? Z(this).show() : Z(this).hide()
                })
            }
        }), Z.Tween = N, N.prototype = {
            constructor: N,
            init: function(e, t, n, r, i, o) {
                this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = o || (Z.cssNumber[n] ? "" : "px")
            },
            cur: function() {
                var e = N.propHooks[this.prop];
                return e && e.get ? e.get(this) : N.propHooks._default.get(this)
            },
            run: function(e) {
                var t, n = N.propHooks[this.prop];
                return this.pos = t = this.options.duration ? Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : N.propHooks._default.set(this), this
            }
        }, N.prototype.init.prototype = N.prototype, N.propHooks = {
            _default: {
                get: function(e) {
                    var t;
                    return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
                },
                set: function(e) {
                    Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
                }
            }
        }, N.propHooks.scrollTop = N.propHooks.scrollLeft = {
            set: function(e) {
                e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
            }
        }, Z.easing = {
            linear: function(e) {
                return e
            },
            swing: function(e) {
                return .5 - Math.cos(e * Math.PI) / 2
            }
        }, Z.fx = N.prototype.init, Z.fx.step = {};
        var Kt, Jt, Qt = /^(?:toggle|show|hide)$/,
            Zt = new RegExp("^(?:([+-])=|)(" + xt + ")([a-z%]*)$", "i"),
            en = /queueHooks$/,
            tn = [P],
            nn = {
                "*": [function(e, t) {
                    var n = this.createTween(e, t),
                        r = n.cur(),
                        i = Zt.exec(t),
                        o = i && i[3] || (Z.cssNumber[e] ? "" : "px"),
                        a = (Z.cssNumber[e] || "px" !== o && +r) && Zt.exec(Z.css(n.elem, e)),
                        s = 1,
                        c = 20;
                    if (a && a[3] !== o) {
                        o = o || a[3], i = i || [], a = +r || 1;
                        do s = s || ".5", a /= s, Z.style(n.elem, e, a + o); while (s !== (s = n.cur() / r) && 1 !== s && --c)
                    }
                    return i && (a = n.start = +a || +r || 0, n.unit = o, n.end = i[1] ? a + (i[1] + 1) * i[2] : +i[2]), n
                }]
            };
        Z.Animation = Z.extend(L, {
                tweener: function(e, t) {
                    Z.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
                    for (var n, r = 0, i = e.length; i > r; r++) n = e[r], nn[n] = nn[n] || [], nn[n].unshift(t)
                },
                prefilter: function(e, t) {
                    t ? tn.unshift(e) : tn.push(e)
                }
            }), Z.speed = function(e, t, n) {
                var r = e && "object" == typeof e ? Z.extend({}, e) : {
                    complete: n || !n && t || Z.isFunction(e) && e,
                    duration: e,
                    easing: n && t || t && !Z.isFunction(t) && t
                };
                return r.duration = Z.fx.off ? 0 : "number" == typeof r.duration ? r.duration : r.duration in Z.fx.speeds ? Z.fx.speeds[r.duration] : Z.fx.speeds._default, (null == r.queue || r.queue === !0) && (r.queue = "fx"), r.old = r.complete, r.complete = function() {
                    Z.isFunction(r.old) && r.old.call(this), r.queue && Z.dequeue(this, r.queue)
                }, r
            }, Z.fn.extend({
                fadeTo: function(e, t, n, r) {
                    return this.filter(Et).css("opacity", 0).show().end().animate({
                        opacity: t
                    }, e, n, r)
                },
                animate: function(e, t, n, r) {
                    var i = Z.isEmptyObject(e),
                        o = Z.speed(t, n, r),
                        a = function() {
                            var t = L(this, Z.extend({}, e), o);
                            (i || gt.get(this, "finish")) && t.stop(!0)
                        };
                    return a.finish = a, i || o.queue === !1 ? this.each(a) : this.queue(o.queue, a)
                },
                stop: function(e, t, n) {
                    var r = function(e) {
                        var t = e.stop;
                        delete e.stop, t(n)
                    };
                    return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function() {
                        var t = !0,
                            i = null != e && e + "queueHooks",
                            o = Z.timers,
                            a = gt.get(this);
                        if (i) a[i] && a[i].stop && r(a[i]);
                        else
                            for (i in a) a[i] && a[i].stop && en.test(i) && r(a[i]);
                        for (i = o.length; i--;) o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n), t = !1, o.splice(i, 1));
                        (t || !n) && Z.dequeue(this, e)
                    })
                },
                finish: function(e) {
                    return e !== !1 && (e = e || "fx"), this.each(function() {
                        var t, n = gt.get(this),
                            r = n[e + "queue"],
                            i = n[e + "queueHooks"],
                            o = Z.timers,
                            a = r ? r.length : 0;
                        for (n.finish = !0, Z.queue(this, e, []), i && i.stop && i.stop.call(this, !0), t = o.length; t--;) o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0), o.splice(t, 1));
                        for (t = 0; a > t; t++) r[t] && r[t].finish && r[t].finish.call(this);
                        delete n.finish
                    })
                }
            }), Z.each(["toggle", "show", "hide"], function(e, t) {
                var n = Z.fn[t];
                Z.fn[t] = function(e, r, i) {
                    return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(D(t, !0), e, r, i)
                }
            }), Z.each({
                slideDown: D("show"),
                slideUp: D("hide"),
                slideToggle: D("toggle"),
                fadeIn: {
                    opacity: "show"
                },
                fadeOut: {
                    opacity: "hide"
                },
                fadeToggle: {
                    opacity: "toggle"
                }
            }, function(e, t) {
                Z.fn[e] = function(e, n, r) {
                    return this.animate(t, e, n, r)
                }
            }), Z.timers = [], Z.fx.tick = function() {
                var e, t = 0,
                    n = Z.timers;
                for (Kt = Z.now(); t < n.length; t++) e = n[t], e() || n[t] !== e || n.splice(t--, 1);
                n.length || Z.fx.stop(), Kt = void 0
            }, Z.fx.timer = function(e) {
                Z.timers.push(e), e() ? Z.fx.start() : Z.timers.pop()
            }, Z.fx.interval = 13, Z.fx.start = function() {
                Jt || (Jt = setInterval(Z.fx.tick, Z.fx.interval))
            }, Z.fx.stop = function() {
                clearInterval(Jt), Jt = null
            }, Z.fx.speeds = {
                slow: 600,
                fast: 200,
                _default: 400
            }, Z.fn.delay = function(e, t) {
                return e = Z.fx ? Z.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function(t, n) {
                    var r = setTimeout(t, e);
                    n.stop = function() {
                        clearTimeout(r)
                    }
                })
            },
            function() {
                var e = J.createElement("input"),
                    t = J.createElement("select"),
                    n = t.appendChild(J.createElement("option"));
                e.type = "checkbox", K.checkOn = "" !== e.value, K.optSelected = n.selected, t.disabled = !0, K.optDisabled = !n.disabled, e = J.createElement("input"), e.value = "t", e.type = "radio", K.radioValue = "t" === e.value
            }();
        var rn, on, an = Z.expr.attrHandle;
        Z.fn.extend({
            attr: function(e, t) {
                return vt(this, Z.attr, e, t, arguments.length > 1)
            },
            removeAttr: function(e) {
                return this.each(function() {
                    Z.removeAttr(this, e)
                })
            }
        }), Z.extend({
            attr: function(e, t, n) {
                var r, i, o = e.nodeType;
                if (e && 3 !== o && 8 !== o && 2 !== o) return typeof e.getAttribute === Ct ? Z.prop(e, t, n) : (1 === o && Z.isXMLDoc(e) || (t = t.toLowerCase(), r = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? on : rn)), void 0 === n ? r && "get" in r && null !== (i = r.get(e, t)) ? i : (i = Z.find.attr(e, t), null == i ? void 0 : i) : null !== n ? r && "set" in r && void 0 !== (i = r.set(e, n, t)) ? i : (e.setAttribute(t, n + ""), n) : void Z.removeAttr(e, t))
            },
            removeAttr: function(e, t) {
                var n, r, i = 0,
                    o = t && t.match(ht);
                if (o && 1 === e.nodeType)
                    for (; n = o[i++];) r = Z.propFix[n] || n, Z.expr.match.bool.test(n) && (e[r] = !1), e.removeAttribute(n)
            },
            attrHooks: {
                type: {
                    set: function(e, t) {
                        if (!K.radioValue && "radio" === t && Z.nodeName(e, "input")) {
                            var n = e.value;
                            return e.setAttribute("type", t), n && (e.value = n), t
                        }
                    }
                }
            }
        }), on = {
            set: function(e, t, n) {
                return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n), n
            }
        }, Z.each(Z.expr.match.bool.source.match(/\w+/g), function(e, t) {
            var n = an[t] || Z.find.attr;
            an[t] = function(e, t, r) {
                var i, o;
                return r || (o = an[t], an[t] = i, i = null != n(e, t, r) ? t.toLowerCase() : null, an[t] = o), i
            }
        });
        var sn = /^(?:input|select|textarea|button)$/i;
        Z.fn.extend({
            prop: function(e, t) {
                return vt(this, Z.prop, e, t, arguments.length > 1)
            },
            removeProp: function(e) {
                return this.each(function() {
                    delete this[Z.propFix[e] || e]
                })
            }
        }), Z.extend({
            propFix: {
                "for": "htmlFor",
                "class": "className"
            },
            prop: function(e, t, n) {
                var r, i, o, a = e.nodeType;
                if (e && 3 !== a && 8 !== a && 2 !== a) return o = 1 !== a || !Z.isXMLDoc(e), o && (t = Z.propFix[t] || t, i = Z.propHooks[t]), void 0 !== n ? i && "set" in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get" in i && null !== (r = i.get(e, t)) ? r : e[t]
            },
            propHooks: {
                tabIndex: {
                    get: function(e) {
                        return e.hasAttribute("tabindex") || sn.test(e.nodeName) || e.href ? e.tabIndex : -1
                    }
                }
            }
        }), K.optSelected || (Z.propHooks.selected = {
            get: function(e) {
                var t = e.parentNode;
                return t && t.parentNode && t.parentNode.selectedIndex, null
            }
        }), Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
            Z.propFix[this.toLowerCase()] = this
        });
        var cn = /[\t\r\n\f]/g;
        Z.fn.extend({
            addClass: function(e) {
                var t, n, r, i, o, a, s = "string" == typeof e && e,
                    c = 0,
                    l = this.length;
                if (Z.isFunction(e)) return this.each(function(t) {
                    Z(this).addClass(e.call(this, t, this.className))
                });
                if (s)
                    for (t = (e || "").match(ht) || []; l > c; c++)
                        if (n = this[c], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(cn, " ") : " ")) {
                            for (o = 0; i = t[o++];) r.indexOf(" " + i + " ") < 0 && (r += i + " ");
                            a = Z.trim(r), n.className !== a && (n.className = a)
                        }
                return this
            },
            removeClass: function(e) {
                var t, n, r, i, o, a, s = 0 === arguments.length || "string" == typeof e && e,
                    c = 0,
                    l = this.length;
                if (Z.isFunction(e)) return this.each(function(t) {
                    Z(this).removeClass(e.call(this, t, this.className))
                });
                if (s)
                    for (t = (e || "").match(ht) || []; l > c; c++)
                        if (n = this[c], r = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(cn, " ") : "")) {
                            for (o = 0; i = t[o++];)
                                for (; r.indexOf(" " + i + " ") >= 0;) r = r.replace(" " + i + " ", " ");
                            a = e ? Z.trim(r) : "", n.className !== a && (n.className = a)
                        }
                return this
            },
            toggleClass: function(e, t) {
                var n = typeof e;
                return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(Z.isFunction(e) ? function(n) {
                    Z(this).toggleClass(e.call(this, n, this.className, t), t)
                } : function() {
                    if ("string" === n)
                        for (var t, r = 0, i = Z(this), o = e.match(ht) || []; t = o[r++];) i.hasClass(t) ? i.removeClass(t) : i.addClass(t);
                    else(n === Ct || "boolean" === n) && (this.className && gt.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : gt.get(this, "__className__") || "")
                })
            },
            hasClass: function(e) {
                for (var t = " " + e + " ", n = 0, r = this.length; r > n; n++)
                    if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(cn, " ").indexOf(t) >= 0) return !0;
                return !1
            }
        });
        var ln = /\r/g;
        Z.fn.extend({
            val: function(e) {
                var t, n, r, i = this[0]; {
                    if (arguments.length) return r = Z.isFunction(e), this.each(function(n) {
                        var i;
                        1 === this.nodeType && (i = r ? e.call(this, n, Z(this).val()) : e, null == i ? i = "" : "number" == typeof i ? i += "" : Z.isArray(i) && (i = Z.map(i, function(e) {
                            return null == e ? "" : e + ""
                        })), t = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, i, "value") || (this.value = i))
                    });
                    if (i) return t = Z.valHooks[i.type] || Z.valHooks[i.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(i, "value")) ? n : (n = i.value, "string" == typeof n ? n.replace(ln, "") : null == n ? "" : n)
                }
            }
        }), Z.extend({
            valHooks: {
                option: {
                    get: function(e) {
                        var t = Z.find.attr(e, "value");
                        return null != t ? t : Z.trim(Z.text(e))
                    }
                },
                select: {
                    get: function(e) {
                        for (var t, n, r = e.options, i = e.selectedIndex, o = "select-one" === e.type || 0 > i, a = o ? null : [], s = o ? i + 1 : r.length, c = 0 > i ? s : o ? i : 0; s > c; c++)
                            if (n = r[c], !(!n.selected && c !== i || (K.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && Z.nodeName(n.parentNode, "optgroup"))) {
                                if (t = Z(n).val(), o) return t;
                                a.push(t)
                            }
                        return a
                    },
                    set: function(e, t) {
                        for (var n, r, i = e.options, o = Z.makeArray(t), a = i.length; a--;) r = i[a], (r.selected = Z.inArray(r.value, o) >= 0) && (n = !0);
                        return n || (e.selectedIndex = -1), o
                    }
                }
            }
        }), Z.each(["radio", "checkbox"], function() {
            Z.valHooks[this] = {
                set: function(e, t) {
                    return Z.isArray(t) ? e.checked = Z.inArray(Z(e).val(), t) >= 0 : void 0
                }
            }, K.checkOn || (Z.valHooks[this].get = function(e) {
                return null === e.getAttribute("value") ? "on" : e.value
            })
        }), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(e, t) {
            Z.fn[t] = function(e, n) {
                return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
            }
        }), Z.fn.extend({
            hover: function(e, t) {
                return this.mouseenter(e).mouseleave(t || e)
            },
            bind: function(e, t, n) {
                return this.on(e, null, t, n)
            },
            unbind: function(e, t) {
                return this.off(e, null, t)
            },
            delegate: function(e, t, n, r) {
                return this.on(t, e, n, r)
            },
            undelegate: function(e, t, n) {
                return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
            }
        });
        var un = Z.now(),
            fn = /\?/;
        Z.parseJSON = function(e) {
            return JSON.parse(e + "")
        }, Z.parseXML = function(e) {
            var t, n;
            if (!e || "string" != typeof e) return null;
            try {
                n = new DOMParser, t = n.parseFromString(e, "text/xml")
            } catch (r) {
                t = void 0
            }
            return (!t || t.getElementsByTagName("parsererror").length) && Z.error("Invalid XML: " + e), t
        };
        var dn, hn, pn = /#.*$/,
            mn = /([?&])_=[^&]*/,
            vn = /^(.*?):[ \t]*([^\r\n]*)$/gm,
            gn = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
            yn = /^(?:GET|HEAD)$/,
            bn = /^\/\//,
            wn = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
            xn = {},
            Tn = {},
            En = "*/".concat("*");
        try {
            hn = location.href
        } catch (_n) {
            hn = J.createElement("a"), hn.href = "", hn = hn.href
        }
        dn = wn.exec(hn.toLowerCase()) || [], Z.extend({
            active: 0,
            lastModified: {},
            etag: {},
            ajaxSettings: {
                url: hn,
                type: "GET",
                isLocal: gn.test(dn[1]),
                global: !0,
                processData: !0,
                async: !0,
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                accepts: {
                    "*": En,
                    text: "text/plain",
                    html: "text/html",
                    xml: "application/xml, text/xml",
                    json: "application/json, text/javascript"
                },
                contents: {
                    xml: /xml/,
                    html: /html/,
                    json: /json/
                },
                responseFields: {
                    xml: "responseXML",
                    text: "responseText",
                    json: "responseJSON"
                },
                converters: {
                    "* text": String,
                    "text html": !0,
                    "text json": Z.parseJSON,
                    "text xml": Z.parseXML
                },
                flatOptions: {
                    url: !0,
                    context: !0
                }
            },
            ajaxSetup: function(e, t) {
                return t ? I(I(e, Z.ajaxSettings), t) : I(Z.ajaxSettings, e)
            },
            ajaxPrefilter: O(xn),
            ajaxTransport: O(Tn),
            ajax: function(e, t) {
                function n(e, t, n, a) {
                    var c, u, g, y, w, T = t;
                    2 !== b && (b = 2, s && clearTimeout(s), r = void 0, o = a || "", x.readyState = e > 0 ? 4 : 0, c = e >= 200 && 300 > e || 304 === e, n && (y = F(f, x, n)), y = R(f, y, x, c), c ? (f.ifModified && (w = x.getResponseHeader("Last-Modified"), w && (Z.lastModified[i] = w), w = x.getResponseHeader("etag"), w && (Z.etag[i] = w)), 204 === e || "HEAD" === f.type ? T = "nocontent" : 304 === e ? T = "notmodified" : (T = y.state, u = y.data, g = y.error, c = !g)) : (g = T, (e || !T) && (T = "error", 0 > e && (e = 0))), x.status = e, x.statusText = (t || T) + "", c ? p.resolveWith(d, [u, T, x]) : p.rejectWith(d, [x, T, g]), x.statusCode(v), v = void 0, l && h.trigger(c ? "ajaxSuccess" : "ajaxError", [x, f, c ? u : g]), m.fireWith(d, [x, T]), l && (h.trigger("ajaxComplete", [x, f]), --Z.active || Z.event.trigger("ajaxStop")))
                }
                "object" == typeof e && (t = e, e = void 0), t = t || {};
                var r, i, o, a, s, c, l, u, f = Z.ajaxSetup({}, t),
                    d = f.context || f,
                    h = f.context && (d.nodeType || d.jquery) ? Z(d) : Z.event,
                    p = Z.Deferred(),
                    m = Z.Callbacks("once memory"),
                    v = f.statusCode || {},
                    g = {},
                    y = {},
                    b = 0,
                    w = "canceled",
                    x = {
                        readyState: 0,
                        getResponseHeader: function(e) {
                            var t;
                            if (2 === b) {
                                if (!a)
                                    for (a = {}; t = vn.exec(o);) a[t[1].toLowerCase()] = t[2];
                                t = a[e.toLowerCase()]
                            }
                            return null == t ? null : t
                        },
                        getAllResponseHeaders: function() {
                            return 2 === b ? o : null
                        },
                        setRequestHeader: function(e, t) {
                            var n = e.toLowerCase();
                            return b || (e = y[n] = y[n] || e, g[e] = t), this
                        },
                        overrideMimeType: function(e) {
                            return b || (f.mimeType = e), this
                        },
                        statusCode: function(e) {
                            var t;
                            if (e)
                                if (2 > b)
                                    for (t in e) v[t] = [v[t], e[t]];
                                else x.always(e[x.status]);
                            return this
                        },
                        abort: function(e) {
                            var t = e || w;
                            return r && r.abort(t), n(0, t), this
                        }
                    };
                if (p.promise(x).complete = m.add, x.success = x.done, x.error = x.fail, f.url = ((e || f.url || hn) + "").replace(pn, "").replace(bn, dn[1] + "//"), f.type = t.method || t.type || f.method || f.type, f.dataTypes = Z.trim(f.dataType || "*").toLowerCase().match(ht) || [""], null == f.crossDomain && (c = wn.exec(f.url.toLowerCase()), f.crossDomain = !(!c || c[1] === dn[1] && c[2] === dn[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (dn[3] || ("http:" === dn[1] ? "80" : "443")))), f.data && f.processData && "string" != typeof f.data && (f.data = Z.param(f.data, f.traditional)), M(xn, f, t, x), 2 === b) return x;
                l = f.global, l && 0 === Z.active++ && Z.event.trigger("ajaxStart"), f.type = f.type.toUpperCase(), f.hasContent = !yn.test(f.type), i = f.url, f.hasContent || (f.data && (i = f.url += (fn.test(i) ? "&" : "?") + f.data, delete f.data), f.cache === !1 && (f.url = mn.test(i) ? i.replace(mn, "$1_=" + un++) : i + (fn.test(i) ? "&" : "?") + "_=" + un++)), f.ifModified && (Z.lastModified[i] && x.setRequestHeader("If-Modified-Since", Z.lastModified[i]), Z.etag[i] && x.setRequestHeader("If-None-Match", Z.etag[i])), (f.data && f.hasContent && f.contentType !== !1 || t.contentType) && x.setRequestHeader("Content-Type", f.contentType), x.setRequestHeader("Accept", f.dataTypes[0] && f.accepts[f.dataTypes[0]] ? f.accepts[f.dataTypes[0]] + ("*" !== f.dataTypes[0] ? ", " + En + "; q=0.01" : "") : f.accepts["*"]);
                for (u in f.headers) x.setRequestHeader(u, f.headers[u]);
                if (f.beforeSend && (f.beforeSend.call(d, x, f) === !1 || 2 === b)) return x.abort();
                w = "abort";
                for (u in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) x[u](f[u]);
                if (r = M(Tn, f, t, x)) {
                    x.readyState = 1, l && h.trigger("ajaxSend", [x, f]), f.async && f.timeout > 0 && (s = setTimeout(function() {
                        x.abort("timeout")
                    }, f.timeout));
                    try {
                        b = 1, r.send(g, n)
                    } catch (T) {
                        if (!(2 > b)) throw T;
                        n(-1, T)
                    }
                } else n(-1, "No Transport");
                return x
            },
            getJSON: function(e, t, n) {
                return Z.get(e, t, n, "json")
            },
            getScript: function(e, t) {
                return Z.get(e, void 0, t, "script")
            }
        }), Z.each(["get", "post"], function(e, t) {
            Z[t] = function(e, n, r, i) {
                return Z.isFunction(n) && (i = i || r, r = n, n = void 0), Z.ajax({
                    url: e,
                    type: t,
                    dataType: i,
                    data: n,
                    success: r
                })
            }
        }), Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
            Z.fn[t] = function(e) {
                return this.on(t, e)
            }
        }), Z._evalUrl = function(e) {
            return Z.ajax({
                url: e,
                type: "GET",
                dataType: "script",
                async: !1,
                global: !1,
                "throws": !0
            })
        }, Z.expr.filters.hidden = function(e) {
            return e.offsetWidth <= 0 && e.offsetHeight <= 0
        }, Z.expr.filters.visible = function(e) {
            return !Z.expr.filters.hidden(e)
        };
        var Cn = /%20/g,
            kn = /\[\]$/,
            Sn = /\r?\n/g,
            Nn = /^(?:submit|button|image|reset|file)$/i,
            An = /^(?:input|select|textarea|keygen)/i;
        Z.param = function(e, t) {
            var n, r = [],
                i = function(e, t) {
                    t = Z.isFunction(t) ? t() : null == t ? "" : t, r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
                };
            if (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e, function() {
                i(this.name, this.value)
            });
            else
                for (n in e) U(n, e[n], t, i);
            return r.join("&").replace(Cn, "+")
        }, Z.fn.extend({
            serialize: function() {
                return Z.param(this.serializeArray())
            },
            serializeArray: function() {
                return this.map(function() {
                    var e = Z.prop(this, "elements");
                    return e ? Z.makeArray(e) : this
                }).filter(function() {
                    var e = this.type;
                    return this.name && !Z(this).is(":disabled") && An.test(this.nodeName) && !Nn.test(e) && (this.checked || !_t.test(e))
                }).map(function(e, t) {
                    var n = Z(this).val();
                    return null == n ? null : Z.isArray(n) ? Z.map(n, function(e) {
                        return {
                            name: t.name,
                            value: e.replace(Sn, "\r\n")
                        }
                    }) : {
                        name: t.name,
                        value: n.replace(Sn, "\r\n")
                    }
                }).get()
            }
        }), Z.ajaxSettings.xhr = function() {
            try {
                return new XMLHttpRequest
            } catch (e) {}
        };
        var Dn = 0,
            jn = {},
            Pn = {
                0: 200,
                1223: 204
            },
            $n = Z.ajaxSettings.xhr();
        e.ActiveXObject && Z(e).on("unload", function() {
            for (var e in jn) jn[e]()
        }), K.cors = !!$n && "withCredentials" in $n, K.ajax = $n = !!$n, Z.ajaxTransport(function(e) {
            var t;
            return K.cors || $n && !e.crossDomain ? {
                send: function(n, r) {
                    var i, o = e.xhr(),
                        a = ++Dn;
                    if (o.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
                        for (i in e.xhrFields) o[i] = e.xhrFields[i];
                    e.mimeType && o.overrideMimeType && o.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
                    for (i in n) o.setRequestHeader(i, n[i]);
                    t = function(e) {
                        return function() {
                            t && (delete jn[a], t = o.onload = o.onerror = null, "abort" === e ? o.abort() : "error" === e ? r(o.status, o.statusText) : r(Pn[o.status] || o.status, o.statusText, "string" == typeof o.responseText ? {
                                text: o.responseText
                            } : void 0, o.getAllResponseHeaders()))
                        }
                    }, o.onload = t(), o.onerror = t("error"), t = jn[a] = t("abort");
                    try {
                        o.send(e.hasContent && e.data || null)
                    } catch (s) {
                        if (t) throw s
                    }
                },
                abort: function() {
                    t && t()
                }
            } : void 0
        }), Z.ajaxSetup({
            accepts: {
                script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
            },
            contents: {
                script: /(?:java|ecma)script/
            },
            converters: {
                "text script": function(e) {
                    return Z.globalEval(e), e
                }
            }
        }), Z.ajaxPrefilter("script", function(e) {
            void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
        }), Z.ajaxTransport("script", function(e) {
            if (e.crossDomain) {
                var t, n;
                return {
                    send: function(r, i) {
                        t = Z("<script>").prop({
                            async: !0,
                            charset: e.scriptCharset,
                            src: e.url
                        }).on("load error", n = function(e) {
                            t.remove(), n = null, e && i("error" === e.type ? 404 : 200, e.type)
                        }), J.head.appendChild(t[0])
                    },
                    abort: function() {
                        n && n()
                    }
                }
            }
        }), Z.parseHTML = function(e, t, n) {
            if (!e || "string" != typeof e) return null;
            "boolean" == typeof t && (n = t, t = !1), t = t || J;
            var r = at.exec(e),
                i = !n && [];
            return r ? [t.createElement(r[1])] : (r = Z.buildFragment([e], t, i), i && i.length && Z(i).remove(), Z.merge([], r.childNodes))
        };
        var Ln = Z.fn.load;
        Z.fn.load = function(e, t, n) {
            if ("string" != typeof e && Ln) return Ln.apply(this, arguments);
            var r, i, o, a = this,
                s = e.indexOf(" ");
            return s >= 0 && (r = Z.trim(e.slice(s)), e = e.slice(0, s)), Z.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (i = "POST"), a.length > 0 && Z.ajax({
                url: e,
                type: i,
                dataType: "html",
                data: t
            }).done(function(e) {
                o = arguments, a.html(r ? Z("<div>").append(Z.parseHTML(e)).find(r) : e)
            }).complete(n && function(e, t) {
                a.each(n, o || [e.responseText, t, e])
            }), this
        }, Z.expr.filters.animated = function(e) {
            return Z.grep(Z.timers, function(t) {
                return e === t.elem
            }).length
        };
        var On = e.document.documentElement;
        Z.offset = {
            setOffset: function(e, t, n) {
                var r, i, o, a, s, c, l, u = Z.css(e, "position"),
                    f = Z(e),
                    d = {};
                "static" === u && (e.style.position = "relative"), s = f.offset(), o = Z.css(e, "top"), c = Z.css(e, "left"), l = ("absolute" === u || "fixed" === u) && (o + c).indexOf("auto") > -1, l ? (r = f.position(), a = r.top, i = r.left) : (a = parseFloat(o) || 0, i = parseFloat(c) || 0), Z.isFunction(t) && (t = t.call(e, n, s)), null != t.top && (d.top = t.top - s.top + a), null != t.left && (d.left = t.left - s.left + i), "using" in t ? t.using.call(e, d) : f.css(d)
            }
        }, Z.fn.extend({
            offset: function(e) {
                if (arguments.length) return void 0 === e ? this : this.each(function(t) {
                    Z.offset.setOffset(this, e, t)
                });
                var t, n, r = this[0],
                    i = {
                        top: 0,
                        left: 0
                    },
                    o = r && r.ownerDocument;
                if (o) return t = o.documentElement, Z.contains(t, r) ? (typeof r.getBoundingClientRect !== Ct && (i = r.getBoundingClientRect()), n = H(o), {
                    top: i.top + n.pageYOffset - t.clientTop,
                    left: i.left + n.pageXOffset - t.clientLeft
                }) : i
            },
            position: function() {
                if (this[0]) {
                    var e, t, n = this[0],
                        r = {
                            top: 0,
                            left: 0
                        };
                    return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), Z.nodeName(e[0], "html") || (r = e.offset()), r.top += Z.css(e[0], "borderTopWidth", !0), r.left += Z.css(e[0], "borderLeftWidth", !0)), {
                        top: t.top - r.top - Z.css(n, "marginTop", !0),
                        left: t.left - r.left - Z.css(n, "marginLeft", !0)
                    }
                }
            },
            offsetParent: function() {
                return this.map(function() {
                    for (var e = this.offsetParent || On; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position");) e = e.offsetParent;
                    return e || On
                })
            }
        }), Z.each({
            scrollLeft: "pageXOffset",
            scrollTop: "pageYOffset"
        }, function(t, n) {
            var r = "pageYOffset" === n;
            Z.fn[t] = function(i) {
                return vt(this, function(t, i, o) {
                    var a = H(t);
                    return void 0 === o ? a ? a[n] : t[i] : void(a ? a.scrollTo(r ? e.pageXOffset : o, r ? o : e.pageYOffset) : t[i] = o)
                }, t, i, arguments.length, null)
            }
        }), Z.each(["top", "left"], function(e, t) {
            Z.cssHooks[t] = T(K.pixelPosition, function(e, n) {
                return n ? (n = x(e, t), zt.test(n) ? Z(e).position()[t] + "px" : n) : void 0
            })
        }), Z.each({
            Height: "height",
            Width: "width"
        }, function(e, t) {
            Z.each({
                padding: "inner" + e,
                content: t,
                "": "outer" + e
            }, function(n, r) {
                Z.fn[r] = function(r, i) {
                    var o = arguments.length && (n || "boolean" != typeof r),
                        a = n || (r === !0 || i === !0 ? "margin" : "border");
                    return vt(this, function(t, n, r) {
                        var i;
                        return Z.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (i = t.documentElement, Math.max(t.body["scroll" + e], i["scroll" + e], t.body["offset" + e], i["offset" + e], i["client" + e])) : void 0 === r ? Z.css(t, n, a) : Z.style(t, n, r, a)
                    }, t, o ? r : void 0, o, null)
                }
            })
        });
        var Mn = e.jQuery,
            In = e.$;
        return Z.noConflict = function(t) {
            return e.$ === Z && (e.$ = In), t && e.jQuery === Z && (e.jQuery = Mn), Z
        }, typeof t === Ct && (e.jQuery = e.$ = Z), Z
    }),
    function(e) {
        "use strict";

        function t() {
            return this instanceof t ? (this.size = 0, this.uid = 0, this.selectors = [], this.indexes = Object.create(this.indexes), void(this.activeIndexes = [])) : new t
        }

        function n(e, t) {
            e = e.slice(0).concat(e["default"]);
            var n, r, i, o, a, s, c = e.length,
                l = t,
                u = [];
            do
                if (f.exec(""), (i = f.exec(l)) && (l = i[3], i[2] || !l))
                    for (n = 0; c > n; n++)
                        if (s = e[n], a = s.selector(i[1])) {
                            for (r = u.length, o = !1; r--;)
                                if (u[r].index === s && u[r].key === a) {
                                    o = !0;
                                    break
                                }
                            o || u.push({
                                index: s,
                                key: a
                            });
                            break
                        }
            while (i);
            return u
        }

        function r(e, t) {
            var n, r, i;
            for (n = 0, r = e.length; r > n; n++)
                if (i = e[n], t.isPrototypeOf(i)) return i
        }

        function i(e, t) {
            return e.id - t.id
        }
        var o = e.document.documentElement,
            a = o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector;
        t.prototype.matchesSelector = function(e, t) {
            return a.call(e, t)
        }, t.prototype.querySelectorAll = function(e, t) {
            return t.querySelectorAll(e)
        }, t.prototype.indexes = [];
        var s = /^#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
        t.prototype.indexes.push({
            name: "ID",
            selector: function(e) {
                var t;
                return (t = e.match(s)) ? t[0].slice(1) : void 0
            },
            element: function(e) {
                return e.id ? [e.id] : void 0
            }
        });
        var c = /^\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
        t.prototype.indexes.push({
            name: "CLASS",
            selector: function(e) {
                var t;
                return (t = e.match(c)) ? t[0].slice(1) : void 0
            },
            element: function(e) {
                var t = e.className;
                if (t) {
                    if ("string" == typeof t) return t.split(/\s/);
                    if ("object" == typeof t && "baseVal" in t) return t.baseVal.split(/\s/)
                }
            }
        });
        var l = /^((?:[\w\u00c0-\uFFFF\-]|\\.)+)/g;
        t.prototype.indexes.push({
            name: "TAG",
            selector: function(e) {
                var t;
                return (t = e.match(l)) ? t[0].toUpperCase() : void 0
            },
            element: function(e) {
                return [e.nodeName.toUpperCase()]
            }
        }), t.prototype.indexes["default"] = {
            name: "UNIVERSAL",
            selector: function() {
                return !0
            },
            element: function() {
                return [!0]
            }
        };
        var u;
        u = "function" == typeof e.Map ? e.Map : function() {
            function e() {
                this.map = {}
            }
            return e.prototype.get = function(e) {
                return this.map[e + " "]
            }, e.prototype.set = function(e, t) {
                this.map[e + " "] = t
            }, e
        }();
        var f = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g;
        t.prototype.logDefaultIndexUsed = function() {}, t.prototype.add = function(e, t) {
            var i, o, a, s, c, l, f, d, h = this.activeIndexes,
                p = this.selectors;
            if ("string" == typeof e) {
                for (i = {
                        id: this.uid++,
                        selector: e,
                        data: t
                    }, f = n(this.indexes, e), o = 0; o < f.length; o++) d = f[o], s = d.key, a = d.index, c = r(h, a), c || (c = Object.create(a), c.map = new u, h.push(c)), a === this.indexes["default"] && this.logDefaultIndexUsed(i), l = c.map.get(s), l || (l = [], c.map.set(s, l)), l.push(i);
                this.size++, p.push(e)
            }
        }, t.prototype.remove = function(e, t) {
            if ("string" == typeof e) {
                var r, i, o, a, s, c, l, u, f = this.activeIndexes,
                    d = {},
                    h = 1 === arguments.length;
                for (r = n(this.indexes, e), o = 0; o < r.length; o++)
                    for (i = r[o], a = f.length; a--;)
                        if (c = f[a], i.index.isPrototypeOf(c)) {
                            if (l = c.map.get(i.key))
                                for (s = l.length; s--;) u = l[s], u.selector !== e || !h && u.data !== t || (l.splice(s, 1), d[u.id] = !0);
                            break
                        }
                this.size -= Object.keys(d).length
            }
        }, t.prototype.queryAll = function(e) {
            if (!this.selectors.length) return [];
            var t, n, r, o, a, s, c, l, u = {},
                f = [],
                d = this.querySelectorAll(this.selectors.join(", "), e);
            for (t = 0, r = d.length; r > t; t++)
                for (a = d[t], s = this.matches(a), n = 0, o = s.length; o > n; n++) l = s[n], u[l.id] ? c = u[l.id] : (c = {
                    id: l.id,
                    selector: l.selector,
                    data: l.data,
                    elements: []
                }, u[l.id] = c, f.push(c)), c.elements.push(a);
            return f.sort(i)
        }, t.prototype.matches = function(e) {
            if (!e) return [];
            var t, n, r, o, a, s, c, l, u, f, d, h = this.activeIndexes,
                p = {},
                m = [];
            for (t = 0, o = h.length; o > t; t++)
                if (c = h[t], l = c.element(e))
                    for (n = 0, a = l.length; a > n; n++)
                        if (u = c.map.get(l[n]))
                            for (r = 0, s = u.length; s > r; r++) f = u[r], d = f.id, !p[d] && this.matchesSelector(e, f.selector) && (p[d] = !0, m.push(f));
            return m.sort(i)
        }, e.SelectorSet = t
    }(window),
    function() {
        var e, t, n, r, i, o, a, s, c, l, u, f, d, h, p, m, v, g, y, b, w, x, T, E, _;
        h = function() {
            var e, t, n;
            return e = document.createElement("div"), t = document.createElement("div"), n = document.createElement("div"), e.appendChild(t), t.appendChild(n), e.innerHTML = "", n.parentNode !== t
        }(), _ = 0, s = [], T = new SelectorSet, T.querySelectorAll = $.find, T.matchesSelector = $.find.matchesSelector, f = new WeakMap, n = new WeakMap, d = new WeakMap, b = function(e, t) {
            var n, r;
            (n = f.get(e)) || (n = [], f.set(e, n)), -1 === n.indexOf(t.id) && (null != t.initialize && (r = t.initialize.call(e, e)), d.set(e, r), n.push(t.id))
        }, y = function(e, t) {
            var r, i, o, a;
            (r = n.get(e)) || (r = [], n.set(e, r)), -1 === r.indexOf(t.id) && (t.elements.push(e), (i = d.get(e)) && ("length" in i || null != (o = i.add) && o.call(e, e)), null != (a = t.add) && a.call(e, e), r.push(t.id))
        }, w = function(e, t) {
            var r, i, o, a, c, l, u, f, h, p, m;
            if (r = n.get(e))
                if (t) o = t.elements.indexOf(e), -1 !== o && t.elements.splice(o, 1), o = r.indexOf(t.id), -1 !== o && ((a = d.get(e)) && ("length" in a || null != (u = a.remove) && u.call(e, e)), null != (f = t.remove) && f.call(e, e), r.splice(o, 1)), 0 === r.length && n["delete"](e);
                else {
                    for (h = r.slice(0), c = 0, l = h.length; l > c; c++) i = h[c], t = s[i], t && (o = t.elements.indexOf(e), -1 !== o && t.elements.splice(o, 1), (a = d.get(e)) && null != (p = a.remove) && p.call(e, e), null != (m = t.remove) && m.call(e, e));
                    n["delete"](e)
                }
        }, r = function(e, t) {
            var n, r, i, o, a, s, c, l, u, f, d, h, p, m, v;
            for (a = 0, u = t.length; u > a; a++)
                if (i = t[a], i.nodeType === Node.ELEMENT_NODE) {
                    for (p = T.matches(i), s = 0, f = p.length; f > s; s++) n = p[s].data, e.push(["add", i, n]);
                    for (m = T.queryAll(i), c = 0, d = m.length; d > c; c++)
                        for (v = m[c], n = v.data, o = v.elements, l = 0, h = o.length; h > l; l++) r = o[l], e.push(["add", r, n])
                }
        }, p = function(e, t) {
            var n, r, i, o, a, s, c;
            for (i = 0, a = t.length; a > i; i++)
                if (r = t[i], r.nodeType === Node.ELEMENT_NODE)
                    for (e.push(["remove", r]), c = r.getElementsByTagName("*"), o = 0, s = c.length; s > o; o++) n = c[o], e.push(["remove", n])
        }, g = function(e) {
            var t, n, r, i, o, a, c;
            for (r = 0, o = s.length; o > r; r++)
                if (n = s[r])
                    for (c = n.elements, i = 0, a = c.length; a > i; i++) t = c[i], t.parentNode || e.push(["remove", t])
        }, v = function(e, t) {
            var r, i, o, a, c, l, u, f, d;
            if (t.nodeType === Node.ELEMENT_NODE) {
                for (d = T.matches(t), c = 0, u = d.length; u > c; c++) r = d[c].data, e.push(["add", t, r]);
                if (o = n.get(t))
                    for (l = 0, f = o.length; f > l; l++) i = o[l], (a = s[i]) && (T.matchesSelector(t, a.selector) || e.push(["remove", t, a]))
            }
        }, m = function(e, t) {
            var n, r, i, o;
            if (t.nodeType === Node.ELEMENT_NODE)
                for (v(e, t), o = t.getElementsByTagName("*"), r = 0, i = o.length; i > r; r++) n = o[r], v(e, n)
        }, i = function(e) {
            var t, n, r, i, o, a;
            for (i = 0, o = e.length; o > i; i++) a = e[i], r = a[0], t = a[1], n = a[2], "add" === r ? (b(t, n), y(t, n)) : "remove" === r && w(t, n)
        }, E = function(e) {
            var t, n, r, i;
            for (i = e.elements, n = 0, r = i.length; r > n; n++) t = i[n], w(t, e);
            T.remove(e.selector, e), delete s[e.id], $.observe.count--
        }, $.observe = function(e, t) {
            var n;
            return null != t.call && (t = {
                initialize: t
            }), n = {
                id: _++,
                selector: e,
                initialize: t.initialize || t.init,
                add: t.add,
                remove: t.remove,
                elements: [],
                stop: function() {
                    return E(n)
                }
            }, T.add(e, n), s[n.id] = n, x(), $.observe.count++, n
        }, t = !1, x = function() {
            return t ? void 0 : (setImmediate(e), t = !0)
        }, e = function() {
            var e;
            return e = [], r(e, [document.documentElement]), i(e), t = !1
        }, $.observe.count = 0, $(document).on("observe:dirty", function(e) {
            var t;
            t = [], m(t, e.target), i(t)
        }), o = [], c = function() {
            var e, t, n, r, a, s, c, l, u;
            for (e = [], a = o, o = [], s = 0, l = a.length; l > s; s++)
                for (r = a[s], n = r.form ? r.form.elements : r.ownerDocument.getElementsByTagName("input"), c = 0, u = n.length; u > c; c++) t = n[c], v(e, t);
            i(e)
        }, l = function(e) {
            o.push(e.target), setImmediate(c)
        }, document.addEventListener("change", l, !1), $(document).on("change", l), u = function(e) {
            var t, n, o, a;
            for (t = [], o = 0, a = e.length; a > o; o++) n = e[o], "childList" === n.type ? (r(t, n.addedNodes), p(t, n.removedNodes)) : "attributes" === n.type && v(t, n.target);
            h && g(t), i(t)
        }, a = new MutationObserver(u), $(function() {
            var e;
            return a.observe(document, {
                childList: !0,
                attributes: !0,
                subtree: !0
            }), e = [], r(e, [document.documentElement]), i(e)
        }, !1)
    }.call(this),
    function() {
        var e, t, n, r, i, o, a, s, c;
        s = $.fn.clone, $.fn.clone = function() {
            var e, t, n, r, i;
            for (t = s.apply(this, arguments), i = t.find("[placeholder]"), n = 0, r = i.length; r > n; n++) e = i[n], e.value === e.getAttribute("placeholder") && (e.value = "");
            return t
        }, c = [], GitHub.support.placeholder_input || c.push("input[placeholder]"), GitHub.support.placeholder_textarea || c.push("textarea[placeholder]"), c = c.join(", "), c && (e = function() {
            try {
                return document.activeElement
            } catch (e) {}
        }, t = function(e) {
            return e.getAttribute("placeholder")
        }, a = function() {
            return this !== e() ? r.call(this) : void 0
        }, i = function() {
            return this.classList.contains("placeholder") ? (this.value === t(this) && (this.value = ""), this.classList.remove("placeholder")) : void 0
        }, r = function() {
            return this.value ? void 0 : (this.value = t(this), this.classList.add("placeholder"))
        }, o = function() {
            var e;
            return e = $(this), setTimeout(function() {
                return e.find(c).each(a)
            }, 10)
        }, n = function(e) {
            var t;
            return a.call(e), t = $(e.form), $(e).on("focus", i).on("blur", r), t.data("placeholder-handlers") ? void 0 : t.data("placeholder-handlers", !0).on("reset", o).on("submit", function() {
                t.find(c).each(i), o.call(this)
            })
        }, $.observe(c, function() {
            n(this)
        }), $(window).on("beforeunload", function() {
            $(c).each(i)
        }))
    }.call(this),
    function(e, t) {
        function n(e) {
            var t = [],
                n = e.target,
                r = e.handleObj.selectorSet;
            do {
                if (1 !== n.nodeType) break;
                var i = r.matches(n);
                i.length && t.push({
                    elem: n,
                    handlers: i
                })
            } while (n = n.parentElement);
            return t
        }

        function r(e) {
            for (var t, r = n(e), i = 0;
                (t = r[i++]) && !e.isPropagationStopped();) {
                e.currentTarget = t.elem;
                for (var o, a = 0;
                    (o = t.handlers[a++]) && !e.isImmediatePropagationStopped();) {
                    var s = o.data.apply(t.elem, arguments);
                    void 0 !== s && (e.result = s, s === !1 && (e.preventDefault(), e.stopPropagation()))
                }
            }
        }
        var i = e.document,
            o = e.SelectorSet,
            a = t.event.add,
            s = t.event.remove,
            c = {};
        if (!o) throw "SelectorSet undefined - https://github.com/josh/jquery-selector-set";
        t.event.add = function(e, n, s, l, u) {
            if (e !== i || n.match(/\./) || l || !u) a.call(this, e, n, s, l, u);
            else
                for (var f = n.match(/\S+/g), d = f.length; d--;) {
                    var h = f[d],
                        p = t.event.special[h] || {};
                    h = p.delegateType || h;
                    var m = c[h];
                    m || (m = c[h] = {
                        handler: r,
                        selectorSet: new o
                    }, m.selectorSet.matchesSelector = t.find.matchesSelector, a.call(this, e, h, m)), m.selectorSet.add(u, s), t.expr.cacheLength++, t.find.compile && t.find.compile(u)
                }
        }, t.event.remove = function(e, n, r, o, a) {
            if (e === i && n && !n.match(/\./) && o)
                for (var l = n.match(/\S+/g), u = l.length; u--;) {
                    var f = l[u],
                        d = t.event.special[f] || {};
                    f = d.delegateType || f;
                    var h = c[f];
                    h && h.selectorSet.remove(o, r)
                }
            s.call(this, e, n, r, o, a)
        }
    }(window, jQuery),
    function() {
        var e;
        $(document.documentElement).hasClass("is-preview-features") && (e = /id|data-(ga|hotkey|remote)/, SelectorSet.prototype.logDefaultIndexUsed = function(t) {
            return t.selector.match(e) ? void 0 : console.warn(t.selector, "could not be indexed")
        })
    }.call(this),
    function() {
        var e, t;
        $.fn.inspect = function() {
            var t;
            if (t = this[0]) return e(t)
        }, e = function(e) {
            var n;
            for (n = []; null != e && (n.push(t(e)), e !== document.body && !e.id);) e = e.parentNode;
            return n.reverse().join(" > ")
        }, t = function(e) {
            var t, n, r, i;
            return e === window ? "window" : (n = [e.nodeName.toLowerCase()], (null != (r = e.id) ? r.length : void 0) && n.push("#" + e.id), t = "function" == typeof e.getAttribute && null != (i = e.getAttribute("class")) ? i.trim().split(/\s+/).join(".") : void 0, (null != t ? t.length : void 0) && n.push("." + t), n.join(""))
        }
    }.call(this), // copyright chris wanstrath
    function(e) {
        function t(t, r, i) {
            var o = this;
            return this.on("click.pjax", t, function(t) {
                var a = e.extend({}, d(r, i));
                a.container || (a.container = e(this).attr("data-pjax") || o), n(t, a)
            })
        }

        function n(t, n, r) {
            r = d(n, r);
            var o = t.currentTarget;
            if ("A" !== o.tagName.toUpperCase()) throw "$.fn.pjax or $.pjax.click requires an anchor element";
            if (!(t.which > 1 || t.metaKey || t.ctrlKey || t.shiftKey || t.altKey || location.protocol !== o.protocol || location.hostname !== o.hostname || o.hash && o.href.replace(o.hash, "") === location.href.replace(location.hash, "") || o.href === location.href + "#" || t.isDefaultPrevented())) {
                var a = {
                        url: o.href,
                        container: e(o).attr("data-pjax"),
                        target: o
                    },
                    s = e.extend({}, a, r),
                    c = e.Event("pjax:click");
                e(o).trigger(c, [s]), c.isDefaultPrevented() || (i(s), t.preventDefault(), e(o).trigger("pjax:clicked", [s]))
            }
        }

        function r(t, n, r) {
            r = d(n, r);
            var o = t.currentTarget;
            if ("FORM" !== o.tagName.toUpperCase()) throw "$.pjax.submit requires a form element";
            var a = {
                type: o.method.toUpperCase(),
                url: o.action,
                data: e(o).serializeArray(),
                container: e(o).attr("data-pjax"),
                target: o
            };
            i(e.extend({}, a, r)), t.preventDefault()
        }

        function i(t) {
            function n(t, n, i) {
                i || (i = {}), i.relatedTarget = r;
                var o = e.Event(t, i);
                return s.trigger(o, n), !o.isDefaultPrevented()
            }
            t = e.extend(!0, {}, e.ajaxSettings, i.defaults, t), e.isFunction(t.url) && (t.url = t.url());
            var r = t.target,
                o = f(t.url).hash,
                s = t.context = h(t.container);
            t.data || (t.data = {}), t.data._pjax = s.selector;
            var c;
            t.beforeSend = function(e, r) {
                return "GET" !== r.type && (r.timeout = 0), e.setRequestHeader("X-PJAX", "true"), e.setRequestHeader("X-PJAX-Container", s.selector), n("pjax:beforeSend", [e, r]) ? (r.timeout > 0 && (c = setTimeout(function() {
                    n("pjax:timeout", [e, t]) && e.abort("timeout")
                }, r.timeout), r.timeout = 0), void(t.requestUrl = f(r.url).href)) : !1
            }, t.complete = function(e, r) {
                c && clearTimeout(c), n("pjax:complete", [e, r, t]), n("pjax:end", [e, t])
            }, t.error = function(e, r, i) {
                var o = v("", e, t),
                    s = n("pjax:error", [e, r, i, t]);
                "GET" == t.type && "abort" !== r && s && a(o.url)
            }, t.success = function(r, c, u) {
                var d = i.state,
                    h = "function" == typeof e.pjax.defaults.version ? e.pjax.defaults.version() : e.pjax.defaults.version,
                    p = u.getResponseHeader("X-PJAX-Version"),
                    m = v(r, u, t);
                if (h && p && h !== p) return void a(m.url);
                if (!m.contents) return void a(m.url);
                i.state = {
                    id: t.id || l(),
                    url: m.url,
                    title: m.title,
                    container: s.selector,
                    fragment: t.fragment,
                    timeout: t.timeout
                }, (t.push || t.replace) && window.history.replaceState(i.state, m.title, m.url);
                try {
                    document.activeElement.blur()
                } catch (y) {}
                m.title && (document.title = m.title), n("pjax:beforeReplace", [m.contents, t], {
                    state: i.state,
                    previousState: d
                }), s.html(m.contents);
                var b = s.find("input[autofocus], textarea[autofocus]").last()[0];
                if (b && document.activeElement !== b && b.focus(), g(m.scripts), "number" == typeof t.scrollTo && e(window).scrollTop(t.scrollTo), "" !== o) {
                    var w = f(m.url);
                    w.hash = o, i.state.url = w.href, window.history.replaceState(i.state, m.title, w.href);
                    var x = e(w.hash);
                    x.length && e(window).scrollTop(x.offset().top)
                }
                n("pjax:success", [r, c, u, t])
            }, i.state || (i.state = {
                id: l(),
                url: window.location.href,
                title: document.title,
                container: s.selector,
                fragment: t.fragment,
                timeout: t.timeout
            }, window.history.replaceState(i.state, document.title));
            var d = i.xhr;
            d && d.readyState < 4 && (d.onreadystatechange = e.noop, d.abort()), i.options = t;
            var d = i.xhr = e.ajax(t);
            return d.readyState > 0 && (t.push && !t.replace && (y(i.state.id, s.clone().contents()), window.history.pushState(null, "", u(t.requestUrl))), n("pjax:start", [d, t]), n("pjax:send", [d, t])), i.xhr
        }

        function o(t, n) {
            var r = {
                url: window.location.href,
                push: !1,
                replace: !0,
                scrollTo: !1
            };
            return i(e.extend(r, d(t, n)))
        }

        function a(e) {
            window.history.replaceState(null, "", "#"), window.location.replace(e)
        }

        function s(t) {
            var n = i.state,
                r = t.state;
            if (r && r.container) {
                if (E && _ == r.url) return;
                if (i.state && i.state.id === r.id) return;
                var o = e(r.container);
                if (o.length) {
                    var s, c = k[r.id];
                    i.state && (s = i.state.id < r.id ? "forward" : "back", b(s, i.state.id, o.clone().contents()));
                    var l = e.Event("pjax:popstate", {
                        state: r,
                        direction: s
                    });
                    o.trigger(l);
                    var u = {
                        id: r.id,
                        url: r.url,
                        container: o,
                        push: !1,
                        fragment: r.fragment,
                        timeout: r.timeout,
                        scrollTo: !1
                    };
                    if (c) {
                        o.trigger("pjax:start", [null, u]), i.state = r, r.title && (document.title = r.title);
                        var f = e.Event("pjax:beforeReplace", {
                            state: r,
                            previousState: n
                        });
                        o.trigger(f, [c, u]), o.html(c), o.trigger("pjax:end", [null, u])
                    } else i(u);
                    o[0].offsetHeight
                } else a(location.href)
            }
            E = !1
        }

        function c(t) {
            var n = e.isFunction(t.url) ? t.url() : t.url,
                r = t.type ? t.type.toUpperCase() : "GET",
                i = e("<form>", {
                    method: "GET" === r ? "GET" : "POST",
                    action: n,
                    style: "display:none"
                });
            "GET" !== r && "POST" !== r && i.append(e("<input>", {
                type: "hidden",
                name: "_method",
                value: r.toLowerCase()
            }));
            var o = t.data;
            if ("string" == typeof o) e.each(o.split("&"), function(t, n) {
                var r = n.split("=");
                i.append(e("<input>", {
                    type: "hidden",
                    name: r[0],
                    value: r[1]
                }))
            });
            else if ("object" == typeof o)
                for (key in o) i.append(e("<input>", {
                    type: "hidden",
                    name: key,
                    value: o[key]
                }));
            e(document.body).append(i), i.submit()
        }

        function l() {
            return (new Date).getTime()
        }

        function u(e) {
            return e.replace(/\?_pjax=[^&]+&?/, "?").replace(/_pjax=[^&]+&?/, "").replace(/[\?&]$/, "")
        }

        function f(e) {
            var t = document.createElement("a");
            return t.href = e, t
        }

        function d(t, n) {
            return t && n ? n.container = t : n = e.isPlainObject(t) ? t : {
                container: t
            }, n.container && (n.container = h(n.container)), n
        }

        function h(t) {
            if (t = e(t), t.length) {
                if ("" !== t.selector && t.context === document) return t;
                if (t.attr("id")) return e("#" + t.attr("id"));
                throw "cant get selector for pjax container!"
            }
            throw "no pjax container for " + t.selector
        }

        function p(e, t) {
            return e.filter(t).add(e.find(t))
        }

        function m(t) {
            return e.parseHTML(t, document, !0)
        }

        function v(t, n, r) {
            var i = {};
            if (i.url = u(n.getResponseHeader("X-PJAX-URL") || r.requestUrl), /<html/i.test(t)) var o = e(m(t.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0])),
                a = e(m(t.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0]));
            else var o = a = e(m(t));
            if (0 === a.length) return i;
            if (i.title = p(o, "title").last().text(), r.fragment) {
                if ("body" === r.fragment) var s = a;
                else var s = p(a, r.fragment).first();
                s.length && (i.contents = s.contents(), i.title || (i.title = s.attr("title") || s.data("title")))
            } else /<html/i.test(t) || (i.contents = a);
            return i.contents && (i.contents = i.contents.not(function() {
                return e(this).is("title")
            }), i.contents.find("title").remove(), i.scripts = p(i.contents, "script[src]").remove(), i.contents = i.contents.not(i.scripts)), i.title && (i.title = e.trim(i.title)), i
        }

        function g(t) {
            if (t) {
                var n = e("script[src]");
                t.each(function() {
                    var t = this.src,
                        r = n.filter(function() {
                            return this.src === t
                        });
                    if (!r.length) {
                        var i = document.createElement("script");
                        i.type = e(this).attr("type"), i.src = e(this).attr("src"), document.head.appendChild(i)
                    }
                })
            }
        }

        function y(e, t) {
            for (k[e] = t, N.push(e); S.length;) delete k[S.shift()];
            for (; N.length > i.defaults.maxCacheLength;) delete k[N.shift()]
        }

        function b(e, t, n) {
            var r, i;
            k[t] = n, "forward" === e ? (r = N, i = S) : (r = S, i = N), r.push(t), (t = i.pop()) && delete k[t]
        }

        function w() {
            return e("meta").filter(function() {
                var t = e(this).attr("http-equiv");
                return t && "X-PJAX-VERSION" === t.toUpperCase()
            }).attr("content")
        }

        function x() {
            e.fn.pjax = t, e.pjax = i, e.pjax.enable = e.noop, e.pjax.disable = T, e.pjax.click = n, e.pjax.submit = r, e.pjax.reload = o, e.pjax.defaults = {
                timeout: 650,
                push: !0,
                replace: !1,
                type: "GET",
                dataType: "html",
                scrollTo: 0,
                maxCacheLength: 20,
                version: w
            }, e(window).on("popstate.pjax", s)
        }

        function T() {
            e.fn.pjax = function() {
                return this
            }, e.pjax = c, e.pjax.enable = x, e.pjax.disable = e.noop, e.pjax.click = e.noop, e.pjax.submit = e.noop, e.pjax.reload = function() {
                window.location.reload()
            }, e(window).off("popstate.pjax", s)
        }
        var E = !0,
            _ = window.location.href,
            C = window.history.state;
        C && C.container && (i.state = C), "state" in window.history && (E = !1);
        var k = {},
            S = [],
            N = [];
        e.inArray("state", e.event.props) < 0 && e.event.props.push("state"), e.support.pjax = window.history && window.history.pushState && window.history.replaceState && !navigator.userAgent.match(/((iPod|iPhone|iPad).+\bOS\s+[1-4]|WebApps\/.+CFNetwork)/), e.support.pjax ? x() : T()
    }(jQuery),
    function() {
        ("undefined" == typeof Zepto || null === Zepto) && $.ajaxSetup({
            beforeSend: function(e, t) {
                var n, r;
                if (t.global) return n = t.context || document, r = $.Event("ajaxBeforeSend"), $(n).trigger(r, [e, t]), r.isDefaultPrevented() ? !1 : r.result
            }
        })
    }.call(this),
    function() {
        var e, t, n, r, i;
        "undefined" != typeof Zepto && null !== Zepto ? (e = function(e) {
            var t, n, r, i;
            n = document.createEvent("Events");
            for (r in e) i = e[r], n[r] = i;
            return n.initEvent("" + e.type + ":prepare", !0, !0), t = function(t, r) {
                return function() {
                    return t.apply(e), r.apply(n)
                }
            }, n.preventDefault = t(e.preventDefault, n.preventDefault), n.stopPropagation = t(e.stopPropagation, n.stopPropagation), n.stopImmediatePropagation = t(e.stopImmediatePropagation, n.stopImmediatePropagation), e.target.dispatchEvent(n), n.result
        }, window.addEventListener("click", e, !0), window.addEventListener("submit", e, !0)) : (t = null, n = function(e) {
            var n, r;
            r = "" + e.type + ":" + e.timeStamp, r !== t && (n = e.type, e.type = "" + n + ":prepare", $.event.trigger(e, [], e.target, !1), e.type = n, t = r)
        }, r = function(e) {
            return function() {
                $(this).on("" + e + ".prepare", function() {})
            }
        }, i = function(e) {
            return function() {
                $(this).off("" + e + ".prepare", function() {})
            }
        }, $.event.special.click = {
            preDispatch: n
        }, $.event.special.submit = {
            preDispatch: n
        }, $.event.special["click:prepare"] = {
            setup: r("click"),
            teardown: i("click")
        }, $.event.special["submit:prepare"] = {
            setup: r("submit"),
            teardown: i("submit")
        })
    }.call(this),
    function() {
        $(document).on("ajaxBeforeSend", function(e, t, n) {
            return n.dataType ? void 0 : t.setRequestHeader("Accept", "*/*;q=0.5, " + n.accepts.script)
        })
    }.call(this),
    function() {
        $(document).on("click:prepare", "a[data-confirm], button[data-confirm]", function(e) {
            var t;
            (t = $(this).attr("data-confirm")) && (confirm(t) || (e.stopImmediatePropagation(), e.preventDefault()))
        })
    }.call(this),
    function() {
        var e;
        $(document).on("ajaxBeforeSend", function(e, t, n) {
            var r;
            if (!n.crossDomain && "GET" !== n.type) return (r = $('meta[name="csrf-token"]').attr("content")) ? t.setRequestHeader("X-CSRF-Token", r) : void 0
        }), $(document).on("submit:prepare", "form", function() {
            var t, n, r, i;
            t = $(this), t.is("form[data-remote]") || this.method && "GET" !== this.method.toUpperCase() && e(t.attr("action")) && (r = $('meta[name="csrf-param"]').attr("content"), i = $('meta[name="csrf-token"]').attr("content"), null != r && null != i && (t.find("input[name=" + r + "]")[0] || (n = document.createElement("input"), n.setAttribute("type", "hidden"), n.setAttribute("name", r), n.setAttribute("value", i), t.prepend(n))))
        }), e = function(e) {
            var t, n;
            return t = document.createElement("a"), t.href = e, n = t.href.split("/", 3).join("/"), 0 === location.href.indexOf(n)
        }
    }.call(this),
    function() {
        $(document).on("submit:prepare", "form", function() {
            var e, t, n, r, i, o, a, s, c;
            for (s = $(this).find("input[type=submit][data-disable-with]"), r = 0, o = s.length; o > r; r++) t = s[r], t = $(t), t.attr("data-enable-with", t.val() || "Submit"), (n = t.attr("data-disable-with")) && t.val(n), t[0].disabled = !0;
            for (c = $(this).find("button[type=submit][data-disable-with]"), i = 0, a = c.length; a > i; i++) e = c[i], e = $(e), e.attr("data-enable-with", e.html() || ""), (n = e.attr("data-disable-with")) && e.html(n), e[0].disabled = !0
        }), $(document).on("ajaxComplete", "form", function() {
            var e, t, n, r, i, o, a, s;
            for (a = $(this).find("input[type=submit][data-enable-with]"), n = 0, i = a.length; i > n; n++) t = a[n], $(t).val($(t).attr("data-enable-with")), t.disabled = !1;
            for (s = $(this).find("button[type=submit][data-enable-with]"), r = 0, o = s.length; o > r; r++) e = s[r], $(e).html($(e).attr("data-enable-with")), e.disabled = !1
        })
    }.call(this),
    function() {
        $(document).on("click", "a[data-method]", function(e) {
            var t, n, r, i;
            return t = $(this), t.is("a[data-remote]") || (i = t.attr("data-method").toLowerCase(), "get" === i) ? void 0 : (n = document.createElement("form"), n.method = "POST", n.action = t.attr("href"), n.style.display = "none", "post" !== i && (r = document.createElement("input"), r.setAttribute("type", "hidden"), r.setAttribute("name", "_method"), r.setAttribute("value", i), n.appendChild(r)), document.body.appendChild(n), $(n).submit(), e.preventDefault(), !1)
        })
    }.call(this),
    function() {
        $(document).on("click", "a[data-remote]", function(e) {
            var t, n, r, i, o;
            return n = $(this), r = {}, r.context = this, (i = n.attr("data-method")) && (r.type = i), (o = this.href) && (r.url = o), (t = n.attr("data-type")) && (r.dataType = t), $.ajax(r), e.preventDefault(), !1
        }), $(document).on("submit", "form[data-remote]", function(e) {
            var t, n, r, i, o, a;
            return r = $(this), i = {}, i.context = this, (o = r.attr("method")) && (i.type = o), (a = this.action) && (i.url = a), (t = r.serializeArray()) && (i.data = t), (n = r.attr("data-type")) && (i.dataType = n), $.ajax(i), e.preventDefault(), !1
        }), $(document).on("ajaxSend", "[data-remote]", function(e, t) {
            $(this).data("remote-xhr", t)
        }), $(document).on("ajaxComplete", "[data-remote]", function() {
            var e;
            "function" == typeof(e = $(this)).removeData && e.removeData("remote-xhr")
        })
    }.call(this),
    function() {
        var e;
        e = "form[data-remote] input[type=submit],\nform[data-remote] button[type=submit],\nform[data-remote] button:not([type]),\nform[data-remote-submit] input[type=submit],\nform[data-remote-submit] button[type=submit],\nform[data-remote-submit] button:not([type])", $(document).on("click", e, function() {
            var e, t, n, r, i, o;
            i = $(this), t = i.closest("form"), n = t.find(".js-submit-button-value"), (r = i.attr("name")) ? (e = i.is("input[type=submit]") ? "Submit" : "", o = i.val() || e, n[0] ? (n.attr("name", r), n.attr("value", o)) : (n = document.createElement("input"), n.setAttribute("type", "hidden"), n.setAttribute("name", r), n.setAttribute("value", o), n.setAttribute("class", "js-submit-button-value"), t.prepend(n))) : n.remove()
        })
    }.call(this),
    /*!
     * Pulled from https://js.braintreegateway.com/v2/braintree.js on 15 July, 2014
     *
     * We have a small number of minor customization to this file for image asset
     * hosting.
     *
     * Braintree End-to-End Encryption Library
     * https://www.braintreepayments.com
     * Copyright (c) 2009-2014 Braintree, a division of PayPal, Inc.
     *
     * JSBN
     * Copyright (c) 2005  Tom Wu
     *
     * Both Licensed under the MIT License.
     * http://opensource.org/licenses/MIT
     *
     * ASN.1 JavaScript decoder
     * Copyright (c) 2008-2009 Lapo Luchini <lapo@lapo.it>
     * Licensed under the ISC License.
     * http://opensource.org/licenses/ISC
     */
    ! function() {
        function e(t, n) {
            t instanceof e ? (this.enc = t.enc, this.pos = t.pos) : (this.enc = t, this.pos = n)
        }

        function t(e, t, n, r, i) {
            this.stream = e, this.header = t, this.length = n, this.tag = r, this.sub = i
        }

        function n(e) {
            var t, n, r = "";
            for (t = 0; t + 3 <= e.length; t += 3) n = parseInt(e.substring(t, t + 3), 16), r += tt.charAt(n >> 6) + tt.charAt(63 & n);
            for (t + 1 == e.length ? (n = parseInt(e.substring(t, t + 1), 16), r += tt.charAt(n << 2)) : t + 2 == e.length && (n = parseInt(e.substring(t, t + 2), 16), r += tt.charAt(n >> 2) + tt.charAt((3 & n) << 4));
                (3 & r.length) > 0;) r += nt;
            return r
        }

        function r(e) {
            var t, n, r, i = "",
                o = 0;
            for (t = 0; t < e.length && e.charAt(t) != nt; ++t) r = tt.indexOf(e.charAt(t)), 0 > r || (0 == o ? (i += u(r >> 2), n = 3 & r, o = 1) : 1 == o ? (i += u(n << 2 | r >> 4), n = 15 & r, o = 2) : 2 == o ? (i += u(n), i += u(r >> 2), n = 3 & r, o = 3) : (i += u(n << 2 | r >> 4), i += u(15 & r), o = 0));
            return 1 == o && (i += u(n << 2)), i
        }

        function i(e) {
            var t, n = r(e),
                i = new Array;
            for (t = 0; 2 * t < n.length; ++t) i[t] = parseInt(n.substring(2 * t, 2 * t + 2), 16);
            return i
        }

        function o(e, t, n) {
            null != e && ("number" == typeof e ? this.fromNumber(e, t, n) : null == t && "string" != typeof e ? this.fromString(e, 256) : this.fromString(e, t))
        }

        function a() {
            return new o(null)
        }

        function s(e, t, n, r, i, o) {
            for (; --o >= 0;) {
                var a = t * this[e++] + n[r] + i;
                i = Math.floor(a / 67108864), n[r++] = 67108863 & a
            }
            return i
        }

        function c(e, t, n, r, i, o) {
            for (var a = 32767 & t, s = t >> 15; --o >= 0;) {
                var c = 32767 & this[e],
                    l = this[e++] >> 15,
                    u = s * c + l * a;
                c = a * c + ((32767 & u) << 15) + n[r] + (1073741823 & i), i = (c >>> 30) + (u >>> 15) + s * l + (i >>> 30), n[r++] = 1073741823 & c
            }
            return i
        }

        function l(e, t, n, r, i, o) {
            for (var a = 16383 & t, s = t >> 14; --o >= 0;) {
                var c = 16383 & this[e],
                    l = this[e++] >> 14,
                    u = s * c + l * a;
                c = a * c + ((16383 & u) << 14) + n[r] + i, i = (c >> 28) + (u >> 14) + s * l, n[r++] = 268435455 & c
            }
            return i
        }

        function u(e) {
            return ct.charAt(e)
        }

        function f(e, t) {
            var n = lt[e.charCodeAt(t)];
            return null == n ? -1 : n
        }

        function d(e) {
            for (var t = this.t - 1; t >= 0; --t) e[t] = this[t];
            e.t = this.t, e.s = this.s
        }

        function h(e) {
            this.t = 1, this.s = 0 > e ? -1 : 0, e > 0 ? this[0] = e : -1 > e ? this[0] = e + this.DV : this.t = 0
        }

        function p(e) {
            var t = a();
            return t.fromInt(e), t
        }

        function m(e, t) {
            var n;
            if (16 == t) n = 4;
            else if (8 == t) n = 3;
            else if (256 == t) n = 8;
            else if (2 == t) n = 1;
            else if (32 == t) n = 5;
            else {
                if (4 != t) return void this.fromRadix(e, t);
                n = 2
            }
            this.t = 0, this.s = 0;
            for (var r = e.length, i = !1, a = 0; --r >= 0;) {
                var s = 8 == n ? 255 & e[r] : f(e, r);
                0 > s ? "-" == e.charAt(r) && (i = !0) : (i = !1, 0 == a ? this[this.t++] = s : a + n > this.DB ? (this[this.t - 1] |= (s & (1 << this.DB - a) - 1) << a, this[this.t++] = s >> this.DB - a) : this[this.t - 1] |= s << a, a += n, a >= this.DB && (a -= this.DB))
            }
            8 == n && 0 != (128 & e[0]) && (this.s = -1, a > 0 && (this[this.t - 1] |= (1 << this.DB - a) - 1 << a)), this.clamp(), i && o.ZERO.subTo(this, this)
        }

        function v() {
            for (var e = this.s & this.DM; this.t > 0 && this[this.t - 1] == e;) --this.t
        }

        function g(e) {
            if (this.s < 0) return "-" + this.negate().toString(e);
            var t;
            if (16 == e) t = 4;
            else if (8 == e) t = 3;
            else if (2 == e) t = 1;
            else if (32 == e) t = 5;
            else {
                if (4 != e) return this.toRadix(e);
                t = 2
            }
            var n, r = (1 << t) - 1,
                i = !1,
                o = "",
                a = this.t,
                s = this.DB - a * this.DB % t;
            if (a-- > 0)
                for (s < this.DB && (n = this[a] >> s) > 0 && (i = !0, o = u(n)); a >= 0;) t > s ? (n = (this[a] & (1 << s) - 1) << t - s, n |= this[--a] >> (s += this.DB - t)) : (n = this[a] >> (s -= t) & r, 0 >= s && (s += this.DB, --a)), n > 0 && (i = !0), i && (o += u(n));
            return i ? o : "0"
        }

        function y() {
            var e = a();
            return o.ZERO.subTo(this, e), e
        }

        function b() {
            return this.s < 0 ? this.negate() : this
        }

        function w(e) {
            var t = this.s - e.s;
            if (0 != t) return t;
            var n = this.t;
            if (t = n - e.t, 0 != t) return this.s < 0 ? -t : t;
            for (; --n >= 0;)
                if (0 != (t = this[n] - e[n])) return t;
            return 0
        }

        function x(e) {
            var t, n = 1;
            return 0 != (t = e >>> 16) && (e = t, n += 16), 0 != (t = e >> 8) && (e = t, n += 8), 0 != (t = e >> 4) && (e = t, n += 4), 0 != (t = e >> 2) && (e = t, n += 2), 0 != (t = e >> 1) && (e = t, n += 1), n
        }

        function T() {
            return this.t <= 0 ? 0 : this.DB * (this.t - 1) + x(this[this.t - 1] ^ this.s & this.DM)
        }

        function E(e, t) {
            var n;
            for (n = this.t - 1; n >= 0; --n) t[n + e] = this[n];
            for (n = e - 1; n >= 0; --n) t[n] = 0;
            t.t = this.t + e, t.s = this.s
        }

        function _(e, t) {
            for (var n = e; n < this.t; ++n) t[n - e] = this[n];
            t.t = Math.max(this.t - e, 0), t.s = this.s
        }

        function C(e, t) {
            var n, r = e % this.DB,
                i = this.DB - r,
                o = (1 << i) - 1,
                a = Math.floor(e / this.DB),
                s = this.s << r & this.DM;
            for (n = this.t - 1; n >= 0; --n) t[n + a + 1] = this[n] >> i | s, s = (this[n] & o) << r;
            for (n = a - 1; n >= 0; --n) t[n] = 0;
            t[a] = s, t.t = this.t + a + 1, t.s = this.s, t.clamp()
        }

        function k(e, t) {
            t.s = this.s;
            var n = Math.floor(e / this.DB);
            if (n >= this.t) return void(t.t = 0);
            var r = e % this.DB,
                i = this.DB - r,
                o = (1 << r) - 1;
            t[0] = this[n] >> r;
            for (var a = n + 1; a < this.t; ++a) t[a - n - 1] |= (this[a] & o) << i, t[a - n] = this[a] >> r;
            r > 0 && (t[this.t - n - 1] |= (this.s & o) << i), t.t = this.t - n, t.clamp()
        }

        function S(e, t) {
            for (var n = 0, r = 0, i = Math.min(e.t, this.t); i > n;) r += this[n] - e[n], t[n++] = r & this.DM, r >>= this.DB;
            if (e.t < this.t) {
                for (r -= e.s; n < this.t;) r += this[n], t[n++] = r & this.DM, r >>= this.DB;
                r += this.s
            } else {
                for (r += this.s; n < e.t;) r -= e[n], t[n++] = r & this.DM, r >>= this.DB;
                r -= e.s
            }
            t.s = 0 > r ? -1 : 0, -1 > r ? t[n++] = this.DV + r : r > 0 && (t[n++] = r), t.t = n, t.clamp()
        }

        function N(e, t) {
            var n = this.abs(),
                r = e.abs(),
                i = n.t;
            for (t.t = i + r.t; --i >= 0;) t[i] = 0;
            for (i = 0; i < r.t; ++i) t[i + n.t] = n.am(0, r[i], t, i, 0, n.t);
            t.s = 0, t.clamp(), this.s != e.s && o.ZERO.subTo(t, t)
        }

        function A(e) {
            for (var t = this.abs(), n = e.t = 2 * t.t; --n >= 0;) e[n] = 0;
            for (n = 0; n < t.t - 1; ++n) {
                var r = t.am(n, t[n], e, 2 * n, 0, 1);
                (e[n + t.t] += t.am(n + 1, 2 * t[n], e, 2 * n + 1, r, t.t - n - 1)) >= t.DV && (e[n + t.t] -= t.DV, e[n + t.t + 1] = 1)
            }
            e.t > 0 && (e[e.t - 1] += t.am(n, t[n], e, 2 * n, 0, 1)), e.s = 0, e.clamp()
        }

        function D(e, t, n) {
            var r = e.abs();
            if (!(r.t <= 0)) {
                var i = this.abs();
                if (i.t < r.t) return null != t && t.fromInt(0), void(null != n && this.copyTo(n));
                null == n && (n = a());
                var s = a(),
                    c = this.s,
                    l = e.s,
                    u = this.DB - x(r[r.t - 1]);
                u > 0 ? (r.lShiftTo(u, s), i.lShiftTo(u, n)) : (r.copyTo(s), i.copyTo(n));
                var f = s.t,
                    d = s[f - 1];
                if (0 != d) {
                    var h = d * (1 << this.F1) + (f > 1 ? s[f - 2] >> this.F2 : 0),
                        p = this.FV / h,
                        m = (1 << this.F1) / h,
                        v = 1 << this.F2,
                        g = n.t,
                        y = g - f,
                        b = null == t ? a() : t;
                    for (s.dlShiftTo(y, b), n.compareTo(b) >= 0 && (n[n.t++] = 1, n.subTo(b, n)), o.ONE.dlShiftTo(f, b), b.subTo(s, s); s.t < f;) s[s.t++] = 0;
                    for (; --y >= 0;) {
                        var w = n[--g] == d ? this.DM : Math.floor(n[g] * p + (n[g - 1] + v) * m);
                        if ((n[g] += s.am(0, w, n, y, 0, f)) < w)
                            for (s.dlShiftTo(y, b), n.subTo(b, n); n[g] < --w;) n.subTo(b, n)
                    }
                    null != t && (n.drShiftTo(f, t), c != l && o.ZERO.subTo(t, t)), n.t = f, n.clamp(), u > 0 && n.rShiftTo(u, n), 0 > c && o.ZERO.subTo(n, n)
                }
            }
        }

        function j(e) {
            var t = a();
            return this.abs().divRemTo(e, null, t), this.s < 0 && t.compareTo(o.ZERO) > 0 && e.subTo(t, t), t
        }

        function P(e) {
            this.m = e
        }

        function $(e) {
            return e.s < 0 || e.compareTo(this.m) >= 0 ? e.mod(this.m) : e
        }

        function L(e) {
            return e
        }

        function O(e) {
            e.divRemTo(this.m, null, e)
        }

        function M(e, t, n) {
            e.multiplyTo(t, n), this.reduce(n)
        }

        function I(e, t) {
            e.squareTo(t), this.reduce(t)
        }

        function F() {
            if (this.t < 1) return 0;
            var e = this[0];
            if (0 == (1 & e)) return 0;
            var t = 3 & e;
            return t = t * (2 - (15 & e) * t) & 15, t = t * (2 - (255 & e) * t) & 255, t = t * (2 - ((65535 & e) * t & 65535)) & 65535, t = t * (2 - e * t % this.DV) % this.DV, t > 0 ? this.DV - t : -t
        }

        function R(e) {
            this.m = e, this.mp = e.invDigit(), this.mpl = 32767 & this.mp, this.mph = this.mp >> 15, this.um = (1 << e.DB - 15) - 1, this.mt2 = 2 * e.t
        }

        function U(e) {
            var t = a();
            return e.abs().dlShiftTo(this.m.t, t), t.divRemTo(this.m, null, t), e.s < 0 && t.compareTo(o.ZERO) > 0 && this.m.subTo(t, t), t
        }

        function H(e) {
            var t = a();
            return e.copyTo(t), this.reduce(t), t
        }

        function z(e) {
            for (; e.t <= this.mt2;) e[e.t++] = 0;
            for (var t = 0; t < this.m.t; ++t) {
                var n = 32767 & e[t],
                    r = n * this.mpl + ((n * this.mph + (e[t] >> 15) * this.mpl & this.um) << 15) & e.DM;
                for (n = t + this.m.t, e[n] += this.m.am(0, r, e, t, 0, this.m.t); e[n] >= e.DV;) e[n] -= e.DV, e[++n] ++
            }
            e.clamp(), e.drShiftTo(this.m.t, e), e.compareTo(this.m) >= 0 && e.subTo(this.m, e)
        }

        function q(e, t) {
            e.squareTo(t), this.reduce(t)
        }

        function B(e, t, n) {
            e.multiplyTo(t, n), this.reduce(n)
        }

        function W() {
            return 0 == (this.t > 0 ? 1 & this[0] : this.s)
        }

        function V(e, t) {
            if (e > 4294967295 || 1 > e) return o.ONE;
            var n = a(),
                r = a(),
                i = t.convert(this),
                s = x(e) - 1;
            for (i.copyTo(n); --s >= 0;)
                if (t.sqrTo(n, r), (e & 1 << s) > 0) t.mulTo(r, i, n);
                else {
                    var c = n;
                    n = r, r = c
                }
            return t.revert(n)
        }

        function X(e, t) {
            var n;
            return n = 256 > e || t.isEven() ? new P(t) : new R(t), this.exp(e, n)
        }

        function Y(e, t) {
            return new o(e, t)
        }

        function G(e, t) {
            if (t < e.length + 11) throw new Error("Message too long for RSA");
            for (var n = new Array, r = e.length - 1; r >= 0 && t > 0;) {
                var i = e.charCodeAt(r--);
                128 > i ? n[--t] = i : i > 127 && 2048 > i ? (n[--t] = 63 & i | 128, n[--t] = i >> 6 | 192) : (n[--t] = 63 & i | 128, n[--t] = i >> 6 & 63 | 128, n[--t] = i >> 12 | 224)
            }
            n[--t] = 0;
            for (var a = 0, s = 0, c = 0; t > 2;) 0 == c && (s = ut.random.randomWords(1, 0)[0]), a = s >> c & 255, c = (c + 8) % 32, 0 != a && (n[--t] = a);
            return n[--t] = 2, n[--t] = 0, new o(n)
        }

        function K() {
            this.n = null, this.e = 0, this.d = null, this.p = null, this.q = null, this.dmp1 = null, this.dmq1 = null, this.coeff = null
        }

        function J(e, t) {
            if (!(null != e && null != t && e.length > 0 && t.length > 0)) throw new Error("Invalid RSA public key");
            this.n = Y(e, 16), this.e = parseInt(t, 16)
        }

        function Q(e) {
            return e.modPowInt(this.e, this.n)
        }

        function Z(e) {
            var t = G(e, this.n.bitLength() + 7 >> 3);
            if (null == t) return null;
            var n = this.doPublic(t);
            if (null == n) return null;
            var r = n.toString(16);
            return 0 == (1 & r.length) ? r : "0" + r
        }
        e.prototype.get = function(e) {
            if (void 0 == e && (e = this.pos++), e >= this.enc.length) throw "Requesting byte offset " + e + " on a stream of length " + this.enc.length;
            return this.enc[e]
        }, e.prototype.hexDigits = "0123456789ABCDEF", e.prototype.hexByte = function(e) {
            return this.hexDigits.charAt(e >> 4 & 15) + this.hexDigits.charAt(15 & e)
        }, e.prototype.hexDump = function(e, t) {
            for (var n = "", r = e; t > r; ++r) switch (n += this.hexByte(this.get(r)), 15 & r) {
                case 7:
                    n += "  ";
                    break;
                case 15:
                    n += "\n";
                    break;
                default:
                    n += " "
            }
            return n
        }, e.prototype.parseStringISO = function(e, t) {
            for (var n = "", r = e; t > r; ++r) n += String.fromCharCode(this.get(r));
            return n
        }, e.prototype.parseStringUTF = function(e, t) {
            for (var n = "", r = 0, i = e; t > i;) {
                var r = this.get(i++);
                n += String.fromCharCode(128 > r ? r : r > 191 && 224 > r ? (31 & r) << 6 | 63 & this.get(i++) : (15 & r) << 12 | (63 & this.get(i++)) << 6 | 63 & this.get(i++))
            }
            return n
        }, e.prototype.reTime = /^((?:1[89]|2\d)?\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/, e.prototype.parseTime = function(e, t) {
            var n = this.parseStringISO(e, t),
                r = this.reTime.exec(n);
            return r ? (n = r[1] + "-" + r[2] + "-" + r[3] + " " + r[4], r[5] && (n += ":" + r[5], r[6] && (n += ":" + r[6], r[7] && (n += "." + r[7]))), r[8] && (n += " UTC", "Z" != r[8] && (n += r[8], r[9] && (n += ":" + r[9]))), n) : "Unrecognized time: " + n
        }, e.prototype.parseInteger = function(e, t) {
            var n = t - e;
            if (n > 4) {
                n <<= 3;
                var r = this.get(e);
                if (0 == r) n -= 8;
                else
                    for (; 128 > r;) r <<= 1, --n;
                return "(" + n + " bit)"
            }
            for (var i = 0, o = e; t > o; ++o) i = i << 8 | this.get(o);
            return i
        }, e.prototype.parseBitString = function(e, t) {
            var n = this.get(e),
                r = (t - e - 1 << 3) - n,
                i = "(" + r + " bit)";
            if (20 >= r) {
                var o = n;
                i += " ";
                for (var a = t - 1; a > e; --a) {
                    for (var s = this.get(a), c = o; 8 > c; ++c) i += s >> c & 1 ? "1" : "0";
                    o = 0
                }
            }
            return i
        }, e.prototype.parseOctetString = function(e, t) {
            var n = t - e,
                r = "(" + n + " byte) ";
            n > 20 && (t = e + 20);
            for (var i = e; t > i; ++i) r += this.hexByte(this.get(i));
            return n > 20 && (r += String.fromCharCode(8230)), r
        }, e.prototype.parseOID = function(e, t) {
            for (var n, r = 0, i = 0, o = e; t > o; ++o) {
                var a = this.get(o);
                r = r << 7 | 127 & a, i += 7, 128 & a || (void 0 == n ? n = parseInt(r / 40) + "." + r % 40 : n += "." + (i >= 31 ? "bigint" : r), r = i = 0), n += String.fromCharCode()
            }
            return n
        }, t.prototype.typeName = function() {
            if (void 0 == this.tag) return "unknown";
            var e = this.tag >> 6,
                t = (this.tag >> 5 & 1, 31 & this.tag);
            switch (e) {
                case 0:
                    switch (t) {
                        case 0:
                            return "EOC";
                        case 1:
                            return "BOOLEAN";
                        case 2:
                            return "INTEGER";
                        case 3:
                            return "BIT_STRING";
                        case 4:
                            return "OCTET_STRING";
                        case 5:
                            return "NULL";
                        case 6:
                            return "OBJECT_IDENTIFIER";
                        case 7:
                            return "ObjectDescriptor";
                        case 8:
                            return "EXTERNAL";
                        case 9:
                            return "REAL";
                        case 10:
                            return "ENUMERATED";
                        case 11:
                            return "EMBEDDED_PDV";
                        case 12:
                            return "UTF8String";
                        case 16:
                            return "SEQUENCE";
                        case 17:
                            return "SET";
                        case 18:
                            return "NumericString";
                        case 19:
                            return "PrintableString";
                        case 20:
                            return "TeletexString";
                        case 21:
                            return "VideotexString";
                        case 22:
                            return "IA5String";
                        case 23:
                            return "UTCTime";
                        case 24:
                            return "GeneralizedTime";
                        case 25:
                            return "GraphicString";
                        case 26:
                            return "VisibleString";
                        case 27:
                            return "GeneralString";
                        case 28:
                            return "UniversalString";
                        case 30:
                            return "BMPString";
                        default:
                            return "Universal_" + t.toString(16)
                    }
                case 1:
                    return "Application_" + t.toString(16);
                case 2:
                    return "[" + t + "]";
                case 3:
                    return "Private_" + t.toString(16)
            }
        }, t.prototype.content = function() {
            if (void 0 == this.tag) return null;
            var e = this.tag >> 6;
            if (0 != e) return null == this.sub ? null : "(" + this.sub.length + ")";
            var t = 31 & this.tag,
                n = this.posContent(),
                r = Math.abs(this.length);
            switch (t) {
                case 1:
                    return 0 == this.stream.get(n) ? "false" : "true";
                case 2:
                    return this.stream.parseInteger(n, n + r);
                case 3:
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseBitString(n, n + r);
                case 4:
                    return this.sub ? "(" + this.sub.length + " elem)" : this.stream.parseOctetString(n, n + r);
                case 6:
                    return this.stream.parseOID(n, n + r);
                case 16:
                case 17:
                    return "(" + this.sub.length + " elem)";
                case 12:
                    return this.stream.parseStringUTF(n, n + r);
                case 18:
                case 19:
                case 20:
                case 21:
                case 22:
                case 26:
                    return this.stream.parseStringISO(n, n + r);
                case 23:
                case 24:
                    return this.stream.parseTime(n, n + r)
            }
            return null
        }, t.prototype.toString = function() {
            return this.typeName() + "@" + this.stream.pos + "[header:" + this.header + ",length:" + this.length + ",sub:" + (null == this.sub ? "null" : this.sub.length) + "]"
        }, t.prototype.print = function(e) {
            if (void 0 == e && (e = ""), document.writeln(e + this), null != this.sub) {
                e += "  ";
                for (var t = 0, n = this.sub.length; n > t; ++t) this.sub[t].print(e)
            }
        }, t.prototype.toPrettyString = function(e) {
            void 0 == e && (e = "");
            var t = e + this.typeName() + " @" + this.stream.pos;
            if (this.length >= 0 && (t += "+"), t += this.length, 32 & this.tag ? t += " (constructed)" : 3 != this.tag && 4 != this.tag || null == this.sub || (t += " (encapsulates)"), t += "\n", null != this.sub) {
                e += "  ";
                for (var n = 0, r = this.sub.length; r > n; ++n) t += this.sub[n].toPrettyString(e)
            }
            return t
        }, t.prototype.posStart = function() {
            return this.stream.pos
        }, t.prototype.posContent = function() {
            return this.stream.pos + this.header
        }, t.prototype.posEnd = function() {
            return this.stream.pos + this.header + Math.abs(this.length)
        }, t.decodeLength = function(e) {
            var t = e.get(),
                n = 127 & t;
            if (n == t) return n;
            if (n > 3) throw "Length over 24 bits not supported at position " + (e.pos - 1);
            if (0 == n) return -1;
            t = 0;
            for (var r = 0; n > r; ++r) t = t << 8 | e.get();
            return t
        }, t.hasContent = function(n, r, i) {
            if (32 & n) return !0;
            if (3 > n || n > 4) return !1;
            var o = new e(i);
            3 == n && o.get();
            var a = o.get();
            if (a >> 6 & 1) return !1;
            try {
                var s = t.decodeLength(o);
                return o.pos - i.pos + s == r
            } catch (c) {
                return !1
            }
        }, t.decode = function(n) {
            n instanceof e || (n = new e(n, 0));
            var r = new e(n),
                i = n.get(),
                o = t.decodeLength(n),
                a = n.pos - r.pos,
                s = null;
            if (t.hasContent(i, o, n)) {
                var c = n.pos;
                if (3 == i && n.get(), s = [], o >= 0) {
                    for (var l = c + o; n.pos < l;) s[s.length] = t.decode(n);
                    if (n.pos != l) throw "Content size is not correct for container starting at offset " + c
                } else try {
                    for (;;) {
                        var u = t.decode(n);
                        if (0 == u.tag) break;
                        s[s.length] = u
                    }
                    o = c - n.pos
                } catch (f) {
                    throw "Exception while decoding undefined length content: " + f
                }
            } else n.pos += o;
            return new t(r, a, o, i, s)
        };
        var et, tt = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            nt = "=",
            rt = 0xdeadbeefcafe,
            it = 15715070 == (16777215 & rt);
        it && "Microsoft Internet Explorer" == navigator.appName ? (o.prototype.am = c, et = 30) : it && "Netscape" != navigator.appName ? (o.prototype.am = s, et = 26) : (o.prototype.am = l, et = 28), o.prototype.DB = et, o.prototype.DM = (1 << et) - 1, o.prototype.DV = 1 << et;
        var ot = 52;
        o.prototype.FV = Math.pow(2, ot), o.prototype.F1 = ot - et, o.prototype.F2 = 2 * et - ot;
        var at, st, ct = "0123456789abcdefghijklmnopqrstuvwxyz",
            lt = new Array;
        for (at = "0".charCodeAt(0), st = 0; 9 >= st; ++st) lt[at++] = st;
        for (at = "a".charCodeAt(0), st = 10; 36 > st; ++st) lt[at++] = st;
        for (at = "A".charCodeAt(0), st = 10; 36 > st; ++st) lt[at++] = st;
        P.prototype.convert = $, P.prototype.revert = L, P.prototype.reduce = O, P.prototype.mulTo = M, P.prototype.sqrTo = I, R.prototype.convert = U, R.prototype.revert = H, R.prototype.reduce = z, R.prototype.mulTo = B, R.prototype.sqrTo = q, o.prototype.copyTo = d, o.prototype.fromInt = h, o.prototype.fromString = m, o.prototype.clamp = v, o.prototype.dlShiftTo = E, o.prototype.drShiftTo = _, o.prototype.lShiftTo = C, o.prototype.rShiftTo = k, o.prototype.subTo = S, o.prototype.multiplyTo = N, o.prototype.squareTo = A, o.prototype.divRemTo = D, o.prototype.invDigit = F, o.prototype.isEven = W, o.prototype.exp = V, o.prototype.toString = g, o.prototype.negate = y, o.prototype.abs = b, o.prototype.compareTo = w, o.prototype.bitLength = T, o.prototype.mod = j, o.prototype.modPowInt = X, o.ZERO = p(0), o.ONE = p(1), K.prototype.doPublic = Q, K.prototype.setPublic = J, K.prototype.encrypt = Z;
        var ut = {
            cipher: {},
            hash: {},
            keyexchange: {},
            mode: {},
            misc: {},
            codec: {},
            exception: {
                corrupt: function(e) {
                    this.toString = function() {
                        return "CORRUPT: " + this.message
                    }, this.message = e
                },
                invalid: function(e) {
                    this.toString = function() {
                        return "INVALID: " + this.message
                    }, this.message = e
                },
                bug: function(e) {
                    this.toString = function() {
                        return "BUG: " + this.message
                    }, this.message = e
                },
                notReady: function(e) {
                    this.toString = function() {
                        return "NOT READY: " + this.message
                    }, this.message = e
                }
            }
        };
        "undefined" != typeof module && module.exports && (module.exports = ut), ut.cipher.aes = function(e) {
                this._tables[0][0][0] || this._precompute();
                var t, n, r, i, o, a = this._tables[0][4],
                    s = this._tables[1],
                    c = e.length,
                    l = 1;
                if (4 !== c && 6 !== c && 8 !== c) throw new ut.exception.invalid("invalid aes key size");
                for (this._key = [i = e.slice(0), o = []], t = c; 4 * c + 28 > t; t++) r = i[t - 1], (t % c === 0 || 8 === c && t % c === 4) && (r = a[r >>> 24] << 24 ^ a[r >> 16 & 255] << 16 ^ a[r >> 8 & 255] << 8 ^ a[255 & r], t % c === 0 && (r = r << 8 ^ r >>> 24 ^ l << 24, l = l << 1 ^ 283 * (l >> 7))), i[t] = i[t - c] ^ r;
                for (n = 0; t; n++, t--) r = i[3 & n ? t : t - 4], o[n] = 4 >= t || 4 > n ? r : s[0][a[r >>> 24]] ^ s[1][a[r >> 16 & 255]] ^ s[2][a[r >> 8 & 255]] ^ s[3][a[255 & r]]
            }, ut.cipher.aes.prototype = {
                encrypt: function(e) {
                    return this._crypt(e, 0)
                },
                decrypt: function(e) {
                    return this._crypt(e, 1)
                },
                _tables: [
                    [
                        [],
                        [],
                        [],
                        [],
                        []
                    ],
                    [
                        [],
                        [],
                        [],
                        [],
                        []
                    ]
                ],
                _precompute: function() {
                    var e, t, n, r, i, o, a, s, c, l = this._tables[0],
                        u = this._tables[1],
                        f = l[4],
                        d = u[4],
                        h = [],
                        p = [];
                    for (e = 0; 256 > e; e++) p[(h[e] = e << 1 ^ 283 * (e >> 7)) ^ e] = e;
                    for (t = n = 0; !f[t]; t ^= r || 1, n = p[n] || 1)
                        for (a = n ^ n << 1 ^ n << 2 ^ n << 3 ^ n << 4, a = a >> 8 ^ 255 & a ^ 99, f[t] = a, d[a] = t, o = h[i = h[r = h[t]]], c = 16843009 * o ^ 65537 * i ^ 257 * r ^ 16843008 * t, s = 257 * h[a] ^ 16843008 * a, e = 0; 4 > e; e++) l[e][t] = s = s << 24 ^ s >>> 8, u[e][a] = c = c << 24 ^ c >>> 8;
                    for (e = 0; 5 > e; e++) l[e] = l[e].slice(0), u[e] = u[e].slice(0)
                },
                _crypt: function(e, t) {
                    if (4 !== e.length) throw new ut.exception.invalid("invalid aes block size");
                    var n, r, i, o, a = this._key[t],
                        s = e[0] ^ a[0],
                        c = e[t ? 3 : 1] ^ a[1],
                        l = e[2] ^ a[2],
                        u = e[t ? 1 : 3] ^ a[3],
                        f = a.length / 4 - 2,
                        d = 4,
                        h = [0, 0, 0, 0],
                        p = this._tables[t],
                        m = p[0],
                        v = p[1],
                        g = p[2],
                        y = p[3],
                        b = p[4];
                    for (o = 0; f > o; o++) n = m[s >>> 24] ^ v[c >> 16 & 255] ^ g[l >> 8 & 255] ^ y[255 & u] ^ a[d], r = m[c >>> 24] ^ v[l >> 16 & 255] ^ g[u >> 8 & 255] ^ y[255 & s] ^ a[d + 1], i = m[l >>> 24] ^ v[u >> 16 & 255] ^ g[s >> 8 & 255] ^ y[255 & c] ^ a[d + 2], u = m[u >>> 24] ^ v[s >> 16 & 255] ^ g[c >> 8 & 255] ^ y[255 & l] ^ a[d + 3], d += 4, s = n, c = r, l = i;
                    for (o = 0; 4 > o; o++) h[t ? 3 & -o : o] = b[s >>> 24] << 24 ^ b[c >> 16 & 255] << 16 ^ b[l >> 8 & 255] << 8 ^ b[255 & u] ^ a[d++], n = s, s = c, c = l, l = u, u = n;
                    return h
                }
            }, ut.bitArray = {
                bitSlice: function(e, t, n) {
                    return e = ut.bitArray._shiftRight(e.slice(t / 32), 32 - (31 & t)).slice(1), void 0 === n ? e : ut.bitArray.clamp(e, n - t)
                },
                extract: function(e, t, n) {
                    var r, i = Math.floor(-t - n & 31);
                    return r = -32 & (t + n - 1 ^ t) ? e[t / 32 | 0] << 32 - i ^ e[t / 32 + 1 | 0] >>> i : e[t / 32 | 0] >>> i, r & (1 << n) - 1
                },
                concat: function(e, t) {
                    if (0 === e.length || 0 === t.length) return e.concat(t);
                    var n = e[e.length - 1],
                        r = ut.bitArray.getPartial(n);
                    return 32 === r ? e.concat(t) : ut.bitArray._shiftRight(t, r, 0 | n, e.slice(0, e.length - 1))
                },
                bitLength: function(e) {
                    var t, n = e.length;
                    return 0 === n ? 0 : (t = e[n - 1], 32 * (n - 1) + ut.bitArray.getPartial(t))
                },
                clamp: function(e, t) {
                    if (32 * e.length < t) return e;
                    e = e.slice(0, Math.ceil(t / 32));
                    var n = e.length;
                    return t = 31 & t, n > 0 && t && (e[n - 1] = ut.bitArray.partial(t, e[n - 1] & 2147483648 >> t - 1, 1)), e
                },
                partial: function(e, t, n) {
                    return 32 === e ? t : (n ? 0 | t : t << 32 - e) + 1099511627776 * e
                },
                getPartial: function(e) {
                    return Math.round(e / 1099511627776) || 32
                },
                equal: function(e, t) {
                    if (ut.bitArray.bitLength(e) !== ut.bitArray.bitLength(t)) return !1;
                    var n, r = 0;
                    for (n = 0; n < e.length; n++) r |= e[n] ^ t[n];
                    return 0 === r
                },
                _shiftRight: function(e, t, n, r) {
                    var i, o, a = 0;
                    for (void 0 === r && (r = []); t >= 32; t -= 32) r.push(n), n = 0;
                    if (0 === t) return r.concat(e);
                    for (i = 0; i < e.length; i++) r.push(n | e[i] >>> t), n = e[i] << 32 - t;
                    return a = e.length ? e[e.length - 1] : 0, o = ut.bitArray.getPartial(a), r.push(ut.bitArray.partial(t + o & 31, t + o > 32 ? n : r.pop(), 1)), r
                },
                _xor4: function(e, t) {
                    return [e[0] ^ t[0], e[1] ^ t[1], e[2] ^ t[2], e[3] ^ t[3]]
                }
            }, ut.codec.hex = {
                fromBits: function(e) {
                    var t, n = "";
                    for (t = 0; t < e.length; t++) n += ((0 | e[t]) + 0xf00000000000).toString(16).substr(4);
                    return n.substr(0, ut.bitArray.bitLength(e) / 4)
                },
                toBits: function(e) {
                    var t, n, r = [];
                    for (e = e.replace(/\s|0x/g, ""), n = e.length, e += "00000000", t = 0; t < e.length; t += 8) r.push(0 ^ parseInt(e.substr(t, 8), 16));
                    return ut.bitArray.clamp(r, 4 * n)
                }
            }, ut.codec.utf8String = {
                fromBits: function(e) {
                    var t, n, r = "",
                        i = ut.bitArray.bitLength(e);
                    for (t = 0; i / 8 > t; t++) 0 === (3 & t) && (n = e[t / 4]), r += String.fromCharCode(n >>> 24), n <<= 8;
                    return decodeURIComponent(escape(r))
                },
                toBits: function(e) {
                    e = unescape(encodeURIComponent(e));
                    var t, n = [],
                        r = 0;
                    for (t = 0; t < e.length; t++) r = r << 8 | e.charCodeAt(t), 3 === (3 & t) && (n.push(r), r = 0);
                    return 3 & t && n.push(ut.bitArray.partial(8 * (3 & t), r)), n
                }
            }, ut.codec.base64 = {
                _chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
                fromBits: function(e, t, n) {
                    var r, i = "",
                        o = 0,
                        a = ut.codec.base64._chars,
                        s = 0,
                        c = ut.bitArray.bitLength(e);
                    for (n && (a = a.substr(0, 62) + "-_"), r = 0; 6 * i.length < c;) i += a.charAt((s ^ e[r] >>> o) >>> 26), 6 > o ? (s = e[r] << 6 - o, o += 26, r++) : (s <<= 6, o -= 6);
                    for (; 3 & i.length && !t;) i += "=";
                    return i
                },
                toBits: function(e, t) {
                    e = e.replace(/\s|=/g, "");
                    var n, r, i = [],
                        o = 0,
                        a = ut.codec.base64._chars,
                        s = 0;
                    for (t && (a = a.substr(0, 62) + "-_"), n = 0; n < e.length; n++) {
                        if (r = a.indexOf(e.charAt(n)), 0 > r) throw new ut.exception.invalid("this isn't base64!");
                        o > 26 ? (o -= 26, i.push(s ^ r >>> o), s = r << 32 - o) : (o += 6, s ^= r << 32 - o)
                    }
                    return 56 & o && i.push(ut.bitArray.partial(56 & o, s, 1)), i
                }
            }, ut.codec.base64url = {
                fromBits: function(e) {
                    return ut.codec.base64.fromBits(e, 1, 1)
                },
                toBits: function(e) {
                    return ut.codec.base64.toBits(e, 1)
                }
            }, void 0 === ut.beware && (ut.beware = {}), ut.beware["CBC mode is dangerous because it doesn't protect message integrity."] = function() {
                ut.mode.cbc = {
                    name: "cbc",
                    encrypt: function(e, t, n, r) {
                        if (r && r.length) throw new ut.exception.invalid("cbc can't authenticate data");
                        if (128 !== ut.bitArray.bitLength(n)) throw new ut.exception.invalid("cbc iv must be 128 bits");
                        var i, o = ut.bitArray,
                            a = o._xor4,
                            s = o.bitLength(t),
                            c = 0,
                            l = [];
                        if (7 & s) throw new ut.exception.invalid("pkcs#5 padding only works for multiples of a byte");
                        for (i = 0; s >= c + 128; i += 4, c += 128) n = e.encrypt(a(n, t.slice(i, i + 4))), l.splice(i, 0, n[0], n[1], n[2], n[3]);
                        return s = 16843009 * (16 - (s >> 3 & 15)), n = e.encrypt(a(n, o.concat(t, [s, s, s, s]).slice(i, i + 4))), l.splice(i, 0, n[0], n[1], n[2], n[3]), l
                    },
                    decrypt: function(e, t, n, r) {
                        if (r && r.length) throw new ut.exception.invalid("cbc can't authenticate data");
                        if (128 !== ut.bitArray.bitLength(n)) throw new ut.exception.invalid("cbc iv must be 128 bits");
                        if (127 & ut.bitArray.bitLength(t) || !t.length) throw new ut.exception.corrupt("cbc ciphertext must be a positive multiple of the block size");
                        var i, o, a, s = ut.bitArray,
                            c = s._xor4,
                            l = [];
                        for (r = r || [], i = 0; i < t.length; i += 4) o = t.slice(i, i + 4), a = c(n, e.decrypt(o)), l.splice(i, 0, a[0], a[1], a[2], a[3]), n = o;
                        if (o = 255 & l[i - 1], 0 == o || o > 16) throw new ut.exception.corrupt("pkcs#5 padding corrupt");
                        if (a = 16843009 * o, !s.equal(s.bitSlice([a, a, a, a], 0, 8 * o), s.bitSlice(l, 32 * l.length - 8 * o, 32 * l.length))) throw new ut.exception.corrupt("pkcs#5 padding corrupt");
                        return s.bitSlice(l, 0, 32 * l.length - 8 * o)
                    }
                }
            }, ut.misc.hmac = function(e, t) {
                this._hash = t = t || ut.hash.sha256;
                var n, r = [
                        [],
                        []
                    ],
                    i = t.prototype.blockSize / 32;
                for (this._baseHash = [new t, new t], e.length > i && (e = t.hash(e)), n = 0; i > n; n++) r[0][n] = 909522486 ^ e[n], r[1][n] = 1549556828 ^ e[n];
                this._baseHash[0].update(r[0]), this._baseHash[1].update(r[1])
            }, ut.misc.hmac.prototype.encrypt = ut.misc.hmac.prototype.mac = function(e, t) {
                var n = new this._hash(this._baseHash[0]).update(e, t).finalize();
                return new this._hash(this._baseHash[1]).update(n).finalize()
            }, ut.hash.sha256 = function(e) {
                this._key[0] || this._precompute(), e ? (this._h = e._h.slice(0), this._buffer = e._buffer.slice(0), this._length = e._length) : this.reset()
            }, ut.hash.sha256.hash = function(e) {
                return (new ut.hash.sha256).update(e).finalize()
            }, ut.hash.sha256.prototype = {
                blockSize: 512,
                reset: function() {
                    return this._h = this._init.slice(0), this._buffer = [], this._length = 0, this
                },
                update: function(e) {
                    "string" == typeof e && (e = ut.codec.utf8String.toBits(e));
                    var t, n = this._buffer = ut.bitArray.concat(this._buffer, e),
                        r = this._length,
                        i = this._length = r + ut.bitArray.bitLength(e);
                    for (t = 512 + r & -512; i >= t; t += 512) this._block(n.splice(0, 16));
                    return this
                },
                finalize: function() {
                    var e, t = this._buffer,
                        n = this._h;
                    for (t = ut.bitArray.concat(t, [ut.bitArray.partial(1, 1)]), e = t.length + 2; 15 & e; e++) t.push(0);
                    for (t.push(Math.floor(this._length / 4294967296)), t.push(0 | this._length); t.length;) this._block(t.splice(0, 16));
                    return this.reset(), n
                },
                _init: [],
                _key: [],
                _precompute: function() {
                    function e(e) {
                        return 4294967296 * (e - Math.floor(e)) | 0
                    }
                    var t, n = 0,
                        r = 2;
                    e: for (; 64 > n; r++) {
                        for (t = 2; r >= t * t; t++)
                            if (r % t === 0) continue e;
                        8 > n && (this._init[n] = e(Math.pow(r, .5))), this._key[n] = e(Math.pow(r, 1 / 3)), n++
                    }
                },
                _block: function(e) {
                    var t, n, r, i, o = e.slice(0),
                        a = this._h,
                        s = this._key,
                        c = a[0],
                        l = a[1],
                        u = a[2],
                        f = a[3],
                        d = a[4],
                        h = a[5],
                        p = a[6],
                        m = a[7];
                    for (t = 0; 64 > t; t++) 16 > t ? n = o[t] : (r = o[t + 1 & 15], i = o[t + 14 & 15], n = o[15 & t] = (r >>> 7 ^ r >>> 18 ^ r >>> 3 ^ r << 25 ^ r << 14) + (i >>> 17 ^ i >>> 19 ^ i >>> 10 ^ i << 15 ^ i << 13) + o[15 & t] + o[t + 9 & 15] | 0), n = n + m + (d >>> 6 ^ d >>> 11 ^ d >>> 25 ^ d << 26 ^ d << 21 ^ d << 7) + (p ^ d & (h ^ p)) + s[t], m = p, p = h, h = d, d = f + n | 0, f = u, u = l, l = c, c = n + (l & u ^ f & (l ^ u)) + (l >>> 2 ^ l >>> 13 ^ l >>> 22 ^ l << 30 ^ l << 19 ^ l << 10) | 0;
                    a[0] = a[0] + c | 0, a[1] = a[1] + l | 0, a[2] = a[2] + u | 0, a[3] = a[3] + f | 0, a[4] = a[4] + d | 0, a[5] = a[5] + h | 0, a[6] = a[6] + p | 0, a[7] = a[7] + m | 0
                }
            }, ut.random = {
                randomWords: function(e, t) {
                    var n, r, i = [],
                        o = this.isReady(t);
                    if (o === this._NOT_READY) throw new ut.exception.notReady("generator isn't seeded");
                    for (o & this._REQUIRES_RESEED && this._reseedFromPools(!(o & this._READY)), n = 0; e > n; n += 4)(n + 1) % this._MAX_WORDS_PER_BURST === 0 && this._gate(), r = this._gen4words(), i.push(r[0], r[1], r[2], r[3]);
                    return this._gate(), i.slice(0, e)
                },
                setDefaultParanoia: function(e) {
                    this._defaultParanoia = e
                },
                addEntropy: function(e, t, n) {
                    n = n || "user";
                    var r, i, o, a = (new Date).valueOf(),
                        s = this._robins[n],
                        c = this.isReady(),
                        l = 0;
                    switch (r = this._collectorIds[n], void 0 === r && (r = this._collectorIds[n] = this._collectorIdNext++), void 0 === s && (s = this._robins[n] = 0), this._robins[n] = (this._robins[n] + 1) % this._pools.length, typeof e) {
                        case "number":
                            void 0 === t && (t = 1), this._pools[s].update([r, this._eventId++, 1, t, a, 1, 0 | e]);
                            break;
                        case "object":
                            var u = Object.prototype.toString.call(e);
                            if ("[object Uint32Array]" === u) {
                                for (o = [], i = 0; i < e.length; i++) o.push(e[i]);
                                e = o
                            } else
                                for ("[object Array]" !== u && (l = 1), i = 0; i < e.length && !l; i++) "number" != typeof e[i] && (l = 1);
                            if (!l) {
                                if (void 0 === t)
                                    for (t = 0, i = 0; i < e.length; i++)
                                        for (o = e[i]; o > 0;) t++, o >>>= 1;
                                this._pools[s].update([r, this._eventId++, 2, t, a, e.length].concat(e))
                            }
                            break;
                        case "string":
                            void 0 === t && (t = e.length), this._pools[s].update([r, this._eventId++, 3, t, a, e.length]), this._pools[s].update(e);
                            break;
                        default:
                            l = 1
                    }
                    if (l) throw new ut.exception.bug("random: addEntropy only supports number, array of numbers or string");
                    this._poolEntropy[s] += t, this._poolStrength += t, c === this._NOT_READY && (this.isReady() !== this._NOT_READY && this._fireEvent("seeded", Math.max(this._strength, this._poolStrength)), this._fireEvent("progress", this.getProgress()))
                },
                isReady: function(e) {
                    var t = this._PARANOIA_LEVELS[void 0 !== e ? e : this._defaultParanoia];
                    return this._strength && this._strength >= t ? this._poolEntropy[0] > this._BITS_PER_RESEED && (new Date).valueOf() > this._nextReseed ? this._REQUIRES_RESEED | this._READY : this._READY : this._poolStrength >= t ? this._REQUIRES_RESEED | this._NOT_READY : this._NOT_READY
                },
                getProgress: function(e) {
                    var t = this._PARANOIA_LEVELS[e ? e : this._defaultParanoia];
                    return this._strength >= t ? 1 : this._poolStrength > t ? 1 : this._poolStrength / t
                },
                startCollectors: function() {
                    if (!this._collectorsStarted) {
                        if (window.addEventListener) window.addEventListener("load", this._loadTimeCollector, !1), window.addEventListener("mousemove", this._mouseCollector, !1);
                        else {
                            if (!document.attachEvent) throw new ut.exception.bug("can't attach event");
                            document.attachEvent("onload", this._loadTimeCollector), document.attachEvent("onmousemove", this._mouseCollector)
                        }
                        this._collectorsStarted = !0
                    }
                },
                stopCollectors: function() {
                    this._collectorsStarted && (window.removeEventListener ? (window.removeEventListener("load", this._loadTimeCollector, !1), window.removeEventListener("mousemove", this._mouseCollector, !1)) : window.detachEvent && (window.detachEvent("onload", this._loadTimeCollector), window.detachEvent("onmousemove", this._mouseCollector)), this._collectorsStarted = !1)
                },
                addEventListener: function(e, t) {
                    this._callbacks[e][this._callbackI++] = t
                },
                removeEventListener: function(e, t) {
                    var n, r, i = this._callbacks[e],
                        o = [];
                    for (r in i) i.hasOwnProperty(r) && i[r] === t && o.push(r);
                    for (n = 0; n < o.length; n++) r = o[n], delete i[r]
                },
                _pools: [new ut.hash.sha256],
                _poolEntropy: [0],
                _reseedCount: 0,
                _robins: {},
                _eventId: 0,
                _collectorIds: {},
                _collectorIdNext: 0,
                _strength: 0,
                _poolStrength: 0,
                _nextReseed: 0,
                _key: [0, 0, 0, 0, 0, 0, 0, 0],
                _counter: [0, 0, 0, 0],
                _cipher: void 0,
                _defaultParanoia: 6,
                _collectorsStarted: !1,
                _callbacks: {
                    progress: {},
                    seeded: {}
                },
                _callbackI: 0,
                _NOT_READY: 0,
                _READY: 1,
                _REQUIRES_RESEED: 2,
                _MAX_WORDS_PER_BURST: 65536,
                _PARANOIA_LEVELS: [0, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024],
                _MILLISECONDS_PER_RESEED: 3e4,
                _BITS_PER_RESEED: 80,
                _gen4words: function() {
                    for (var e = 0; 4 > e && (this._counter[e] = this._counter[e] + 1 | 0, !this._counter[e]); e++);
                    return this._cipher.encrypt(this._counter)
                },
                _gate: function() {
                    this._key = this._gen4words().concat(this._gen4words()), this._cipher = new ut.cipher.aes(this._key)
                },
                _reseed: function(e) {
                    this._key = ut.hash.sha256.hash(this._key.concat(e)), this._cipher = new ut.cipher.aes(this._key);
                    for (var t = 0; 4 > t && (this._counter[t] = this._counter[t] + 1 | 0, !this._counter[t]); t++);
                },
                _reseedFromPools: function(e) {
                    var t, n = [],
                        r = 0;
                    for (this._nextReseed = n[0] = (new Date).valueOf() + this._MILLISECONDS_PER_RESEED, t = 0; 16 > t; t++) n.push(4294967296 * Math.random() | 0);
                    for (t = 0; t < this._pools.length && (n = n.concat(this._pools[t].finalize()), r += this._poolEntropy[t], this._poolEntropy[t] = 0, e || !(this._reseedCount & 1 << t)); t++);
                    this._reseedCount >= 1 << this._pools.length && (this._pools.push(new ut.hash.sha256), this._poolEntropy.push(0)), this._poolStrength -= r, r > this._strength && (this._strength = r), this._reseedCount++, this._reseed(n)
                },
                _mouseCollector: function(e) {
                    var t = e.x || e.clientX || e.offsetX || 0,
                        n = e.y || e.clientY || e.offsetY || 0;
                    ut.random.addEntropy([t, n], 2, "mouse")
                },
                _loadTimeCollector: function() {
                    ut.random.addEntropy((new Date).valueOf(), 2, "loadtime")
                },
                _fireEvent: function(e, t) {
                    var n, r = ut.random._callbacks[e],
                        i = [];
                    for (n in r) r.hasOwnProperty(n) && i.push(r[n]);
                    for (n = 0; n < i.length; n++) i[n](t)
                }
            },
            function() {
                try {
                    var e = new Uint32Array(32);
                    crypto.getRandomValues(e), ut.random.addEntropy(e, 1024, "crypto.getRandomValues")
                } catch (t) {}
            }(),
            function() {
                for (var e in ut.beware) ut.beware.hasOwnProperty(e) && ut.beware[e]()
            }();
        var ft = {
            sjcl: ut,
            version: "1.3.10"
        };
        ft.generateAesKey = function() {
            return {
                key: ut.random.randomWords(8, 0),
                encrypt: function(e) {
                    return this.encryptWithIv(e, ut.random.randomWords(4, 0))
                },
                encryptWithIv: function(e, t) {
                    var n = new ut.cipher.aes(this.key),
                        r = ut.codec.utf8String.toBits(e),
                        i = ut.mode.cbc.encrypt(n, r, t),
                        o = ut.bitArray.concat(t, i);
                    return ut.codec.base64.fromBits(o)
                }
            }
        }, ft.create = function(e) {
            return new ft.EncryptionClient(e)
        }, ft.EncryptionClient = function(e) {
            var r = this,
                o = [];
            r.publicKey = e, r.version = ft.version;
            var a = function(e, t) {
                    var n, r, i;
                    n = document.createElement(e);
                    for (r in t) t.hasOwnProperty(r) && (i = t[r], n.setAttribute(r, i));
                    return n
                },
                s = function(e) {
                    return window.jQuery && e instanceof jQuery ? e[0] : e.nodeType && 1 === e.nodeType ? e : document.getElementById(e)
                },
                c = function(e) {
                    var t, n, r, i, o = [];
                    if ("INTEGER" === e.typeName() && (t = e.posContent(), n = e.posEnd(), r = e.stream.hexDump(t, n).replace(/[ \n]/g, ""), o.push(r)), null !== e.sub)
                        for (i = 0; i < e.sub.length; i++) o = o.concat(c(e.sub[i]));
                    return o
                },
                l = function(e) {
                    var t, n, r = [],
                        i = e.children;
                    for (n = 0; n < i.length; n++) t = i[n], 1 === t.nodeType && t.attributes["data-encrypted-name"] ? r.push(t) : t.children && t.children.length > 0 && (r = r.concat(l(t)));
                    return r
                },
                u = function() {
                    var n, r, o, a, s, l;
                    try {
                        s = i(e), n = t.decode(s)
                    } catch (u) {
                        throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'"
                    }
                    if (o = c(n), 2 !== o.length) throw "Invalid encryption key. Please use the key labeled 'Client-Side Encryption Key'";
                    return a = o[0], r = o[1], l = new K, l.setPublic(a, r), l
                },
                f = function() {
                    return {
                        key: ut.random.randomWords(8, 0),
                        sign: function(e) {
                            var t = new ut.misc.hmac(this.key, ut.hash.sha256),
                                n = t.encrypt(e);
                            return ut.codec.base64.fromBits(n)
                        }
                    }
                };
            r.encrypt = function(e) {
                var t = u(),
                    i = ft.generateAesKey(),
                    o = f(),
                    a = i.encrypt(e),
                    s = o.sign(ut.codec.base64.toBits(a)),
                    c = ut.bitArray.concat(i.key, o.key),
                    l = ut.codec.base64.fromBits(c),
                    d = t.encrypt(l),
                    h = "$bt4|javascript_" + r.version.replace(/\./g, "_") + "$",
                    p = null;
                return d && (p = n(d)), h + p + "$" + a + "$" + s
            }, r.encryptForm = function(e) {
                var t, n, i, c, u, f;
                for (e = s(e), f = l(e); o.length > 0;) {
                    try {
                        e.removeChild(o[0])
                    } catch (d) {}
                    o.splice(0, 1)
                }
                for (u = 0; u < f.length; u++) t = f[u], i = t.getAttribute("data-encrypted-name"), n = r.encrypt(t.value), t.removeAttribute("name"), c = a("input", {
                    value: n,
                    type: "hidden",
                    name: i
                }), o.push(c), e.appendChild(c)
            }, r.onSubmitEncryptForm = function(e, t) {
                var n;
                e = s(e), n = function(n) {
                    return r.encryptForm(e), t ? t(n) : n
                }, window.jQuery ? window.jQuery(e).submit(n) : e.addEventListener ? e.addEventListener("submit", n, !1) : e.attachEvent && e.attachEvent("onsubmit", n)
            }, r.formEncrypter = {
                encryptForm: r.encryptForm,
                extractForm: s,
                onSubmitEncryptForm: r.onSubmitEncryptForm
            }, ut.random.startCollectors()
        }, window.Braintree = ft, "function" == typeof define && define("braintree", function() {
            return ft
        })
    }(),
    function() {
        function e(e) {
            switch (e) {
                case null:
                case void 0:
                    return "";
                case !0:
                    return "1";
                case !1:
                    return "0";
                default:
                    return encodeURIComponent(e)
            }
        }
        var t = window || t,
            n = t.braintree || {},
            r = n.Utils || {};
        r.makeQueryString = function(t, n) {
            var i, o, a = [];
            for (o in t)
                if (t.hasOwnProperty(o)) {
                    var s = t[o];
                    i = n ? n + "[" + o + "]" : o, "object" == typeof s ? a.push(r.makeQueryString(s, i)) : void 0 !== s && null !== s && a.push(e(i) + "=" + e(s))
                }
            return a.join("&")
        }, r.decodeQueryString = function(e) {
            for (var t = {}, n = e.split("&"), r = 0; r < n.length; r++) {
                var i = n[r].split("="),
                    o = i[0],
                    a = decodeURIComponent(i[1]);
                t[o] = a
            }
            return t
        }, r.getParams = function(e) {
            var t = e.split("?");
            return 2 !== t.length ? {} : n.Utils.decodeQueryString(t[1])
        }, r.isFunction = function(e) {
            return "[object Function]" === Object.prototype.toString.call(e)
        }, r.bind = function(e, t) {
            return function() {
                e.apply(t, arguments)
            }
        }, r.addEventListener = function(e, t, n) {
            e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent && e.attachEvent("on" + t, n)
        }, r.removeEventListener = function(e, t, n) {
            e.removeEventListener ? e.removeEventListener(t, n, !1) : e.detachEvent && e.detachEvent("on" + t, n)
        }, r.normalizeElement = function(e, t) {
            if (t = t || "[" + e + "] is not a valid DOM Element", e && e.nodeType && 1 === e.nodeType) return e;
            if (e && window.jQuery && e instanceof jQuery && 0 !== e.length) return e[0];
            if ("string" == typeof e && document.getElementById(e)) return document.getElementById(e);
            throw new Error(t)
        }, n.Utils = r, t.braintree = n
    }(),
    function() {
        function e(e) {
            this.host = e || window, this.handlers = [], n.Utils.addEventListener(this.host, "message", n.Utils.bind(this.receive, this))
        }
        var t = window || t,
            n = t.braintree || {};
        e.prototype.receive = function(t) {
            var n, r, i, o;
            try {
                i = JSON.parse(t.data)
            } catch (a) {
                return
            }
            for (o = i.type, r = new e.Message(this, t.source, i.data), n = 0; n < this.handlers.length; n++) this.handlers[n].type === o && this.handlers[n].handler(r)
        }, e.prototype.send = function(e, t, n) {
            e.postMessage(JSON.stringify({
                type: t,
                data: n
            }), "*")
        }, e.prototype.register = function(e, t) {
            this.handlers.push({
                type: e,
                handler: t
            })
        }, e.prototype.unregister = function(e, t) {
            for (var n = this.handlers.length - 1; n >= 0; n--)
                if (this.handlers[n].type === e && this.handlers[n].handler === t) return this.handlers.splice(n, 1)
        }, e.Message = function(e, t, n) {
            this.bus = e, this.source = t, this.content = n
        }, e.Message.prototype.reply = function(e, t) {
            this.bus.send(this.source, e, t)
        }, n.MessageBus = e, t.braintree = n
    }(),
    function() {
        function e(e) {
            this.bus = e, this.methods = {}, this.bus.register("rpc_request", n.Utils.bind(this._handleRequest, this))
        }
        var t = window || t,
            n = t.braintree || {};
        e.prototype._handleRequest = function(e) {
            var t, n = e.content,
                r = n.args || [],
                i = this.methods[n.method];
            "function" == typeof i && (t = function() {
                e.reply("rpc_response", {
                    id: n.id,
                    response: Array.prototype.slice.call(arguments)
                })
            }, r.push(t), i.apply(null, r))
        }, e.prototype.define = function(e, t) {
            this.methods[e] = t
        }, n.RPCServer = e, t.braintree = n
    }(),
    function() {
        function e(e, t) {
            this.bus = e, this.target = t || window.parent, this.counter = 0, this.callbacks = {}, this.bus.register("rpc_response", n.Utils.bind(this._handleResponse, this))
        }
        var t = window || t,
            n = t.braintree || {};
        e.prototype._handleResponse = function(e) {
            var t = e.content,
                n = this.callbacks[t.id];
            "function" == typeof n && (n.apply(null, t.response), delete this.callbacks[t.id])
        }, e.prototype.invoke = function(e, t, n) {
            var r = this.counter++;
            this.callbacks[r] = n, this.bus.send(this.target, "rpc_request", {
                id: r,
                method: e,
                args: t
            })
        }, n.RPCClient = e, t.braintree = n
    }(),
    function(e) {
        "use strict";
        var t = e.braintree || {};
        t.api = t.api || {}, t.api.configure = function(e) {
            return new t.api.Client(e)
        }, t.api.parseClientToken = function(e) {
            var t;
            if (!e) throw new Error("Braintree API Client Misconfigured: clientToken required.");
            if ("object" == typeof e && null !== e) t = e;
            else {
                try {
                    e = atob(e)
                } catch (n) {}
                try {
                    t = JSON.parse(e)
                } catch (r) {
                    throw new Error("Braintree API Client Misconfigured: clientToken is invalid.")
                }
            }
            if (!t.hasOwnProperty("authUrl") || !t.hasOwnProperty("clientApiUrl")) throw new Error("Braintree API Client Misconfigured: clientToken is invalid.");
            return t
        }, e.braintree = t
    }(this),
    function(e) {
        "use strict";

        function t(e, t) {
            return e.status >= 400 ? [e, null] : [null, t(e)]
        }

        function n(e) {
            var t;
            this.attrs = {}, e.hasOwnProperty("sharedCustomerIdentifier") && (this.attrs.sharedCustomerIdentifier = e.sharedCustomerIdentifier), t = i.api.parseClientToken(e.clientToken), this.driver = e.driver || i.api.JSONPDriver, this.authUrl = t.authUrl, this.analyticsUrl = t.analytics ? t.analytics.url : void 0, this.clientApiUrl = t.clientApiUrl, this.customerId = e.customerId, this.challenges = t.challenges, this.attrs.authorizationFingerprint = t.authorizationFingerprint, this.attrs.sharedCustomerIdentifierType = e.sharedCustomerIdentifierType, this.timeoutWatchers = [], this.requestTimeout = e.hasOwnProperty("timeout") ? e.timeout : 6e4
        }

        function r(e, t) {
            var n, r = {};
            for (n in e) e.hasOwnProperty(n) && (r[n] = e[n]);
            for (n in t) t.hasOwnProperty(n) && (r[n] = t[n]);
            return r
        }
        var i = e.braintree || {};
        i.api = i.api || {}, n.prototype.requestWithTimeout = function(e, n, r, i, o) {
            var a = this,
                s = i(e, n, function(e, n) {
                    if (a.timeoutWatchers[n]) {
                        clearTimeout(a.timeoutWatchers[n]);
                        var i = t(e, function(e) {
                            return r(e)
                        });
                        o.apply(null, i)
                    }
                });
            a.requestTimeout > 0 ? this.timeoutWatchers[s] = setTimeout(function() {
                a.timeoutWatchers[s] = null, o.apply(null, [{
                    errors: "Unknown error"
                }, null])
            }, a.requestTimeout) : o.apply(null, [{
                errors: "Unknown error"
            }, null])
        }, n.prototype.post = function(e, t, n, r) {
            this.requestWithTimeout(e, t, n, this.driver.post, r)
        }, n.prototype.get = function(e, t, n, r) {
            this.requestWithTimeout(e, t, n, this.driver.get, r)
        }, n.prototype.put = function(e, t, n, r) {
            this.requestWithTimeout(e, t, n, this.driver.put, r)
        }, n.prototype.getCreditCards = function(t) {
            this.get(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "payment_methods"]), this.attrs, function(t) {
                var n = 0,
                    r = t.paymentMethods.length,
                    i = [];
                for (n; r > n; n++) i.push(new e.braintree.api.CreditCard(t.paymentMethods[n]));
                return i
            }, t)
        }, n.prototype.tokenizeCard = function(e, t) {
            e.options = {
                validate: !1
            }, this.addCreditCard(e, function(e, n) {
                n && n.nonce ? t(e, n.nonce) : t("Unable to tokenize card.", null)
            })
        }, n.prototype.addSEPAMandate = function(t, n) {
            var o = r(this.attrs, {
                sepaMandate: t
            });
            this.post(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "sepa_mandates.json"]), o, function(t) {
                return new e.braintree.api.SEPAMandate(t.sepaMandates[0])
            }, n)
        }, n.prototype.acceptSEPAMandate = function(t, n) {
            this.put(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "sepa_mandates", t, "accept"]), this.attrs, function(t) {
                return new e.braintree.api.SEPABankAccount(t.sepaBankAccounts[0])
            }, n)
        }, n.prototype.getSEPAMandate = function(t, n) {
            var o;
            o = t.paymentMethodToken ? r(this.attrs, {
                paymentMethodToken: t.paymentMethodToken
            }) : this.attrs, this.get(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "sepa_mandates", t.mandateReferenceNumber || ""]), o, function(t) {
                return new e.braintree.api.SEPAMandate(t.sepaMandates[0])
            }, n)
        }, n.prototype.addCreditCard = function(t, n) {
            var o = t.share;
            delete t.share;
            var a = r(this.attrs, {
                share: o,
                creditCard: t
            });
            this.post(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "payment_methods/credit_cards"]), a, function(t) {
                return new e.braintree.api.CreditCard(t.creditCards[0])
            }, n)
        }, n.prototype.unlockCreditCard = function(t, n, o) {
            var a = r(this.attrs, {
                challengeResponses: n
            });
            this.put(i.api.util.joinUrlFragments([this.clientApiUrl, "v1", "payment_methods/", t.nonce]), a, function(t) {
                return new e.braintree.api.CreditCard(t.paymentMethods[0])
            }, o)
        }, n.prototype.sendAnalyticsEvents = function(n, i) {
            var o, a, s, c = this,
                l = [];
            if (n = e.braintree.api.util.isArray(n) ? n : [n], !this.analyticsUrl) return void(i && i.apply(null, [null, {}]));
            for (var u in n) n.hasOwnProperty(u) && l.push({
                kind: n[u]
            });
            o = this.analyticsUrl, a = r(this.attrs, {
                analytics: l
            }), s = this.driver.post(o, a, function(e, n) {
                if (c.timeoutWatchers[n]) {
                    clearTimeout(c.timeoutWatchers[n]);
                    var r = t(e, function(e) {
                        return e
                    });
                    i && i.apply(null, r)
                }
            }), this.timeoutWatchers[s] = setTimeout(function() {
                c.timeoutWatchers[s] = null, i.apply(null, [{
                    errors: "Unknown error"
                }, null])
            }, this.requestTimeout)
        }, i.api.Client = n, e.braintree = i
    }(this),
    function(e) {
        "use strict";

        function t(e) {
            for (var t = 0; t < r.length; t++) {
                var n = r[t];
                this[n] = e[n]
            }
        }
        var n = e.braintree || {};
        n.api = n.api || {};
        var r = ["billingAddress", "branding", "createdAt", "createdAtMerchant", "createdAtMerchantName", "details", "isLocked", "lastUsedAt", "lastUsedAtMerchant", "lastUsedAtMerchantName", "lastUsedByCurrentMerchant", "nonce", "securityQuestions", "type"];
        n.api.CreditCard = t, e.braintree = n
    }(this),
    function(e) {
        "use strict";
        var t = e.braintree || {};
        t.api = t.api || {}, t.api.JSONPDriver = {}, t.api.JSONPDriver.get = function(e, n, r) {
            return t.api.JSONP.get(e, n, r)
        }, t.api.JSONPDriver.post = function(e, n, r) {
            return n._method = "POST", t.api.JSONP.get(e, n, r)
        }, t.api.JSONPDriver.put = function(e, n, r) {
            return n._method = "PUT", t.api.JSONP.get(e, n, r)
        }, e.braintree = t
    }(this),
    function(e) {
        function t(e, t) {
            var n = document.createElement("script"),
                r = !1;
            n.src = e, n.async = !0;
            var i = t || u.error;
            "function" == typeof i && (n.onerror = function(t) {
                i({
                    url: e,
                    event: t
                })
            }), n.onload = n.onreadystatechange = function() {
                r || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (r = !0, n.onload = n.onreadystatechange = null, n && n.parentNode && n.parentNode.removeChild(n))
            }, s || (s = document.getElementsByTagName("head")[0]), s.appendChild(n)
        }

        function n(e, t) {
            var r, i, o = [];
            for (var i in e) v = e[i], r = t ? a.api.util.isArray(e) ? t + "[]" : t + "[" + i + "]" : i, o.push("object" == typeof v ? n(v, r) : encodeURIComponent(r) + "=" + encodeURIComponent(v));
            return o.join("&")
        }

        function r(e, r, i, a) {
            var s = -1 === (e || "").indexOf("?") ? "?" : "&";
            a = a || u.callbackName || "callback";
            var f = a + "_json" + ++c;
            return s += n(o(r)), l[f] = function(e) {
                i(e, f);
                try {
                    delete l[f]
                } catch (t) {}
                l[f] = null
            }, t(e + s + "&" + a + "=" + f), f
        }

        function i(e) {
            u = e
        }

        function o(e) {
            return e.braintreeLibraryVersion = "js/" + a.api.version, e
        }
        var a = e.braintree || {};
        a.api = a.api || {};
        var s, c = 0,
            l = this,
            u = {};
        a.api.JSONP = {
            get: r,
            init: i,
            stringify: n,
            populateParams: o
        }, e.braintree = a
    }(this),
    function(e) {
        "use strict";
        e.atob = e.atob || function(e) {
            var t = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})([=]{1,2})?$"),
                n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                r = "";
            if (!t.test(e)) throw new Error("Braintree API Client Misconfigured: clientToken is invalid.");
            var i = 0;
            do {
                var o = n.indexOf(e.charAt(i++)),
                    a = n.indexOf(e.charAt(i++)),
                    s = n.indexOf(e.charAt(i++)),
                    c = n.indexOf(e.charAt(i++)),
                    l = (63 & o) << 2 | a >> 4 & 3,
                    u = (15 & a) << 4 | s >> 2 & 15,
                    f = (3 & s) << 6 | 63 & c;
                r += String.fromCharCode(l) + (u ? String.fromCharCode(u) : "") + (f ? String.fromCharCode(f) : "")
            } while (i < e.length);
            return r
        }
    }(this),
    function(e) {
        "use strict";

        function t(e) {
            for (var t = 0; t < r.length; t++) {
                var n = r[t];
                this[n] = e[n]
            }
        }
        var n = e.braintree || {};
        n.api = n.api || {};
        var r = ["bic", "maskedIBAN", "nonce", "accountHolderName"];
        n.api.SEPABankAccount = t, e.braintree = n
    }(this),
    function(e) {
        "use strict";

        function t(e) {
            for (var t = 0; t < r.length; t++) {
                var n = r[t];
                this[n] = e[n]
            }
        }
        var n = e.braintree || {};
        n.api = n.api || {};
        var r = ["accountHolderName", "bic", "longFormURL", "mandateReferenceNumber", "maskedIBAN", "shortForm"];
        n.api.SEPAMandate = t, e.braintree = n
    }(this),
    function(e) {
        "use strict";
        var t = e.braintree || {};
        t.api = t.api || {}, t.api.testing = {}, t.api.testing.createClient = function(n, r) {
            var i = n.driver || t.api.JSONPDriver,
                o = n.sharedCustomerIdentifier || Math.random() + "",
                a = t.api.util.joinUrlFragments([e.GATEWAY_HOST + ":" + e.GATEWAY_PORT, "merchants", n.merchantId]),
                s = {
                    merchantId: n.merchantId,
                    publicKey: n.publicKey,
                    customer: n.customer,
                    sharedCustomerIdentifierType: "testing",
                    sharedCustomerIdentifier: o,
                    baseUrl: a
                };
            n.creditCard && (s.creditCard = n.creditCard), n.SEPAMandateType && (s.sepaMandateType = n.SEPAMandateType), i.post(t.api.util.joinUrlFragments([a, "client_api/testing/setup"]), s, function(e) {
                n.clientToken = JSON.stringify({
                    authUrl: "fake_auth_url",
                    clientApiUrl: t.api.util.joinUrlFragments([a, "client_api"]),
                    authorizationFingerprint: e.authorizationFingerprint,
                    analytics: n && n.analytics ? n.analytics : {}
                }), n.sharedCustomerIdentifier = o, n.sharedCustomerIdentifierType = "testing", n.customerId = e.token;
                var i = new t.api.Client(n);
                r(i)
            })
        }, e.braintree = t
    }(this),
    function(e) {
        "use strict";

        function t() {}
        var n = e.braintree || {};
        n.api = n.api || {}, t.prototype.joinUrlFragments = function(e) {
            var t, n, r = [];
            for (n = 0; n < e.length; n++) t = e[n], "/" === t.charAt(t.length - 1) && (t = t.substring(0, t.length - 1)), "/" === t.charAt(0) && (t = t.substring(1)), r.push(t);
            return r.join("/")
        }, t.prototype.isArray = function(e) {
            return e && "object" == typeof e && "number" == typeof e.length && "[object Array]" === Object.prototype.toString.call(e) || !1
        }, n.api.util = new t
    }(this),
    function(e) {
        "use strict";
        var t = "1.0.0",
            n = e.braintree || {};
        n.api = n.api || {}, n.api.version = t
    }(this),
    function(e) {
        "use strict";

        function t(e) {
            if ("object" == typeof e) return e;
            var t = "payment_method_nonce";
            "string" == typeof e && (t = e);
            var n = document.createElement("input");
            return n.name = t, n.type = "hidden", n
        }

        function n(e) {
            for (var t = e.getElementsByTagName("*"), n = {}, r = 0; r < t.length; r++) {
                var i = t[r].getAttribute("data-braintree-name");
                n[i] = !0
            }
            if (!n.number) throw 'Unable to find an input with data-braintree-name="number" in your form. Please add one.';
            if (n.expiration_date) {
                if (n.expiration_month || n.expiration_year) throw 'You have inputs with data-braintree-name="expiration_date" AND data-braintree-name="expiration_(year|month)". Please use either "expiration_date" or "expiration_year" and "expiration_month".'
            } else {
                if (!n.expiration_month && !n.expiration_year) throw 'Unable to find an input with data-braintree-name="expiration_date" in your form. Please add one.';
                if (!n.expiration_month) throw 'Unable to find an input with data-braintree-name="expiration_month" in your form. Please add one.';
                if (!n.expiration_year) throw 'Unable to find an input with data-braintree-name="expiration_year" in your form. Please add one.'
            }
        }
        var r = e.braintree || {};
        r.Form = function(e, t, n) {
            this.client = e, this.htmlForm = t, this.paymentMethodNonce = n
        }, r.Form.setup = function(e, i) {
            var o = document.getElementById(i.id);
            if (!o) throw 'Unable to find form with id: "' + i.id + '"';
            n(o);
            var a = t(i.paymentMethodNonceInputField);
            o.appendChild(a);
            var s = new r.Form(e, o, a);
            return s.hijackForm(), s
        }, r.Form.prototype.registerAsyncTaskOnSubmit = function(e, t) {
            function n(n) {
                n.preventDefault ? n.preventDefault() : n.returnValue = !1, t(function() {
                    i(), "function" == typeof e.submit ? e.submit() : setTimeout(function() {
                        e.querySelector('[type="submit"]').click()
                    }, 1)
                })
            }

            function r() {
                e.addEventListener ? e.addEventListener("submit", n) : e.attachEvent && e.attachEvent("onsubmit", n)
            }

            function i() {
                e.removeEventListener ? e.removeEventListener("submit", n) : e.detachEvent && e.detachEvent("onsubmit", n)
            }
            r()
        }, r.Form.prototype.hijackForm = function() {
            var e = this;
            this.registerAsyncTaskOnSubmit(this.htmlForm, function(t) {
                return e.paymentMethodNonce.value && "" !== e.paymentMethodNonce.value ? void t() : void e.client.tokenizeCard(e.extractValues(e.htmlForm), function(n, r) {
                    if (n) throw "Unable to process payments at this time.";
                    e.paymentMethodNonce.value = r, t()
                })
            })
        }, r.Form.prototype.extractValues = function(e, t) {
            t = t || {};
            var n, r, i = e.children;
            for (r = 0; r < i.length; r++)
                if (n = i[r], 1 === n.nodeType && n.attributes["data-braintree-name"]) {
                    var o = n.getAttribute("data-braintree-name");
                    "postal_code" === o ? t.billingAddress = {
                        postalCode: n.value
                    } : t[o] = n.value, this.scrubAttributes(n)
                } else n.children && n.children.length > 0 && this.extractValues(n, t);
            return t
        }, r.Form.prototype.scrubAttributes = function(e) {
            try {
                e.attributes.removeNamedItem("name")
            } catch (t) {}
        }, e.braintree = r
    }(this),
    function() {
        "use strict";
        ! function() {
            var e = window.braintree || {};
            e.paypal = e.paypal || {}, window.braintree = e
        }(),
        function() {
            braintree.paypal.VERSION = [1, 0, 0].join("."), braintree.paypal.constants = {
                POPUP_NAME: "braintree_paypal_popup",
                POPUP_PATH: "/pwpp/" + braintree.paypal.VERSION + "/html/braintree-frame.html",
                POPUP_OPTIONS: "height=470,width=410,resizable=true"
            }
        }(),
        function() {
            braintree.paypal.browser = {}, braintree.paypal.browser.DEFAULT_POPUP_TARGET = "braintree_paypal_external_popup", braintree.paypal.browser.DEFAULT_POPUP_HEIGHT = 600, braintree.paypal.browser.DEFAULT_POPUP_WIDTH = 800, braintree.paypal.browser.isMobile = function() {
                return braintree.paypal.browser.isMobileDevice() && window.outerWidth < 600
            }, braintree.paypal.browser.isMobileDevice = function() {
                return /Android|webOS|iPhone|iPod|iOS|Blackberry/i.test(window.navigator.userAgent)
            }, braintree.paypal.browser.detectedPostMessage = function() {
                return !!window.postMessage
            }, braintree.paypal.browser.isPopupSupported = function() {
                return /pwpp=popup/.test(document.location.search)
            }, braintree.paypal.browser.popup = function(e, t) {
                t || (t = {}), t.target = t.target || e.target || braintree.paypal.browser.DEFAULT_POPUP_TARGET, t.height = t.height || braintree.paypal.browser.DEFAULT_POPUP_HEIGHT, t.width = t.width || braintree.paypal.browser.DEFAULT_POPUP_WIDTH;
                var n = "undefined" != typeof e.href ? e.href : String(e),
                    r = t.target || e.target,
                    i = [];
                for (var o in t)
                    if (t.hasOwnProperty(o)) switch (o) {
                        case "width":
                        case "height":
                        case "top":
                        case "left":
                            i.push(o + "=" + t[o]);
                            break;
                        case "target":
                        case "noreferrer":
                            break;
                        default:
                            i.push(o + "=" + (t[o] ? 1 : 0))
                    }
                    var a = i.join(","),
                        s = window.open(n, r, a);
                return s ? (s.focus(), !1) : !0
            }
        }(),
        function() {
            braintree.paypal.dom = {}, braintree.paypal.dom.setTextContent = function(e, t) {
                var n = "innerText";
                document && document.body && "textContent" in document.body && (n = "textContent"), e[n] = t
            }, braintree.paypal.dom.normalizeElement = function(e) {
                if (e && e.nodeType && 1 === e.nodeType) return e;
                if (e && window.jQuery && e instanceof jQuery && 0 !== e.length) return e[0];
                if ("string" == typeof e && document.getElementById(e)) return document.getElementById(e);
                throw new Error("[" + e + "] is not a valid DOM Element")
            }
        }(),
        function() {
            braintree.paypal.util = {}, braintree.paypal.util.trim = "function" == typeof String.prototype.trim ? function(e) {
                return e.trim()
            } : function(e) {
                return e.replace(/^\s+|\s+$/, "")
            }, braintree.paypal.util.btoa = "function" == typeof window.btoa ? function(e) {
                return window.btoa(e)
            } : function(e) {
                for (var t, n, r, i, o, a, s, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", l = "", u = 0; u < e.length;) t = e.charCodeAt(u++), n = e.charCodeAt(u++), r = e.charCodeAt(u++), i = t >> 2, o = (3 & t) << 4 | n >> 4, a = (15 & n) << 2 | r >> 6, s = 63 & r, isNaN(n) ? a = s = 64 : isNaN(r) && (s = 64), l = l + c.charAt(i) + c.charAt(o) + c.charAt(a) + c.charAt(s);
                return l
            }, braintree.paypal.util.generateUid = function() {
                for (var e = "", t = 0; 32 > t; t++) {
                    var n = Math.floor(16 * Math.random());
                    e += n.toString(16)
                }
                return e
            }, braintree.paypal.util.castToBoolean = function(e) {
                return /^(true|1)$/i.test(e)
            }
        }(),
        function() {
            braintree.paypal.create = function(e, t) {
                if (!braintree.paypal.browser.detectedPostMessage()) return void("function" == typeof t.onUnsupported && t.onUnsupported(new Error("unsupported browser detected")));
                var n = new braintree.paypal.Client(e, t);
                return n.initialize(), n
            }
        }(),
        function() {
            function e(e) {
                this.options = e, this.container = this.createViewContainer(), this.createPayPalName(), this.emailNode = this.createEmailNode(), this.logoutNode = this.createLogoutNode()
            }
            e.prototype.createViewContainer = function() {
                var e = document.createElement("div");
                e.id = "braintree-paypal-loggedin";
                var t = ["display: none", "max-width: 500px", "overflow: hidden", "padding: 16px", "background-image: url(/images/paypal/paypal-small.png)", "background-image: url(/images/paypal/paypal-small.svg), none", "background-position: 20px 50%", "background-repeat: no-repeat", "background-size: 13px 15px", "border-top: 1px solid #d1d4d6", "border-bottom: 1px solid #d1d4d6"].join(";");
                return e.style.cssText = t, this.options.container.appendChild(e), e
            }, e.prototype.createPayPalName = function() {
                var e = document.createElement("span");
                e.id = "bt-pp-name", e.innerHTML = "PayPal";
                var t = ["color: #283036", "font-size: 13px", "font-weight: 800", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif', "margin-left: 36px", "-webkit-font-smoothing: antialiased", "-moz-font-smoothing: antialiased", "-ms-font-smoothing: antialiased", "font-smoothing: antialiased"].join(";");
                return e.style.cssText = t, this.container.appendChild(e)
            }, e.prototype.createEmailNode = function() {
                var e = document.createElement("span");
                e.id = "bt-pp-email";
                var t = ["color: #6e787f", "font-size: 13px", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif', "margin-left: 5px", "-webkit-font-smoothing: antialiased", "-moz-font-smoothing: antialiased", "-ms-font-smoothing: antialiased", "font-smoothing: antialiased"].join(";");
                return e.style.cssText = t, this.container.appendChild(e)
            }, e.prototype.createLogoutNode = function() {
                var e = document.createElement("button");
                e.id = "bt-pp-cancel", e.innerHTML = "Cancel";
                var t = ["color: #3d95ce", "font-size: 11px", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif', "line-height: 20px", "margin: 0 0 0 25px", "padding: 0", "background-color: transparent", "border: 0", "cursor: pointer", "text-decoration: underline", "float: right", "-webkit-font-smoothing: antialiased", "-moz-font-smoothing: antialiased", "-ms-font-smoothing: antialiased", "font-smoothing: antialiased"].join(";");
                return e.style.cssText = t, this.container.appendChild(e)
            }, e.prototype.show = function() {
                this.container.style.display = "block"
            }, e.prototype.hide = function() {
                this.container.style.display = "none"
            }, braintree.paypal.LoggedInView = e
        }(),
        function() {
            function e(e) {
                this.options = e, this.assetsUrl = this.options.assetsUrl, this.container = this.createViewContainer(), this.buttonNode = this.createPayWithPayPalButton()
            }
            e.prototype.createViewContainer = function() {
                var e = document.createElement("div");
                return e.id = "braintree-paypal-loggedout", this.options.container.appendChild(e), e
            }, e.prototype.createPayWithPayPalButton = function() {
                var e = document.createElement("a");
                e.id = "braintree-paypal-button", e.href = "#";
                var t = ["display: block", "width: 115px", "height: 44px", "overflow: hidden"].join(";");
                e.style.cssText = t;
                var n = new Image;
                n.src = "/images/paypal/pay-with-paypal.png", n.setAttribute("alt", "Pay with PayPal");
                var r = ["max-width: 100%", "display: block", "width: 100%", "height: 100%", "outline: none", "border: 0"].join(";");
                return n.style.cssText = r, e.appendChild(n), this.container.appendChild(e)
            }, e.prototype.show = function() {
                this.container.style.display = "block"
            }, e.prototype.hide = function() {
                this.container.style.display = "none"
            }, braintree.paypal.LoggedOutView = e
        }(),
        function() {
            function e(e) {
                var t = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle;
                return {
                    overflow: t.overflow || "",
                    height: e.style.height || ""
                }
            }

            function t() {
                return {
                    html: {
                        node: document.documentElement,
                        styles: e(document.documentElement)
                    },
                    body: {
                        node: document.body,
                        styles: e(document.body)
                    }
                }
            }

            function n(e, t) {
                t = t || {}, this.clientToken = e, this.parsedClientToken = this._parseClientToken(e), this.parsedClientToken && t.displayName && (this.parsedClientToken.paypalDisplayName = t.displayName), this.locale = t.locale || "en", this.singleUse = t.singleUse || !1, this.demoMode = t.demo || !1, this.container = t.container, this.merchantPageDefaultStyles = null, this.paymentMethodNonceInputField = t.paymentMethodNonceInputField, this.frame = null, this.popup = null, this.communicationFrame = null, this.windowResizeListener = braintree.Utils.bind(this._handleWindowResize, this), this.insertFrameFunction = t.insertFrame, this.onSuccess = t.onSuccess, this.onCancelled = t.onCancelled, this.onUnsupported = t.onUnsupported, this.rpcServer = null, this.loggedInView = null, this.loggedOutView = null, this.insertUI = !0
            }
            n.prototype.initialize = function() {
                return this._isPayPalEnabled() ? this._hasSecureBrowserProtocol() ? (this._setupDomElements(), this._setupPaymentMethodNonceInputField(), this._setupViews(), void this._setupRPCServer()) : void("function" == typeof this.onUnsupported && this.onUnsupported(new Error("unsupported protocol detected"))) : void("function" == typeof this.onUnsupported && this.onUnsupported(new Error("PayPal is not enabled")))
            }, n.prototype._isPayPalEnabled = function() {
                return !(!this.parsedClientToken || !this.parsedClientToken.paypalEnabled)
            }, n.prototype._hasSecureBrowserProtocol = function() {
                return /https/.test(window.location.protocol) || this.parsedClientToken.paypalAllowHttp
            }, n.prototype._canBeInitialized = function() {
                return this._isPayPalEnabled() && this._hasSecureBrowserProtocol()
            }, n.prototype._setupDomElements = function() {
                this.insertUI && (this.container = braintree.paypal.dom.normalizeElement(this.container))
            }, n.prototype._setupPaymentMethodNonceInputField = function() {
                if (this.insertUI) {
                    var e = this.paymentMethodNonceInputField;
                    braintree.Utils.isFunction(e) || (e = void 0 !== e ? braintree.paypal.dom.normalizeElement(e) : this._createPaymentMethodNonceInputField(), this.paymentMethodNonceInputField = e)
                }
            }, n.prototype._setupViews = function() {
                this.insertUI && (this.loggedInView = new braintree.paypal.LoggedInView({
                    container: this.container,
                    assetsUrl: this.parsedClientToken.assetsUrl
                }), this.loggedOutView = new braintree.paypal.LoggedOutView({
                    assetsUrl: this.parsedClientToken.assetsUrl,
                    container: this.container
                }), braintree.Utils.addEventListener(this.loggedOutView.buttonNode, "click", braintree.Utils.bind(this._handleButtonClick, this)), braintree.Utils.addEventListener(this.loggedInView.logoutNode, "click", braintree.Utils.bind(this._handleLogout, this)))
            }, n.prototype._setupRPCServer = function() {
                var e = new braintree.MessageBus(window);
                this.rpcServer = new braintree.RPCServer(e, window), this.rpcServer.define("closePayPalModal", braintree.Utils.bind(this._handleCloseMessage, this)), this.rpcServer.define("receivePayPalData", braintree.Utils.bind(this._handleSuccessfulAuthentication, this))
            }, n.prototype._createFrameUrl = function() {
                var e = "";
                return e += this.parsedClientToken.assetsUrl + "/pwpp/" + braintree.paypal.VERSION + "/html/braintree-frame.html", e += "?locale=" + this.locale, e += "&singleUse=" + this.singleUse, e += "&demo=" + this.demoMode, e += "&displayName=" + encodeURIComponent(this.parsedClientToken.paypalDisplayName), e += "&clientApiUrl=" + this.parsedClientToken.clientApiUrl, e += "&authUrl=" + this.parsedClientToken.authUrl, e += "&authorizationFingerprint=" + this.parsedClientToken.authorizationFingerprint, e += "&paypalBaseUrl=" + this.parsedClientToken.paypalBaseUrl, e += "&paypalClientId=" + this.parsedClientToken.paypalClientId, e += "&paypalPrivacyUrl=" + this.parsedClientToken.paypalPrivacyUrl, e += "&paypalUserAgreementUrl=" + this.parsedClientToken.paypalUserAgreementUrl, e += "&offline=" + this.parsedClientToken.paypalEnvironmentNoNetwork
            }, n.prototype._createPaymentMethodNonceInputField = function() {
                var e = document.createElement("input");
                return e.name = "payment_method_nonce", e.type = "hidden", this.container.appendChild(e)
            }, n.prototype._createFrame = function() {
                var e = this._createFrameUrl(),
                    t = document.createElement("iframe");
                return t.src = e, t.id = "braintree-paypal-frame", t.allowTransparency = !0, t.height = "100%", t.width = "100%", t.frameBorder = 0, t.style.position = braintree.paypal.browser.isMobile() ? "absolute" : "fixed", t.style.top = 0, t.style.left = 0, t.style.bottom = 0, t.style.zIndex = 20001, t.style.padding = 0, t.style.margin = 0, t.style.border = 0, t.style.outline = "none", t
            }, n.prototype._removeFrame = function(e) {
                e = e || document.body, this.frame && e.contains(this.frame) && (e.removeChild(this.frame), this._unlockMerchantWindowSize())
            }, n.prototype._insertFrame = function() {
                this.insertFrameFunction ? this.insertFrameFunction(this._createFrameUrl()) : (this.frame = this._createFrame(), document.body.appendChild(this.frame)), this._lockMerchantWindowSize()
            }, n.prototype._handleButtonClick = function(e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1, this._open()
            }, n.prototype._setMerchantPageDefaultStyles = function() {
                this.merchantPageDefaultStyles = t()
            }, n.prototype._open = function() {
                braintree.paypal.browser.isPopupSupported() ? this._openPopup() : this._openModal()
            }, n.prototype._close = function() {
                braintree.paypal.browser.isPopupSupported() ? this._closePopup() : this._closeModal()
            }, n.prototype._openModal = function() {
                this._removeFrame(), this._insertFrame()
            }, n.prototype._openPopup = function() {
                var e = braintree.paypal.constants.POPUP_NAME,
                    t = braintree.paypal.constants.POPUP_OPTIONS;
                return this.popup = window.open(this._createFrameUrl(), e, t), this.popup.focus(), this.popup
            }, n.prototype._closeModal = function() {
                this._removeFrame()
            }, n.prototype._closePopup = function() {
                this.popup && (this.popup.close(), this.popup = null)
            }, n.prototype._handleSuccessfulAuthentication = function(e, t) {
                braintree.Utils.isFunction(this.onSuccess) && this.onSuccess(e, t), this._close(), braintree.Utils.isFunction(this.paymentMethodNonceInputField) ? this.paymentMethodNonceInputField(e) : (this._showLoggedInContent(t), this._setNonceInputValue(e))
            }, n.prototype._lockMerchantWindowSize = function() {
                this._setMerchantPageDefaultStyles(), document.documentElement.style.overflow = "hidden", document.body.style.height = "100%", document.body.style.overflow = "hidden", braintree.paypal.browser.isMobile() && (window.scrollTo(0, 0), this._updateMerchantWindowHeight(document.documentElement.clientHeight), braintree.Utils.addEventListener("resize", this.windowResizeListener))
            }, n.prototype._unlockMerchantWindowSize = function() {
                this.merchantPageDefaultStyles && (document.documentElement.style.height = this.merchantPageDefaultStyles.html.styles.height, document.documentElement.style.overflow = this.merchantPageDefaultStyles.html.styles.overflow, document.body.style.height = this.merchantPageDefaultStyles.body.styles.height, document.body.style.overflow = this.merchantPageDefaultStyles.body.styles.overflow), braintree.Utils.removeEventListener("resize", this.windowResizeListener)
            }, n.prototype._handleWindowResize = function() {
                this._updateMerchantWindowHeight(document.documentElement.clientHeight)
            }, n.prototype._updateMerchantWindowHeight = function(e) {
                document.documentElement.style.height = e + "px", this.frame.style.minHeight = e + "px"
            }, n.prototype._handleCloseMessage = function() {
                this._removeFrame()
            }, n.prototype._showLoggedInContent = function(e) {
                this.loggedOutView.hide(), braintree.paypal.dom.setTextContent(this.loggedInView.emailNode, e), this.loggedInView.show()
            }, n.prototype._handleLogout = function(e) {
                e.preventDefault ? e.preventDefault() : e.returnValue = !1, this.loggedInView.hide(), this.loggedOutView.show(), this._setNonceInputValue(""), braintree.Utils.isFunction(this.onCancelled) && this.onCancelled()
            }, n.prototype._setNonceInputValue = function(e) {
                this.paymentMethodNonceInputField.value = e
            }, n.prototype._parseClientToken = function(e) {
                if (!e || 0 === e.length) throw new Error("clientToken not provided.");
                var t = braintree.api.parseClientToken(e);
                return t.paypalEnabled ? {
                    assetsUrl: t.paypal.assetsUrl,
                    authUrl: t.authUrl,
                    authorizationFingerprint: encodeURIComponent(t.authorizationFingerprint),
                    clientApiUrl: encodeURIComponent(t.clientApiUrl),
                    paypalAllowHttp: braintree.paypal.util.castToBoolean(t.paypal.allowHttp),
                    paypalBaseUrl: t.paypal.assetsUrl,
                    paypalClientId: t.paypal.clientId,
                    paypalDisplayName: t.paypal.displayName,
                    paypalEnvironmentNoNetwork: braintree.paypal.util.castToBoolean(t.paypal.environmentNoNetwork),
                    paypalPrivacyUrl: encodeURIComponent(t.paypal.privacyUrl),
                    paypalUserAgreementUrl: encodeURIComponent(t.paypal.userAgreementUrl),
                    paypalEnabled: braintree.paypal.util.castToBoolean(t.paypalEnabled)
                } : !1
            }, braintree.paypal.Client = n
        }()
    }(),
    function() {
        "use strict";
        ! function() {
            var e = e || window,
                t = e.braintree || {};
            t.dropin = t.dropin || {}, t.dropin.version = "1.0.4", t.dropin.Shared = {}, t.dropin.InlineFrame = {}, e.braintree = t
        }(),
        function() {
            braintree.dropin.create = function(e, t) {
                t.clientToken = e;
                var n = new braintree.dropin.Client(t);
                return n.initialize(), n
            }
        }(),
        function() {
            function e(e) {
                this.form = e.form, this.frames = e.frames, this.onSubmit = e.onSubmit, this.apiClient = e.apiClient
            }
            e.prototype.initialize = function() {
                return this._isSubmitBased() && this._setElements(), this._setEvents(), this
            }, e.prototype.writeNonce = function(e) {
                this.currentNonce = e
            }, e.prototype._isSubmitBased = function() {
                return !this.onSubmit
            }, e.prototype._isCallbackBased = function() {
                return !!this.onSubmit
            }, e.prototype._setElements = function() {
                if (!this.form.payment_method_nonce) {
                    var e = document.createElement("input");
                    e.type = "hidden", e.name = "payment_method_nonce", this.form.appendChild(e)
                }
                this.nonceField = this.form.payment_method_nonce
            }, e.prototype._setEvents = function() {
                var e = this;
                braintree.Utils.addEventListener(this.form, "submit", function() {
                    e._handleFormSubmit.apply(e, arguments)
                })
            }, e.prototype._handleFormSubmit = function(e) {
                this._shouldSubmit() || (e && e.preventDefault ? e.preventDefault() : e.returnValue = !1, this.currentNonce ? this._handleNonceReply(e) : this.frames.inline.rpcClient.invoke("requestNonce", [], braintree.Utils.bind(function(t) {
                    this.writeNonce(t), this._handleNonceReply(e)
                }, this)))
            }, e.prototype._shouldSubmit = function() {
                return this._isCallbackBased() ? !1 : this.nonceField.value.length > 0
            }, e.prototype._handleNonceReply = function(e) {
                this._isCallbackBased() ? this.apiClient.sendAnalyticsEvents("dropin.web.end.callback", braintree.Utils.bind(function() {
                    this.onSubmit(e, this.currentNonce), setTimeout(braintree.Utils.bind(function() {
                        this.frames.inline.rpcClient.invoke("clearLoadingState")
                    }, this), 200)
                }, this)) : this._triggerFormSubmission()
            }, e.prototype._triggerFormSubmission = function() {
                this.nonceField.value = this.currentNonce, this.apiClient.sendAnalyticsEvents("dropin.web.end.auto-submit", braintree.Utils.bind(function() {
                    "function" == typeof this.form.submit ? this.form.submit() : this.form.querySelector('[type="submit"]').click()
                }, this))
            }, braintree.dropin.MerchantFormManager = e
        }(),
        function() {
            function e(e, t) {
                var n = window.getComputedStyle ? getComputedStyle(e) : e.currentStyle;
                return n[t]
            }

            function t() {
                return {
                    html: {
                        height: i.style.height || "",
                        overflow: e(i, "overflow"),
                        position: e(i, "position")
                    },
                    body: {
                        height: o.style.height || "",
                        overflow: e(o, "overflow")
                    }
                }
            }

            function n() {
                var e = /Android|iPhone|iPod|iPad/i.test(window.navigator.userAgent);
                return e
            }

            function r(e) {
                var t, n, r, a = braintree.dropin.version;
                this.encodedClientToken = e.clientToken, this.paypalOptions = e.paypal, this.container = null, this.merchantFormManager = null, this.root = e.root, this.configurationRequests = [], this.braintreeApiClient = braintree.api.configure({
                    clientToken: e.clientToken
                }), this.paymentMethodNonceReceivedCallback = e.paymentMethodNonceReceived, this.clientToken = braintree.api.parseClientToken(e.clientToken), this.bus = new braintree.MessageBus(this.root), this.rpcServer = new braintree.RPCServer(this.bus), this.apiProxyServer = new braintree.dropin.APIProxyServer(this.braintreeApiClient), this.apiProxyServer.attach(this.rpcServer), t = e.inlineFramePath || this.clientToken.assetsUrl + "/dropin/" + a + "/inline_frame.html", n = e.modalFramePath || this.clientToken.assetsUrl + "/dropin/" + a + "/modal_frame.html", i = document.documentElement, o = document.body, this.frames = {
                    inline: this._createFrame(t),
                    modal: this._createFrame(n)
                }, this.container = braintree.Utils.normalizeElement(e.container, "Unable to find valid container."), r = braintree.Utils.normalizeElement(e.form || this._findClosest(this.container, "form")), this.merchantFormManager = new braintree.dropin.MerchantFormManager({
                    form: r,
                    frames: this.frames,
                    onSubmit: this.paymentMethodNonceReceivedCallback,
                    apiClient: this.braintreeApiClient
                }).initialize(), this.clientToken.paypalEnabled && this._configurePayPal(), this.braintreeApiClient.sendAnalyticsEvents("dropin.web.initialized")
            }
            var i, o;
            r.prototype.initialize = function() {
                var e = this;
                this._initializeModal(), this.container.appendChild(this.frames.inline.element), o.appendChild(this.frames.modal.element), this.rpcServer.define("receiveSharedCustomerIdentifier", function(t) {
                    e.braintreeApiClient.attrs.sharedCustomerIdentifier = t, e.braintreeApiClient.attrs.sharedCustomerIdentifierType = "browser_session_cookie_store";
                    for (var n = 0; n < e.configurationRequests.length; n++) e.configurationRequests[n](e.encodedClientToken);
                    e.configurationRequests = []
                }), this.rpcServer.define("getConfiguration", function(t) {
                    t(e.encodedClientToken)
                }), this.rpcServer.define("getPayPalOptions", function(t) {
                    t(e.paypalOptions)
                }), this.rpcServer.define("selectPaymentMethod", function(t) {
                    e.frames.modal.rpcClient.invoke("selectPaymentMethod", [t]), e._showModal()
                }), this.rpcServer.define("sendAddedPaymentMethod", function(t) {
                    e.merchantFormManager.writeNonce(t.nonce), e.frames.inline.rpcClient.invoke("receiveNewPaymentMethod", [t])
                }), this.rpcServer.define("sendUsedPaymentMethod", function(t) {
                    e.frames.inline.rpcClient.invoke("selectPaymentMethod", [t])
                }), this.rpcServer.define("sendUnlockedNonce", function(t) {
                    e.merchantFormManager.writeNonce(t)
                }), this.rpcServer.define("clearNonce", function() {
                    e.merchantFormManager.writeNonce("")
                }), this.rpcServer.define("closeDropInModal", function() {
                    e._hideModal()
                }), this.rpcServer.define("setInlineFrameHeight", function(t) {
                    e.frames.inline.element.style.height = t + "px"
                }), this.bus.register("ready", function(t) {
                    t.source === e.frames.inline.element.contentWindow ? e.frames.inline.rpcClient = new braintree.RPCClient(e.bus, t.source) : t.source === e.frames.modal.element.contentWindow && (e.frames.modal.rpcClient = new braintree.RPCClient(e.bus, t.source))
                })
            }, r.prototype._createFrame = function(e) {
                return new braintree.dropin.FrameContainer(e)
            }, r.prototype._initializeModal = function() {
                this.frames.modal.element.style.display = "none", this.frames.modal.element.style.position = n() ? "absolute" : "fixed", this.frames.modal.element.style.top = "0", this.frames.modal.element.style.left = "0", this.frames.modal.element.style.height = "100%", this.frames.modal.element.style.width = "100%"
            }, r.prototype._lockMerchantWindowSize = function() {
                setTimeout(function() {
                    i.style.overflow = "hidden", o.style.overflow = "hidden", o.style.height = "100%", n() && (i.style.position = "relative", i.style.height = window.innerHeight + "px")
                }, 160)
            }, r.prototype._unlockMerchantWindowSize = function() {
                var e = this.merchantPageDefaultStyles;
                o.style.height = e.body.height, o.style.overflow = e.body.overflow, i.style.overflow = e.html.overflow, n() && (i.style.height = e.html.height, i.style.position = e.html.position)
            }, r.prototype._showModal = function() {
                var e = this,
                    n = this.frames.modal.element;
                this.merchantPageDefaultStyles = t(), n.style.display = "block", this.frames.modal.rpcClient.invoke("open", [], function() {
                    setTimeout(function() {
                        e._lockMerchantWindowSize(), n.contentWindow.focus()
                    }, 200)
                })
            }, r.prototype._hideModal = function() {
                this._unlockMerchantWindowSize(), this.frames.modal.element.style.display = "none"
            }, r.prototype._configurePayPal = function() {
                braintree.paypal.browser.isPopupSupported() || (this.ppClient = new braintree.dropin.PayPalService({
                    clientToken: this.clientToken,
                    paypal: this.paypalOptions
                }), this.rpcServer.define("openPayPalModal", braintree.Utils.bind(this.ppClient._openModal, this.ppClient))), this.rpcServer.define("receivePayPalData", braintree.Utils.bind(this._handlePayPalData, this))
            }, r.prototype._handlePayPalData = function(e, t) {
                this.merchantFormManager.writeNonce(e), this.frames.inline.rpcClient.invoke("receiveNewPaymentMethod", [{
                    nonce: e,
                    email: t
                }]), this.frames.modal.rpcClient.invoke("paypalViewClose")
            }, r.prototype._findClosest = function(e, t) {
                t = t.toUpperCase();
                do
                    if (e.nodeName === t) return e;
                while (e = e.parentNode);
                throw "Unable to find a valid " + t
            }, braintree.dropin.Client = r
        }(),
        function() {
            function e(e) {
                this.apiClient = e
            }
            var t = ["getCreditCards", "unlockCreditCard", "sendAnalyticsEvents"];
            e.prototype.attach = function(e) {
                function n(t) {
                    e.define(t, function() {
                        r.apiClient[t].apply(r.apiClient, arguments)
                    })
                }
                var r = this,
                    i = 0,
                    o = t.length;
                for (i; o > i; i++) n(t[i])
            }, braintree.dropin.APIProxyServer = e
        }(),
        function() {
            function e(e) {
                this.element = document.createElement("iframe"), this.element.setAttribute("allowtransparency", "true"), this.element.setAttribute("width", "100%"), this.element.setAttribute("height", "68"), this.element.setAttribute("style", "-webkit-transition: height 210ms cubic-bezier(0.390, 0.575, 0.565, 1.000); -moz-transition: height 210ms cubic-bezier(0.390, 0.575, 0.565, 1.000); -ms-transition: height 210ms cubic-bezier(0.390, 0.575, 0.565, 1.000); -o-transition: height 210ms cubic-bezier(0.390, 0.575, 0.565, 1.000); transition: height 210ms cubic-bezier(0.390, 0.575, 0.565, 1.000);"), this.element.src = e, this.element.setAttribute("frameborder", "0"), this.element.setAttribute("allowtransparency", "true"), this.element.style.border = "0", this.element.style.zIndex = "9999"
            }
            braintree.dropin.FrameContainer = e
        }(),
        function() {
            function e(e) {
                var t = e.clientToken,
                    n = e.paypal || {},
                    r = new braintree.paypal.Client(t, {
                        container: document.createElement("div"),
                        displayName: n.displayName,
                        locale: n.locale,
                        singleUse: n.singleUse,
                        onSuccess: n.onSuccess
                    });
                return r.initialize(), r
            }
            braintree.dropin.PayPalService = e
        }()
    }(this),
    function(e) {
        var t = e.braintree || {};
        t.setup = function(e, n, r) {
            if ("dropin" === n || "paypal" === n) t[n].create(e, r);
            else {
                if ("custom" !== n) throw new Error(n + " is an unsupported integration");
                var i = new t.api.Client({
                        clientToken: e
                    }),
                    o = t.Form.setup(i, r);
                r.paypal && (void 0 == r.paypal.paymentMethodNonceInputField && (r.paypal.paymentMethodNonceInputField = o.paymentMethodNonce), t.paypal.create(e, r.paypal))
            }
        }, t.cse = Braintree
    }(this);
var deviceIsAndroid = navigator.userAgent.indexOf("Android") > 0,
    deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent),
    deviceIsIOS4 = deviceIsIOS && /OS 4_\d(_\d)?/.test(navigator.userAgent),
    deviceIsIOSWithBadTarget = deviceIsIOS && /OS ([6-9]|\d{2})_\d/.test(navigator.userAgent);
FastClick.prototype.needsClick = function(e) {
        "use strict";
        switch (e.nodeName.toLowerCase()) {
            case "button":
            case "select":
            case "textarea":
                if (e.disabled) return !0;
                break;
            case "input":
                if (deviceIsIOS && "file" === e.type || e.disabled) return !0;
                break;
            case "label":
            case "video":
                return !0
        }
        return /\bneedsclick\b/.test(e.className)
    }, FastClick.prototype.needsFocus = function(e) {
        "use strict";
        switch (e.nodeName.toLowerCase()) {
            case "textarea":
                return !0;
            case "select":
                return !deviceIsAndroid;
            case "input":
                switch (e.type) {
                    case "button":
                    case "checkbox":
                    case "file":
                    case "image":
                    case "radio":
                    case "submit":
                        return !1
                }
                return !e.disabled && !e.readOnly;
            default:
                return /\bneedsfocus\b/.test(e.className)
        }
    }, FastClick.prototype.sendClick = function(e, t) {
        "use strict";
        var n, r;
        document.activeElement && document.activeElement !== e && document.activeElement.blur(), r = t.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, r.screenX, r.screenY, r.clientX, r.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, e.dispatchEvent(n)
    }, FastClick.prototype.determineEventType = function(e) {
        "use strict";
        return deviceIsAndroid && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
    }, FastClick.prototype.focus = function(e) {
        "use strict";
        var t;
        deviceIsIOS && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
    }, FastClick.prototype.updateScrollParent = function(e) {
        "use strict";
        var t, n;
        if (t = e.fastClickScrollParent, !t || !t.contains(e)) {
            n = e;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    t = n, e.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        t && (t.fastClickLastScrollTop = t.scrollTop)
    }, FastClick.prototype.getTargetElementFromEventTarget = function(e) {
        "use strict";
        return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
    }, FastClick.prototype.onTouchStart = function(e) {
        "use strict";
        var t, n, r;
        if (e.targetTouches.length > 1) return !0;
        if (t = this.getTargetElementFromEventTarget(e.target), n = e.targetTouches[0], deviceIsIOS) {
            if (r = window.getSelection(), r.rangeCount && !r.isCollapsed) return !0;
            if (!deviceIsIOS4) {
                if (n.identifier === this.lastTouchIdentifier) return e.preventDefault(), !1;
                this.lastTouchIdentifier = n.identifier, this.updateScrollParent(t)
            }
        }
        return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = n.pageX, this.touchStartY = n.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
    }, FastClick.prototype.touchHasMoved = function(e) {
        "use strict";
        var t = e.changedTouches[0],
            n = this.touchBoundary;
        return Math.abs(t.pageX - this.touchStartX) > n || Math.abs(t.pageY - this.touchStartY) > n ? !0 : !1
    }, FastClick.prototype.onTouchMove = function(e) {
        "use strict";
        return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
    }, FastClick.prototype.findControl = function(e) {
        "use strict";
        return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }, FastClick.prototype.onTouchEnd = function(e) {
        "use strict";
        var t, n, r, i, o, a = this.targetElement;
        if (!this.trackingClick) return !0;
        if (e.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
        if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, n = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, deviceIsIOSWithBadTarget && (o = e.changedTouches[0], a = document.elementFromPoint(o.pageX - window.pageXOffset, o.pageY - window.pageYOffset) || a, a.fastClickScrollParent = this.targetElement.fastClickScrollParent), r = a.tagName.toLowerCase(), "label" === r) {
            if (t = this.findControl(a)) {
                if (this.focus(a), deviceIsAndroid) return !1;
                a = t
            }
        } else if (this.needsFocus(a)) return e.timeStamp - n > 100 || deviceIsIOS && window.top !== window && "input" === r ? (this.targetElement = null, !1) : (this.focus(a), this.sendClick(a, e), deviceIsIOS && "select" === r || (this.targetElement = null, e.preventDefault()), !1);
        return deviceIsIOS && !deviceIsIOS4 && (i = a.fastClickScrollParent, i && i.fastClickLastScrollTop !== i.scrollTop) ? !0 : (this.needsClick(a) || (e.preventDefault(), this.sendClick(a, e)), !1)
    }, FastClick.prototype.onTouchCancel = function() {
        "use strict";
        this.trackingClick = !1, this.targetElement = null
    }, FastClick.prototype.onMouse = function(e) {
        "use strict";
        return this.targetElement ? e.forwardedTouchEvent ? !0 : e.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1) : !0 : !0
    }, FastClick.prototype.onClick = function(e) {
        "use strict";
        var t;
        return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === e.target.type && 0 === e.detail ? !0 : (t = this.onMouse(e), t || (this.targetElement = null), t)
    }, FastClick.prototype.destroy = function() {
        "use strict";
        var e = this.layer;
        deviceIsAndroid && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }, FastClick.notNeeded = function(e) {
        "use strict";
        var t, n;
        if ("undefined" == typeof window.ontouchstart) return !0;
        if (n = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!deviceIsAndroid) return !0;
            if (t = document.querySelector("meta[name=viewport]")) {
                if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
                if (n > 31 && window.innerWidth <= window.screen.width) return !0
            }
        }
        return "none" === e.style.msTouchAction ? !0 : !1
    }, FastClick.attach = function(e, t) {
        "use strict";
        return new FastClick(e, t)
    }, "undefined" != typeof define && define.amd ? define(function() {
        "use strict";
        return FastClick
    }) : "undefined" != typeof module && module.exports ? (module.exports = FastClick.attach, module.exports.FastClick = FastClick) : window.FastClick = FastClick,
    function() {
        var e, t, n, r, i, o, a, s, c, l, u, f, d, h, p = [].indexOf || function(e) {
            for (var t = 0, n = this.length; n > t; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        c = "[ ]", t = "[x]", s = function(e) {
            return e.replace(/([\[\]])/g, "\\$1").replace(/\s/, "\\s").replace("x", "[xX]")
        }, l = RegExp("" + s(c)), n = RegExp("" + s(t)), u = RegExp("^(?:\\s*(?:>\\s*)*(?:[-+*]|(?:\\d+\\.)))\\s*(" + s(t) + "|" + s(c) + ")\\s+(?!\\(.*?\\))(?=(?:\\[.*?\\]\\s*(?:\\[.*?\\]|\\(.*?\\))\\s*)*(?:[^\\[]|$))"), e = /^`{3}(?:\s*\w+)?[\S\s].*[\S\s]^`{3}$/gm, f = RegExp("^(" + s(t) + "|" + s(c) + ").+$", "g"), h = function(r, i, o) {
            var a, s, d, h;
            return a = r.replace(/\r/g, "").replace(e, "").replace(f, "").split("\n"), s = 0, h = function() {
                var e, f, h, m;
                for (h = r.split("\n"), m = [], e = 0, f = h.length; f > e; e++) d = h[e], p.call(a, d) >= 0 && d.match(u) && (s += 1, s === i && (d = o ? d.replace(l, t) : d.replace(n, c))), m.push(d);
                return m
            }(), h.join("\n")
        }, d = function(e) {
            var t, n, r, i, o;
            return t = e.closest(".js-task-list-container"), n = t.find(".js-task-list-field"), o = 1 + t.find(".task-list-item-checkbox").index(e), r = e.prop("checked"), i = $.Event("tasklist:change"), n.trigger(i, [o, r]), i.isDefaultPrevented() ? void 0 : (n.val(h(n.val(), o, r)), n.trigger("change"), n.trigger("tasklist:changed", [o, r]))
        }, $(document).on("change", ".task-list-item-checkbox", function() {
            return d($(this))
        }), o = function(e) {
            return e.find(".js-task-list-field").length > 0 ? (e.find(".task-list-item").addClass("enabled").find(".task-list-item-checkbox").attr("disabled", null), e.addClass("is-task-list-enabled").trigger("tasklist:enabled")) : void 0
        }, a = function(e) {
            var t, n, r, i;
            for (i = [], n = 0, r = e.length; r > n; n++) t = e[n], i.push(o($(t)));
            return i
        }, r = function(e) {
            return e.find(".task-list-item").removeClass("enabled").find(".task-list-item-checkbox").attr("disabled", "disabled"), e.removeClass("is-task-list-enabled").trigger("tasklist:disabled")
        }, i = function(e) {
            var t, n, i, o;
            for (o = [], n = 0, i = e.length; i > n; n++) t = e[n], o.push(r($(t)));
            return o
        }, $.fn.taskList = function(e) {
            var t, n;
            return t = $(this).closest(".js-task-list-container"), n = {
                enable: a,
                disable: i
            }, n[e || "enable"](t)
        }
    }.call(this),
    /*!
     * ZeroClipboard
     * The ZeroClipboard library provides an easy way to copy text to the clipboard using an invisible Adobe Flash movie and a JavaScript interface.
     * Copyright (c) 2014 Jon Rohan, James M. Greene
     * Licensed MIT
     * http://zeroclipboard.org/
     * v2.1.6
     */
    function(e, t) {
        "use strict";
        var n, r, i = e,
            o = i.document,
            a = i.navigator,
            s = i.setTimeout,
            c = i.encodeURIComponent,
            l = i.ActiveXObject,
            u = i.Error,
            f = i.Number.parseInt || i.parseInt,
            d = i.Number.parseFloat || i.parseFloat,
            h = i.Number.isNaN || i.isNaN,
            p = i.Math.round,
            m = i.Date.now,
            v = i.Object.keys,
            g = i.Object.defineProperty,
            y = i.Object.prototype.hasOwnProperty,
            b = i.Array.prototype.slice,
            w = function() {
                var e = function(e) {
                    return e
                };
                if ("function" == typeof i.wrap && "function" == typeof i.unwrap) try {
                    var t = o.createElement("div"),
                        n = i.unwrap(t);
                    1 === t.nodeType && n && 1 === n.nodeType && (e = i.unwrap)
                } catch (r) {}
                return e
            }(),
            x = function(e) {
                return b.call(e, 0)
            },
            T = function() {
                var e, n, r, i, o, a, s = x(arguments),
                    c = s[0] || {};
                for (e = 1, n = s.length; n > e; e++)
                    if (null != (r = s[e]))
                        for (i in r) y.call(r, i) && (o = c[i], a = r[i], c !== a && a !== t && (c[i] = a));
                return c
            },
            E = function(e) {
                var t, n, r, i;
                if ("object" != typeof e || null == e) t = e;
                else if ("number" == typeof e.length)
                    for (t = [], n = 0, r = e.length; r > n; n++) y.call(e, n) && (t[n] = E(e[n]));
                else {
                    t = {};
                    for (i in e) y.call(e, i) && (t[i] = E(e[i]))
                }
                return t
            },
            _ = function(e, t) {
                for (var n = {}, r = 0, i = t.length; i > r; r++) t[r] in e && (n[t[r]] = e[t[r]]);
                return n
            },
            C = function(e, t) {
                var n = {};
                for (var r in e) - 1 === t.indexOf(r) && (n[r] = e[r]);
                return n
            },
            k = function(e) {
                if (e)
                    for (var t in e) y.call(e, t) && delete e[t];
                return e
            },
            S = function(e, t) {
                if (e && 1 === e.nodeType && e.ownerDocument && t && (1 === t.nodeType && t.ownerDocument && t.ownerDocument === e.ownerDocument || 9 === t.nodeType && !t.ownerDocument && t === e.ownerDocument))
                    do {
                        if (e === t) return !0;
                        e = e.parentNode
                    } while (e);
                return !1
            },
            N = function(e) {
                var t;
                return "string" == typeof e && e && (t = e.split("#")[0].split("?")[0], t = e.slice(0, e.lastIndexOf("/") + 1)), t
            },
            A = function(e) {
                var t, n;
                return "string" == typeof e && e && (n = e.match(/^(?:|[^:@]*@|.+\)@(?=http[s]?|file)|.+?\s+(?: at |@)(?:[^:\(]+ )*[\(]?)((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/), n && n[1] ? t = n[1] : (n = e.match(/\)@((?:http[s]?|file):\/\/[\/]?.+?\/[^:\)]*?)(?::\d+)(?::\d+)?/), n && n[1] && (t = n[1]))), t
            },
            D = function() {
                var e, t;
                try {
                    throw new u
                } catch (n) {
                    t = n
                }
                return t && (e = t.sourceURL || t.fileName || A(t.stack)), e
            },
            j = function() {
                var e, n, r;
                if (o.currentScript && (e = o.currentScript.src)) return e;
                if (n = o.getElementsByTagName("script"), 1 === n.length) return n[0].src || t;
                if ("readyState" in n[0])
                    for (r = n.length; r--;)
                        if ("interactive" === n[r].readyState && (e = n[r].src)) return e;
                return "loading" === o.readyState && (e = n[n.length - 1].src) ? e : (e = D()) ? e : t
            },
            P = function() {
                var e, n, r, i = o.getElementsByTagName("script");
                for (e = i.length; e--;) {
                    if (!(r = i[e].src)) {
                        n = null;
                        break
                    }
                    if (r = N(r), null == n) n = r;
                    else if (n !== r) {
                        n = null;
                        break
                    }
                }
                return n || t
            },
            $ = function() {
                var e = N(j()) || P() || "";
                return e + "ZeroClipboard.swf"
            },
            L = {
                bridge: null,
                version: "0.0.0",
                pluginType: "unknown",
                disabled: null,
                outdated: null,
                unavailable: null,
                deactivated: null,
                overdue: null,
                ready: null
            },
            O = "11.0.0",
            M = {},
            I = {},
            F = null,
            R = {
                ready: "Flash communication is established",
                error: {
                    "flash-disabled": "Flash is disabled or not installed",
                    "flash-outdated": "Flash is too outdated to support ZeroClipboard",
                    "flash-unavailable": "Flash is unable to communicate bidirectionally with JavaScript",
                    "flash-deactivated": "Flash is too outdated for your browser and/or is configured as click-to-activate",
                    "flash-overdue": "Flash communication was established but NOT within the acceptable time limit"
                }
            },
            U = {
                swfPath: $(),
                trustedDomains: e.location.host ? [e.location.host] : [],
                cacheBust: !0,
                forceEnhancedClipboard: !1,
                flashLoadTimeout: 3e4,
                autoActivate: !0,
                bubbleEvents: !0,
                containerId: "global-zeroclipboard-html-bridge",
                containerClass: "global-zeroclipboard-container",
                swfObjectId: "global-zeroclipboard-flash-bridge",
                hoverClass: "zeroclipboard-is-hover",
                activeClass: "zeroclipboard-is-active",
                forceHandCursor: !1,
                title: null,
                zIndex: 999999999
            },
            H = function(e) {
                if ("object" == typeof e && null !== e)
                    for (var t in e)
                        if (y.call(e, t))
                            if (/^(?:forceHandCursor|title|zIndex|bubbleEvents)$/.test(t)) U[t] = e[t];
                            else if (null == L.bridge)
                    if ("containerId" === t || "swfObjectId" === t) {
                        if (!nt(e[t])) throw new Error("The specified `" + t + "` value is not valid as an HTML4 Element ID");
                        U[t] = e[t]
                    } else U[t] = e[t]; {
                        if ("string" != typeof e || !e) return E(U);
                        if (y.call(U, e)) return U[e]
                    }
            },
            z = function() {
                return {
                    browser: _(a, ["userAgent", "platform", "appName"]),
                    flash: C(L, ["bridge"]),
                    zeroclipboard: {
                        version: jt.version,
                        config: jt.config()
                    }
                }
            },
            q = function() {
                return !!(L.disabled || L.outdated || L.unavailable || L.deactivated)
            },
            B = function(e, t) {
                var n, r, i, o = {};
                if ("string" == typeof e && e) i = e.toLowerCase().split(/\s+/);
                else if ("object" == typeof e && e && "undefined" == typeof t)
                    for (n in e) y.call(e, n) && "string" == typeof n && n && "function" == typeof e[n] && jt.on(n, e[n]);
                if (i && i.length) {
                    for (n = 0, r = i.length; r > n; n++) e = i[n].replace(/^on/, ""), o[e] = !0, M[e] || (M[e] = []), M[e].push(t);
                    if (o.ready && L.ready && jt.emit({
                            type: "ready"
                        }), o.error) {
                        var a = ["disabled", "outdated", "unavailable", "deactivated", "overdue"];
                        for (n = 0, r = a.length; r > n; n++)
                            if (L[a[n]] === !0) {
                                jt.emit({
                                    type: "error",
                                    name: "flash-" + a[n]
                                });
                                break
                            }
                    }
                }
                return jt
            },
            W = function(e, t) {
                var n, r, i, o, a;
                if (0 === arguments.length) o = v(M);
                else if ("string" == typeof e && e) o = e.split(/\s+/);
                else if ("object" == typeof e && e && "undefined" == typeof t)
                    for (n in e) y.call(e, n) && "string" == typeof n && n && "function" == typeof e[n] && jt.off(n, e[n]);
                if (o && o.length)
                    for (n = 0, r = o.length; r > n; n++)
                        if (e = o[n].toLowerCase().replace(/^on/, ""), a = M[e], a && a.length)
                            if (t)
                                for (i = a.indexOf(t); - 1 !== i;) a.splice(i, 1), i = a.indexOf(t, i);
                            else a.length = 0;
                return jt
            },
            V = function(e) {
                var t;
                return t = "string" == typeof e && e ? E(M[e]) || null : E(M)
            },
            X = function(e) {
                var t, n, r;
                return e = rt(e), e && !lt(e) ? "ready" === e.type && L.overdue === !0 ? jt.emit({
                    type: "error",
                    name: "flash-overdue"
                }) : (t = T({}, e), ct.call(this, t), "copy" === e.type && (r = mt(I), n = r.data, F = r.formatMap), n) : void 0
            },
            Y = function() {
                if ("boolean" != typeof L.ready && (L.ready = !1), !jt.isFlashUnusable() && null === L.bridge) {
                    var e = U.flashLoadTimeout;
                    "number" == typeof e && e >= 0 && s(function() {
                        "boolean" != typeof L.deactivated && (L.deactivated = !0), L.deactivated === !0 && jt.emit({
                            type: "error",
                            name: "flash-deactivated"
                        })
                    }, e), L.overdue = !1, ht()
                }
            },
            G = function() {
                jt.clearData(), jt.blur(), jt.emit("destroy"), pt(), jt.off()
            },
            K = function(e, t) {
                var n;
                if ("object" == typeof e && e && "undefined" == typeof t) n = e, jt.clearData();
                else {
                    if ("string" != typeof e || !e) return;
                    n = {}, n[e] = t
                }
                for (var r in n) "string" == typeof r && r && y.call(n, r) && "string" == typeof n[r] && n[r] && (I[r] = n[r])
            },
            J = function(e) {
                "undefined" == typeof e ? (k(I), F = null) : "string" == typeof e && y.call(I, e) && delete I[e]
            },
            Q = function(e) {
                return "undefined" == typeof e ? E(I) : "string" == typeof e && y.call(I, e) ? I[e] : void 0
            },
            Z = function(e) {
                if (e && 1 === e.nodeType) {
                    n && (Et(n, U.activeClass), n !== e && Et(n, U.hoverClass)), n = e, Tt(e, U.hoverClass);
                    var t = e.getAttribute("title") || U.title;
                    if ("string" == typeof t && t) {
                        var r = dt(L.bridge);
                        r && r.setAttribute("title", t)
                    }
                    var i = U.forceHandCursor === !0 || "pointer" === _t(e, "cursor");
                    Nt(i), St()
                }
            },
            et = function() {
                var e = dt(L.bridge);
                e && (e.removeAttribute("title"), e.style.left = "0px", e.style.top = "-9999px", e.style.width = "1px", e.style.top = "1px"), n && (Et(n, U.hoverClass), Et(n, U.activeClass), n = null)
            },
            tt = function() {
                return n || null
            },
            nt = function(e) {
                return "string" == typeof e && e && /^[A-Za-z][A-Za-z0-9_:\-\.]*$/.test(e)
            },
            rt = function(e) {
                var t;
                if ("string" == typeof e && e ? (t = e, e = {}) : "object" == typeof e && e && "string" == typeof e.type && e.type && (t = e.type), t) {
                    !e.target && /^(copy|aftercopy|_click)$/.test(t.toLowerCase()) && (e.target = r), T(e, {
                        type: t.toLowerCase(),
                        target: e.target || n || null,
                        relatedTarget: e.relatedTarget || null,
                        currentTarget: L && L.bridge || null,
                        timeStamp: e.timeStamp || m() || null
                    });
                    var i = R[e.type];
                    return "error" === e.type && e.name && i && (i = i[e.name]), i && (e.message = i), "ready" === e.type && T(e, {
                        target: null,
                        version: L.version
                    }), "error" === e.type && (/^flash-(disabled|outdated|unavailable|deactivated|overdue)$/.test(e.name) && T(e, {
                        target: null,
                        minimumVersion: O
                    }), /^flash-(outdated|unavailable|deactivated|overdue)$/.test(e.name) && T(e, {
                        version: L.version
                    })), "copy" === e.type && (e.clipboardData = {
                        setData: jt.setData,
                        clearData: jt.clearData
                    }), "aftercopy" === e.type && (e = vt(e, F)), e.target && !e.relatedTarget && (e.relatedTarget = it(e.target)), e = ot(e)
                }
            },
            it = function(e) {
                var t = e && e.getAttribute && e.getAttribute("data-clipboard-target");
                return t ? o.getElementById(t) : null
            },
            ot = function(e) {
                if (e && /^_(?:click|mouse(?:over|out|down|up|move))$/.test(e.type)) {
                    var n = e.target,
                        r = "_mouseover" === e.type && e.relatedTarget ? e.relatedTarget : t,
                        a = "_mouseout" === e.type && e.relatedTarget ? e.relatedTarget : t,
                        s = kt(n),
                        c = i.screenLeft || i.screenX || 0,
                        l = i.screenTop || i.screenY || 0,
                        u = o.body.scrollLeft + o.documentElement.scrollLeft,
                        f = o.body.scrollTop + o.documentElement.scrollTop,
                        d = s.left + ("number" == typeof e._stageX ? e._stageX : 0),
                        h = s.top + ("number" == typeof e._stageY ? e._stageY : 0),
                        p = d - u,
                        m = h - f,
                        v = c + p,
                        g = l + m,
                        y = "number" == typeof e.movementX ? e.movementX : 0,
                        b = "number" == typeof e.movementY ? e.movementY : 0;
                    delete e._stageX, delete e._stageY, T(e, {
                        srcElement: n,
                        fromElement: r,
                        toElement: a,
                        screenX: v,
                        screenY: g,
                        pageX: d,
                        pageY: h,
                        clientX: p,
                        clientY: m,
                        x: p,
                        y: m,
                        movementX: y,
                        movementY: b,
                        offsetX: 0,
                        offsetY: 0,
                        layerX: 0,
                        layerY: 0
                    })
                }
                return e
            },
            at = function(e) {
                var t = e && "string" == typeof e.type && e.type || "";
                return !/^(?:(?:before)?copy|destroy)$/.test(t)
            },
            st = function(e, t, n, r) {
                r ? s(function() {
                    e.apply(t, n)
                }, 0) : e.apply(t, n)
            },
            ct = function(e) {
                if ("object" == typeof e && e && e.type) {
                    var t = at(e),
                        n = M["*"] || [],
                        r = M[e.type] || [],
                        o = n.concat(r);
                    if (o && o.length) {
                        var a, s, c, l, u, f = this;
                        for (a = 0, s = o.length; s > a; a++) c = o[a], l = f, "string" == typeof c && "function" == typeof i[c] && (c = i[c]), "object" == typeof c && c && "function" == typeof c.handleEvent && (l = c, c = c.handleEvent), "function" == typeof c && (u = T({}, e), st(c, l, [u], t))
                    }
                    return this
                }
            },
            lt = function(e) {
                var t = e.target || n || null,
                    i = "swf" === e._source;
                delete e._source;
                var o = ["flash-disabled", "flash-outdated", "flash-unavailable", "flash-deactivated", "flash-overdue"];
                switch (e.type) {
                    case "error":
                        -1 !== o.indexOf(e.name) && T(L, {
                            disabled: "flash-disabled" === e.name,
                            outdated: "flash-outdated" === e.name,
                            unavailable: "flash-unavailable" === e.name,
                            deactivated: "flash-deactivated" === e.name,
                            overdue: "flash-overdue" === e.name,
                            ready: !1
                        });
                        break;
                    case "ready":
                        var a = L.deactivated === !0;
                        T(L, {
                            disabled: !1,
                            outdated: !1,
                            unavailable: !1,
                            deactivated: !1,
                            overdue: a,
                            ready: !a
                        });
                        break;
                    case "beforecopy":
                        r = t;
                        break;
                    case "copy":
                        var s, c, l = e.relatedTarget;
                        !I["text/html"] && !I["text/plain"] && l && (c = l.value || l.outerHTML || l.innerHTML) && (s = l.value || l.textContent || l.innerText) ? (e.clipboardData.clearData(), e.clipboardData.setData("text/plain", s), c !== s && e.clipboardData.setData("text/html", c)) : !I["text/plain"] && e.target && (s = e.target.getAttribute("data-clipboard-text")) && (e.clipboardData.clearData(), e.clipboardData.setData("text/plain", s));
                        break;
                    case "aftercopy":
                        jt.clearData(), t && t !== xt() && t.focus && t.focus();
                        break;
                    case "_mouseover":
                        jt.focus(t), U.bubbleEvents === !0 && i && (t && t !== e.relatedTarget && !S(e.relatedTarget, t) && ut(T({}, e, {
                            type: "mouseenter",
                            bubbles: !1,
                            cancelable: !1
                        })), ut(T({}, e, {
                            type: "mouseover"
                        })));
                        break;
                    case "_mouseout":
                        jt.blur(), U.bubbleEvents === !0 && i && (t && t !== e.relatedTarget && !S(e.relatedTarget, t) && ut(T({}, e, {
                            type: "mouseleave",
                            bubbles: !1,
                            cancelable: !1
                        })), ut(T({}, e, {
                            type: "mouseout"
                        })));
                        break;
                    case "_mousedown":
                        Tt(t, U.activeClass), U.bubbleEvents === !0 && i && ut(T({}, e, {
                            type: e.type.slice(1)
                        }));
                        break;
                    case "_mouseup":
                        Et(t, U.activeClass), U.bubbleEvents === !0 && i && ut(T({}, e, {
                            type: e.type.slice(1)
                        }));
                        break;
                    case "_click":
                        r = null, U.bubbleEvents === !0 && i && ut(T({}, e, {
                            type: e.type.slice(1)
                        }));
                        break;
                    case "_mousemove":
                        U.bubbleEvents === !0 && i && ut(T({}, e, {
                            type: e.type.slice(1)
                        }))
                }
                return /^_(?:click|mouse(?:over|out|down|up|move))$/.test(e.type) ? !0 : void 0
            },
            ut = function(e) {
                if (e && "string" == typeof e.type && e) {
                    var t, n = e.target || null,
                        r = n && n.ownerDocument || o,
                        a = {
                            view: r.defaultView || i,
                            canBubble: !0,
                            cancelable: !0,
                            detail: "click" === e.type ? 1 : 0,
                            button: "number" == typeof e.which ? e.which - 1 : "number" == typeof e.button ? e.button : r.createEvent ? 0 : 1
                        },
                        s = T(a, e);
                    n && r.createEvent && n.dispatchEvent && (s = [s.type, s.canBubble, s.cancelable, s.view, s.detail, s.screenX, s.screenY, s.clientX, s.clientY, s.ctrlKey, s.altKey, s.shiftKey, s.metaKey, s.button, s.relatedTarget], t = r.createEvent("MouseEvents"), t.initMouseEvent && (t.initMouseEvent.apply(t, s), t._source = "js", n.dispatchEvent(t)))
                }
            },
            ft = function() {
                var e = o.createElement("div");
                return e.id = U.containerId, e.className = U.containerClass, e.style.position = "absolute", e.style.left = "0px", e.style.top = "-9999px", e.style.width = "1px", e.style.height = "1px", e.style.zIndex = "" + At(U.zIndex), e
            },
            dt = function(e) {
                for (var t = e && e.parentNode; t && "OBJECT" === t.nodeName && t.parentNode;) t = t.parentNode;
                return t || null
            },
            ht = function() {
                var e, t = L.bridge,
                    n = dt(t);
                if (!t) {
                    var r = wt(i.location.host, U),
                        a = "never" === r ? "none" : "all",
                        s = yt(U),
                        c = U.swfPath + gt(U.swfPath, U);
                    n = ft();
                    var l = o.createElement("div");
                    n.appendChild(l), o.body.appendChild(n);
                    var u = o.createElement("div"),
                        f = "activex" === L.pluginType;
                    u.innerHTML = '<object id="' + U.swfObjectId + '" name="' + U.swfObjectId + '" width="100%" height="100%" ' + (f ? 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"' : 'type="application/x-shockwave-flash" data="' + c + '"') + ">" + (f ? '<param name="movie" value="' + c + '"/>' : "") + '<param name="allowScriptAccess" value="' + r + '"/><param name="allowNetworking" value="' + a + '"/><param name="menu" value="false"/><param name="wmode" value="transparent"/><param name="flashvars" value="' + s + '"/></object>', t = u.firstChild, u = null, w(t).ZeroClipboard = jt, n.replaceChild(t, l)
                }
                return t || (t = o[U.swfObjectId], t && (e = t.length) && (t = t[e - 1]), !t && n && (t = n.firstChild)), L.bridge = t || null, t
            },
            pt = function() {
                var e = L.bridge;
                if (e) {
                    var t = dt(e);
                    t && ("activex" === L.pluginType && "readyState" in e ? (e.style.display = "none", function n() {
                        if (4 === e.readyState) {
                            for (var r in e) "function" == typeof e[r] && (e[r] = null);
                            e.parentNode && e.parentNode.removeChild(e), t.parentNode && t.parentNode.removeChild(t)
                        } else s(n, 10)
                    }()) : (e.parentNode && e.parentNode.removeChild(e), t.parentNode && t.parentNode.removeChild(t))), L.ready = null, L.bridge = null, L.deactivated = null
                }
            },
            mt = function(e) {
                var t = {},
                    n = {};
                if ("object" == typeof e && e) {
                    for (var r in e)
                        if (r && y.call(e, r) && "string" == typeof e[r] && e[r]) switch (r.toLowerCase()) {
                            case "text/plain":
                            case "text":
                            case "air:text":
                            case "flash:text":
                                t.text = e[r], n.text = r;
                                break;
                            case "text/html":
                            case "html":
                            case "air:html":
                            case "flash:html":
                                t.html = e[r], n.html = r;
                                break;
                            case "application/rtf":
                            case "text/rtf":
                            case "rtf":
                            case "richtext":
                            case "air:rtf":
                            case "flash:rtf":
                                t.rtf = e[r], n.rtf = r
                        }
                        return {
                            data: t,
                            formatMap: n
                        }
                }
            },
            vt = function(e, t) {
                if ("object" != typeof e || !e || "object" != typeof t || !t) return e;
                var n = {};
                for (var r in e)
                    if (y.call(e, r)) {
                        if ("success" !== r && "data" !== r) {
                            n[r] = e[r];
                            continue
                        }
                        n[r] = {};
                        var i = e[r];
                        for (var o in i) o && y.call(i, o) && y.call(t, o) && (n[r][t[o]] = i[o])
                    }
                return n
            },
            gt = function(e, t) {
                var n = null == t || t && t.cacheBust === !0;
                return n ? (-1 === e.indexOf("?") ? "?" : "&") + "noCache=" + m() : ""
            },
            yt = function(e) {
                var t, n, r, o, a = "",
                    s = [];
                if (e.trustedDomains && ("string" == typeof e.trustedDomains ? o = [e.trustedDomains] : "object" == typeof e.trustedDomains && "length" in e.trustedDomains && (o = e.trustedDomains)), o && o.length)
                    for (t = 0, n = o.length; n > t; t++)
                        if (y.call(o, t) && o[t] && "string" == typeof o[t]) {
                            if (r = bt(o[t]), !r) continue;
                            if ("*" === r) {
                                s.length = 0, s.push(r);
                                break
                            }
                            s.push.apply(s, [r, "//" + r, i.location.protocol + "//" + r])
                        }
                return s.length && (a += "trustedOrigins=" + c(s.join(","))), e.forceEnhancedClipboard === !0 && (a += (a ? "&" : "") + "forceEnhancedClipboard=true"), "string" == typeof e.swfObjectId && e.swfObjectId && (a += (a ? "&" : "") + "swfObjectId=" + c(e.swfObjectId)), a
            },
            bt = function(e) {
                if (null == e || "" === e) return null;
                if (e = e.replace(/^\s+|\s+$/g, ""), "" === e) return null;
                var t = e.indexOf("//");
                e = -1 === t ? e : e.slice(t + 2);
                var n = e.indexOf("/");
                return e = -1 === n ? e : -1 === t || 0 === n ? null : e.slice(0, n), e && ".swf" === e.slice(-4).toLowerCase() ? null : e || null
            },
            wt = function() {
                var e = function(e) {
                    var t, n, r, i = [];
                    if ("string" == typeof e && (e = [e]), "object" != typeof e || !e || "number" != typeof e.length) return i;
                    for (t = 0, n = e.length; n > t; t++)
                        if (y.call(e, t) && (r = bt(e[t]))) {
                            if ("*" === r) {
                                i.length = 0, i.push("*");
                                break
                            } - 1 === i.indexOf(r) && i.push(r)
                        }
                    return i
                };
                return function(t, n) {
                    var r = bt(n.swfPath);
                    null === r && (r = t);
                    var i = e(n.trustedDomains),
                        o = i.length;
                    if (o > 0) {
                        if (1 === o && "*" === i[0]) return "always";
                        if (-1 !== i.indexOf(t)) return 1 === o && t === r ? "sameDomain" : "always"
                    }
                    return "never"
                }
            }(),
            xt = function() {
                try {
                    return o.activeElement
                } catch (e) {
                    return null
                }
            },
            Tt = function(e, t) {
                if (!e || 1 !== e.nodeType) return e;
                if (e.classList) return e.classList.contains(t) || e.classList.add(t), e;
                if (t && "string" == typeof t) {
                    var n = (t || "").split(/\s+/);
                    if (1 === e.nodeType)
                        if (e.className) {
                            for (var r = " " + e.className + " ", i = e.className, o = 0, a = n.length; a > o; o++) r.indexOf(" " + n[o] + " ") < 0 && (i += " " + n[o]);
                            e.className = i.replace(/^\s+|\s+$/g, "")
                        } else e.className = t
                }
                return e
            },
            Et = function(e, t) {
                if (!e || 1 !== e.nodeType) return e;
                if (e.classList) return e.classList.contains(t) && e.classList.remove(t), e;
                if ("string" == typeof t && t) {
                    var n = t.split(/\s+/);
                    if (1 === e.nodeType && e.className) {
                        for (var r = (" " + e.className + " ").replace(/[\n\t]/g, " "), i = 0, o = n.length; o > i; i++) r = r.replace(" " + n[i] + " ", " ");
                        e.className = r.replace(/^\s+|\s+$/g, "")
                    }
                }
                return e
            },
            _t = function(e, t) {
                var n = i.getComputedStyle(e, null).getPropertyValue(t);
                return "cursor" !== t || n && "auto" !== n || "A" !== e.nodeName ? n : "pointer"
            },
            Ct = function() {
                var e, t, n, r = 1;
                return "function" == typeof o.body.getBoundingClientRect && (e = o.body.getBoundingClientRect(), t = e.right - e.left, n = o.body.offsetWidth, r = p(t / n * 100) / 100), r
            },
            kt = function(e) {
                var t = {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                };
                if (e.getBoundingClientRect) {
                    var n, r, a, s = e.getBoundingClientRect();
                    "pageXOffset" in i && "pageYOffset" in i ? (n = i.pageXOffset, r = i.pageYOffset) : (a = Ct(), n = p(o.documentElement.scrollLeft / a), r = p(o.documentElement.scrollTop / a));
                    var c = o.documentElement.clientLeft || 0,
                        l = o.documentElement.clientTop || 0;
                    t.left = s.left + n - c, t.top = s.top + r - l, t.width = "width" in s ? s.width : s.right - s.left, t.height = "height" in s ? s.height : s.bottom - s.top
                }
                return t
            },
            St = function() {
                var e;
                if (n && (e = dt(L.bridge))) {
                    var t = kt(n);
                    T(e.style, {
                        width: t.width + "px",
                        height: t.height + "px",
                        top: t.top + "px",
                        left: t.left + "px",
                        zIndex: "" + At(U.zIndex)
                    })
                }
            },
            Nt = function(e) {
                L.ready === !0 && (L.bridge && "function" == typeof L.bridge.setHandCursor ? L.bridge.setHandCursor(e) : L.ready = !1)
            },
            At = function(e) {
                if (/^(?:auto|inherit)$/.test(e)) return e;
                var t;
                return "number" != typeof e || h(e) ? "string" == typeof e && (t = At(f(e, 10))) : t = e, "number" == typeof t ? t : "auto"
            },
            Dt = function(e) {
                function t(e) {
                    var t = e.match(/[\d]+/g);
                    return t.length = 3, t.join(".")
                }

                function n(e) {
                    return !!e && (e = e.toLowerCase()) && (/^(pepflashplayer\.dll|libpepflashplayer\.so|pepperflashplayer\.plugin)$/.test(e) || "chrome.plugin" === e.slice(-13))
                }

                function r(e) {
                    e && (c = !0, e.version && (f = t(e.version)), !f && e.description && (f = t(e.description)), e.filename && (u = n(e.filename)))
                }
                var i, o, s, c = !1,
                    l = !1,
                    u = !1,
                    f = "";
                if (a.plugins && a.plugins.length) i = a.plugins["Shockwave Flash"], r(i), a.plugins["Shockwave Flash 2.0"] && (c = !0, f = "2.0.0.11");
                else if (a.mimeTypes && a.mimeTypes.length) s = a.mimeTypes["application/x-shockwave-flash"], i = s && s.enabledPlugin, r(i);
                else if ("undefined" != typeof e) {
                    l = !0;
                    try {
                        o = new e("ShockwaveFlash.ShockwaveFlash.7"), c = !0, f = t(o.GetVariable("$version"))
                    } catch (h) {
                        try {
                            o = new e("ShockwaveFlash.ShockwaveFlash.6"), c = !0, f = "6.0.21"
                        } catch (p) {
                            try {
                                o = new e("ShockwaveFlash.ShockwaveFlash"), c = !0, f = t(o.GetVariable("$version"))
                            } catch (m) {
                                l = !1
                            }
                        }
                    }
                }
                L.disabled = c !== !0, L.outdated = f && d(f) < d(O), L.version = f || "0.0.0", L.pluginType = u ? "pepper" : l ? "activex" : c ? "netscape" : "unknown"
            };
        Dt(l);
        var jt = function() {
            return this instanceof jt ? void("function" == typeof jt._createClient && jt._createClient.apply(this, x(arguments))) : new jt
        };
        g(jt, "version", {
            value: "2.1.6",
            writable: !1,
            configurable: !0,
            enumerable: !0
        }), jt.config = function() {
            return H.apply(this, x(arguments))
        }, jt.state = function() {
            return z.apply(this, x(arguments))
        }, jt.isFlashUnusable = function() {
            return q.apply(this, x(arguments))
        }, jt.on = function() {
            return B.apply(this, x(arguments))
        }, jt.off = function() {
            return W.apply(this, x(arguments))
        }, jt.handlers = function() {
            return V.apply(this, x(arguments))
        }, jt.emit = function() {
            return X.apply(this, x(arguments))
        }, jt.create = function() {
            return Y.apply(this, x(arguments))
        }, jt.destroy = function() {
            return G.apply(this, x(arguments))
        }, jt.setData = function() {
            return K.apply(this, x(arguments))
        }, jt.clearData = function() {
            return J.apply(this, x(arguments))
        }, jt.getData = function() {
            return Q.apply(this, x(arguments))
        }, jt.focus = jt.activate = function() {
            return Z.apply(this, x(arguments))
        }, jt.blur = jt.deactivate = function() {
            return et.apply(this, x(arguments))
        }, jt.activeElement = function() {
            return tt.apply(this, x(arguments))
        };
        var Pt = 0,
            $t = {},
            Lt = 0,
            Ot = {},
            Mt = {};
        T(U, {
            autoActivate: !0
        });
        var It = function(e) {
                var t = this;
                t.id = "" + Pt++, $t[t.id] = {
                    instance: t,
                    elements: [],
                    handlers: {}
                }, e && t.clip(e), jt.on("*", function(e) {
                    return t.emit(e)
                }), jt.on("destroy", function() {
                    t.destroy()
                }), jt.create()
            },
            Ft = function(e, t) {
                var n, r, i, o = {},
                    a = $t[this.id] && $t[this.id].handlers;
                if ("string" == typeof e && e) i = e.toLowerCase().split(/\s+/);
                else if ("object" == typeof e && e && "undefined" == typeof t)
                    for (n in e) y.call(e, n) && "string" == typeof n && n && "function" == typeof e[n] && this.on(n, e[n]);
                if (i && i.length) {
                    for (n = 0, r = i.length; r > n; n++) e = i[n].replace(/^on/, ""), o[e] = !0, a[e] || (a[e] = []), a[e].push(t);
                    if (o.ready && L.ready && this.emit({
                            type: "ready",
                            client: this
                        }), o.error) {
                        var s = ["disabled", "outdated", "unavailable", "deactivated", "overdue"];
                        for (n = 0, r = s.length; r > n; n++)
                            if (L[s[n]]) {
                                this.emit({
                                    type: "error",
                                    name: "flash-" + s[n],
                                    client: this
                                });
                                break
                            }
                    }
                }
                return this
            },
            Rt = function(e, t) {
                var n, r, i, o, a, s = $t[this.id] && $t[this.id].handlers;
                if (0 === arguments.length) o = v(s);
                else if ("string" == typeof e && e) o = e.split(/\s+/);
                else if ("object" == typeof e && e && "undefined" == typeof t)
                    for (n in e) y.call(e, n) && "string" == typeof n && n && "function" == typeof e[n] && this.off(n, e[n]);
                if (o && o.length)
                    for (n = 0, r = o.length; r > n; n++)
                        if (e = o[n].toLowerCase().replace(/^on/, ""), a = s[e], a && a.length)
                            if (t)
                                for (i = a.indexOf(t); - 1 !== i;) a.splice(i, 1), i = a.indexOf(t, i);
                            else a.length = 0;
                return this
            },
            Ut = function(e) {
                var t = null,
                    n = $t[this.id] && $t[this.id].handlers;
                return n && (t = "string" == typeof e && e ? n[e] ? n[e].slice(0) : [] : E(n)), t
            },
            Ht = function(e) {
                if (Vt.call(this, e)) {
                    "object" == typeof e && e && "string" == typeof e.type && e.type && (e = T({}, e));
                    var t = T({}, rt(e), {
                        client: this
                    });
                    Xt.call(this, t)
                }
                return this
            },
            zt = function(e) {
                e = Yt(e);
                for (var t = 0; t < e.length; t++)
                    if (y.call(e, t) && e[t] && 1 === e[t].nodeType) {
                        e[t].zcClippingId ? -1 === Ot[e[t].zcClippingId].indexOf(this.id) && Ot[e[t].zcClippingId].push(this.id) : (e[t].zcClippingId = "zcClippingId_" + Lt++, Ot[e[t].zcClippingId] = [this.id], U.autoActivate === !0 && Gt(e[t]));
                        var n = $t[this.id] && $t[this.id].elements; - 1 === n.indexOf(e[t]) && n.push(e[t])
                    }
                return this
            },
            qt = function(e) {
                var t = $t[this.id];
                if (!t) return this;
                var n, r = t.elements;
                e = "undefined" == typeof e ? r.slice(0) : Yt(e);
                for (var i = e.length; i--;)
                    if (y.call(e, i) && e[i] && 1 === e[i].nodeType) {
                        for (n = 0; - 1 !== (n = r.indexOf(e[i], n));) r.splice(n, 1);
                        var o = Ot[e[i].zcClippingId];
                        if (o) {
                            for (n = 0; - 1 !== (n = o.indexOf(this.id, n));) o.splice(n, 1);
                            0 === o.length && (U.autoActivate === !0 && Kt(e[i]), delete e[i].zcClippingId)
                        }
                    }
                return this
            },
            Bt = function() {
                var e = $t[this.id];
                return e && e.elements ? e.elements.slice(0) : []
            },
            Wt = function() {
                this.unclip(), this.off(), delete $t[this.id]
            },
            Vt = function(e) {
                if (!e || !e.type) return !1;
                if (e.client && e.client !== this) return !1;
                var t = $t[this.id] && $t[this.id].elements,
                    n = !!t && t.length > 0,
                    r = !e.target || n && -1 !== t.indexOf(e.target),
                    i = e.relatedTarget && n && -1 !== t.indexOf(e.relatedTarget),
                    o = e.client && e.client === this;
                return r || i || o ? !0 : !1
            },
            Xt = function(e) {
                if ("object" == typeof e && e && e.type) {
                    var t = at(e),
                        n = $t[this.id] && $t[this.id].handlers["*"] || [],
                        r = $t[this.id] && $t[this.id].handlers[e.type] || [],
                        o = n.concat(r);
                    if (o && o.length) {
                        var a, s, c, l, u, f = this;
                        for (a = 0, s = o.length; s > a; a++) c = o[a], l = f, "string" == typeof c && "function" == typeof i[c] && (c = i[c]), "object" == typeof c && c && "function" == typeof c.handleEvent && (l = c, c = c.handleEvent), "function" == typeof c && (u = T({}, e), st(c, l, [u], t))
                    }
                    return this
                }
            },
            Yt = function(e) {
                return "string" == typeof e && (e = []), "number" != typeof e.length ? [e] : e
            },
            Gt = function(e) {
                if (e && 1 === e.nodeType) {
                    var t = function(e) {
                            (e || (e = i.event)) && ("js" !== e._source && (e.stopImmediatePropagation(), e.preventDefault()), delete e._source)
                        },
                        n = function(n) {
                            (n || (n = i.event)) && (t(n), jt.focus(e))
                        };
                    e.addEventListener("mouseover", n, !1), e.addEventListener("mouseout", t, !1), e.addEventListener("mouseenter", t, !1), e.addEventListener("mouseleave", t, !1), e.addEventListener("mousemove", t, !1), Mt[e.zcClippingId] = {
                        mouseover: n,
                        mouseout: t,
                        mouseenter: t,
                        mouseleave: t,
                        mousemove: t
                    }
                }
            },
            Kt = function(e) {
                if (e && 1 === e.nodeType) {
                    var t = Mt[e.zcClippingId];
                    if ("object" == typeof t && t) {
                        for (var n, r, i = ["move", "leave", "enter", "out", "over"], o = 0, a = i.length; a > o; o++) n = "mouse" + i[o], r = t[n], "function" == typeof r && e.removeEventListener(n, r, !1);
                        delete Mt[e.zcClippingId]
                    }
                }
            };
        jt._createClient = function() {
            It.apply(this, x(arguments))
        }, jt.prototype.on = function() {
            return Ft.apply(this, x(arguments))
        }, jt.prototype.off = function() {
            return Rt.apply(this, x(arguments))
        }, jt.prototype.handlers = function() {
            return Ut.apply(this, x(arguments))
        }, jt.prototype.emit = function() {
            return Ht.apply(this, x(arguments))
        }, jt.prototype.clip = function() {
            return zt.apply(this, x(arguments))
        }, jt.prototype.unclip = function() {
            return qt.apply(this, x(arguments))
        }, jt.prototype.elements = function() {
            return Bt.apply(this, x(arguments))
        }, jt.prototype.destroy = function() {
            return Wt.apply(this, x(arguments))
        }, jt.prototype.setText = function(e) {
            return jt.setData("text/plain", e), this
        }, jt.prototype.setHtml = function(e) {
            return jt.setData("text/html", e), this
        }, jt.prototype.setRichText = function(e) {
            return jt.setData("application/rtf", e), this
        }, jt.prototype.setData = function() {
            return jt.setData.apply(this, x(arguments)), this
        }, jt.prototype.clearData = function() {
            return jt.clearData.apply(this, x(arguments)), this
        }, jt.prototype.getData = function() {
            return jt.getData.apply(this, x(arguments))
        }, "function" == typeof define && define.amd ? define(function() {
            return jt
        }) : "object" == typeof module && module && "object" == typeof module.exports && module.exports ? module.exports = jt : e.ZeroClipboard = jt
    }(function() {
        return this || window
    }()),
    /*
     * Facebox (for jQuery)
     * version: 1.3
     * @requires jQuery v1.2 or later
     * @homepage https://github.com/defunkt/facebox
     *
     * Licensed under the MIT:
     *   http://www.opensource.org/licenses/mit-license.php
     *
     * Copyright Forever Chris Wanstrath, Kyle Neath
     *
     * Usage:
     *
     *  jQuery(document).ready(function() {
     *    jQuery('a[rel*=facebox]').facebox()
     *  })
     *
     *  <a href="#terms" rel="facebox">Terms</a>
     *    Loads the #terms div in the box
     *
     *  <a href="terms.html" rel="facebox">Terms</a>
     *    Loads the terms.html page in the box
     *
     *  <a href="terms.png" rel="facebox">Terms</a>
     *    Loads the terms.png image in the box
     *
     *
     *  You can also use it programmatically:
     *
     *    jQuery.facebox('some html')
     *    jQuery.facebox('some html', 'my-groovy-style')
     *
     *  The above will open a facebox with "some html" as the content.
     *
     *    jQuery.facebox(function($) {
     *      $.get('blah.html', function(data) { $.facebox(data) })
     *    })
     *
     *  The above will show a loading screen before the passed function is called,
     *  allowing for a better ajaxy experience.
     *
     *  The facebox function can also display an ajax page, an image, or the contents of a div:
     *
     *    jQuery.facebox({ ajax: 'remote.html' })
     *    jQuery.facebox({ ajax: 'remote.html' }, 'my-groovy-style')
     *    jQuery.facebox({ image: 'stairs.jpg' })
     *    jQuery.facebox({ image: 'stairs.jpg' }, 'my-groovy-style')
     *    jQuery.facebox({ div: '#box' })
     *    jQuery.facebox({ div: '#box' }, 'my-groovy-style')
     *
     *  Want to close the facebox?  Trigger the 'close.facebox' document event:
     *
     *    jQuery(document).trigger('close.facebox')
     *
     *  Facebox also has a bunch of other hooks:
     *
     *    loading.facebox
     *    beforeReveal.facebox
     *    reveal.facebox (aliased as 'afterReveal.facebox')
     *    init.facebox
     *    afterClose.facebox
     *
     *  Simply bind a function to any of these hooks:
     *
     *   $(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
     *
     */
    function(e) {
        function t(t) {
            if (e.facebox.settings.inited) return !0;
            e.facebox.settings.inited = !0, e(document).trigger("init.facebox"), i();
            var n = e.facebox.settings.imageTypes.join("|");
            e.facebox.settings.imageTypesRegexp = new RegExp("\\.(" + n + ")(\\?.*)?$", "i"), t && e.extend(e.facebox.settings, t), e("body").append(e.facebox.settings.faceboxHtml)
        }

        function n() {
            var e, t;
            return self.pageYOffset ? (t = self.pageYOffset, e = self.pageXOffset) : document.documentElement && document.documentElement.scrollTop ? (t = document.documentElement.scrollTop, e = document.documentElement.scrollLeft) : document.body && (t = document.body.scrollTop, e = document.body.scrollLeft), new Array(e, t)
        }

        function r() {
            var e;
            return self.innerHeight ? e = self.innerHeight : document.documentElement && document.documentElement.clientHeight ? e = document.documentElement.clientHeight : document.body && (e = document.body.clientHeight), e
        }

        function i() {
            var t = e.facebox.settings;
            t.imageTypes = t.image_types || t.imageTypes, t.faceboxHtml = t.facebox_html || t.faceboxHtml
        }

        function o(t, n) {
            if (t.match(/#/)) {
                var r = window.location.href.split("#")[0],
                    i = t.replace(r, "");
                if ("#" == i) return;
                e.facebox.reveal(e(i).html(), n)
            } else t.match(e.facebox.settings.imageTypesRegexp) ? a(t, n) : s(t, n)
        }

        function a(t, n) {
            var r = new Image;
            r.onload = function() {
                e.facebox.reveal('<div class="image"><img src="' + r.src + '" /></div>', n)
            }, r.src = t
        }

        function s(t, n) {
            e.facebox.jqxhr = e.get(t, function(t) {
                e.facebox.reveal(t, n)
            })
        }

        function c() {
            return 0 == e.facebox.settings.overlay || null === e.facebox.settings.opacity
        }

        function l() {
            return c() ? void 0 : (0 == e(".facebox-overlay").length && e("body").append('<div class="facebox-overlay facebox-overlay-hide"></div>'), e(".facebox-overlay").hide().addClass("facebox-overlay-active").css("opacity", e.facebox.settings.opacity).click(function() {
                e(document).trigger("close.facebox")
            }).fadeIn(200), !1)
        }

        function u() {
            return c() ? void 0 : (e(".facebox-overlay").fadeOut(200, function() {
                e(".facebox-overlay").removeClass("facebox-overlay-active"), e(".facebox-overlay").addClass("facebox-overlay-hide"), e(".facebox-overlay").remove()
            }), !1)
        }
        e.facebox = function(t, n) {
            return e.facebox.loading(), new Promise(function(r) {
                e(document).one("reveal.facebox", function() {
                    r(e(".facebox-content")[0])
                }), t.ajax ? s(t.ajax, n) : t.image ? a(t.image, n) : t.div ? o(t.div, n) : e.isFunction(t) ? t.call(e) : e.facebox.reveal(t, n)
            })
        }, e.extend(e.facebox, {
            settings: {
                opacity: .5,
                overlay: !0,
                imageTypes: ["png", "jpg", "jpeg", "gif"],
                faceboxHtml: '    <div class="facebox" id="facebox" style="display:none;">       <div class="facebox-popup">         <div class="facebox-content">         </div>         <button type="button" class="facebox-close js-facebox-close" aria-label="Close modal">           <span class="octicon octicon-remove-close"></span>         </button>       </div>     </div>'
            },
            loading: function() {
                return t(), 1 == e(".facebox-loading").length ? !0 : (l(), e(".facebox-content").empty().append('<div class="facebox-loading"></div>'), e(".facebox").show().css({
                    top: n()[1] + r() / 10,
                    left: e(window).width() / 2 - e(".facebox-popup").outerWidth() / 2
                }), e(document).bind("keydown.facebox", function(t) {
                    return 27 == t.keyCode && e.facebox.close(), !0
                }), void e(document).trigger("loading.facebox"))
            },
            reveal: function(t, n) {
                e(document).trigger("beforeReveal.facebox"), n && e(".facebox-content").addClass(n), e(".facebox-content").empty().append(t), e(".facebox-loading").remove(), e(".facebox-popup").children().fadeIn("normal"), e(".facebox").css("left", e(window).width() / 2 - e(".facebox-popup").outerWidth() / 2), e(document).trigger("reveal.facebox").trigger("afterReveal.facebox")
            },
            close: function() {
                return e(document).trigger("close.facebox"), !1
            }
        }), e.fn.facebox = function(n) {
            function r() {
                e.facebox.loading(!0);
                var t = this.rel.match(/facebox\[?\.(\w+)\]?/);
                return t && (t = t[1]), o(this.href, t), !1
            }
            if (0 != e(this).length) return t(n), this.bind("click.facebox", r)
        }, e(document).bind("close.facebox", function() {
            e.facebox.jqxhr && (e.facebox.jqxhr.abort(), e.facebox.jqxhr = null), e(document).unbind("keydown.facebox"), e(".facebox").fadeOut(function() {
                e(".facebox-content").removeClass().addClass("facebox-content"), e(".facebox-loading").remove(), e(document).trigger("afterClose.facebox")
            }), u()
        }), e(document).on("click", ".js-facebox-close", e.facebox.close)
    }(jQuery),
    function() {
        "use strict";

        function e(e, t) {
            setTimeout(function() {
                var n = t.ownerDocument.createEvent("Event");
                n.initEvent(e, !0, !0), t.dispatchEvent(n)
            }, 0)
        }

        function t(e, t) {
            return t.then(function(t) {
                e.insertAdjacentHTML("afterend", t), e.parentNode.removeChild(e)
            }, function() {
                e.classList.add("is-error")
            })
        }

        function n(e) {
            var t = e.src,
                n = r.get(e);
            return n && n.src === t ? n.data : (n = e.load(t), r.set(e, {
                src: t,
                data: n
            }), n)
        }
        var r = new WeakMap,
            i = Object.create(window.HTMLElement.prototype);
        Object.defineProperty(i, "src", {
            get: function() {
                var e = this.getAttribute("src");
                if (e) {
                    var t = this.ownerDocument.createElement("a");
                    return t.href = e, t.href
                }
                return ""
            },
            set: function(e) {
                this.setAttribute("src", e)
            }
        }), Object.defineProperty(i, "data", {
            get: function() {
                return n(this)
            }
        }), i.attributeChangedCallback = function(e) {
            "src" === e && n(this)
        }, i.createdCallback = function() {
            n(this)
        }, i.attachedCallback = function() {
            t(this, n(this))
        }, i.load = function(t) {
            var n = this;
            return t ? (e("loadstart", n), n.fetch(t).then(function(t) {
                return e("load", n), e("loadend", n), t
            }, function(t) {
                throw e("error", n), e("loadend", n), t
            })) : Promise.reject(new Error("missing src"))
        }, i.fetch = function(e) {
            return new Promise(function(t, n) {
                var r = new XMLHttpRequest;
                r.onload = function() {
                    switch (r.status) {
                        case 200:
                            t(r.responseText);
                            break;
                        default:
                            n()
                    }
                }, r.onerror = function() {
                    n()
                }, r.open("GET", e), r.send()
            })
        }, window.DeferredContentElement = document.registerElement("deferred-content", {
            prototype: i
        });
        var o = Object.create(i);
        o.fetch = function(e) {
            return new Promise(function(t, n) {
                function r(i) {
                    var o = new XMLHttpRequest;
                    o.onload = function() {
                        switch (o.status) {
                            case 200:
                                t(o.responseText);
                                break;
                            case 202:
                            case 404:
                                window.setTimeout(function() {
                                    r(1.5 * i)
                                }, i);
                                break;
                            default:
                                n()
                        }
                    }, o.onerror = function() {
                        n()
                    }, o.open("GET", e), o.send()
                }
                r(1e3)
            })
        }, window.PollDeferredContentElement = document.registerElement("poll-deferred-content", {
            prototype: o
        })
    }(),
    function() {
        "use strict";

        function e(e) {
            return ("0" + e).slice(-2)
        }

        function t(n, r) {
            var i = n.getDay(),
                o = n.getDate(),
                a = n.getMonth(),
                s = n.getFullYear(),
                c = n.getHours(),
                f = n.getMinutes(),
                d = n.getSeconds();
            return r.replace(/%([%aAbBcdeHIlmMpPSwyYZz])/g, function(r) {
                var h, p = r[1];
                switch (p) {
                    case "%":
                        return "%";
                    case "a":
                        return l[i].slice(0, 3);
                    case "A":
                        return l[i];
                    case "b":
                        return u[a].slice(0, 3);
                    case "B":
                        return u[a];
                    case "c":
                        return n.toString();
                    case "d":
                        return e(o);
                    case "e":
                        return o;
                    case "H":
                        return e(c);
                    case "I":
                        return e(t(n, "%l"));
                    case "l":
                        return 0 === c || 12 === c ? 12 : (c + 12) % 12;
                    case "m":
                        return e(a + 1);
                    case "M":
                        return e(f);
                    case "p":
                        return c > 11 ? "PM" : "AM";
                    case "P":
                        return c > 11 ? "pm" : "am";
                    case "S":
                        return e(d);
                    case "w":
                        return i;
                    case "y":
                        return e(s % 100);
                    case "Y":
                        return s;
                    case "Z":
                        return h = n.toString().match(/\((\w+)\)$/), h ? h[1] : "";
                    case "z":
                        return h = n.toString().match(/\w([+-]\d\d\d\d) /), h ? h[1] : ""
                }
            })
        }

        function n(e) {
            this.date = e
        }

        function r() {
            if (null !== f) return f;
            if (!("Intl" in window)) return !1;
            var e = {
                    day: "numeric",
                    month: "short"
                },
                t = new window.Intl.DateTimeFormat(void 0, e),
                n = t.format(new Date(0));
            return f = !!n.match(/^\d/)
        }

        function i() {
            if (null !== d) return d;
            if (!("Intl" in window)) return !0;
            var e = {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                },
                t = new window.Intl.DateTimeFormat(void 0, e),
                n = t.format(new Date(0));
            return d = !!n.match(/\d,/)
        }

        function o(e) {
            var t = new Date;
            return t.getUTCFullYear() === e.getUTCFullYear()
        }

        function a() {
            var e, t, n;
            for (t = 0, n = m.length; n > t; t++) e = m[t], e.textContent = e.getFormattedDate()
        }

        function s(e) {
            var n = {
                    weekday: {
                        "short": "%a",
                        "long": "%A"
                    },
                    day: {
                        numeric: "%e",
                        "2-digit": "%d"
                    },
                    month: {
                        "short": "%b",
                        "long": "%B"
                    },
                    year: {
                        numeric: "%Y",
                        "2-digit": "%y"
                    }
                },
                i = r() ? "weekday day month year" : "weekday month day, year";
            for (var o in n) {
                var a = n[o][e.getAttribute(o)];
                i = i.replace(o, a || "")
            }
            return i = i.replace(/(\s,)|(,\s$)/, ""), t(e._date, i).replace(/\s+/, " ").trim()
        }

        function c(e) {
            var n = {
                hour: e.getAttribute("hour"),
                minute: e.getAttribute("minute"),
                second: e.getAttribute("second")
            };
            for (var r in n) n[r] || delete n[r];
            if (0 !== Object.keys(n).length) {
                if ("Intl" in window) {
                    var i = new window.Intl.DateTimeFormat(void 0, n);
                    return i.format(e._date)
                }
                var o = n.second ? "%H:%M:%S" : "%H:%M";
                return t(e._date, o)
            }
        }
        var l = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            u = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        n.prototype.toString = function() {
            var e = this.timeElapsed();
            return e ? e : "on " + this.formatDate()
        }, n.prototype.timeElapsed = function() {
            var e = (new Date).getTime() - this.date.getTime(),
                t = Math.round(e / 1e3),
                n = Math.round(t / 60),
                r = Math.round(n / 60),
                i = Math.round(r / 24);
            return 0 > e ? "just now" : 10 > t ? "just now" : 45 > t ? t + " seconds ago" : 90 > t ? "a minute ago" : 45 > n ? n + " minutes ago" : 90 > n ? "an hour ago" : 24 > r ? r + " hours ago" : 36 > r ? "a day ago" : 30 > i ? i + " days ago" : null
        }, n.prototype.timeAgo = function() {
            var e = (new Date).getTime() - this.date.getTime(),
                t = Math.round(e / 1e3),
                n = Math.round(t / 60),
                r = Math.round(n / 60),
                i = Math.round(r / 24),
                o = Math.round(i / 30),
                a = Math.round(o / 12);
            return 0 > e ? "just now" : 10 > t ? "just now" : 45 > t ? t + " seconds ago" : 90 > t ? "a minute ago" : 45 > n ? n + " minutes ago" : 90 > n ? "an hour ago" : 24 > r ? r + " hours ago" : 36 > r ? "a day ago" : 30 > i ? i + " days ago" : 45 > i ? "a month ago" : 12 > o ? o + " months ago" : 18 > o ? "a year ago" : a + " years ago"
        }, n.prototype.microTimeAgo = function() {
            var e = (new Date).getTime() - this.date.getTime(),
                t = e / 1e3,
                n = t / 60,
                r = n / 60,
                i = r / 24,
                o = i / 30,
                a = o / 12;
            return 1 > n ? "1m" : 60 > n ? Math.round(n) + "m" : 24 > r ? Math.round(r) + "h" : 365 > i ? Math.round(i) + "d" : Math.round(a) + "y"
        };
        var f = null,
            d = null;
        n.prototype.formatDate = function() {
            var e = r() ? "%e %b" : "%b %e";
            return o(this.date) || (e += i() ? ", %Y" : " %Y"), t(this.date, e)
        }, n.prototype.formatTime = function() {
            if ("Intl" in window) {
                var e = new window.Intl.DateTimeFormat(void 0, {
                    hour: "numeric",
                    minute: "2-digit"
                });
                return e.format(this.date)
            }
            return t(this.date, "%l:%M%P")
        };
        var h, p, m = [];
        p = Object.create("HTMLTimeElement" in window ? window.HTMLTimeElement.prototype : window.HTMLElement.prototype), p.attributeChangedCallback = function(e, t, n) {
            if ("datetime" === e) {
                var r = Date.parse(n);
                this._date = isNaN(r) ? null : new Date(r)
            }
            var i = this.getFormattedTitle();
            i && this.setAttribute("title", i);
            var o = this.getFormattedDate();
            o && (this.textContent = o)
        }, p.getFormattedTitle = function() {
            if (this._date) {
                if (this.hasAttribute("title")) return this.getAttribute("title");
                if ("Intl" in window) {
                    var e = {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                            timeZoneName: "short"
                        },
                        t = new window.Intl.DateTimeFormat(void 0, e);
                    return t.format(this._date)
                }
                return this._date.toLocaleString()
            }
        };
        var v = Object.create(p);
        v.createdCallback = function() {
            var e = this.getAttribute("datetime");
            e && this.attributeChangedCallback("datetime", null, e)
        }, v.getFormattedDate = function() {
            return this._date ? new n(this._date).toString() : void 0
        }, v.attachedCallback = function() {
            m.push(this), h || (a(), h = setInterval(a, 6e4))
        }, v.detachedCallback = function() {
            var e = m.indexOf(this); - 1 !== e && m.splice(e, 1), m.length || h && (clearInterval(h), h = null)
        };
        var g = Object.create(v);
        g.getFormattedDate = function() {
            if (this._date) {
                var e = this.getAttribute("format");
                return "micro" === e ? new n(this._date).microTimeAgo() : new n(this._date).timeAgo()
            }
        };
        var y = Object.create(p);
        y.createdCallback = function() {
            var e;
            (e = this.getAttribute("datetime")) && this.attributeChangedCallback("datetime", null, e), (e = this.getAttribute("format")) && this.attributeChangedCallback("format", null, e)
        }, y.getFormattedDate = function() {
            if (this._date) {
                var e = s(this) || "",
                    t = c(this) || "";
                return (e + " " + t).trim()
            }
        }, window.RelativeTimeElement = document.registerElement("relative-time", {
            prototype: v,
            "extends": "time"
        }), window.TimeAgoElement = document.registerElement("time-ago", {
            prototype: g,
            "extends": "time"
        }), window.LocalTimeElement = document.registerElement("local-time", {
            prototype: y,
            "extends": "time"
        })
    }(),
    function() {
        var e, t, n, r, i, o;
        o = function() {
            var e;
            return e = document.querySelector('meta[name="csrf-token"]'), null != e ? e.getAttribute("content") : void 0
        }, t = function(e) {
            var t;
            return t = (null != e ? e.method : void 0) || "get", "get" === t.toLowerCase()
        }, r = function(e) {
            var t;
            return 200 <= (t = e.status) && 300 > t ? Promise.resolve(e) : Promise.reject(e)
        }, e = function(e) {
            return null == e && (e = {}), e.headers || (e.headers = {}), t(e) || (e.headers["X-CSRF-Token"] = o()), e.headers["X-Requested-With"] = "XMLHttpRequest", e
        }, n = function(e) {
            return e.json()
        }, i = function(e) {
            return e.text()
        }, $.fetch = function(t, n) {
            return fetch(t, e(n)).then(r)
        }, $.fetchText = function(t, n) {
            return fetch(t, e(n)).then(r).then(i)
        }, $.fetchJSON = function(t, i) {
            return i = e(i), i.headers.Accept = "application/json", fetch(t, i).then(r).then(n)
        }
    }.call(this),
    function() {
        $(document).on("change", "form[data-autosubmit]", function() {
            return $(this).submit()
        })
    }.call(this),
    function() {
        $.fn.replaceContent = function(e) {
            var t;
            return "string" == typeof e && (e = $.parseHTML($.trim(e))), t = $(e), this.replaceWith(t), t
        }
    }.call(this),
    function() {
        $.fn.fire = function(e) {
            var t, n, r, i, o;
            return (t = arguments[1]) && ($.isPlainObject(t) ? i = t : $.isFunction(t) && (n = t)), (t = arguments[2]) && $.isFunction(t) && (n = t), r = this[0], null == i && (i = {}), null == i.cancelable && (i.cancelable = !!n), null == i.bubbles && (i.bubbles = !0), o = function() {
                var t;
                return t = $.Event(e, i), $.event.trigger(t, [], r, !t.bubbles), n && !t.isDefaultPrevented() && n.call(r, t), t
            }, i.async ? (delete i.async, void setImmediate(o)) : o()
        }
    }.call(this),
    function() {
        $.ajaxPoll = function(e) {
            var t, n, r, i, o, a, s, c;
            return r = $.Deferred(), e = $.extend({
                cache: !1
            }, e), n = null != (a = e.interval) ? a : 1e3, delete e.interval, t = null != (s = e.decay) ? s : 1.5, delete e.decay, o = null != (c = e.status) ? c : 202, delete e.status, i = function(n, a) {
                var s, c, l, u;
                u = $.ajax(e), l = function(e) {
                    return r.notifyWith(this, [n]), u.status === o ? setTimeout(function() {
                        return i(n + 1, a * t)
                    }, a) : e()
                }, s = function() {
                    var e;
                    return e = arguments, l(function() {
                        return r.resolveWith(this, e)
                    })
                }, c = function() {
                    var e;
                    return e = arguments, l(function() {
                        return r.rejectWith(this, e)
                    })
                }, u.then(s, c)
            }, i(0, n), r.promise()
        }
    }.call(this),
    function() {
        var e;
        $.observe(".js-deferred-content", e = function(e) {
            var t, n, r;
            return t = $(e), (n = t.attr("data-url")) ? (r = $.ajaxPoll({
                url: n,
                context: e,
                dataType: "html"
            }), r.then(function(e) {
                t.fire("deferredcontent:load", function() {
                    return t = t.replaceContent(e), t.fire("deferredcontent:loaded", {
                        async: !0
                    })
                })
            }, function() {
                t.fire("deferredcontent:error", function() {
                    return t.addClass("error")
                })
            })) : void 0
        })
    }.call(this),
    function() {
        var e, t, n;
        t = "ontransitionend" in window, $.fn.performTransition = function(r) {
            var i, o, a, s, c, l, u, f;
            if (!t) return void r.apply(this);
            for (a = this.find(".js-transitionable"), a = a.add(this.filter(".js-transitionable")), c = 0, u = a.length; u > c; c++) o = a[c], i = $(o), s = e(o), i.one("transitionend", function() {
                return o.style.display = null, o.style.visibility = null, s ? n(o, function() {
                    return o.style.height = null
                }) : void 0
            }), o.style.display = "block", o.style.visibility = "visible", s && n(o, function() {
                return o.style.height = "" + i.height() + "px"
            }), o.offsetHeight;
            for (r.apply(this), l = 0, f = a.length; f > l; l++) o = a[l], e(o) && (o.style.height = 0 === $(o).height() ? "" + o.scrollHeight + "px" : "0px");
            return this
        }, e = function(e) {
            return "height" === $(e).css("transitionProperty")
        }, n = function(e, t) {
            e.style.transition = "none", t(e), e.offsetHeight, e.style.transition = null
        }
    }.call(this),
    function() {
        $(document).on("click", ".js-details-container .js-details-target", function(e) {
            var t, n;
            n = $(this), t = n.closest(".js-details-container"), n.fire("details:toggle", {
                relatedTarget: e.target
            }, function() {
                return function() {
                    t.performTransition(function() {
                        this.toggleClass("open"), this.fire("details:toggled", {
                            relatedTarget: e.target,
                            async: !0
                        })
                    }), e.preventDefault()
                }
            }(this))
        })
    }.call(this),
    function() {
        var e, t;
        $.fuzzyScore = function(e, n) {
            var r;
            return r = t(e, n), r && !/\//.test(n) && (r += t(e.replace(/^.*\//, ""), n)), r
        }, $.fuzzySort = function(t, n) {
            var r, i, o, a, s, c;
            for (t = function() {
                    var e, r, a;
                    for (a = [], e = 0, r = t.length; r > e; e++) o = t[e], (i = $.fuzzyScore(o, n)) && a.push([o, i]);
                    return a
                }(), t.sort(e), c = [], a = 0, s = t.length; s > a; a++) r = t[a], c.push(r[0]);
            return c
        }, e = function(e, t) {
            var n, r, i, o;
            return r = e[0], o = t[0], n = e[1], i = t[1], n > i ? -1 : i > n ? 1 : o > r ? -1 : r > o ? 1 : 0
        }, $.fuzzyRegexp = function(e) {
            var t, n, r;
            return r = e.toLowerCase(), t = "+.*?[]{}()^$|\\".replace(/(.)/g, "\\$1"), n = new RegExp("\\(([" + t + "])\\)", "g"), e = r.replace(/(.)/g, "($1)(.*?)").replace(n, "(\\$1)"), new RegExp("(.*)" + e + "$", "i")
        }, $.fuzzyHighlight = function(e, t, n) {
            var r, i, o, a, s, c, l, u;
            if (null == n && (n = null), i = $.trim(e.innerHTML), t) {
                if (null == n && (n = $.fuzzyRegexp(t)), !(s = i.match(n))) return;
                for (c = !1, i = [], o = l = 1, u = s.length; u >= 1 ? u > l : l > u; o = u >= 1 ? ++l : --l) a = s[o], a && (o % 2 === 0 ? c || (i.push("<mark>"), c = !0) : c && (i.push("</mark>"), c = !1), i.push("" + a));
                e.innerHTML = i.join("")
            } else r = i.replace(/<\/?mark>/g, ""), i !== r && (e.innerHTML = r)
        }, t = function(e, t) {
            var n, r, i, o, a, s, c, l, u, f, d, h, p, m, v;
            if (e === t) return 1;
            for (h = e.length, p = 0, d = 0, s = m = 0, v = t.length; v > m; s = ++m) {
                if (i = t[s], c = e.indexOf(i.toLowerCase()), l = e.indexOf(i.toUpperCase()), f = Math.min(c, l), u = f > -1 ? f : Math.max(c, l), -1 === u) return 0;
                o = .1, e[u] === i && (o += .1), 0 === u && (o += .8, 0 === s && (d = 1)), " " === e.charAt(u - 1) && (o += .8), e = e.substring(u + 1, h), p += o
            }
            return n = t.length, r = p / n, a = (r * (n / h) + r) / 2, d && 1 > a + .1 && (a += .1), a
        }
    }.call(this),
    function() {
        var e, t, n, r, i;
        r = new WeakMap, $.fn.fuzzyFilterSortList = function(o, a) {
            var s, c, l, u, f, d, h, p, m, v, g, y, b, w, x, T, E, _, C, k, S, N, A, D, j, P, L;
            if (null == a && (a = {}), p = this[0]) {
                for (o = o.toLowerCase(), u = null != (D = a.content) ? D : e, b = null != (j = a.text) ? j : n, y = null != (P = a.score) ? P : $.fuzzyScore, h = a.limit, a.mark === !0 ? m = t : null != (null != (L = a.mark) ? L.call : void 0) && (m = a.mark), (s = r.get(p)) ? l = $(p).children() : (l = s = $(p).children(), r.set(p, s.slice(0))), T = 0, k = l.length; k > T; T++) f = l[T], p.removeChild(f), f.style.display = "";
                if (g = document.createDocumentFragment(), w = 0, x = 0, o) {
                    for (d = s.slice(0), _ = 0, N = d.length; N > _; _++) f = d[_], null == f.fuzzyFilterTextCache && (f.fuzzyFilterTextCache = b(u(f))), f.fuzzyFilterScoreCache = y(f.fuzzyFilterTextCache, o);
                    for (d.sort(i), v = $.fuzzyRegexp(o), C = 0, A = d.length; A > C; C++) f = d[C], (!h || h > w) && f.fuzzyFilterScoreCache > 0 && (x++, m && (c = u(f), m(c), m(c, o, v)), g.appendChild(f)), w++
                } else
                    for (E = 0, S = s.length; S > E; E++) f = s[E], (!h || h > w) && (x++, m && m(u(f)), g.appendChild(f)), w++;
                return p.appendChild(g), x
            }
        }, i = function(e, t) {
            var n, r, i, o;
            return n = e.fuzzyFilterScoreCache, i = t.fuzzyFilterScoreCache, r = e.fuzzyFilterTextCache, o = t.fuzzyFilterTextCache, n > i ? -1 : i > n ? 1 : o > r ? -1 : r > o ? 1 : 0
        }, e = function(e) {
            return e
        }, n = function(e) {
            return $.trim(e.textContent.toLowerCase())
        }, t = $.fuzzyHighlight
    }.call(this),
    function() {
        var e, t;
        $.fn.prefixFilterList = function(n, r) {
            var i, o, a, s, c, l, u, f, d, h, p;
            if (null == r && (r = {}), s = this[0]) {
                for (n = n.toLowerCase(), l = null != (h = r.text) ? h : t, o = $(s).children(), a = r.limit, r.mark === !0 ? c = e : null != (null != (p = r.mark) ? p.call : void 0) && (c = r.mark), u = 0, f = 0, d = o.length; d > f; f++) i = o[f], 0 === l(i).indexOf(n) ? a && u >= a ? i.style.display = "none" : (u++, i.style.display = "", c && (c(i), c(i, n))) : i.style.display = "none";
                return u
            }
        }, t = function(e) {
            return $.trim(e.textContent.toLowerCase())
        }, e = function(e, t) {
            var n, r, i;
            r = e.innerHTML, t ? (i = new RegExp(t, "i"), e.innerHTML = r.replace(i, "<mark>$&</mark>")) : (n = r.replace(/<\/?mark>/g, ""), r !== n && (e.innerHTML = n))
        }
    }.call(this),
    function() {
        var e, t;
        $.fn.substringFilterList = function(n, r) {
            var i, o, a, s, c, l, u, f, d, h, p;
            if (null == r && (r = {}), s = this[0]) {
                for (n = n.toLowerCase(), l = null != (h = r.text) ? h : t, a = r.limit, o = $(s).children(), r.mark === !0 ? c = e : null != (null != (p = r.mark) ? p.call : void 0) && (c = r.mark), u = 0, f = 0, d = o.length; d > f; f++) i = o[f], -1 !== l(i).indexOf(n) ? a && u >= a ? i.style.display = "none" : (u++, i.style.display = "", c && (c(i), c(i, n))) : i.style.display = "none";
                return u
            }
        }, t = function(e) {
            return $.trim(e.textContent.toLowerCase())
        }, e = function(e, t) {
            var n, r, i;
            r = e.innerHTML, t ? (i = new RegExp(t, "i"), e.innerHTML = r.replace(i, "<mark>$&</mark>")) : (n = r.replace(/<\/?mark>/g, ""), r !== n && (e.innerHTML = n))
        }
    }.call(this),
    function() {
        $.fn.focused = function(e) {
            var t, n, r;
            return n = [], r = [], t = e ? this.find(e).filter(document.activeElement)[0] : this.filter(document.activeElement)[0], this.on("focusin", e, function() {
                var e, r, i;
                if (!t)
                    for (t = this, r = 0, i = n.length; i > r; r++) e = n[r], e.call(this)
            }), this.on("focusout", e, function() {
                var e, n, i;
                if (t)
                    for (t = null, n = 0, i = r.length; i > n; n++) e = r[n], e.call(this)
            }), {
                "in": function(e) {
                    return n.push(e), t && e.call(t), this
                },
                out: function(e) {
                    return r.push(e), this
                }
            }
        }
    }.call(this),
    function() {
        var e, t;
        e = function() {
            var e, t, n, r, i;
            return n = !1, t = !1, i = null, e = 100, r = function(n) {
                return function(r) {
                    i && clearTimeout(i), i = setTimeout(function() {
                        var e;
                        i = null, t = !1, e = new $.Event("throttled:input", {
                            target: r
                        }), $.event.trigger(e, null, n, !0)
                    }, e)
                }
            }(this), $(this).on("keydown.throttledInput", function() {
                n = !0, i && clearTimeout(i)
            }), $(this).on("keyup.throttledInput", function(e) {
                n = !1, t && r(e.target)
            }), $(this).on("input.throttledInput", function(e) {
                t = !0, n || r(e.target)
            })
        }, t = function() {
            return $(this).off("keydown.throttledInput"), $(this).off("keyup.throttledInput"), $(this).off("input.throttledInput")
        }, $.event.special["throttled:input"] = {
            setup: e,
            teardown: t
        }
    }.call(this),
    function() {
        var e;
        $(document).focused(".js-filterable-field")["in"](function() {
            var e;
            return e = $(this).val(), $(this).on("throttled:input.filterable", function() {
                return e !== $(this).val() ? (e = $(this).val(), $(this).fire("filterable:change", {
                    async: !0
                })) : void 0
            }), $(this).fire("filterable:change", {
                async: !0
            })
        }).out(function() {
            return $(this).off(".filterable")
        }), $(document).on("filterable:change", ".js-filterable-field", function() {
            var t, n, r, i, o, a;
            for (r = $.trim($(this).val().toLowerCase()), a = $("[data-filterable-for=" + this.id + "]"), i = 0, o = a.length; o > i; i++) n = a[i], t = $(n), e(t, r), t.fire("filterable:change", {
                relatedTarget: this
            })
        }), e = function(e, t) {
            var n, r, i;
            r = void 0 !== e.attr("data-filterable-highlight"), n = e.attr("data-filterable-limit"), i = function() {
                switch (e.attr("data-filterable-type")) {
                    case "fuzzy":
                        return e.fuzzyFilterSortList(t, {
                            mark: r,
                            limit: n
                        });
                    case "substring":
                        return e.substringFilterList(t, {
                            mark: r,
                            limit: n
                        });
                    default:
                        return e.prefixFilterList(t, {
                            mark: r,
                            limit: n
                        })
                }
            }(), e.toggleClass("filterable-active", t.length > 0), e.toggleClass("filterable-empty", 0 === i)
        }
    }.call(this),
    function() {
        var e, t, n, r;
        n = {
            8: "backspace",
            9: "tab",
            13: "enter",
            16: "shift",
            17: "ctrl",
            18: "alt",
            19: "pause",
            20: "capslock",
            27: "esc",
            32: "space",
            33: "pageup",
            34: "pagedown",
            35: "end",
            36: "home",
            37: "left",
            38: "up",
            39: "right",
            40: "down",
            45: "insert",
            46: "del",
            48: "0",
            49: "1",
            50: "2",
            51: "3",
            52: "4",
            53: "5",
            54: "6",
            55: "7",
            56: "8",
            57: "9",
            65: "a",
            66: "b",
            67: "c",
            68: "d",
            69: "e",
            70: "f",
            71: "g",
            72: "h",
            73: "i",
            74: "j",
            75: "k",
            76: "l",
            77: "m",
            78: "n",
            79: "o",
            80: "p",
            81: "q",
            82: "r",
            83: "s",
            84: "t",
            85: "u",
            86: "v",
            87: "w",
            88: "x",
            89: "y",
            90: "z",
            91: "meta",
            93: "meta",
            96: "0",
            97: "1",
            98: "2",
            99: "3",
            100: "4",
            101: "5",
            102: "6",
            103: "7",
            104: "8",
            105: "9",
            106: "*",
            107: "+",
            109: "-",
            110: ".",
            111: "/",
            112: "f1",
            113: "f2",
            114: "f3",
            115: "f4",
            116: "f5",
            117: "f6",
            118: "f7",
            119: "f8",
            120: "f9",
            121: "f10",
            122: "f11",
            123: "f12",
            144: "numlock",
            145: "scroll",
            186: ";",
            187: "=",
            188: ",",
            189: "-",
            190: ".",
            191: "/",
            192: "`",
            219: "[",
            220: "\\",
            221: "]",
            222: "'"
        }, r = {
            48: ")",
            49: "!",
            50: "@",
            51: "#",
            52: "$",
            53: "%",
            54: "^",
            55: "&",
            56: "*",
            57: "(",
            65: "A",
            66: "B",
            67: "C",
            68: "D",
            69: "E",
            70: "F",
            71: "G",
            72: "H",
            73: "I",
            74: "J",
            75: "K",
            76: "L",
            77: "M",
            78: "N",
            79: "O",
            80: "P",
            81: "Q",
            82: "R",
            83: "S",
            84: "T",
            85: "U",
            86: "V",
            87: "W",
            88: "X",
            89: "Y",
            90: "Z",
            186: ":",
            187: "+",
            188: "<",
            189: "_",
            190: ">",
            191: "?",
            192: "~",
            219: "{",
            220: "|",
            221: "}",
            222: '"'
        }, e = function(e) {
            var t, i, o;
            return t = n[e.which], i = "", e.ctrlKey && "ctrl" !== t && (i += "ctrl+"), e.altKey && "alt" !== t && (i += "alt+"), e.metaKey && !e.ctrlKey && "meta" !== t && (i += "meta+"), e.shiftKey ? (o = r[e.which]) ? "" + i + o : "shift" === t ? "" + i + "shift" : t ? "" + i + "shift+" + t : null : t ? "" + i + t : null
        }, t = function(t) {
            return null == t.hotkey && (t.hotkey = e(t)), t.handleObj.handler.apply(this, arguments)
        }, $.event.special.keydown = {
            handle: t
        }, $.event.special.keyup = {
            handle: t
        }
    }.call(this),
    function() {
        var e, t, n, r, i, o, a;
        r = e = {}, o = null, a = function() {
            return o = null, e = r
        }, $(document).on("keydown", function(t) {
            var n;
            if (t.target === document.body)
                if (o && clearTimeout(o), n = e[t.hotkey]) {
                    if (!("nodeType" in n)) return e = n, void(o = setTimeout(a, 1500));
                    a(), $(n).fire("hotkey:activate", {
                        originalEvent: t
                    }, function() {
                        return $(n).is("input, textarea") ? void $(n).focus() : void $(n).click()
                    }), t.preventDefault()
                } else a()
        }), t = function(e) {
            var t, n, r, i, o;
            for (i = e.getAttribute("data-hotkey").split(/\s*,\s*/), o = [], n = 0, r = i.length; r > n; n++) t = i[n], o.push(t.split(/\s+/));
            return o
        }, n = function(e) {
            var n, i, o, a, s, c, l, u, f;
            for (u = t(e), f = [], c = 0, l = u.length; l > c; c++) a = u[c], s = r, f.push(function() {
                var t, r, c;
                for (c = [], i = t = 0, r = a.length; r > t; i = ++t) o = a[i], i < a.length - 1 ? (n = s[o], (!n || "nodeType" in n) && (s[o] = {}), c.push(s = s[o])) : c.push(s[o] = e);
                return c
            }());
            return f
        }, i = function(t) {
            var i, o, a, s;
            for (r = e = {}, a = $("[data-hotkey]"), s = [], i = 0, o = a.length; o > i; i++) t = a[i], s.push(n(t));
            return s
        }, $.observe("[data-hotkey]", {
            add: n,
            remove: i
        })
    }.call(this),
    function() {
        var e, t, n, r, i, o = [].indexOf || function(e) {
            for (var t = 0, n = this.length; n > t; t++)
                if (t in this && this[t] === e) return t;
            return -1
        };
        t = null, e = function(e) {
            t && n(t), $(e).fire("menu:activate", function() {
                return $(document).on("keydown.menu", i), $(document).on("click.menu", r), t = e, $(e).performTransition(function() {
                    return document.body.classList.add("menu-active"), e.classList.add("active"), $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "false")
                }), $(e).fire("menu:activated", {
                    async: !0
                })
            })
        }, n = function(e) {
            $(e).fire("menu:deactivate", function() {
                return $(document).off(".menu"), t = null, $(e).performTransition(function() {
                    return document.body.classList.remove("menu-active"), e.classList.remove("active"), $(e).find(".js-menu-content[aria-hidden]").attr("aria-hidden", "true")
                }), $(e).fire("menu:deactivated", {
                    async: !0
                })
            })
        }, r = function(e) {
            t && ($(e.target).closest(t)[0] || (e.preventDefault(), n(t)))
        }, i = function(e) {
            t && "esc" === e.hotkey && (o.call($(document.activeElement).parents(), t) >= 0 && document.activeElement.blur(), e.preventDefault(), n(t))
        }, $(document).on("click", ".js-menu-container", function(r) {
            var i, o, a;
            i = this, (a = $(r.target).closest(".js-menu-target")[0]) ? (r.preventDefault(), i === t ? n(i) : e(i)) : (o = $(r.target).closest(".js-menu-content")[0]) || i === t && (r.preventDefault(), n(i))
        }), $(document).on("click", ".js-menu-container .js-menu-close", function(e) {
            n($(this).closest(".js-menu-container")[0]), e.preventDefault()
        }), $.fn.menu = function(t) {
            var r, i;
            return (r = $(this).closest(".js-menu-container")[0]) ? (i = {
                activate: function() {
                    return function() {
                        return e(r)
                    }
                }(this),
                deactivate: function() {
                    return function() {
                        return n(r)
                    }
                }(this)
            }, "function" == typeof i[t] ? i[t]() : void 0) : void 0
        }
    }.call(this),
    function() {
        $.fn.positionedOffset = function(e) {
            var t, n, r, i, o, a, s, c, l;
            if (n = this[0]) {
                for ((null != e ? e.jquery : void 0) && (e = e[0]), c = 0, i = 0, r = n.offsetHeight, l = n.offsetWidth; n !== document.body && n !== e;)
                    if (c += n.offsetTop || 0, i += n.offsetLeft || 0, n = n.offsetParent, !n) return;
                return e && e.offsetParent ? (a = e.scrollHeight, s = e.scrollWidth) : (a = $(document).height(), s = $(document).width()), t = a - (c + r), o = s - (i + l), {
                    top: c,
                    left: i,
                    bottom: t,
                    right: o
                }
            }
        }
    }.call(this),
    function() {
        var e, t = [].slice;
        $.fn.scrollTo = function() {
            var n, r, i, o, a, s, c;
            return n = 1 <= arguments.length ? t.call(arguments, 0) : [], (r = this[0]) ? (o = {}, $.isPlainObject(n[0]) ? (o = n[0], $.isFunction(n[1]) && null == o.complete && (o.complete = n[1])) : null != n[0] && (o.target = n[0]), null == o.top && null == o.left && (o.target ? (s = $(o.target).positionedOffset(r), a = s.top, i = s.left, o.top = a, o.left = i) : (c = $(r).positionedOffset(), a = c.top, i = c.left, o.top = a, o.left = i, r = document)), r.offsetParent ? o.duration ? e(r, o) : (null != o.top && (r.scrollTop = o.top), null != o.left && (r.scrollLeft = o.left), "function" == typeof o.complete && o.complete()) : o.duration ? e("html, body", o) : (null != o.top && $(document).scrollTop(o.top), null != o.left && $(document).scrollLeft(o.left), "function" == typeof o.complete && o.complete()), this) : this
        }, e = function(e, t) {
            var n, r, i;
            return i = {}, null != t.top && (i.scrollTop = t.top), null != t.left && (i.scrollLeft = t.left), r = {
                duration: t.duration,
                queue: !1
            }, t.complete && (n = $(e).length, r.complete = function() {
                return 0 === --n ? setImmediate(t.complete) : void 0
            }), $(e).animate(i, r)
        }
    }.call(this),
    function() {
        $.hidden = function() {
            return this.offsetWidth <= 0 && this.offsetHeight <= 0
        }, $.visible = function() {
            return !$.hidden.call(this)
        }, $.fn.hidden = function() {
            return this.filter($.hidden)
        }, $.fn.visible = function() {
            return this.filter($.visible)
        }
    }.call(this),
    function() {
        $.fn.overflowOffset = function(e) {
            var t, n, r, i, o, a, s, c, l;
            return null == e && (e = document.body), (n = this[0]) && (o = $(n).positionedOffset(e)) ? (e.offsetParent ? s = {
                top: $(e).scrollTop(),
                left: $(e).scrollLeft()
            } : (s = {
                top: $(window).scrollTop(),
                left: $(window).scrollLeft()
            }, e = document.documentElement), c = o.top - s.top, i = o.left - s.left, r = e.clientHeight, l = e.clientWidth, t = r - (c + n.offsetHeight), a = l - (i + n.offsetWidth), {
                top: c,
                left: i,
                bottom: t,
                right: a,
                height: r,
                width: l
            }) : void 0
        }
    }.call(this),
    function() {
        $.fn.overflowParent = function() {
            var e, t, n;
            if (!(e = this[0])) return $();
            if (e === document.body) return $();
            for (; e !== document.body;) {
                if (e = e.parentElement, !e) return $();
                if (n = $(e).css("overflow-y"), t = $(e).css("overflow-x"), "auto" === n || "auto" === t || "scroll" === n || "scroll" === t) break
            }
            return $(e)
        }
    }.call(this),
    function() {
        var e, t, n, r, i, o, a, s, c, l, u, f, d, h, p, m, v, g, y, b, w, x, T, E, _, C, k, S;
        i = navigator.userAgent.match(/Macintosh/), v = navigator.userAgent.match(/Macintosh/) ? "meta" : "ctrl", c = !1, g = {
            x: 0,
            y: 0
        }, t = function(e) {
            e.addEventListener("mousemove", y, !1), e.addEventListener("mouseover", b, !1)
        }, S = function(e) {
            e.removeEventListener("mousemove", y, !1), e.removeEventListener("mouseover", b, !1)
        }, $.observe(".js-navigation-container", {
            add: t,
            remove: S
        }), y = function(e) {
            (g.x !== e.clientX || g.y !== e.clientY) && (c = !1), g = {
                x: e.clientX,
                y: e.clientY
            }
        }, b = function(e) {
            c || $(e.target).trigger("navigation:mouseover")
        }, $(document).on("keydown", function(e) {
            var t, n, r;
            (e.target === document.body || e.target.classList.contains("js-navigation-enable")) && (t = d()) && (c = !0, r = $(t).find(".js-navigation-item.navigation-focus")[0] || t, n = $(r).fire("navigation:keydown", {
                originalEvent: e,
                hotkey: e.hotkey,
                relatedTarget: t
            }), n.isDefaultPrevented() && e.preventDefault())
        }), $(document).on("navigation:keydown", ".js-active-navigation-container", function(e) {
            var t, n, r;
            if (t = this, n = $(e.originalEvent.target).is("input, textarea"), $(e.target).is(".js-navigation-item"))
                if (r = e.target, n) {
                    if (i) switch (e.hotkey) {
                        case "ctrl+n":
                            o(r, t);
                            break;
                        case "ctrl+p":
                            a(r, t)
                    }
                    switch (e.hotkey) {
                        case "up":
                            a(r, t);
                            break;
                        case "down":
                            o(r, t);
                            break;
                        case "enter":
                            m(r);
                            break;
                        case "" + v + "+enter":
                            m(r, !0)
                    }
                } else {
                    if (i) switch (e.hotkey) {
                        case "ctrl+n":
                            o(r, t);
                            break;
                        case "ctrl+p":
                            a(r, t);
                            break;
                        case "alt+v":
                            x(r, t);
                            break;
                        case "ctrl+v":
                            w(r, t)
                    }
                    switch (e.hotkey) {
                        case "j":
                            o(r, t);
                            break;
                        case "k":
                            a(r, t);
                            break;
                        case "o":
                        case "enter":
                            m(r);
                            break;
                        case "" + v + "+enter":
                            m(r, !0)
                    }
                } else if (r = h(t)[0])
                if (n) {
                    if (i) switch (e.hotkey) {
                        case "ctrl+n":
                            f(r, t)
                    }
                    switch (e.hotkey) {
                        case "down":
                            f(r, t)
                    }
                } else {
                    if (i) switch (e.hotkey) {
                        case "ctrl+n":
                        case "ctrl+v":
                            f(r, t)
                    }
                    switch (e.hotkey) {
                        case "j":
                            f(r, t)
                    }
                }
            if (n) {
                if (i) switch (e.hotkey) {
                    case "ctrl+n":
                    case "ctrl+p":
                        e.preventDefault()
                }
                switch (e.hotkey) {
                    case "up":
                    case "down":
                        e.preventDefault();
                        break;
                    case "enter":
                    case "" + v + "+enter":
                        e.preventDefault()
                }
            } else {
                if (i) switch (e.hotkey) {
                    case "ctrl+n":
                    case "ctrl+p":
                    case "alt+v":
                    case "ctrl+v":
                        e.preventDefault()
                }
                switch (e.hotkey) {
                    case "j":
                    case "k":
                        e.preventDefault();
                        break;
                    case "o":
                    case "enter":
                    case "" + v + "+enter":
                        e.preventDefault()
                }
            }
        }), $(document).on("navigation:mouseover", ".js-active-navigation-container .js-navigation-item", function(e) {
            var t;
            t = $(e.currentTarget).closest(".js-navigation-container")[0], f(e.currentTarget, t)
        }), l = function(e) {
            var t, n, r;
            r = e.currentTarget, n = e.modifierKey || e.altKey || e.ctrlKey || e.metaKey, t = $(r).fire("navigation:open", {
                modifierKey: n
            }), t.isDefaultPrevented() && e.preventDefault()
        }, $(document).on("click", ".js-active-navigation-container .js-navigation-item", function(e) {
            l(e)
        }), $(document).on("navigation:keyopen", ".js-active-navigation-container .js-navigation-item", function(e) {
            var t;
            (t = $(this).filter(".js-navigation-open")[0] || $(this).find(".js-navigation-open")[0]) ? (e.modifierKey ? (window.open(t.href, "_blank"), window.focus()) : $(t).click(), e.preventDefault()) : l(e)
        }), e = function(e) {
            var t;
            return t = d(), e !== t ? $(e).fire("navigation:activate", function() {
                return function() {
                    return t && t.classList.remove("js-active-navigation-container"), e.classList.add("js-active-navigation-container"), $(e).fire("navigation:activated", {
                        async: !0
                    })
                }
            }(this)) : void 0
        }, s = function(e) {
            return $(e).fire("navigation:deactivate", function() {
                return function() {
                    return e.classList.remove("js-active-navigation-container"), $(e).fire("navigation:deactivated", {
                        async: !0
                    })
                }
            }(this))
        }, r = [], E = function(t) {
            var n;
            (n = d()) && r.push(n), e(t)
        }, T = function(t) {
            var i;
            s(t), n(t), (i = r.pop()) && e(i)
        }, u = function(t, n) {
            var r, i, o;
            if (r = h(n)[0], o = $(t).closest(".js-navigation-item")[0] || r, e(n), o) {
                if (i = f(o, n)) return;
                k($(o).overflowParent()[0], o)
            }
        }, n = function(e) {
            $(e).find(".navigation-focus.js-navigation-item").removeClass("navigation-focus")
        }, _ = function(e, t) {
            n(t), u(e, t)
        }, a = function(e, t) {
            var n, r, i, o, a;
            if (i = h(t), r = $.inArray(e, i), a = i[r - 1]) {
                if (n = f(a, t)) return;
                o = $(a).overflowParent()[0], "page" === p(t) ? k(o, a) : C(o, a)
            }
        }, o = function(e, t) {
            var n, r, i, o, a;
            if (i = h(t), r = $.inArray(e, i), o = i[r + 1]) {
                if (n = f(o, t)) return;
                a = $(o).overflowParent()[0], "page" === p(t) ? k(a, o) : C(a, o)
            }
        }, x = function(e, t) {
            var n, r, i, o, a;
            for (i = h(t), r = $.inArray(e, i), o = $(e).overflowParent()[0];
                (a = i[r - 1]) && $(a).overflowOffset(o).top >= 0;) r--;
            if (a) {
                if (n = f(a, t)) return;
                k(o, a)
            }
        }, w = function(e, t) {
            var n, r, i, o, a;
            for (i = h(t), r = $.inArray(e, i), a = $(e).overflowParent()[0];
                (o = i[r + 1]) && $(o).overflowOffset(a).bottom >= 0;) r++;
            if (o) {
                if (n = f(o, t)) return;
                k(a, o)
            }
        }, m = function(e, t) {
            null == t && (t = !1), $(e).fire("navigation:keyopen", {
                modifierKey: t
            })
        }, f = function(e, t) {
            var r;
            return r = $(e).fire("navigation:focus", function() {
                return n(t), e.classList.add("navigation-focus"), $(e).fire("navigation:focused", {
                    async: !0
                })
            }), r.isDefaultPrevented()
        }, d = function() {
            return $(".js-active-navigation-container")[0]
        }, h = function(e) {
            return $(e).find(".js-navigation-item").visible()
        }, p = function(e) {
            var t;
            return null != (t = $(e).attr("data-navigation-scroll")) ? t : "item"
        }, k = function(e, t) {
            var n, r, i, o;
            return r = $(t).positionedOffset(e), n = $(t).overflowOffset(e), n.bottom <= 0 ? $(e).scrollTo({
                top: r.top - 30,
                duration: 200
            }) : n.top <= 0 ? (i = null != e.offsetParent ? e.scrollHeight : $(document).height(), o = i - (r.bottom + n.height), $(e).scrollTo({
                top: o + 30,
                duration: 200
            })) : void 0
        }, C = function(e, t) {
            var n, r, i, o;
            return r = $(t).positionedOffset(e), n = $(t).overflowOffset(e), n.bottom <= 0 ? (i = null != e.offsetParent ? e.scrollHeight : $(document).height(), o = i - (r.bottom + n.height), $(e).scrollTo({
                top: o
            })) : n.top <= 0 ? $(e).scrollTo({
                top: r.top
            }) : void 0
        }, $.fn.navigation = function(t) {
            var r, i;
            if ("active" === t) return d();
            if (r = $(this).closest(".js-navigation-container")[0]) return i = {
                activate: function() {
                    return function() {
                        return e(r)
                    }
                }(this),
                deactivate: function() {
                    return function() {
                        return s(r)
                    }
                }(this),
                push: function() {
                    return function() {
                        return E(r)
                    }
                }(this),
                pop: function() {
                    return function() {
                        return T(r)
                    }
                }(this),
                focus: function(e) {
                    return function() {
                        return u(e, r)
                    }
                }(this),
                clear: function() {
                    return function() {
                        return n(r)
                    }
                }(this),
                refocus: function(e) {
                    return function() {
                        return _(e, r)
                    }
                }(this)
            }, "function" == typeof i[t] ? i[t]() : void 0
        }
    }.call(this),
    function() {
        $(document).on("keydown", function(e) {
            var t, n, r, i, o, a, s, c, l;
            if ("r" === e.hotkey && !e.isDefaultPrevented() && e.target === document.body && (c = window.getSelection(), r = $(c.focusNode), (l = $.trim(c.toString())) && (t = r.closest(".js-quote-selection-container"), t.length))) {
                if (o = $.Event("quote:selection"), t.trigger(o), o.isDefaultPrevented()) return !1;
                if (n = t.find(".js-quote-selection-target").visible().first(), a = n[0]) return s = "> " + l.replace(/\n/g, "\n> ") + "\n\n", (i = a.value) && (s = "" + i + "\n\n" + s), a.value = s, n.trigger("change"), n.scrollTo({
                    duration: 300
                }, function() {
                    return a.focus(), a.selectionStart = a.value.length, n.scrollTop(a.scrollHeight)
                }), e.preventDefault()
            }
        })
    }.call(this),
    function() {
        var e;
        null != window.getSelection && (e = function(t, n) {
            var r, i, o, a;
            if (t === n) return !0;
            for (a = t.childNodes, i = 0, o = a.length; o > i; i++)
                if (r = a[i], e(r, n)) return !0;
            return !1
        }, $(document).on("click", ".js-selectable-text", function() {
            var t, n;
            n = window.getSelection(), n.rangeCount && (t = n.getRangeAt(0).commonAncestorContainer, e(this, t) || n.selectAllChildren(this))
        }))
    }.call(this),
    function() {
        $.debounce = function(e, t) {
            var n;
            return n = null,
                function() {
                    n && clearTimeout(n), n = setTimeout(e, t)
                }
        }
    }.call(this),
    function() {
        var e, t;
        e = function() {
            var e, t, n;
            e = null, n = $.debounce(function() {
                return e = null
            }, 200), t = {
                x: 0,
                y: 0
            }, $(this).on("mousemove.userResize", function(r) {
                var i;
                (t.x !== r.clientX || t.y !== r.clientY) && (i = this.style.height, e && e !== i && $(this).trigger("user:resize"), e = i, n()), t = {
                    x: r.clientX,
                    y: r.clientY
                }
            })
        }, t = function() {
            $(this).off("mousemove.userResize")
        }, $.event.special["user:resize"] = {
            setup: e,
            teardown: t
        }
    }.call(this),
    function() {
        var e, t, n, r;
        n = function(e) {
            return $(e).on("user:resize.trackUserResize", function() {
                return $(e).addClass("is-user-resized"), $(e).css({
                    "max-height": ""
                })
            })
        }, r = function(e) {
            return $(e).off("user:resize.trackUserResize")
        }, $(document).on("reset", "form", function() {
            var e;
            e = $(this).find("textarea.js-size-to-fit"), e.removeClass("is-user-resized"), e.css({
                height: "",
                "max-height": ""
            })
        }), $.observe("textarea.js-size-to-fit", {
            add: n,
            remove: r
        }), e = function(e) {
            var t, n, r;
            t = $(e), n = null, r = function() {
                var r, i, o, a;
                e.value !== n && t.is($.visible) && (a = t.overflowOffset(), a.top < 0 || a.bottom < 0 || (o = t.outerHeight() + a.bottom, e.style.maxHeight = "" + (o - 100) + "px", r = e.parentNode, i = r.style.height, r.style.height = $(r).css("height"), e.style.height = "auto", t.innerHeight(e.scrollHeight), r.style.height = i, n = e.value))
            }, t.on("change.sizeToFit", function() {
                return r()
            }), t.on("input.sizeToFit", function() {
                return r()
            }), e.value && r()
        }, t = function(e) {
            $(e).off(".sizeToFit")
        }, $.observe("textarea.js-size-to-fit:not(.is-user-resized)", {
            add: e,
            remove: t
        })
    }.call(this),
    function() {
        var e, t, n;
        t = 0, e = /^\(\d+\)\s+/, n = function() {
            var n;
            return n = t ? "(" + t + ") " : "", document.title = document.title.match(e) ? document.title.replace(e, n) : "" + n + document.title
        }, $.observe(".js-unread-item", {
            add: function() {
                return t++, n()
            },
            remove: function() {
                return t--, n()
            }
        })
    }.call(this),
    function() {
        $.fn.ajax = function(e) {
            var t, n, r, i, o;
            return null == e && (e = {}), o = $.Deferred(), 1 !== this.length ? (o.reject(), o.promise()) : (t = this[0], (i = this.attr("data-url")) ? (o = this.data("xhr")) ? o : (n = {
                type: "GET",
                url: i,
                context: t
            }, r = $.extend(n, e), o = $.ajax(r), this.data("xhr", o), o.always(function(e) {
                return function() {
                    return e.removeData("xhr")
                }
            }(this)), o) : (o.rejectWith(t), o.promise()))
        }
    }.call(this),
    function() {
        $.fn.hasDirtyFields = function() {
            var e, t, n, r;
            for (r = this.find("input, textarea"), t = 0, n = r.length; n > t; t++)
                if (e = r[t], e.value !== e.defaultValue) return !0;
            return !1
        }
    }.call(this),
    function() {
        $.fn.hasFocus = function() {
            var e, t;
            return (t = this[0]) ? (e = document.activeElement, t === e || $.contains(t, e)) : !1
        }
    }.call(this),
    function() {
        $.fn.hasMousedown = function() {
            var e;
            return (e = this[0]) ? $(e).is(":active") : !1
        }
    }.call(this),
    function() {
        $.fn.hasSelection = function() {
            var e, t, n;
            return (t = this[0]) ? (n = window.getSelection(), n && "Range" === n.type && null != n.focusNode ? (e = n.focusNode, t === e || $.contains(t, e)) : !1) : !1
        }
    }.call(this),
    function() {
        $.fn.markedAsDirty = function() {
            return this.closest(".js-dirty").length > 0 || this.find(".js-dirty").length > 0
        }
    }.call(this),
    function() {
        $.fn.hasInteractions = function() {
            return this.hasDirtyFields() || this.hasFocus() || this.hasMousedown() || this.hasSelection() || this.markedAsDirty()
        }
    }.call(this),
    function() {
        var e, t;
        $.fn.notScrolling = function() {
            return new Promise(function(e) {
                return function(n) {
                    return 1 === e.length ? t(e[0], n) : n()
                }
            }(this))
        }, e = 0, window.addEventListener("scroll", function(t) {
            e = t.timeStamp || (new Date).getTime()
        }, !0), t = function(t, n) {
            var r;
            return t === window && e < (new Date).getTime() - 500 ? void setImmediate(n) : (r = $.debounce(function() {
                return t.removeEventListener("scroll", r, !1), n()
            }, 500), t.addEventListener("scroll", r, !1), void r())
        }
    }.call(this),
    function() {
        var e;
        $.fn.scrollBy = function(t, n) {
            var r, i;
            return 0 === t && 0 === n ? [0, 0] : (i = e(this[0]), this.scrollTo({
                top: i.top + n,
                left: i.left + t
            }), r = e(this[0]), [r.left - i.left, r.top - i.top])
        }, e = function(e) {
            return e.offsetParent ? {
                top: $(e).scrollTop(),
                left: $(e).scrollLeft()
            } : {
                top: $(document).scrollTop(),
                left: $(document).scrollLeft()
            }
        }
    }.call(this),
    function() {
        $.fn.cumulativeScrollBy = function(e, t) {
            var n, r, i, o, a, s;
            for (r = i = 0, n = this.overflowParent(); n[0] && (s = n.scrollBy(e - r, t - i), o = s[0], a = s[1], r += o, i += a, r !== e || i !== t);) n = n.overflowParent()
        }
    }.call(this),
    function() {
        var e, t;
        $.fn.preservingScrollPosition = function(e) {
            return $.preservingScrollPosition(this[0], e), this
        }, $.preservingScrollPosition = function(n, r) {
            var i, o, a, s, c, l, u, f;
            return n ? (a = e(n), l = r.call(n), (o = t(a)) ? (n = o.element, c = o.top, s = o.left, f = n.getBoundingClientRect(), u = f.top, i = f.left, $(n).cumulativeScrollBy(i - s, u - c), l) : void 0) : r()
        }, e = function(e) {
            var t, n, r, i;
            for (n = []; e;) i = e.getBoundingClientRect(), r = i.top, t = i.left, n.push({
                element: e,
                top: r,
                left: t
            }), e = e.parentElement;
            return n
        }, t = function(e) {
            var t, n, r;
            for (n = 0, r = e.length; r > n; n++)
                if (t = e[n], $.contains(document, t.element)) return t
        }
    }.call(this),
    function() {
        $.interactiveElement = function() {
            var e, t, n;
            return document.activeElement !== document.body ? e = document.activeElement : (t = document.querySelectorAll(":hover"), (n = t.length) && (e = t[n - 1])), $(e)
        }
    }.call(this),
    function() {
        $.preserveInteractivePosition = function(e) {
            return $(window).notScrolling().then(function() {
                var t;
                return t = $.interactiveElement()[0], $.preservingScrollPosition(t, e)
            })
        }
    }.call(this),
    function() {
        var e, t;
        t = function(e, t, n) {
            var r, i;
            return r = e.value.substring(0, e.selectionEnd), i = e.value.substring(e.selectionEnd), r = r.replace(t, n), i = i.replace(t, n), e.value = r + i, e.selectionStart = r.length, e.selectionEnd = r.length
        }, e = function(e, t) {
            var n, r, i, o;
            return i = e.selectionEnd, n = e.value.substring(0, i), o = e.value.substring(i), r = "" === e.value || n.match(/\n$/) ? "" : "\n", e.value = n + r + t + o, e.selectionStart = i + t.length, e.selectionEnd = i + t.length
        }, $.fn.replaceText = function(e, n) {
            var r, i, o;
            for (i = 0, o = this.length; o > i; i++) r = this[i], t(r, e, n);
            return this
        }, $.fn.insertText = function(t) {
            var n, r, i;
            for (r = 0, i = this.length; i > r; r++) n = this[r], e(n, t);
            return this
        }
    }.call(this),
    function() {
        $.fn.touch = function(e) {
            var t, n, r, i, o;
            if (e)
                for (n = 0, i = this.length; i > n; n++) t = this[n], t.offsetHeight;
            else
                for (r = 0, o = this.length; o > r; r++) t = this[r], t.className = t.className;
            return this
        }
    }.call(this),
    function() {
        var e;
        e = new WeakMap, $(document).on("focusin.delay", function(t) {
            var n;
            n = t.target, e.get(n) || $(n).fire("focusin:delay", function() {
                e.set(n, !0), $(n).trigger("focusin:delayed")
            })
        }), $(document).on("focusout.delay", function(t) {
            return setTimeout(function() {
                var n;
                n = t.target, n !== document.activeElement && $(n).fire("focusout:delay", function() {
                    e["delete"](t.target), $(n).trigger("focusout:delayed")
                })
            }, 200)
        })
    }.call(this),
    function() {
        $.fn.onFocusedInput = function(e, t) {
            var n;
            return n = "focusInput" + Math.floor(1e3 * Math.random()), this.focused(e)["in"](function() {
                var e;
                return (e = t.call(this, n)) ? $(this).on("input." + n, e) : void 0
            }).out(function() {
                return $(this).off("." + n)
            }), this
        }
    }.call(this),
    function() {
        $.fn.onFocusedKeydown = function(e, t) {
            var n;
            return n = "focusKeydown" + Math.floor(1e3 * Math.random()), this.focused(e)["in"](function() {
                var e;
                return (e = t.call(this, n)) ? $(this).on("keydown." + n, e) : void 0
            }).out(function() {
                return $(this).off("." + n)
            }), this
        }
    }.call(this),
    function() {
        var e;
        e = /complete|loaded|interactive/, $.readyQueue = function(t) {
            var n, r, i, o, a, s, c;
            return r = [], o = 0, c = !1, s = function() {
                var e;
                c = !1, e = o, o = r.length, t(r.slice(e))
            }, a = function() {
                s(), document.removeEventListener("DOMContentLoaded", a, !1)
            }, i = function(t) {
                t && r.push(t), c || (e.test(document.readyState) ? setImmediate(s) : document.addEventListener("DOMContentLoaded", a, !1), c = !0)
            }, n = function() {
                r.length = o = 0, c = !1
            }, {
                handlers: r,
                push: i,
                clear: n
            }
        }
    }.call(this),
    function() {
        var e, t, n, r;
        n = $.readyQueue(function(e) {
            r(e, null, window.location.href)
        }), $.hashChange = n.push, e = window.location.href, $(window).on("popstate", function() {
            return e = window.location.href
        }), $(window).on("hashchange", function(t) {
            var i, o, a;
            o = null != (a = t.originalEvent.oldURL) ? a : e, i = window.location.href, r(n.handlers, o, i), e = i
        }), t = null, $(document).on("pjax:start", function() {
            return t = window.location.href
        }), $(document).on("pjax:end", function() {
            var e;
            return e = window.location.href, r(n.handlers, t, e)
        }), r = function(e, t, n) {
            var r, i, o, a, s, c;
            for ((o = window.location.hash.slice(1)) && (a = document.getElementById(o)), null == a && (a = window), r = {
                    oldURL: t,
                    newURL: n,
                    target: a
                }, s = 0, c = e.length; c > s; s++) i = e[s], i.call(a, r)
        }, $.hashChange.clear = function() {
            return n.clear()
        }
    }.call(this),
    function() {
        $.pageFocused = function() {
            return new Promise(function(e) {
                var t;
                return t = function() {
                    document.hasFocus() && (e(), document.removeEventListener("visibilitychange", t), window.removeEventListener("focus", t), window.removeEventListener("blur", t))
                }, document.addEventListener("visibilitychange", t), window.addEventListener("focus", t), window.addEventListener("blur", t), t()
            })
        }
    }.call(this),
    function() {
        var e, t, n;
        t = ["position:absolute;", "overflow:auto;", "word-wrap:break-word;", "top:0px;", "left:-9999px;"], n = ["box-sizing", "font-family", "font-size", "font-style", "font-variant", "font-weight", "height", "letter-spacing", "line-height", "max-height", "min-height", "padding-bottom", "padding-left", "padding-right", "padding-top", "border-bottom", "border-left", "border-right", "border-top", "text-decoration", "text-indent", "text-transform", "width", "word-spacing"], e = new WeakMap, $.fn.textFieldMirror = function(r) {
            var i, o, a, s, c, l, u, f, d, h, p, m;
            if ((h = this[0]) && (l = h.nodeName.toLowerCase(), "textarea" === l || "input" === l)) {
                if (s = e.get(h), s && s.parentElement === h.parentElement) s.innerHTML = "";
                else {
                    for (s = document.createElement("div"), e.set(h, s), f = window.getComputedStyle(h), u = t.slice(0), u.push("textarea" === l ? "white-space:pre-wrap;" : "white-space:nowrap;"), p = 0, m = n.length; m > p; p++) c = n[p], u.push("" + c + ":" + f.getPropertyValue(c) + ";");
                    s.style.cssText = u.join(" ")
                }
                return r !== !1 && (a = document.createElement("span"), a.style.cssText = "position: absolute;", a.className = "js-marker", a.innerHTML = "&nbsp;"), "number" == typeof r ? ((d = h.value.substring(0, r)) && (o = document.createTextNode(d)), (d = h.value.substring(r)) && (i = document.createTextNode(d))) : (d = h.value) && (o = document.createTextNode(d)), o && s.appendChild(o), a && s.appendChild(a), i && s.appendChild(i), s.parentElement || h.parentElement.insertBefore(s, h), s.scrollTop = h.scrollTop, s.scrollLeft = h.scrollLeft, s
            }
        }
    }.call(this),
    function() {
        $.fn.textFieldSelectionPosition = function(e) {
            var t, n, r;
            if ((r = this[0]) && (null == e && (e = r.selectionEnd), t = $(r).textFieldMirror(e))) return n = $(t).find(".js-marker").position(), n.top += parseInt($(t).css("border-top-width"), 10), n.left += parseInt($(t).css("border-left-width"), 10), setTimeout(function() {
                return $(t).remove()
            }, 5e3), n
        }
    }.call(this),
    function() {
        $.commafy = function(e) {
            return ("" + e).replace(/(^|[^\w.])(\d{4,})/g, function(e, t, n) {
                return t + n.replace(/\d(?=(?:\d\d\d)+(?!\d))/g, "$&,")
            })
        }
    }.call(this),
    function() {
        $.escapeHTML = function(e) {
            return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\//g, "&#x2F;")
        }
    }.call(this),
    function() {
        $.pluralize = function(e, t) {
            return t + (e > 1 || 0 === e ? "s" : "")
        }
    }.call(this),
    function() {
        var e, t, n, r, i, o, a, s, c;
        "ondragover" in window && (t = null, o = null, i = !1, a = function(e) {
            var r, a;
            a = e.target, a !== o && (i = n(e, o, a)), o = a, i && e.preventDefault(), clearTimeout(t), r = function() {
                return i = n(e, o, null), o = null
            }, t = setTimeout(r, 100)
        }, n = function(e, t, n) {
            var r;
            return r = !0, t && $(t).fire("drag:out", {
                originalEvent: e,
                dataTransfer: e.originalEvent.dataTransfer,
                relatedTarget: n
            }), n && $(n).fire("drag:over", {
                originalEvent: e,
                dataTransfer: e.originalEvent.dataTransfer,
                relatedTarget: t
            }, function() {
                return r = !1
            }), r
        }, e = 0, s = function() {
            1 === ++e && $(window).on("dragover", a)
        }, c = function() {
            0 === --e && $(window).off("dragover", a)
        }, r = function(e) {
            var t, n, r, i, o;
            return i = this, o = e.type, n = e.relatedTarget, t = e.handleObj, (!n || n !== i && !$.contains(i, n)) && (e.type = t.origType, r = t.handler.apply(this, arguments), e.type = o), r
        }, $.event.special["drag:out"] = {
            setup: s,
            teardown: c
        }, $.event.special["drag:over"] = {
            setup: s,
            teardown: c
        }, $.event.special["drag:enter"] = {
            handle: r,
            delegateType: "drag:over",
            bindType: "drag:over"
        }, $.event.special["drag:leave"] = {
            handle: r,
            delegateType: "drag:out",
            bindType: "drag:out"
        })
    }.call(this),
    function() {}.call(this);
