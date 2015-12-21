(function(window) {
    function Matrix() {}

    function matrixManagerFunction() {
        var t = new Matrix,
            e = function(e, s, i, a, r) {
                return t.reset().translate(a, r).rotate(e).scale(s, i).toCSS()
            },
            s = function(t) {
                return e(t.tr.r[2], t.tr.s[0], t.tr.s[1], t.tr.p[0], t.tr.p[1])
            };
        return {
            getMatrix: s
        }
    }

    function roundValues(t) {
        bm_rnd = t ? Math.round : function(t) {
            return t
        }
    }

    function styleDiv(t) {
        t.style.position = "absolute", t.style.top = 0, t.style.left = 0, t.style.display = "block", t.style.verticalAlign = "top", t.style.backfaceVisibility = t.style.webkitBackfaceVisibility = "hidden", styleUnselectableDiv(t)
    }

    function styleUnselectableDiv(t) {
        t.style.userSelect = "none", t.style.MozUserSelect = "none", t.style.webkitUserSelect = "none", t.style.oUserSelect = "none"
    }

    function BMEnterFrameEvent(t, e, s, i) {
        this.type = t, this.currentTime = e, this.totalTime = s, this.direction = 0 > i ? -1 : 1
    }

    function BMCompleteEvent(t, e) {
        this.type = t, this.direction = 0 > e ? -1 : 1
    }

    function BMCompleteLoopEvent(t, e, s, i) {
        this.type = t, this.currentLoop = e, this.totalLoops = s, this.direction = 0 > i ? -1 : 1
    }

    function BMSegmentStartEvent(t, e, s) {
        this.type = t, this.firstFrame = e, this.totalFrames = s
    }

    function addEventListener(t, e) {
        this._cbs[t] || (this._cbs[t] = []), this._cbs[t].push(e)
    }

    function removeEventListener(t, e) {
        if (e) {
            if (this._cbs[t]) {
                for (var s = 0, i = this._cbs[t].length; i > s;) this._cbs[t][s] === e && (this._cbs[t].splice(s, 1), s -= 1, i -= 1), s += 1;
                this._cbs[t].length || (this._cbs[t] = null)
            }
        } else this._cbs[t] = null
    }

    function triggerEvent(t, e) {
        if (this._cbs[t])
            for (var s = this._cbs[t].length, i = 0; s > i; i++) this._cbs[t][i](e)
    }

    function randomString(t, e) {
        void 0 === e && (e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        var s, i = "";
        for (s = t; s > 0; --s) i += e[Math.round(Math.random() * (e.length - 1))];
        return i
    }

    function componentToHex(t) {
        var e = t.toString(16);
        return 1 == e.length ? "0" + e : e
    }

    function fillToRgba(t, e) {
        if (!cachedColors[t]) {
            var s = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
            cachedColors[t] = parseInt(s[1], 16) + "," + parseInt(s[2], 16) + "," + parseInt(s[3], 16)
        }
        return "rgba(" + cachedColors[t] + "," + e + ")"
    }

    function RenderedFrame(t, e) {
        this.tr = t, this.o = e
    }

    function iterateDynamicProperties(t) {
        var e, s = this.dynamicProperties;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t)
    }

    function createElement(t, e, s) {
        if (!e) {
            var i = Object.create(t.prototype, s),
                a = {};
            return i && "[object Function]" === a.toString.call(i.init) && i.init(), i
        }
        e.prototype = Object.create(t.prototype), e.prototype.constructor = e, e.prototype.parent = t.prototype
    }

    function bezFunction() {
        function t(t, e, s, i, a, r) {
            return bm_abs((s - t) * (r - e) - (a - t) * (i - e)) < 1e-5
        }

        function e(t, e, s, i, a) {
            if (a || (a = ("bez_" + t + "_" + e + "_" + s + "_" + i).replace(/\./g, "p")), h[a]) return h[a];
            var r, n, o, m, l, p;
            return h[a] = function(a, h, d, f, c) {
                var u = h / c;
                a = u;
                for (var v, y = 0; ++y < 14 && (o = 3 * t, n = 3 * (s - t) - o, r = 1 - o - n, v = a * (o + a * (n + a * r)) - u, !(bm_abs(v) < .001));) a -= v / (o + a * (2 * n + 3 * r * a));
                p = 3 * e, l = 3 * (i - e) - p, m = 1 - p - l;
                var g = a * (p + a * (l + a * m));
                return f * g + d
            }, h[a]
        }

        function s(t) {
            this.segmentLength = 0, this.points = new Array(t)
        }

        function i(t, e) {
            this.partialLength = t, this.point = e
        }

        function a(e) {
            var a, r, n, o, h, m, l, p = e.s,
                d = e.e,
                f = e.to,
                c = e.ti,
                u = defaultCurveSegments,
                v = 0,
                y = null;
            (p[0] != d[0] || p[1] != d[1]) && t(p[0], p[1], d[0], d[1], p[0] + f[0], p[1] + f[1]) && t(p[0], p[1], d[0], d[1], d[0] + c[0], d[1] + c[1]) && (u = 2);
            var g = new s(u);
            for (n = f.length, a = 0; u > a; a += 1) {
                for (l = new Array(n), h = a / (u - 1), m = 0, r = 0; n > r; r += 1) o = bm_pow(1 - h, 3) * p[r] + 3 * bm_pow(1 - h, 2) * h * (p[r] + f[r]) + 3 * (1 - h) * bm_pow(h, 2) * (d[r] + c[r]) + bm_pow(h, 3) * d[r], l[r] = o, null !== y && (m += bm_pow(l[r] - y[r], 2));
                m = bm_sqrt(m), v += m, g.points[a] = new i(m, l), y = l
            }
            g.segmentLength = v, e.bezierData = g
        }

        function r(t, e) {
            var s = e.segments,
                i = s.length,
                a = bm_floor((i - 1) * t),
                r = t * e.addedLength,
                n = 0;
            if (r == s[a].l) return s[a].p;
            for (var o = s[a].l > r ? -1 : 1, h = !0; h;) s[a].l <= r && s[a + 1].l > r ? (n = (r - s[a].l) / (s[a + 1].l - s[a].l), h = !1) : a += o, (0 > a || a >= i - 1) && (h = !1);
            return s[a].p + (s[a + 1].p - s[a].p) * n
        }

        function n() {
            this.pt1 = new Array(2), this.pt2 = new Array(2), this.pt3 = new Array(2), this.pt4 = new Array(2)
        }

        function o(t, e, s, i, a, o, h) {
            var m = new n;
            a = 0 > a ? 0 : a;
            var l = r(a, h);
            o = o > 1 ? 1 : o;
            var p, d = r(o, h),
                f = t.length,
                c = 1 - l,
                u = 1 - d;
            for (p = 0; f > p; p += 1) m.pt1[p] = c * c * c * t[p] + (l * c * c + c * l * c + c * c * l) * s[p] + (l * l * c + c * l * l + l * c * l) * i[p] + l * l * l * e[p], m.pt3[p] = c * c * u * t[p] + (l * c * u + c * l * u + c * c * d) * s[p] + (l * l * u + c * l * d + l * c * d) * i[p] + l * l * d * e[p], m.pt4[p] = c * u * u * t[p] + (l * u * u + c * d * u + c * u * d) * s[p] + (l * d * u + c * d * d + l * u * d) * i[p] + l * d * d * e[p], m.pt2[p] = u * u * u * t[p] + (d * u * u + u * d * u + u * u * d) * s[p] + (d * d * u + u * d * d + d * u * d) * i[p] + d * d * d * e[p];
            return m
        }
        var h = [],
            m = (Math, function() {
                var e = {};
                return function(s, i, a, r) {
                    var n = (s.join("_") + "_" + i.join("_") + "_" + a.join("_") + "_" + r.join("_")).replace(/\./g, "p");
                    if (e[n]) return e[n];
                    var o, h, m, l, p, d, f = defaultCurveSegments,
                        c = 0,
                        u = [],
                        v = [],
                        y = {
                            addedLength: 0,
                            segments: []
                        };
                    for ((s[0] != i[0] || s[1] != i[1]) && t(s[0], s[1], i[0], i[1], a[0], a[1]) && t(s[0], s[1], i[0], i[1], r[0], r[1]) && (f = 2), m = a.length, o = 0; f > o; o += 1) {
                        for (p = o / (f - 1), d = 0, h = 0; m > h; h += 1) l = bm_pow(1 - p, 3) * s[h] + 3 * bm_pow(1 - p, 2) * p * a[h] + 3 * (1 - p) * bm_pow(p, 2) * r[h] + bm_pow(p, 3) * i[h], u[h] = l, null !== v[h] && (d += bm_pow(u[h] - v[h], 2)), v[h] = u[h];
                        d && (d = bm_sqrt(d), c += d), y.segments.push({
                            l: c,
                            p: p
                        })
                    }
                    return y.addedLength = c, e[n] = y, y
                }
            }());
        return {
            getEasingCurve: e,
            getBezierLength: m,
            getNewSegment: o,
            buildBezierData: a
        }
    }

    function dataFunctionManager() {
        function t(a, r) {
            var n, o, h, m, l, p, d, f, c = a.length;
            for (m = 0; c > m; m += 1)
                if (n = a[m], "ks" in n && !n.completed) {
                    if (n.completed = !0, n.tt && (a[m - 1].td = n.tt), o = [], h = -1, n.hasMask) {
                        var u = n.masksProperties;
                        for (p = u.length, l = 0; p > l; l += 1)
                            if (u[l].pt.i) i(u[l].pt);
                            else
                                for (f = u[l].pt.length, d = 0; f > d; d += 1) u[l].pt[d].s && i(u[l].pt[d].s[0]), u[l].pt[d].e && i(u[l].pt[d].e[0])
                    }
                    0 === n.ty ? (n.layers = e(n.refId, r), t(n.layers, r)) : 4 === n.ty && s(n.shapes)
                }
        }

        function e(t, e) {
            for (var s = 0, i = e.length; i > s;) {
                if (e[s].id === t) return JSON.parse(JSON.stringify(e[s].layers));
                s += 1
            }
        }

        function s(t, e) {
            var a, r, n, o = t.length,
                h = e ? e : !1;
            for (a = o - 1; a >= 0; a -= 1)
                if ("tm" == t[a].ty && (h = !0), "sh" == t[a].ty)
                    if (t[a].trimmed = h, t[a].ks.i) i(t[a].ks);
                    else
                        for (n = t[a].ks.length, r = 0; n > r; r += 1) t[a].ks[r].s && i(t[a].ks[r].s[0]), t[a].ks[r].e && i(t[a].ks[r].e[0]);
            else "gr" == t[a].ty && s(t[a].it, h)
        }

        function i(t) {
            var e, s = t.i.length;
            for (e = 0; s > e; e += 1) t.i[e][0] += t.v[e][0], t.i[e][1] += t.v[e][1], t.o[e][0] += t.v[e][0], t.o[e][1] += t.v[e][1]
        }

        function a(e) {
            t(e.layers, e.assets)
        }
        var r = {};
        return r.completeData = a, r
    }

    function SVGRenderer(t) {
        this.animationItem = t, this.layers = null, this.lastFrame = -1, this.globalData = {
            frameNum: -1
        }, this.elements = [], this.destroyed = !1
    }

    function CanvasRenderer(t, e) {
        this.animationItem = t, this.renderConfig = {
            clearCanvas: e && e.clearCanvas || !0,
            context: e && e.context || null,
            scaleMode: e && e.scaleMode || "fit"
        }, this.renderConfig.dpr = e && e.dpr || 1, this.animationItem.wrapper && (this.renderConfig.dpr = e && e.dpr || window.devicePixelRatio || 1), this.lastFrame = -1, this.globalData = {
            frameNum: -1
        }, this.contextData = {
            saved: new Array(15),
            savedOp: new Array(15),
            cArrPos: 0,
            cTr: new Matrix,
            cO: 1
        };
        var s, i = 15;
        for (s = 0; i > s; s += 1) this.contextData.saved[s] = new Array(6);
        this.elements = []
    }

    function MaskElement(t, e, s) {
        this.dynamicProperties = [], this.data = t, this.element = e, this.globalData = s, this.paths = [], this.masksProperties = this.data.masksProperties, this.viewData = new Array(this.masksProperties.length), this.maskElement = null, this.firstFrame = !0;
        var i, a, r, n, o, h = this.element.maskedElement,
            m = this.globalData.defs,
            l = this.masksProperties.length,
            p = this.data.masksProperties,
            d = 0,
            f = [],
            c = randomString(10),
            u = "clipPath",
            v = "clip-path";
        for (i = 0; l > i; i++)
            if (("a" !== p[i].mode && "n" !== p[i].mode || p[i].inv) && (u = "mask", v = "mask"), "s" != p[i].mode && "i" != p[i].mode || 0 != d || (o = document.createElementNS(svgNS, "rect"), o.setAttribute("fill", "#ffffff"), o.setAttribute("x", "0"), o.setAttribute("y", "0"), o.setAttribute("width", "100%"), o.setAttribute("height", "100%"), f.push(o)), "n" != p[i].mode) {
                if (d += 1, a = document.createElementNS(svgNS, "path"), p[i].cl ? "s" == p[i].mode ? a.setAttribute("fill", "#000000") : a.setAttribute("fill", "#ffffff") : (a.setAttribute("fill", "none"), "s" == p[i].mode ? a.setAttribute("fill", "#000000") : a.setAttribute("fill", "#ffffff"), a.setAttribute("stroke-width", "1"), a.setAttribute("stroke-miterlimit", "10")), a.setAttribute("clip-rule", "nonzero"), "i" == p[i].mode) {
                    n = f.length;
                    var y = document.createElementNS(svgNS, "g");
                    for (r = 0; n > r; r += 1) y.appendChild(f[r]);
                    var g = document.createElementNS(svgNS, "mask");
                    g.setAttribute("mask-type", "alpha"), g.setAttribute("id", c + "_" + d), g.appendChild(a), m.appendChild(g), y.setAttribute("mask", "url(#" + c + "_" + d + ")"), f.length = 0, f.push(y)
                } else f.push(a);
                p[i].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[i] = {
                    elem: a,
                    lastPath: "",
                    prop: PropertyFactory.getShapeProp(this.data, p[i], 3, this.dynamicProperties)
                }, this.viewData[i].prop.k || this.drawPath(p[i], this.viewData[i].prop.v, this.viewData[i])
            }
        for (this.maskElement = document.createElementNS(svgNS, u), l = f.length, i = 0; l > i; i += 1) this.maskElement.appendChild(f[i]);
        this.maskElement.setAttribute("id", c), d > 0 && h.setAttribute(v, "url(#" + c + ")"), m.appendChild(this.maskElement)
    }

    function BaseElement() {}

    function SVGBaseElement(t, e, s, i) {
        this.globalData = s, this.data = t, this.matteElement = null, this.parentContainer = e, this.layerId = i ? i.layerId : "ly_" + randomString(10), this.placeholder = i, this.init()
    }

    function ICompElement(t, e, s, i) {
        this.parent.constructor.call(this, t, e, s, i), this.layers = t.layers, this.data.tm && (this.tm = PropertyFactory.getProp(this.data, this.data.tm, 0, s.frameRate, this.dynamicProperties))
    }

    function IImageElement(t, e, s, i) {
        this.assetData = s.getAssetData(t.refId), this.path = s.getPath(), this.parent.constructor.call(this, t, e, s, i)
    }

    function IShapeElement(t, e, s, i) {
        this.shapes = [], this.parent.constructor.call(this, t, e, s, i)
    }

    function ShapeItemElement(t, e, s, i, a, r) {
        this.shape = e, this.parentContainer = s, this.placeholder = i, this.lcEnum = {
            1: "butt",
            2: "round",
            3: "butt"
        }, this.ljEnum = {
            1: "miter",
            2: "round",
            3: "bevel"
        }, this.stylesList = [], this.viewData = [], this.elemData = t, this.data = t.shapes, this.globalData = r, this.firstFrame = !0, this.searchShapes(this.data, this.viewData, a, []), styleUnselectableDiv(this.shape)
    }

    function ISolidElement(t, e, s, i) {
        this.parent.constructor.call(this, t, e, s, i)
    }

    function ITextElement(t, e, s, i) {
        this.parent.constructor.call(this, t, e, s, i)
    }

    function CVBaseElement(t, e) {
        this.globalData = e, this.data = t, this.canvasContext = e.canvasContext, this.init()
    }

    function CVCompElement(t, e) {
        this.parent.constructor.call(this, t, e), this.layers = t.layers, this.data.tm && (this.tm = PropertyFactory.getProp(this.data, this.data.tm, 0, e.frameRate, this.dynamicProperties))
    }

    function CVImageElement(t, e) {
        this.animationItem = e.renderer.animationItem, this.assetData = this.animationItem.getAssetData(t.refId), this.path = this.animationItem.getPath(), this.parent.constructor.call(this, t, e), this.animationItem.pendingElements += 1
    }

    function CVShapeElement(t, e) {
        this.shapes = [], this.parent.constructor.call(this, t, e)
    }

    function CVShapeItemElement(t, e, s) {
        this.lcEnum = {
            1: "butt",
            2: "round",
            3: "butt"
        }, this.ljEnum = {
            1: "miter",
            2: "round",
            3: "bevel"
        }, this.stylesList = [], this.viewData = [], this.elemData = t, this.data = t.shapes, this.globalData = s, this.firstFrame = !0, this.searchShapes(this.data, this.viewData, e, [])
    }

    function CVSolidElement(t, e) {
        this.parent.constructor.call(this, t, e)
    }

    function CVTextElement(t, e) {
        this.parent.constructor.call(this, t, e)
    }

    function CVMaskElement(t, e, s) {
        this.data = t, this.element = e, this.globalData = s, this.dynamicProperties = [], this.masksProperties = this.data.masksProperties, this.totalMasks = this.masksProperties.length, this.ctx = this.element.canvasContext, this.viewData = new Array(this.masksProperties.length);
        var i, a = this.masksProperties.length;
        for (i = 0; a > i; i++) this.viewData[i] = PropertyFactory.getShapeProp(this.data, this.masksProperties[i], 3, this.dynamicProperties)
    }
    var svgNS = "http://www.w3.org/2000/svg",
        Matrix = function() {
            function t() {
                return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 1, this.props[4] = 0, this.props[5] = 0, this
            }

            function e(t) {
                if (0 === t) return this;
                var e = Math.cos(t),
                    s = Math.sin(t);
                return this._t(e, s, -s, e, 0, 0)
            }

            function s(t, e) {
                return 1 == t && 1 == e ? this : this._t(t, 0, 0, e, 0, 0)
            }

            function i(t, e, s, i, a, r) {
                return this.props[0] = t, this.props[1] = e, this.props[2] = s, this.props[3] = i, this.props[4] = a, this.props[5] = r, this
            }

            function a(t, e) {
                return (0 !== t || 0 !== e) && (this.props[4] = this.props[0] * t + this.props[2] * e + this.props[4], this.props[5] = this.props[1] * t + this.props[3] * e + this.props[5]), this
            }

            function r(t, e, s, i, a, r) {
                var n = this.props[0],
                    o = this.props[1],
                    h = this.props[2],
                    m = this.props[3],
                    l = this.props[4],
                    p = this.props[5];
                return 1 === t && 0 === e && 0 === s && 1 === i ? ((0 !== a || 0 !== r) && (this.props[4] = this.props[0] * a + this.props[2] * r + this.props[4], this.props[5] = this.props[1] * a + this.props[3] * r + this.props[5]), this) : (this.props[0] = n * t + h * e, this.props[1] = o * t + m * e, this.props[2] = n * s + h * i, this.props[3] = o * s + m * i, this.props[4] = n * a + h * r + l, this.props[5] = o * a + m * r + p, this)
            }

            function n(t, e) {
                return {
                    x: t * this.props[0] + e * this.props[2] + this.props[4],
                    y: t * this.props[1] + e * this.props[3] + this.props[5]
                }
            }

            function o(t, e) {
                return [t * this.props[0] + e * this.props[2] + this.props[4], t * this.props[1] + e * this.props[3] + this.props[5]]
            }

            function h(t, e) {
                return bm_rnd(t * this.props[0] + e * this.props[2] + this.props[4]) + "," + bm_rnd(t * this.props[1] + e * this.props[3] + this.props[5])
            }

            function m() {
                return [this.props[0], this.props[1], this.props[2], this.props[3], this.props[4], this.props[5]]
            }

            function l() {
                return this.cssParts[1] = this.props.join(","), this.cssParts.join("")
            }

            function p() {
                return "" + this.toArray()
            }
            return function() {
                this.reset = t, this.rotate = e, this.scale = s, this.setTransform = i, this.translate = a, this.transform = r, this.applyToPoint = n, this.applyToPointArray = o, this.applyToPointStringified = h, this.toArray = m, this.toCSS = l, this.toString = p, this._t = this.transform, this.props = [1, 0, 0, 1, 0, 0], this.cssParts = ["matrix(", "", ")"]
            }
        }(),
        MatrixManager = matrixManagerFunction;
    ! function() {
        for (var t = 0, e = ["ms", "moz", "webkit", "o"], s = 0; s < e.length && !window.requestAnimationFrame; ++s) window.requestAnimationFrame = window[e[s] + "RequestAnimationFrame"], window.cancelAnimationFrame = window[e[s] + "CancelAnimationFrame"] || window[e[s] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function(e, s) {
            var i = (new Date).getTime(),
                a = Math.max(0, 16 - (i - t)),
                r = window.setTimeout(function() {
                    e(i + a)
                }, a);
            return t = i + a, r
        }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(t) {
            clearTimeout(t)
        })
    }();
    var subframeEnabled = !0,
        cachedColors = {},
        bm_rounder = Math.round,
        bm_rnd, bm_pow = Math.pow,
        bm_sqrt = Math.sqrt,
        bm_abs = Math.abs,
        bm_floor = Math.floor,
        bm_min = Math.min,
        defaultCurveSegments = 50,
        degToRads = Math.PI / 180;
    roundValues(!1);
    var rgbToHex = function() {
            var t, e, s = [];
            for (t = 0; 256 > t; t += 1) e = t.toString(16), s[t] = 1 == e.length ? "0" + e : e;
            return function(t, e, i) {
                return 0 > t && (t = 0), 0 > e && (e = 0), 0 > i && (i = 0), "#" + s[t] + s[e] + s[i]
            }
        }(),
        fillColorToString = function() {
            var t = [];
            return function(e, s) {
                return void 0 !== s && (e[3] = s), t[e[0]] || (t[e[0]] = {}), t[e[0]][e[1]] || (t[e[0]][e[1]] = {}), t[e[0]][e[1]][e[2]] || (t[e[0]][e[1]][e[2]] = {}), t[e[0]][e[1]][e[2]][e[3]] || (t[e[0]][e[1]][e[2]][e[3]] = "rgba(" + e.join(",") + ")"), t[e[0]][e[1]][e[2]][e[3]]
            }
        }(),
        bez = bezFunction(),
        dataManager = dataFunctionManager(),
        PropertyFactory = function() {
            function t(t) {
                if (this.mdf = !1, this.lastFrame !== p && (this.lastFrame >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t >= this.keyframes[this.keyframes.length - 1].t - this.offsetTime || this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime));
                else {
                    for (var e, s, i = 0, a = this.keyframes.length - 1, r = 1, n = !0; !(!n || (e = this.keyframes[i], s = this.keyframes[i + 1], i == a - 1 && t >= s.t - this.offsetTime) || s.t - this.offsetTime > t);) a - 1 > i ? i += r : n = !1;
                    var o, h, m, l, d, f = 0;
                    if (e.to) {
                        e.bezierData || bez.buildBezierData(e);
                        var c = e.bezierData;
                        if (t >= s.t - this.offsetTime || t < e.t - this.offsetTime) {
                            var u = t >= s.t - this.offsetTime ? c.points.length - 1 : 0;
                            for (h = c.points[u].point.length, o = 0; h > o; o += 1) this.v[o] = this.mult ? c.points[u].point[o] * this.mult : c.points[u].point[o], this.lastValue[o] !== this.v[o] && (this.mdf = !0, this.lastValue[o] = this.v[o])
                        } else {
                            e.__fnct ? d = e.__fnct : (d = bez.getEasingCurve(e.o.x, e.o.y, e.i.x, e.i.y, e.n), e.__fnct = d), m = d("", t - (e.t - this.offsetTime), 0, 1, s.t - this.offsetTime - (e.t - this.offsetTime));
                            var v, y = c.segmentLength * m,
                                g = 0;
                            for (r = 1, n = !0, l = c.points.length; n;) {
                                if (g += c.points[f].partialLength * r, 0 === y || 0 === m || f == c.points.length - 1) {
                                    for (h = c.points[f].point.length, o = 0; h > o; o += 1) this.v[o] = this.mult ? c.points[f].point[o] * this.mult : c.points[f].point[o], this.lastValue[o] !== this.v[o] && (this.mdf = !0, this.lastValue[o] = this.v[o]);
                                    break
                                }
                                if (y > g && y < g + c.points[f + 1].partialLength) {
                                    for (v = (y - g) / c.points[f + 1].partialLength, h = c.points[f].point.length, o = 0; h > o; o += 1) this.v[o] = this.mult ? (c.points[f].point[o] + (c.points[f + 1].point[o] - c.points[f].point[o]) * v) * this.mult : c.points[f].point[o] + (c.points[f + 1].point[o] - c.points[f].point[o]) * v, this.lastValue[o] !== this.v[o] && (this.mdf = !0, this.lastValue[o] = this.v[o]);
                                    break
                                }
                                l - 1 > f && 1 == r || f > 0 && -1 == r ? f += r : n = !1
                            }
                        }
                    } else {
                        var b, E, C, S, w, P = !1;
                        for (a = e.s.length, i = 0; a > i; i += 1) 1 !== e.h && (e.o.x instanceof Array ? (P = !0, e.__fnct || (e.__fnct = []), e.__fnct[i] || (b = e.o.x[i] ? e.o.x[i] : e.o.x[0], E = e.o.y[i] ? e.o.y[i] : e.o.y[0], C = e.i.x[i] ? e.i.x[i] : e.i.x[0], S = e.i.y[i] ? e.i.y[i] : e.i.y[0])) : (P = !1, e.__fnct || (b = e.o.x, E = e.o.y, C = e.i.x, S = e.i.y)), P ? e.__fnct[i] ? d = e.__fnct[i] : (d = bez.getEasingCurve(b, E, C, S), e.__fnct[i] = d) : e.__fnct ? d = e.__fnct : (d = bez.getEasingCurve(b, E, C, S), e.__fnct = d), m = t >= s.t - this.offsetTime ? 1 : t < e.t - this.offsetTime ? 0 : d("", t - (e.t - this.offsetTime), 0, 1, s.t - this.offsetTime - (e.t - this.offsetTime))), w = 1 === e.h ? e.s[i] : e.s[i] + (e.e[i] - e.s[i]) * m, 1 === a ? (this.v = this.mult ? w * this.mult : w, this.lastValue != this.v && (this.mdf = !0, this.lastValue = this.v)) : (this.v[i] = this.mult ? w * this.mult : w, this.lastValue[i] !== this.v[i] && (this.mdf = !0, this.lastValue[i] = this.v[i]))
                    }
                }
                this.lastFrame = t
            }

            function e(t) {
                if (this.mdf = !1, this.lastFrame !== p && (this.lastFrame < this.keyframes[0].t - this.offsetTime && t < this.keyframes[0].t - this.offsetTime || this.lastFrame > this.keyframes[this.keyframes.length - 1].t - this.offsetTime && t > this.keyframes[this.keyframes.length - 1].t - this.offsetTime));
                else if (t < this.keyframes[0].t - this.offsetTime) this.mdf = !0, this.v = this.keyframes[0].s[0];
                else if (t > this.keyframes[this.keyframes.length - 1].t - this.offsetTime) this.mdf = !0, this.v = 1 === this.keyframes[this.keyframes.length - 2].h ? this.keyframes[this.keyframes.length - 2].s[0] : this.keyframes[this.keyframes.length - 2].e[0];
                else {
                    this.mdf = !0;
                    for (var e, s, i, a, r, n, o = 0, h = this.keyframes.length - 1, m = 1, l = !0; l && (e = this.keyframes[o], s = this.keyframes[o + 1], !(s.t - this.offsetTime > t && 1 == m));) h - 1 > o && 1 == m || o > 0 && -1 == m ? o += m : l = !1;
                    var d;
                    if (1 !== e.h) {
                        var f;
                        e.__fnct ? f = e.__fnct : (f = bez.getEasingCurve(e.o.x, e.o.y, e.i.x, e.i.y), e.__fnct = f), d = t >= s.t - this.offsetTime ? 1 : t < e.t - this.offsetTime ? 0 : f("", t - (e.t - this.offsetTime), 0, 1, s.t - this.offsetTime - (e.t - this.offsetTime))
                    }
                    for (a = this.shapeData.i.length, n = e.s[0].i[0].length, i = 0; a > i; i += 1)
                        for (r = 0; n > r; r += 1) 1 === e.h ? (this.shapeData.i[i][r] = e.s[0].i[i][r], this.shapeData.o[i][r] = e.s[0].o[i][r], this.shapeData.v[i][r] = e.s[0].v[i][r]) : (this.shapeData.i[i][r] = e.s[0].i[i][r] + (e.e[0].i[i][r] - e.s[0].i[i][r]) * d, this.shapeData.o[i][r] = e.s[0].o[i][r] + (e.e[0].o[i][r] - e.s[0].o[i][r]) * d, this.shapeData.v[i][r] = e.s[0].v[i][r] + (e.e[0].v[i][r] - e.s[0].v[i][r]) * d);
                    this.v = this.shapeData
                }
                this.lastFrame = t
            }

            function s(t, e) {
                e = e ? e : 1, this.v = t * e, this.mdf = !1, this.k = !1
            }

            function i(t, e) {
                if (e) {
                    var s, i = t.length;
                    for (s = 0; i > s; s += 1) t[s] *= e
                }
                this.v = t, this.mdf = !1, this.k = !1
            }

            function a(e, s, i) {
                this.keyframes = s, this.offsetTime = e.st, this.lastValue = -99999, this.k = !0, this.mult = i, this.lastFrame = p, this.getInterpolatedValue = t
            }

            function r(e, s, i) {
                this.keyframes = s, this.offsetTime = e.st, this.k = !0, this.mult = i, this.getInterpolatedValue = t, this.v = new Array(s[0].s.length), this.lastValue = new Array(s[0].s.length), this.lastFrame = p
            }

            function n(t, e, n, o, h) {
                if (2 === n) return new d(t, e, h);
                if (7 === n) return new u(t, e, h);
                if (e.length) {
                    if ("number" == typeof e[0]) return new i(e, o);
                    switch (n) {
                        case 0:
                            h.push(new a(t, e, o));
                            break;
                        case 1:
                            h.push(new r(t, e, o))
                    }
                    return h[h.length - 1]
                }
                return new s(e, o)
            }

            function o(t, e) {
                this.k = !1, this.mdf = !1, this.closed = 3 === e ? t.cl : t.closed, this.shapeData = t.ks, this.v = 3 === e ? t.pt : t.ks
            }

            function h(t, s, i, a) {
                this.offsetTime = t.st, this.getInterpolatedValue = e, this.keyframes = 3 === a ? s.pt : s.ks, this.k = !0, this.closed = 3 === a ? s.cl : s.closed;
                var r, n = this.keyframes[0].s[0].i.length,
                    o = this.keyframes[0].s[0].i[0].length;
                for (this.shapeData = {
                        i: new Array(n),
                        o: new Array(n),
                        v: new Array(n)
                    }, r = 0; n > r; r += 1) this.shapeData.i[r] = new Array(o), this.shapeData.o[r] = new Array(o), this.shapeData.v[r] = new Array(o);
                this.lastFrame = p, i.push(this)
            }

            function m(t, e, s, i, a) {
                var r;
                if (3 === s || 4 === s) {
                    var n = 3 === s ? e.pt : e.ks;
                    r = n.length ? new h(t, e, i, s) : new o(e, s, i)
                } else 5 === s ? r = new c(t, e, i) : 6 === s && (r = new f(t, e, i));
                var m = !1;
                if (a)
                    for (var l = 0, p = a.length; p > l;) {
                        if (!a[l].closed) {
                            m = !0;
                            break
                        }
                        l += 1
                    }
                return m ? new v(r, a, i) : r
            }

            function l(t, e, s, i) {
                return new y(t, e, s, i)
            }
            var p = -999999,
                d = function() {
                    function t(t) {
                        var e, s = this.dynamicProperties.length;
                        for (this.mdf = !1, e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                        this.mdf && (this.data.p.s ? this.v.reset().translate(this.p.x.v, this.p.y.v).rotate(this.r.v).scale(this.s.v[0], this.s.v[1]).translate(-this.a.v[0], -this.a.v[1]) : this.v.reset().translate(this.p.v[0], this.p.v[1]).rotate(this.r.v).scale(this.s.v[0], this.s.v[1]).translate(-this.a.v[0], -this.a.v[1]))
                    }
                    return function(e, o, h) {
                        this.dynamicProperties = [], this.mdf = !1, this.data = o, this.getInterpolatedValue = t, "number" == typeof o.a[0] ? this.a = new i(o.a) : (this.a = new r(e, o.a, 0), this.dynamicProperties.push(this.a)), o.p.s ? this.p = {
                            x: n(e, o.p.x, 0, 0, this.dynamicProperties),
                            y: n(e, o.p.y, 0, 0, this.dynamicProperties)
                        } : "number" == typeof o.p[0] ? this.p = new i(o.p) : (this.p = new r(e, o.p, 0), this.dynamicProperties.push(this.p)), "number" == typeof o.s[0] ? this.s = new i(o.s, .01) : (this.s = new r(e, o.s, .01), this.dynamicProperties.push(this.s)), o.r.length ? (this.r = new a(e, o.r, degToRads), this.dynamicProperties.push(this.r)) : this.r = new s(o.r, degToRads), this.dynamicProperties.length ? (h.push(this), this.v = new Matrix) : this.v = this.data.p.s ? (new Matrix).translate(this.p.x.v, this.p.y.v).rotate(this.r.v).scale(this.s.v[0], this.s.v[1]).translate(-this.a.v[0], -this.a.v[1]) : (new Matrix).translate(this.p.v[0], this.p.v[1]).rotate(this.r.v).scale(this.s.v[0], this.s.v[1]).translate(-this.a.v[0], -this.a.v[1])
                    }
                }(),
                f = function() {
                    function t() {
                        var t = this.p.v[0],
                            e = this.p.v[1],
                            i = this.s.v[0] / 2,
                            a = this.s.v[1] / 2;
                        2 !== this.d && 3 !== this.d ? (this.v.v[0] = [t, e - a], this.v.i[0] = [t - i * s, e - a], this.v.o[0] = [t + i * s, e - a], this.v.v[1] = [t + i, e], this.v.i[1] = [t + i, e - a * s], this.v.o[1] = [t + i, e + a * s], this.v.v[2] = [t, e + a], this.v.i[2] = [t + i * s, e + a], this.v.o[2] = [t - i * s, e + a], this.v.v[3] = [t - i, e], this.v.i[3] = [t - i, e + a * s], this.v.o[3] = [t - i, e - a * s]) : (this.v.v[0] = [t, e - a], this.v.o[0] = [t - i * s, e - a], this.v.i[0] = [t + i * s, e - a], this.v.v[1] = [t - i, e], this.v.o[1] = [t - i, e + a * s], this.v.i[1] = [t - i, e - a * s], this.v.v[2] = [t, e + a], this.v.o[2] = [t + i * s, e + a], this.v.i[2] = [t - i * s, e + a], this.v.v[3] = [t + i, e], this.v.o[3] = [t + i, e - a * s], this.v.i[3] = [t + i, e + a * s])
                    }

                    function e(t) {
                        var e, s = this.dynamicProperties.length;
                        for (this.mdf = !1, e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                        this.mdf && this.convertEllToPath()
                    }
                    var s = .5519;
                    return function(s, a, n) {
                        this.v = {
                            v: new Array(4),
                            i: new Array(4),
                            o: new Array(4),
                            c: !0
                        }, this.d = a.d, this.dynamicProperties = [], a.closed = !0, this.closed = !0, this.mdf = !1, this.getInterpolatedValue = e, this.convertEllToPath = t, "number" == typeof a.p[0] ? this.p = new i(a.p) : (this.p = new r(s, a.p, 0), this.dynamicProperties.push(this.p)), "number" == typeof a.s[0] ? this.s = new i(a.s) : (this.s = new r(s, a.s, 0), this.dynamicProperties.push(this.s)), this.dynamicProperties.length ? n.push(this) : this.convertEllToPath()
                    }
                }(),
                c = function() {
                    function t(t) {
                        var e, s = this.dynamicProperties.length;
                        for (this.mdf = !1, e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t), this.dynamicProperties[e].mdf && (this.mdf = !0);
                        this.mdf && this.convertRectToPath()
                    }

                    function e() {
                        var t = this.p.v[0],
                            e = this.p.v[1],
                            s = this.s.v[0] / 2,
                            i = this.s.v[1] / 2,
                            a = bm_min(s, i, this.r.v),
                            r = a * (1 - .5519);
                        2 === this.d || 1 === this.d ? (this.v.v[0] = [t + s, e - i + a], this.v.o[0] = this.v.v[0], this.v.i[0] = [t + s, e - i + r], this.v.v[1] = [t + s, e + i - a], this.v.o[1] = [t + s, e + i - r], this.v.i[1] = this.v.v[1], this.v.v[2] = [t + s - a, e + i], this.v.o[2] = this.v.v[2], this.v.i[2] = [t + s - r, e + i], this.v.v[3] = [t - s + a, e + i], this.v.o[3] = [t - s + r, e + i], this.v.i[3] = this.v.v[3], this.v.v[4] = [t - s, e + i - a], this.v.o[4] = this.v.v[4], this.v.i[4] = [t - s, e + i - r], this.v.v[5] = [t - s, e - i + a], this.v.o[5] = [t - s, e - i + r], this.v.i[5] = this.v.v[5], this.v.v[6] = [t - s + a, e - i], this.v.o[6] = this.v.v[6], this.v.i[6] = [t - s + r, e - i], this.v.v[7] = [t + s - a, e - i], this.v.o[7] = [t + s - r, e - i], this.v.i[7] = this.v.v[7]) : (this.v.v[0] = [t + s, e - i + a], this.v.o[0] = [t + s, e - i + r], this.v.i[0] = this.v.v[0], this.v.v[1] = [t + s - a, e - i], this.v.o[1] = this.v.v[1], this.v.i[1] = [t + s - r, e - i], this.v.v[2] = [t - s + a, e - i], this.v.o[2] = [t - s + r, e - i], this.v.i[2] = this.v.v[2], this.v.v[3] = [t - s, e - i + a], this.v.o[3] = this.v.v[3], this.v.i[3] = [t - s, e - i + r], this.v.v[4] = [t - s, e + i - a], this.v.o[4] = [t - s, e + i - r], this.v.i[4] = this.v.v[4], this.v.v[5] = [t - s + a, e + i], this.v.o[5] = this.v.v[5], this.v.i[5] = [t - s + r, e + i], this.v.v[6] = [t + s - a, e + i], this.v.o[6] = [t + s - r, e + i], this.v.i[6] = this.v.v[6], this.v.v[7] = [t + s, e + i - a], this.v.o[7] = this.v.v[7], this.v.i[7] = [t + s, e + i - r])
                    }
                    return function(n, o, h) {
                        this.v = {
                            v: new Array(8),
                            i: new Array(8),
                            o: new Array(8),
                            c: !0
                        }, this.d = o.d, this.dynamicProperties = [], this.mdf = !1, o.closed = !0, this.closed = !0, this.getInterpolatedValue = t, this.convertRectToPath = e, "number" == typeof o.p[0] ? this.p = new i(o.p) : (this.p = new r(n, o.p, 0), this.dynamicProperties.push(this.p)), "number" == typeof o.s[0] ? this.s = new i(o.s) : (this.s = new r(n, o.s, 0), this.dynamicProperties.push(this.s)), o.r.length ? (this.r = new a(n, o.r, 0), this.dynamicProperties.push(this.r)) : this.r = new s(o.r, 0), this.dynamicProperties.length ? h.push(this) : this.convertRectToPath()
                    }
                }(),
                u = function() {
                    function t(t, e) {
                        var s, i = this.dynamicProperties.length;
                        for (this.mdf = !1, s = 0; i > s; s += 1) this.dynamicProperties[s].getInterpolatedValue(t), this.dynamicProperties[s].mdf && (this.mdf = !0);
                        if (this.mdf || e) {
                            var a = this.o.v % 360 / 360;
                            if (0 === a && 0 === this.s.v && 1 == this.e.v) return void(this.isTrimming = !1);
                            this.isTrimming = !0, 0 > a && (a += 1);
                            var r = this.s.v + a,
                                n = this.e.v + a;
                            if (r > n) {
                                var o = r;
                                r = n, n = o
                            }
                            this.sValue = r, this.eValue = n, this.oValue = a
                        }
                    }
                    return function(e, i, r) {
                        this.dynamicProperties = [], this.sValue = 0, this.eValue = 0, this.oValue = 0, this.mdf = !1, this.getInterpolatedValue = t, this.k = !1, this.isTrimming = !1, i.s.length ? (this.s = new a(e, i.s, .01), this.dynamicProperties.push(this.s)) : this.s = new s(i.s, .01), i.e.length ? (this.e = new a(e, i.e, .01), this.dynamicProperties.push(this.e)) : this.e = new s(i.e, .01), i.o.length ? (this.o = new a(e, i.o, 0), this.dynamicProperties.push(this.o)) : this.o = new s(i.o, 0), this.dynamicProperties.length ? (r.push(this), this.k = !0) : this.getInterpolatedValue(0, !0)
                    }
                }(),
                v = function() {
                    function t(t, e) {
                        this.totalLength = 0;
                        var s, i = t.v,
                            a = t.o,
                            r = t.i,
                            n = i.length;
                        for (s = 0; n - 1 > s; s += 1) this.lengths[s] = bez.getBezierLength(i[s], i[s + 1], a[s], r[s + 1]), this.totalLength += this.lengths[s].addedLength;
                        e && (this.lengths[s] = bez.getBezierLength(i[s], i[0], a[s], r[0]), this.totalLength += this.lengths[s].addedLength)
                    }

                    function e(t, e, s, i, a) {
                        this.nextO[this.segmentCount] = e, this.nextI[this.segmentCount + 1] = s, this.nextV[this.segmentCount + 1] = i, this.pathStarted ? this.nextV[this.segmentCount] = t : (this.pathStarted = !0, this.v.s[this.segmentCount] = t), this.segmentCount += 1
                    }

                    function s(t, e) {
                        this.mdf = e ? !0 : !1;
                        var s = 0,
                            i = this.trims.length;
                        for (this.pathStarted = !1; i > s;) {
                            if (this.trims[s].mdf) {
                                this.mdf = !0;
                                break
                            }
                            s += 1
                        }
                        if (this.mdf = this.prop.mdf ? !0 : this.mdf, this.mdf) {
                            this.nextO.length = 0, this.nextI.length = 0, this.nextV.length = 0, this.v.s.length = 0;
                            var a = this.prop.closed;
                            this.getSegmentsLength(this.prop.v, a);
                            var r, n, o, h, m, l, p = this.prop.v,
                                d = this.trims.length;
                            for (r = 0; d > r; r += 1)
                                if (this.trims[r].isTrimming) {
                                    if (n = this.trims[r].eValue, o = this.trims[r].sValue, h = this.trims[r].oValue, n === o) return this.v.v = this.nextV, this.v.o = this.nextO, void(this.v.i = this.nextI);
                                    1 >= n ? (this.segments[0].s = this.totalLength * o, this.segments[0].e = this.totalLength * n, this.segments[1].vl = !1) : o >= 1 ? (this.segments[0].s = this.totalLength * (o - 1), this.segments[0].e = this.totalLength * (n - 1), this.segments[1].vl = !1) : (this.segments[0].s = this.totalLength * o, this.segments[0].e = this.totalLength, this.segments[1].s = 0, this.segments[1].e = this.totalLength * (n - 1), this.segments[1].vl = !0), this.v.v = p.v, this.v.o = p.o, this.v.i = p.i, l = this.v.v.length;
                                    var f = 0,
                                        c = 0;
                                    i = this.segments[1].vl ? 2 : 1;
                                    var u;
                                    for (this.segmentCount = 0, s = 0; i > s; s += 1) {
                                        for (f = 0, m = 1; l > m; m++)
                                            if (c = this.lengths[m - 1].addedLength, f + c < this.segments[s].s) f += c;
                                            else {
                                                if (f > this.segments[s].e) break;
                                                this.segments[s].s <= f && this.segments[s].e >= f + c ? this.addSegment(this.v.v[m - 1], this.v.o[m - 1], this.v.i[m], this.v.v[m], this.lengths[m - 1]) : (u = bez.getNewSegment(this.v.v[m - 1], this.v.v[m], this.v.o[m - 1], this.v.i[m], (this.segments[s].s - f) / c, (this.segments[s].e - f) / c, this.lengths[m - 1]), this.addSegment(u.pt1, u.pt3, u.pt4, u.pt2)), f += c
                                            }
                                        a !== !1 ? f <= this.segments[s].e && (c = this.lengths[m - 1].addedLength, this.segments[s].s <= f && this.segments[s].e >= f + c ? this.addSegment(this.v.v[m - 1], this.v.o[m - 1], this.v.i[0], this.v.v[0], this.lengths[m - 1]) : (u = bez.getNewSegment(this.v.v[m - 1], this.v.v[0], this.v.o[m - 1], this.v.i[0], (this.segments[s].s - f) / c, (this.segments[s].e - f) / c, this.lengths[m - 1]), this.addSegment(u.pt1, u.pt3, u.pt4, u.pt2))) : this.pathStarted = !1
                                    }
                                    a = !1
                                } else this.v.v = p.v, this.v.o = p.o, this.v.i = p.i;
                            this.nextV.length ? (this.v.v = this.nextV, this.v.o = this.nextO, this.v.i = this.nextI) : this.v.s.length = 0, this.v.c = a
                        }
                    }
                    return function(i, a, r) {
                        this.trims = [], this.k = !1, this.mdf = !1, this.pathStarted = !1, this.segments = [{
                            s: 0,
                            e: 0,
                            vl: !0
                        }, {
                            s: 0,
                            e: 0,
                            vl: !1
                        }], this.nextO = [], this.nextV = [], this.nextI = [], this.v = {
                            i: null,
                            o: null,
                            v: null,
                            s: [],
                            c: !1
                        };
                        var n, o = a.length;
                        for (n = 0; o > n; n += 1) a[n].closed || (this.k = a[n].trimProp.k ? !0 : this.k, this.trims.push(a[n].trimProp));
                        this.prop = i, o = this.prop.shapeData.v.length - 1, o += this.prop.closed ? 1 : 0, this.lengths = new Array(o), this.k = i.k ? !0 : this.k, this.totalLength = 0, this.getInterpolatedValue = s, this.addSegment = e, this.getSegmentsLength = t, this.k ? r.push(this) : this.getInterpolatedValue(0, !0)
                    }
                }(),
                y = function() {
                    function t(t, e) {
                        var s = 0,
                            i = this.dataProps.length;
                        for (this.mdf = e ? !0 : !1; i > s;) {
                            if (this.dataProps[s].p.mdf) {
                                this.mdf = !0;
                                break
                            }
                            s += 1
                        }
                        if (this.mdf)
                            for ("svg" === this.renderer && (this.dasharray = ""), s = 0; i > s; s += 1) "o" != this.dataProps[s].n ? "svg" === this.renderer ? this.dasharray += " " + this.dataProps[s].p.v : this.dasharray[s] = this.dataProps[s].p.v : this.dashoffset = this.dataProps[s].p.v
                    }
                    return function(e, s, i, a) {
                        this.dataProps = new Array(s.length), this.renderer = i, this.mdf = !1, this.k = !1, this.dasharray = "svg" === this.renderer ? "" : new Array(s.length - 1), this.dashoffset = 0;
                        var r, o, h = s.length;
                        for (r = 0; h > r; r += 1) o = n(e, s[r].v, 0, 0, a), this.k = o.k ? !0 : this.k, this.dataProps[r] = {
                            n: s[r].n,
                            p: o
                        };
                        this.getInterpolatedValue = t, this.k ? a.push(this) : this.getInterpolatedValue(0, !0)
                    }
                }(),
                g = {};
            return g.getProp = n, g.getShapeProp = m, g.getDashProp = l, g
        }();
    SVGRenderer.prototype.createItem = function(t, e, s) {
        switch (t.ty) {
            case 2:
                return this.createImage(t, e, s);
            case 0:
                return this.createComp(t, e, s);
            case 1:
                return this.createSolid(t, e, s);
            case 4:
                return this.createShape(t, e, s);
            case 5:
                return this.createText(t, e, s);
            case 99:
                return this.createPlaceHolder(t, e)
        }
        return this.createBase(t, e)
    }, SVGRenderer.prototype.buildItems = function(t, e, s, i) {
        var a, r = t.length;
        s || (s = this.elements), e || (e = this.animationItem.container);
        var n;
        for (a = r - 1; a >= 0; a--) s[a] = this.createItem(t[a], e, i), 0 === t[a].ty && (n = [], this.buildItems(t[a].layers, s[a].getDomElement(), n, i), s[a].setElements(n)), t[a].td && s[a + 1].setMatte(s[a].layerId)
    }, SVGRenderer.prototype.includeLayers = function(t, e, s) {
        var i, a = t.length;
        s || (s = this.elements), e || (e = this.animationItem.container);
        var r, n, o, h = s.length;
        for (i = 0; a > i; i += 1)
            for (r = 0; h > r;) {
                if (s[r].data.id == t[i].id) {
                    o = s[r], s[r] = this.createItem(t[i], e, o), 0 === t[i].ty && (n = [], this.buildItems(t[i].layers, s[r].getDomElement(), n, o), s[r].setElements(n));
                    break
                }
                r += 1
            }
        for (i = 0; a > i; i += 1) t[i].td && s[i + 1].setMatte(s[i].layerId)
    }, SVGRenderer.prototype.createBase = function(t, e, s) {
        return new SVGBaseElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.createPlaceHolder = function(t, e) {
        return new PlaceHolderElement(t, e, this.globalData)
    }, SVGRenderer.prototype.createShape = function(t, e, s) {
        return new IShapeElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.createText = function(t, e, s) {
        return new ITextElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.createImage = function(t, e, s) {
        return new IImageElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.createComp = function(t, e, s) {
        return new ICompElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.createSolid = function(t, e, s) {
        return new ISolidElement(t, e, this.globalData, s)
    }, SVGRenderer.prototype.configAnimation = function(t) {
        this.animationItem.container = document.createElementNS(svgNS, "svg"),
            this.animationItem.container.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.animationItem.container.setAttribute("width", t.w), this.animationItem.container.setAttribute("height", t.h), this.animationItem.container.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.animationItem.container.setAttribute("preserveAspectRatio", "xMidYMid meet"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transform = "translate3d(0,0,0)", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container);
        var e = document.createElementNS(svgNS, "defs");
        this.globalData.defs = e, this.animationItem.container.appendChild(e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getPath = this.animationItem.getPath.bind(this.animationItem), this.globalData.elementLoaded = this.animationItem.elementLoaded.bind(this.animationItem), this.globalData.compSize = {
            w: t.w,
            h: t.h
        }, this.globalData.frameRate = t.fr;
        var s = document.createElementNS(svgNS, "clipPath"),
            i = document.createElementNS(svgNS, "rect");
        i.setAttribute("width", t.w), i.setAttribute("height", t.h), i.setAttribute("x", 0), i.setAttribute("y", 0);
        var a = "animationMask_" + randomString(10);
        s.setAttribute("id", a), s.appendChild(i);
        var r = document.createElementNS(svgNS, "g");
        r.setAttribute("clip-path", "url(#" + a + ")"), this.animationItem.container.appendChild(r), e.appendChild(s), this.animationItem.container = r, this.layers = t.layers
    }, SVGRenderer.prototype.buildStage = function(t, e, s) {
        var i, a, r = e.length;
        for (s || (s = this.elements), i = r - 1; i >= 0; i--) a = e[i], void 0 !== a.parent && this.buildItemParenting(a, s[i], e, a.parent, s, !0), 0 === a.ty && this.buildStage(s[i].getComposingElement(), a.layers, s[i].getElements())
    }, SVGRenderer.prototype.buildItemParenting = function(t, e, s, i, a, r) {
        t.parents || (t.parents = []), r && e.resetHierarchy();
        for (var n = 0, o = s.length; o > n;) s[n].ind == i && (e.getHierarchy().push(a[n]), void 0 !== s[n].parent && this.buildItemParenting(t, e, s, s[n].parent, a, !1)), n += 1
    }, SVGRenderer.prototype.destroy = function() {
        this.animationItem.wrapper.innerHTML = "", this.animationItem.container = null, this.globalData.defs = null;
        var t, e = this.layers.length;
        for (t = 0; e > t; t++) this.elements[t].destroy();
        this.elements.length = 0, this.destroyed = !0
    }, SVGRenderer.prototype.updateContainerSize = function() {}, SVGRenderer.prototype.renderFrame = function(t) {
        if (this.lastFrame != t && !this.destroyed) {
            null === t ? t = this.lastFrame : this.lastFrame = t, this.globalData.frameNum = t;
            var e, s = this.layers.length;
            for (e = 0; s > e; e++) this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = 0; s > e; e++) this.elements[e].renderFrame()
        }
    }, CanvasRenderer.prototype.createItem = function(t) {
        switch (t.ty) {
            case 0:
                return this.createComp(t);
            case 1:
                return this.createSolid(t);
            case 2:
                return this.createImage(t);
            case 4:
                return this.createShape(t);
            case 5:
                return this.createText(t);
            case 99:
                return this.createPlaceHolder(t);
            default:
                return this.createBase(t)
        }
        return this.createBase(t, parentContainer)
    }, CanvasRenderer.prototype.buildItems = function(t, e) {
        e || (e = this.elements);
        var s, i = t.length;
        for (s = 0; i > s; s++)
            if (e[s] = this.createItem(t[s]), 0 === t[s].ty) {
                var a = [];
                this.buildItems(t[s].layers, a), e[e.length - 1].setElements(a)
            }
    }, CanvasRenderer.prototype.includeLayers = function(t, e, s) {
        var i, a = t.length;
        s || (s = this.elements);
        var r, n, o = s.length;
        for (i = 0; a > i; i += 1)
            for (r = 0; o > r;) {
                if (s[r].data.id == t[i].id) {
                    s[r] = this.createItem(t[i], e), 0 === t[i].ty && (n = [], this.buildItems(t[i].layers, n), s[r].setElements(n));
                    break
                }
                r += 1
            }
    }, CanvasRenderer.prototype.createBase = function(t) {
        return new CVBaseElement(t, this.globalData)
    }, CanvasRenderer.prototype.createShape = function(t) {
        return new CVShapeElement(t, this.globalData)
    }, CanvasRenderer.prototype.createText = function(t) {
        return new CVTextElement(t, this.globalData)
    }, CanvasRenderer.prototype.createPlaceHolder = function(t) {
        return new PlaceHolderElement(t, null, this.globalData)
    }, CanvasRenderer.prototype.createImage = function(t) {
        return new CVImageElement(t, this.globalData)
    }, CanvasRenderer.prototype.createComp = function(t) {
        return new CVCompElement(t, this.globalData)
    }, CanvasRenderer.prototype.createSolid = function(t) {
        return new CVSolidElement(t, this.globalData)
    }, CanvasRenderer.prototype.ctxTransform = function(t) {
        if (!this.renderConfig.clearCanvas) return void this.canvasContext.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
        this.contextData.cTr.transform(t[0], t[1], t[2], t[3], t[4], t[5]);
        var e = this.contextData.cTr.props;
        this.canvasContext.setTransform(e[0], e[1], e[2], e[3], e[4], e[5])
    }, CanvasRenderer.prototype.ctxOpacity = function(t) {
        return this.renderConfig.clearCanvas ? (this.contextData.cO *= 0 > t ? 0 : t, void(this.canvasContext.globalAlpha = this.contextData.cO)) : void(this.canvasContext.globalAlpha *= 0 > t ? 0 : t)
    }, CanvasRenderer.prototype.reset = function() {
        return this.renderConfig.clearCanvas ? (this.contextData.cArrPos = 0, this.contextData.cTr.reset(), void(this.contextData.cO = 1)) : void this.canvasContext.restore()
    }, CanvasRenderer.prototype.save = function(t) {
        if (!this.renderConfig.clearCanvas) return void this.canvasContext.save();
        t && this.canvasContext.save();
        var e = this.contextData.cTr.props;
        (null === this.contextData.saved[this.contextData.cArrPos] || void 0 === this.contextData.saved[this.contextData.cArrPos]) && (this.contextData.saved[this.contextData.cArrPos] = new Array(6));
        var s, i = 6,
            a = this.contextData.saved[this.contextData.cArrPos];
        for (s = 0; i > s; s += 1) a[s] = e[s];
        this.contextData.savedOp[this.contextData.cArrPos] = this.contextData.cO, this.contextData.cArrPos += 1
    }, CanvasRenderer.prototype.restore = function(t) {
        if (!this.renderConfig.clearCanvas) return void this.canvasContext.restore();
        t && this.canvasContext.restore(), this.contextData.cArrPos -= 1;
        var e, s = this.contextData.saved[this.contextData.cArrPos],
            i = 6,
            a = this.contextData.cTr.props;
        for (e = 0; i > e; e += 1) a[e] = s[e];
        this.canvasContext.setTransform(s[0], s[1], s[2], s[3], s[4], s[5]), s = this.contextData.savedOp[this.contextData.cArrPos], this.contextData.cO = s, this.canvasContext.globalAlpha = s
    }, CanvasRenderer.prototype.configAnimation = function(t) {
        this.animationItem.wrapper ? (this.animationItem.container = document.createElement("canvas"), this.animationItem.container.style.width = "100%", this.animationItem.container.style.height = "100%", this.animationItem.container.style.transformOrigin = this.animationItem.container.style.mozTransformOrigin = this.animationItem.container.style.webkitTransformOrigin = this.animationItem.container.style["-webkit-transform"] = "0px 0px 0px", this.animationItem.wrapper.appendChild(this.animationItem.container), this.canvasContext = this.animationItem.container.getContext("2d")) : this.canvasContext = this.renderConfig.context, this.globalData.canvasContext = this.canvasContext, this.globalData.renderer = this, this.globalData.isDashed = !1, this.globalData.totalFrames = Math.floor(t.tf), this.globalData.compWidth = t.w, this.globalData.compHeight = t.h, this.globalData.frameRate = t.fr, this.layers = t.layers, this.transformCanvas = {}, this.transformCanvas.w = t.w, this.transformCanvas.h = t.h, this.updateContainerSize()
    }, CanvasRenderer.prototype.updateContainerSize = function() {
        var t, e;
        if (this.animationItem.wrapper && this.animationItem.container ? (t = this.animationItem.wrapper.offsetWidth, e = this.animationItem.wrapper.offsetHeight, this.animationItem.container.setAttribute("width", t * this.renderConfig.dpr), this.animationItem.container.setAttribute("height", e * this.renderConfig.dpr)) : (t = this.canvasContext.canvas.width * this.renderConfig.dpr, e = this.canvasContext.canvas.height * this.renderConfig.dpr), "fit" == this.renderConfig.scaleMode) {
            var s = t / e,
                i = this.transformCanvas.w / this.transformCanvas.h;
            i > s ? (this.transformCanvas.sx = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.sy = t / (this.transformCanvas.w / this.renderConfig.dpr), this.transformCanvas.tx = 0, this.transformCanvas.ty = (e - this.transformCanvas.h * (t / this.transformCanvas.w)) / 2 * this.renderConfig.dpr) : (this.transformCanvas.sx = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.sy = e / (this.transformCanvas.h / this.renderConfig.dpr), this.transformCanvas.tx = (t - this.transformCanvas.w * (e / this.transformCanvas.h)) / 2 * this.renderConfig.dpr, this.transformCanvas.ty = 0)
        } else this.transformCanvas.sx = this.renderConfig.dpr, this.transformCanvas.sy = this.renderConfig.dpr, this.transformCanvas.tx = 0, this.transformCanvas.ty = 0;
        this.transformCanvas.props = [this.transformCanvas.sx, 0, 0, this.transformCanvas.sy, this.transformCanvas.tx, this.transformCanvas.ty], this.globalData.cWidth = t, this.globalData.cHeight = e
    }, CanvasRenderer.prototype.buildStage = function(t, e, s) {
        s || (s = this.elements);
        var i, a, r = e.length;
        for (i = r - 1; i >= 0; i--) a = e[i], void 0 !== a.parent && this.buildItemHierarchy(a, s[i], e, a.parent, s, !0), 0 == a.ty && this.buildStage(null, a.layers, s[i].getElements())
    }, CanvasRenderer.prototype.buildItemHierarchy = function(t, e, s, i, a, r) {
        var n = 0,
            o = s.length;
        for (r && e.resetHierarchy(); o > n;) s[n].ind === i && (e.getHierarchy().push(a[n]), void 0 !== s[n].parent && this.buildItemHierarchy(t, e, s, s[n].parent, a, !1)), n += 1
    }, CanvasRenderer.prototype.destroy = function() {
        this.renderConfig.clearCanvas && (this.animationItem.wrapper.innerHTML = "");
        var t, e = this.layers.length;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        this.elements.length = 0, this.globalData.canvasContext = null, this.animationItem.container = null, this.destroyed = !0
    }, CanvasRenderer.prototype.renderFrame = function(t) {
        if (!(this.lastFrame == t && this.renderConfig.clearCanvas === !0 || this.destroyed)) {
            this.lastFrame = t, this.globalData.frameNum = t - this.animationItem.firstFrame, this.renderConfig.clearCanvas === !0 ? (this.reset(), this.canvasContext.canvas.width = this.canvasContext.canvas.width) : this.save(), this.ctxTransform(this.transformCanvas.props), this.canvasContext.rect(0, 0, this.transformCanvas.w, this.transformCanvas.h), this.canvasContext.clip();
            var e, s = this.layers.length;
            for (e = 0; s > e; e++) this.elements[e].prepareFrame(t - this.layers[e].st);
            for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame();
            this.renderConfig.clearCanvas !== !0 && this.restore()
        }
    }, MaskElement.prototype.prepareFrame = function(t) {
        var e, s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t)
    }, MaskElement.prototype.renderFrame = function() {
        var t, e = this.data.masksProperties.length;
        for (t = 0; e > t; t++) "n" !== this.data.masksProperties[t].mode && (this.viewData[t].prop.mdf || this.firstFrame) && this.drawPath(this.data.masksProperties[t], this.viewData[t].prop.v, this.viewData[t]);
        this.firstFrame = !1
    }, MaskElement.prototype.getMaskelement = function() {
        return this.maskElement
    }, MaskElement.prototype.createLayerSolidPath = function() {
        var t = "M0,0 ";
        return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " "
    }, MaskElement.prototype.drawPath = function(t, e, s) {
        var i, a, r = "";
        for (a = e.v.length, i = 1; a > i; i += 1) 1 == i && (r += " M" + bm_rnd(e.v[0][0]) + "," + bm_rnd(e.v[0][1])), r += " C" + bm_rnd(e.o[i - 1][0]) + "," + bm_rnd(e.o[i - 1][1]) + " " + bm_rnd(e.i[i][0]) + "," + bm_rnd(e.i[i][1]) + " " + bm_rnd(e.v[i][0]) + "," + bm_rnd(e.v[i][1]);
        t.cl && (r += " C" + bm_rnd(e.o[i - 1][0]) + "," + bm_rnd(e.o[i - 1][1]) + " " + bm_rnd(e.i[0][0]) + "," + bm_rnd(e.i[0][1]) + " " + bm_rnd(e.v[0][0]) + "," + bm_rnd(e.v[0][1])), s.lastPath !== r && (t.inv ? s.elem.setAttribute("d", this.solidPath + r) : s.elem.setAttribute("d", r), s.lastPath = r)
    }, MaskElement.prototype.destroy = function() {
        this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.paths = null, this.masksProperties = null
    }, BaseElement.prototype.prepareFrame = function(t) {
        this.data.ip - this.data.st <= t && this.data.op - this.data.st > t ? this.isVisible !== !0 && (this.isVisible = !0, this.firstFrame = !0, this.data.hasMask && (this.maskManager.firstFrame = !0)) : this.isVisible !== !1 && (this.isVisible = !1);
        var e, s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t);
        this.data.hasMask && this.maskManager.prepareFrame(t), this.currentFrameNum = t
    }, BaseElement.prototype.init = function() {
        this.hidden = !1, this.firstFrame = !0, this.isVisible = !1, this.dynamicProperties = [], this.currentFrameNum = -99999, this.lastNum = -99999, this.finalTransform = {
            op: PropertyFactory.getProp(this.data, this.data.ks.o, 0, .01, this.dynamicProperties),
            mProp: PropertyFactory.getProp(this.data, this.data.ks, 2, null, this.dynamicProperties),
            matMdf: !1,
            opMdf: !1,
            mat: new Matrix,
            opacity: 1
        }, this.createElements(), this.data.hasMask && this.addMasks(this.data)
    }, BaseElement.prototype.getType = function() {
        return this.type
    }, BaseElement.prototype.resetHierarchy = function() {
        this.hierarchy ? this.hierarchy.length = 0 : this.hierarchy = []
    }, BaseElement.prototype.getHierarchy = function() {
        return this.hierarchy || (this.hierarchy = []), this.hierarchy
    }, BaseElement.prototype.getLayerSize = function() {
        return 5 === this.data.ty ? {
            w: this.data.textData.width,
            h: this.data.textData.height
        } : {
            w: this.data.width,
            h: this.data.height
        }
    }, createElement(BaseElement, SVGBaseElement), SVGBaseElement.prototype.appendNodeToParent = function(t) {
        if (this.placeholder) {
            var e = this.placeholder.phElement;
            e.parentNode.insertBefore(t, e)
        } else this.parentContainer.appendChild(t)
    }, SVGBaseElement.prototype.createElements = function() {
        if (this.data.td) {
            if (3 == this.data.td) this.layerElement = document.createElementNS(svgNS, "mask"), this.layerElement.setAttribute("id", this.layerId), this.layerElement.setAttribute("mask-type", "luminance"), this.globalData.defs.appendChild(this.layerElement);
            else if (2 == this.data.td) {
                var t = document.createElementNS(svgNS, "mask");
                t.setAttribute("id", this.layerId), t.setAttribute("mask-type", "alpha");
                var e = document.createElementNS(svgNS, "g");
                t.appendChild(e), this.layerElement = document.createElementNS(svgNS, "g");
                var s = document.createElementNS(svgNS, "filter"),
                    i = randomString(10);
                s.setAttribute("id", i), s.setAttribute("filterUnits", "objectBoundingBox"), s.setAttribute("x", "0%"), s.setAttribute("y", "0%"), s.setAttribute("width", "100%"), s.setAttribute("height", "100%");
                var a = document.createElementNS(svgNS, "feComponentTransfer");
                a.setAttribute("in", "SourceGraphic"), s.appendChild(a);
                var r = document.createElementNS(svgNS, "feFuncA");
                r.setAttribute("type", "table"), r.setAttribute("tableValues", "1.0 0.0"), a.appendChild(r), this.globalData.defs.appendChild(s);
                var n = document.createElementNS(svgNS, "rect");
                n.setAttribute("width", "100%"), n.setAttribute("height", "100%"), n.setAttribute("x", "0"), n.setAttribute("y", "0"), n.setAttribute("fill", "#ffffff"), n.setAttribute("opacity", "0"), e.setAttribute("filter", "url(#" + i + ")"), e.appendChild(n), e.appendChild(this.layerElement), this.globalData.defs.appendChild(t)
            } else {
                this.layerElement = document.createElementNS(svgNS, "g");
                var o = document.createElementNS(svgNS, "mask");
                o.setAttribute("id", this.layerId), o.setAttribute("mask-type", "alpha"), o.appendChild(this.layerElement), this.globalData.defs.appendChild(o)
            }
            this.data.hasMask && (this.maskedElement = this.layerElement)
        } else this.data.hasMask ? (this.layerElement = document.createElementNS(svgNS, "g"), this.data.tt ? (this.matteElement = document.createElementNS(svgNS, "g"), this.matteElement.appendChild(this.layerElement), this.appendNodeToParent(this.matteElement)) : this.appendNodeToParent(this.layerElement), this.maskedElement = this.layerElement) : this.data.tt ? (this.matteElement = document.createElementNS(svgNS, "g"), this.matteElement.setAttribute("id", this.layerId), this.appendNodeToParent(this.matteElement), this.layerElement = this.matteElement) : this.layerElement = this.parentContainer;
        !this.data.ln || 4 !== this.data.ty && 0 !== this.data.ty || (this.layerElement === this.parentContainer && (this.layerElement = document.createElementNS(svgNS, "g"), this.appendNodeToParent(this.layerElement)), this.layerElement.setAttribute("id", this.data.ln))
    }, SVGBaseElement.prototype.renderFrame = function(t) {
        if (3 === this.data.ty) return !1;
        if (this.currentFrameNum === this.lastNum || !this.isVisible) return this.isVisible;
        this.lastNum = this.currentFrameNum, this.data.hasMask && this.maskManager.renderFrame(), this.finalTransform.opMdf = this.finalTransform.op.mdf, this.finalTransform.matMdf = this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v, this.firstFrame && (this.finalTransform.opMdf = !0, this.finalTransform.matMdf = !0);
        var e, s = this.finalTransform.mat;
        if (t && (e = t.mat.props, s.reset().transform(e[0], e[1], e[2], e[3], e[4], e[5]), this.finalTransform.opacity *= t.opacity, this.finalTransform.opMdf = t.opMdf ? !0 : this.finalTransform.opMdf, this.finalTransform.matMdf = t.matMdf ? !0 : this.finalTransform.matMdf), this.hierarchy) {
            var i, a = this.hierarchy.length;
            for (t || s.reset(), i = a - 1; i >= 0; i -= 1) this.finalTransform.matMdf = this.hierarchy[i].finalTransform.mProp.mdf ? !0 : this.finalTransform.matMdf, e = this.hierarchy[i].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            e = this.finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        } else this.isVisible && (t ? (e = this.finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5])) : (s.props[0] = this.finalTransform.mProp.v.props[0], s.props[1] = this.finalTransform.mProp.v.props[1], s.props[2] = this.finalTransform.mProp.v.props[2], s.props[3] = this.finalTransform.mProp.v.props[3], s.props[4] = this.finalTransform.mProp.v.props[4], s.props[5] = this.finalTransform.mProp.v.props[5]));
        return this.data.hasMask && (this.finalTransform.matMdf && this.layerElement.setAttribute("transform", "matrix(" + s.props.join(",") + ")"), this.finalTransform.opMdf && this.layerElement.setAttribute("opacity", this.finalTransform.opacity)), this.isVisible
    }, SVGBaseElement.prototype.destroy = function() {
        this.layerElement = null, this.parentContainer = null, this.matteElement && (this.matteElement = null), this.maskManager && this.maskManager.destroy()
    }, SVGBaseElement.prototype.getDomElement = function() {
        return this.layerElement
    }, SVGBaseElement.prototype.addMasks = function(t) {
        this.maskManager = new MaskElement(t, this, this.globalData)
    }, SVGBaseElement.prototype.setMatte = function(t) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(#" + t + ")")
    }, SVGBaseElement.prototype.hide = function() {};
    var PlaceHolderElement = function(t, e, s) {
        if (this.data = t, this.globalData = s, e) {
            this.parentContainer = e;
            var i = document.createElementNS(svgNS, "g");
            i.setAttribute("id", this.data.id), e.appendChild(i), this.phElement = i
        }
        this.layerId = "ly_" + randomString(10)
    };
    PlaceHolderElement.prototype.prepareFrame = function() {}, PlaceHolderElement.prototype.renderFrame = function() {}, PlaceHolderElement.prototype.draw = function() {}, createElement(SVGBaseElement, ICompElement), ICompElement.prototype.getComposingElement = function() {
        return this.layerElement
    }, ICompElement.prototype.hide = function() {
        if (!this.hidden) {
            var t, e = this.elements.length;
            for (t = 0; e > t; t += 1) this.elements[t].hide();
            this.hidden = !0
        }
    }, ICompElement.prototype.prepareFrame = function(t) {
        if (this.parent.prepareFrame.call(this, t), this.isVisible !== !1) {
            var e = t;
            this.tm && (e = this.tm.v, e === this.data.op && (e = this.data.op - 1));
            var s, i = this.elements.length;
            for (s = 0; i > s; s += 1) this.elements[s].prepareFrame(e - this.layers[s].st)
        }
    }, ICompElement.prototype.renderFrame = function(t) {
        var e, s = this.parent.renderFrame.call(this, t),
            i = this.layers.length;
        if (s === !1) return void this.hide();
        for (this.hidden = !1, e = 0; i > e; e += 1) this.data.hasMask ? this.elements[e].renderFrame() : this.elements[e].renderFrame(this.finalTransform);
        this.firstFrame && (this.firstFrame = !1)
    }, ICompElement.prototype.setElements = function(t) {
        this.elements = t
    }, ICompElement.prototype.getElements = function() {
        return this.elements
    }, ICompElement.prototype.destroy = function() {
        this.parent.destroy.call();
        var t, e = this.layers.length;
        for (t = 0; e > t; t += 1) this.elements[t].destroy()
    }, createElement(SVGBaseElement, IImageElement), IImageElement.prototype.createElements = function() {
        var t = this,
            e = function() {
                t.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t.path + t.assetData.p), t.maskedElement = t.innerElem
            },
            s = new Image;
        s.addEventListener("load", e, !1), s.addEventListener("error", e, !1), s.src = this.path + this.assetData.p, this.parent.createElements.call(this), this.innerElem = document.createElementNS(svgNS, "image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.layerElement === this.parentContainer ? this.appendNodeToParent(this.innerElem) : this.layerElement.appendChild(this.innerElem), this.data.ln && this.innerElem.setAttribute("id", this.data.ln)
    }, IImageElement.prototype.hide = function() {
        this.hidden || (this.innerElem.setAttribute("visibility", "hidden"), this.hidden = !0)
    }, IImageElement.prototype.renderFrame = function(t) {
        var e = this.parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden && (this.hidden = !1, this.innerElem.setAttribute("visibility", "visible")), this.data.hasMask || ((this.finalTransform.matMdf || this.firstFrame) && this.innerElem.setAttribute("transform", "matrix(" + this.finalTransform.mat.props.join(",") + ")"), (this.finalTransform.opMdf || this.firstFrame) && this.innerElem.setAttribute("opacity", this.finalTransform.opacity)), void(this.firstFrame && (this.firstFrame = !1)))
    }, IImageElement.prototype.destroy = function() {
        this.parent.destroy.call(), this.innerElem = null
    }, createElement(SVGBaseElement, IShapeElement), IShapeElement.prototype.transformHelper = {
        opacity: 1,
        mat: new Matrix,
        matMdf: !1,
        opMdf: !1
    }, IShapeElement.prototype.createElements = function() {
        this.parent.createElements.call(this), this.mainShape = new ShapeItemElement(this.data, this.layerElement, this.parentContainer, this.placeholder, this.dynamicProperties, this.globalData)
    }, IShapeElement.prototype.renderFrame = function(t) {
        var e = this.parent.renderFrame.call(this, t);
        return e === !1 ? void this.hide() : (this.hidden = !1, this.firstFrame && (this.mainShape.firstFrame = !0, this.firstFrame = !1), void(this.data.hasMask ? this.mainShape.renderShape(this.transformHelper, null, null, !0) : this.mainShape.renderShape(this.finalTransform, null, null, !0)))
    }, IShapeElement.prototype.hide = function() {
        this.hidden || (this.mainShape.hideShape(), this.hidden = !0)
    }, IShapeElement.prototype.destroy = function() {
        this.parent.destroy.call(), this.mainShape.destroy()
    }, ShapeItemElement.prototype.appendNodeToParent = SVGBaseElement.prototype.appendNodeToParent, ShapeItemElement.prototype.searchShapes = function(t, e, s, i) {
        var a, r, n, o = t.length - 1,
            h = [],
            m = [];
        for (a = o; a >= 0; a -= 1)
            if ("fl" == t[a].ty || "st" == t[a].ty) {
                e[a] = {};
                var l;
                if (e[a].c = PropertyFactory.getProp(this.elemData, t[a].c, 1, null, s), e[a].o = PropertyFactory.getProp(this.elemData, t[a].o, 0, .01, s), "st" == t[a].ty) {
                    if (l = document.createElementNS(svgNS, "g"), l.style.strokeLinecap = this.lcEnum[t[a].lc] || "round", l.style.strokeLinejoin = this.ljEnum[t[a].lj] || "round", l.style.fillOpacity = 0, 1 == t[a].lj && (l.style.strokeMiterlimit = t[a].ml), e[a].c.k || (l.style.stroke = "rgb(" + e[a].c.v[0] + "," + e[a].c.v[1] + "," + e[a].c.v[2] + ")"), e[a].o.k || (l.style.strokeOpacity = e[a].o.v), e[a].w = PropertyFactory.getProp(this.elemData, t[a].w, 0, null, s), e[a].w.k || (l.style.strokeWidth = e[a].w.v), t[a].d) {
                        var p = PropertyFactory.getDashProp(this.elemData, t[a].d, "svg", s);
                        p.k ? e[a].d = p : (l.style.strokeDasharray = p.dasharray, l.style.strokeDashoffset = p.dashoffset)
                    }
                } else l = document.createElementNS(svgNS, "path"), e[a].c.k || (l.style.fill = "rgb(" + e[a].c.v[0] + "," + e[a].c.v[1] + "," + e[a].c.v[2] + ")"), e[a].o.k || (l.style.fillOpacity = e[a].o.v);
                this.shape === this.parentContainer ? this.appendNodeToParent(l) : this.shape.appendChild(l), this.stylesList.push({
                    pathElement: l,
                    type: t[a].ty,
                    d: "",
                    ld: "",
                    mdf: !1
                }), e[a].style = this.stylesList[this.stylesList.length - 1], h.push(e[a].style)
            } else if ("gr" == t[a].ty) e[a] = {
            it: []
        }, this.searchShapes(t[a].it, e[a].it, s, i);
        else if ("tr" == t[a].ty) e[a] = {
            transform: {
                mat: new Matrix,
                opacity: 1,
                matMdf: !1,
                opMdf: !1,
                op: PropertyFactory.getProp(this.elemData, t[a].o, 0, .01, s),
                mProps: PropertyFactory.getProp(this.elemData, t[a], 2, null, s)
            },
            elements: []
        };
        else if ("sh" == t[a].ty || "rc" == t[a].ty || "el" == t[a].ty) {
            e[a] = {
                elements: [],
                styles: [],
                lStr: ""
            };
            var d = 4;
            "rc" == t[a].ty ? d = 5 : "el" == t[a].ty && (d = 6), e[a].sh = PropertyFactory.getShapeProp(this.elemData, t[a], d, s, i), n = this.stylesList.length;
            var f, c = !1,
                u = !1;
            for (r = 0; n > r; r += 1) this.stylesList[r].closed || ("st" === this.stylesList[r].type ? (c = !0, f = document.createElementNS(svgNS, "path"), this.stylesList[r].pathElement.appendChild(f), e[a].elements.push({
                ty: this.stylesList[r].type,
                el: f
            })) : (u = !0, e[a].elements.push({
                ty: this.stylesList[r].type,
                st: this.stylesList[r]
            })));
            e[a].st = c, e[a].fl = u
        } else if ("tm" == t[a].ty) {
            var v = {
                closed: !1,
                trimProp: PropertyFactory.getProp(this.elemData, t[a], 7, null, s)
            };
            i.push(v), m.push(v)
        }
        for (o = h.length, a = 0; o > a; a += 1) h[a].closed = !0;
        for (o = m.length, a = 0; o > a; a += 1) m[a].closed = !0
    }, ShapeItemElement.prototype.getElement = function() {
        return this.shape
    }, ShapeItemElement.prototype.hideShape = function() {
        var t, e = this.stylesList.length;
        for (t = e - 1; t >= 0; t -= 1) "0" !== this.stylesList[t].ld && (this.stylesList[t].ld = "0", this.stylesList[t].pathElement.style.display = "none", this.stylesList[t].pathElement.parentNode && (this.stylesList[t].parent = this.stylesList[t].pathElement.parentNode))
    }, ShapeItemElement.prototype.renderShape = function(t, e, s, i) {
        var a, r;
        if (!e)
            for (e = this.data, r = this.stylesList.length, a = 0; r > a; a += 1) this.stylesList[a].d = "", this.stylesList[a].mdf = !1;
        s || (s = this.viewData), r = e.length - 1;
        var n, o;
        for (n = t, a = r; a >= 0; a -= 1)
            if ("tr" == e[a].ty) {
                n = s[a].transform;
                var h = s[a].transform.mProps.v.props;
                if (n.matMdf = n.mProps.mdf, n.opMdf = n.op.mdf, o = n.mat, o.reset(), t) {
                    var m = t.mat.props;
                    n.opacity = t.opacity, n.opacity *= s[a].transform.op.v, n.matMdf = t.matMdf ? !0 : n.matMdf, n.opMdf = t.opMdf ? !0 : n.opMdf, o.transform(m[0], m[1], m[2], m[3], m[4], m[5])
                } else n.opacity = n.op.o;
                o.transform(h[0], h[1], h[2], h[3], h[4], h[5])
            } else "sh" == e[a].ty || "el" == e[a].ty || "rc" == e[a].ty ? this.renderPath(e[a], s[a], n) : "fl" == e[a].ty ? this.renderFill(e[a], s[a], n) : "st" == e[a].ty ? this.renderStroke(e[a], s[a], n) : "gr" == e[a].ty ? this.renderShape(n, e[a].it, s[a].it) : "tm" == e[a].ty;
        if (i) {
            for (r = this.stylesList.length, a = 0; r > a; a += 1) "0" === this.stylesList[a].ld && (this.stylesList[a].ld = "1", this.stylesList[a].pathElement.style.display = "block"), "fl" === this.stylesList[a].type && (this.stylesList[a].mdf || this.firstFrame) && this.stylesList[a].pathElement.setAttribute("d", this.stylesList[a].d);
            this.firstFrame && (this.firstFrame = !1)
        }
    }, ShapeItemElement.prototype.renderPath = function(t, e, s) {
        var i, a, r = e.sh.v,
            n = "",
            o = "",
            h = "";
        if (r.v) {
            i = r.v.length;
            var m = s.matMdf || e.sh.mdf || this.firstFrame;
            if (m) {
                var l = r.s ? r.s : [];
                for (a = 1; i > a; a += 1) l[a - 1] ? (e.st && (h += " M" + l[a - 1][0] + "," + l[a - 1][1]), e.fl && (o += " M" + s.mat.applyToPointStringified(l[a - 1][0], l[a - 1][1]))) : 1 == a && (e.st && (h += " M" + r.v[0][0] + "," + r.v[0][1]), e.fl && (o += " M" + s.mat.applyToPointStringified(r.v[0][0], r.v[0][1]))), e.st && (h += " C" + r.o[a - 1][0] + "," + r.o[a - 1][1] + " " + r.i[a][0] + "," + r.i[a][1] + " " + r.v[a][0] + "," + r.v[a][1]), e.fl && (o += " C" + s.mat.applyToPointStringified(r.o[a - 1][0], r.o[a - 1][1]) + " " + s.mat.applyToPointStringified(r.i[a][0], r.i[a][1]) + " " + s.mat.applyToPointStringified(r.v[a][0], r.v[a][1]));
                1 == i && (l[0] ? (e.st && (h += " M" + l[0][0] + "," + l[0][1]), e.fl && (o += " M" + s.mat.applyToPointStringified(l[0][0], l[0][1]))) : (e.st && (h += " M" + r.v[0][0] + "," + r.v[0][1]), e.fl && (o += " M" + s.mat.applyToPointStringified(r.v[0][0], r.v[0][1])))), i && t.closed && (!t.trimmed || r.c) && (e.st && (h += " C" + r.o[a - 1][0] + "," + r.o[a - 1][1] + " " + r.i[0][0] + "," + r.i[0][1] + " " + r.v[0][0] + "," + r.v[0][1]), e.fl && (o += " C" + s.mat.applyToPointStringified(r.o[a - 1][0], r.o[a - 1][1]) + " " + s.mat.applyToPointStringified(r.i[0][0], r.i[0][1]) + " " + s.mat.applyToPointStringified(r.v[0][0], r.v[0][1]))), e.st && (n = "matrix(" + s.mat.props.join(",") + ")"), e.lStr = o
            } else o = e.lStr;
            for (i = e.elements.length, a = 0; i > a; a += 1) "st" === e.elements[a].ty ? ((e.sh.mdf || this.firstFrame) && e.elements[a].el.setAttribute("d", h), (s.matMdf || this.firstFrame) && e.elements[a].el.setAttribute("transform", n)) : (e.elements[a].st.mdf = m ? !0 : e.elements[a].st.mdf, e.elements[a].st.d += o)
        }
    }, ShapeItemElement.prototype.renderFill = function(t, e, s) {
        var i = e.style;
        (e.c.mdf || this.firstFrame) && (i.pathElement.style.fill = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (i.pathElement.style.fillOpacity = e.o.v * s.opacity)
    }, ShapeItemElement.prototype.renderStroke = function(t, e, s) {
        var i = e.style,
            a = e.d;
        a && (a.mdf || this.firstFrame) && (i.pathElement.style.strokeDasharray = a.dasharray, i.pathElement.style.strokeDashoffset = a.dashoffset), (e.c.mdf || this.firstFrame) && (i.pathElement.style.stroke = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (i.pathElement.style.strokeOpacity = e.o.v * s.opacity), (e.w.mdf || this.firstFrame) && (i.pathElement.style.strokeWidth = e.w.v)
    }, ShapeItemElement.prototype.destroy = function(t, e) {
        this.shape = null, this.data = null, this.viewData = null, this.parentContainer = null, this.placeholder = null
    }, createElement(SVGBaseElement, ISolidElement), ISolidElement.prototype.createElements = function() {
        this.parent.createElements.call(this);
        var t = document.createElementNS(svgNS, "rect");
        t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement === this.parentContainer ? this.appendNodeToParent(t) : this.layerElement.appendChild(t), this.data.ln && this.innerElem.setAttribute("id", this.data.ln), this.innerElem = t
    }, ISolidElement.prototype.hide = IImageElement.prototype.hide, ISolidElement.prototype.renderFrame = IImageElement.prototype.renderFrame, ISolidElement.prototype.destroy = IImageElement.prototype.destroy, createElement(SVGBaseElement, ITextElement), ITextElement.prototype.createElements = function() {
        this.parent.createElements.call(this)
    }, createElement(BaseElement, CVBaseElement), CVBaseElement.prototype.createElements = function() {}, CVBaseElement.prototype.renderFrame = function(t) {
        if (3 === this.data.ty) return !1;
        if (!this.isVisible) return this.isVisible;
        this.finalTransform.opMdf = this.finalTransform.op.mdf, this.finalTransform.matMdf = this.finalTransform.mProp.mdf, this.finalTransform.opacity = this.finalTransform.op.v;
        var e, s = this.finalTransform.mat;
        if (t && (e = t.mat.props, s.reset().transform(e[0], e[1], e[2], e[3], e[4], e[5]), this.finalTransform.opacity *= t.opacity, this.finalTransform.opMdf = t.opMdf ? !0 : this.finalTransform.opMdf, this.finalTransform.matMdf = t.matMdf ? !0 : this.finalTransform.matMdf), this.hierarchy) {
            var i, a = this.hierarchy.length;
            for (t || s.reset(), i = a - 1; i >= 0; i -= 1) this.finalTransform.matMdf = this.hierarchy[i].finalTransform.mProp.mdf ? !0 : this.finalTransform.matMdf, e = this.hierarchy[i].finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5]);
            e = this.finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5])
        } else t ? (e = this.finalTransform.mProp.v.props, s.transform(e[0], e[1], e[2], e[3], e[4], e[5])) : (s.props[0] = this.finalTransform.mProp.v.props[0], s.props[1] = this.finalTransform.mProp.v.props[1], s.props[2] = this.finalTransform.mProp.v.props[2], s.props[3] = this.finalTransform.mProp.v.props[3], s.props[4] = this.finalTransform.mProp.v.props[4], s.props[5] = this.finalTransform.mProp.v.props[5]);
        return this.data.hasMask && (this.globalData.renderer.save(!0), this.maskManager.renderFrame(s)), this.isVisible
    }, CVBaseElement.prototype.getCurrentAnimData = function() {
        return this.currentAnimData
    }, CVBaseElement.prototype.addMasks = function(t) {
        this.maskManager = new CVMaskElement(t, this, this.globalData)
    }, CVBaseElement.prototype.destroy = function() {
        this.canvasContext = null, this.data = null, this.globalData = null, this.maskManager && this.maskManager.destroy()
    }, createElement(CVBaseElement, CVCompElement), CVCompElement.prototype.prepareFrame = function(t) {
        if (this.parent.prepareFrame.call(this, t), this.isVisible !== !1) {
            var e = t;
            this.tm && (e = this.tm.v, e === this.data.op && (e = this.data.op - 1));
            var s, i = this.elements.length;
            for (s = 0; i > s; s += 1) this.elements[s].prepareFrame(e - this.layers[s].st)
        }
    }, CVCompElement.prototype.renderFrame = function(t) {
        if (this.parent.renderFrame.call(this, t) !== !1) {
            var e, s = this.layers.length;
            for (e = s - 1; e >= 0; e -= 1) this.elements[e].renderFrame(this.finalTransform);
            this.data.hasMask && this.globalData.renderer.restore(!0), this.firstFrame && (this.firstFrame = !1)
        }
    }, CVCompElement.prototype.setElements = function(t) {
        this.elements = t
    }, CVCompElement.prototype.getElements = function() {
        return this.elements
    }, CVCompElement.prototype.destroy = function() {
        var t, e = this.layers.length;
        for (t = e - 1; t >= 0; t -= 1) this.elements[t].destroy();
        this.layers = null, this.elements = null, this.parent.destroy.call()
    }, createElement(CVBaseElement, CVImageElement), CVImageElement.prototype.createElements = function() {
        var t = this,
            e = function() {
                t.animationItem.elementLoaded();

            },
            s = function() {
                t.failed = !0, t.animationItem.elementLoaded()
            };
        this.img = new Image, this.img.addEventListener("load", e, !1), this.img.addEventListener("error", s, !1), this.img.src = this.path + this.assetData.p, this.parent.createElements.call(this)
    }, CVImageElement.prototype.renderFrame = function(t) {
        if (!this.failed && this.parent.renderFrame.call(this, t) !== !1) {
            var e = this.canvasContext;
            this.globalData.renderer.save();
            var s = this.finalTransform.mat.props;
            this.globalData.renderer.ctxTransform(s), this.globalData.renderer.ctxOpacity(this.finalTransform.opacity), e.drawImage(this.img, 0, 0), this.globalData.renderer.restore(this.data.hasMask), this.firstFrame && (this.firstFrame = !1)
        }
    }, CVImageElement.prototype.destroy = function() {
        this.img = null, this.animationItem = null, this.parent.destroy.call()
    }, createElement(CVBaseElement, CVShapeElement), CVShapeElement.prototype.createElements = function() {
        this.parent.createElements.call(this), this.mainShape = new CVShapeItemElement(this.data, this.dynamicProperties, this.globalData)
    }, CVShapeElement.prototype.renderFrame = function(t) {
        this.parent.renderFrame.call(this, t) !== !1 && (this.firstFrame && (this.mainShape.firstFrame = !0, this.firstFrame = !1), this.mainShape.renderShape(this.finalTransform, null, null, !0), this.data.hasMask && this.globalData.renderer.restore(!0))
    }, CVShapeElement.prototype.destroy = function() {
        this.mainShape.destroy(), this.parent.destroy.call()
    }, CVShapeItemElement.prototype.dashResetter = [], CVShapeItemElement.prototype.searchShapes = function(t, e, s, i) {
        var a, r, n, o, h = t.length - 1,
            m = [],
            l = [];
        for (a = h; a >= 0; a -= 1)
            if ("fl" == t[a].ty || "st" == t[a].ty) {
                if (o = {
                        type: t[a].ty,
                        elements: []
                    }, e[a] = {}, e[a].c = PropertyFactory.getProp(this.elemData, t[a].c, 1, null, s), e[a].c.k || (o.co = "rgb(" + bm_floor(e[a].c.v[0]) + "," + bm_floor(e[a].c.v[1]) + "," + bm_floor(e[a].c.v[2]) + ")"), e[a].o = PropertyFactory.getProp(this.elemData, t[a].o, 0, .01, s), "st" == t[a].ty && (o.lc = this.lcEnum[t[a].lc] || "round", o.lj = this.ljEnum[t[a].lj] || "round", 1 == t[a].lj && (o.ml = t[a].ml), e[a].w = PropertyFactory.getProp(this.elemData, t[a].w, 0, null, s), e[a].w.k || (o.wi = e[a].w.v), t[a].d)) {
                    var p = PropertyFactory.getDashProp(this.elemData, t[a].d, "canvas", s);
                    e[a].d = p, e[a].d.k || (o.da = e[a].d.dasharray, o["do"] = e[a].d.dashoffset)
                }
                this.stylesList.push(o), e[a].style = o, m.push(e[a].style)
            } else if ("gr" == t[a].ty) e[a] = {
            it: []
        }, this.searchShapes(t[a].it, e[a].it, s, i);
        else if ("tr" == t[a].ty) e[a] = {
            transform: {
                mat: new Matrix,
                opacity: 1,
                matMdf: !1,
                opMdf: !1,
                op: PropertyFactory.getProp(this.elemData, t[a].o, 0, .01, s),
                mProps: PropertyFactory.getProp(this.elemData, t[a], 2, null, s)
            },
            elements: []
        };
        else if ("sh" == t[a].ty || "rc" == t[a].ty || "el" == t[a].ty) {
            e[a] = {
                nodes: [],
                trNodes: [],
                tr: [0, 0, 0, 0, 0, 0]
            };
            var d = 4;
            "rc" == t[a].ty ? d = 5 : "el" == t[a].ty && (d = 6), e[a].sh = PropertyFactory.getShapeProp(this.elemData, t[a], d, s, i), n = this.stylesList.length;
            var f = !1,
                c = !1;
            for (r = 0; n > r; r += 1) this.stylesList[r].closed || (this.stylesList[r].elements.push(e[a]), "st" === this.stylesList[r].type ? f = !0 : c = !0);
            e[a].st = f, e[a].fl = c
        } else if ("tm" == t[a].ty) {
            var u = {
                closed: !1,
                trimProp: PropertyFactory.getProp(this.elemData, t[a], 7, null, s)
            };
            i.push(u), l.push(u)
        }
        for (h = m.length, a = 0; h > a; a += 1) m[a].closed = !0;
        for (h = l.length, a = 0; h > a; a += 1) l[a].closed = !0
    }, CVShapeItemElement.prototype.renderShape = function(t, e, s, i) {
        var a, r;
        if (!e)
            for (e = this.data, r = this.stylesList.length, a = 0; r > a; a += 1) this.stylesList[a].d = "", this.stylesList[a].mdf = !1;
        s || (s = this.viewData), r = e.length - 1;
        var n, o;
        for (n = t, a = r; a >= 0; a -= 1)
            if ("tr" == e[a].ty) {
                n = s[a].transform;
                var h = s[a].transform.mProps.v.props;
                if (n.matMdf = n.mProps.mdf, n.opMdf = n.op.mdf, o = n.mat, o.reset(), t) {
                    var m = t.mat.props;
                    n.opacity = t.opacity, n.opacity *= s[a].transform.op.v, n.matMdf = t.matMdf ? !0 : n.matMdf, n.opMdf = t.opMdf ? !0 : n.opMdf, o.transform(m[0], m[1], m[2], m[3], m[4], m[5])
                } else n.opacity = n.op.o;
                o.transform(h[0], h[1], h[2], h[3], h[4], h[5])
            } else "sh" == e[a].ty || "el" == e[a].ty || "rc" == e[a].ty ? this.renderPath(e[a], s[a], n) : "fl" == e[a].ty ? this.renderFill(e[a], s[a], n) : "st" == e[a].ty ? this.renderStroke(e[a], s[a], n) : "gr" == e[a].ty ? this.renderShape(n, e[a].it, s[a].it) : "tm" == e[a].ty;
        if (i) {
            r = this.stylesList.length;
            var l, p, d, f, c, u, v, y = this.globalData.renderer,
                g = this.globalData.canvasContext;
            for (a = 0; r > a; a += 1)
                if (v = this.stylesList[a].type, "st" !== v || 0 !== this.stylesList[a].wi) {
                    for (y.save(), c = this.stylesList[a].elements, p = c.length, "st" === v ? (g.strokeStyle = this.stylesList[a].co, g.lineWidth = this.stylesList[a].wi, g.lineCap = this.stylesList[a].lc, g.lineJoin = this.stylesList[a].lj, g.miterLimit = this.stylesList[a].ml) : g.fillStyle = this.stylesList[a].co, y.ctxOpacity(this.stylesList[a].coOp), g.beginPath(), l = 0; p > l; l += 1) {
                        for ("st" === v ? (y.save(), g.beginPath(), this.stylesList[a].da ? (g.setLineDash(this.stylesList[a].da), g.lineDashOffset = this.stylesList[a]["do"], this.globalData.isDashed = !0) : this.globalData.isDashed && (g.setLineDash(this.dashResetter), this.globalData.isDashed = !1), y.ctxTransform(c[l].tr), u = c[l].nodes) : u = c[l].trNodes, f = u.length, d = 0; f > d; d += 1) "m" == u[d].t ? g.moveTo(u[d].p[0], u[d].p[1]) : g.bezierCurveTo(u[d].p1[0], u[d].p1[1], u[d].p2[0], u[d].p2[1], u[d].p3[0], u[d].p3[1]);
                        "st" === v && (g.stroke(), y.restore())
                    }
                    "st" !== v && g.fill(), y.restore()
                }
            this.firstFrame && (this.firstFrame = !1)
        }
    }, CVShapeItemElement.prototype.renderPath = function(t, e, s) {
        var i, a, r = e.sh.v;
        if (r.v) {
            i = r.v.length;
            var n = s.matMdf || e.sh.mdf || this.firstFrame;
            if (n) {
                var o = e.trNodes,
                    h = e.nodes;
                o.length = 0, h.length = 0;
                var m = r.s ? r.s : [];
                for (a = 1; i > a; a += 1) m[a - 1] ? (e.st && h.push({
                    t: "m",
                    p: m[a - 1]
                }), e.fl && o.push({
                    t: "m",
                    p: s.mat.applyToPointArray(m[a - 1][0], m[a - 1][1])
                })) : 1 == a && (e.st && h.push({
                    t: "m",
                    p: r.v[0]
                }), e.fl && o.push({
                    t: "m",
                    p: s.mat.applyToPointArray(r.v[0][0], r.v[0][1])
                })), e.st && h.push({
                    t: "c",
                    p1: r.o[a - 1],
                    p2: r.i[a],
                    p3: r.v[a]
                }), e.fl && o.push({
                    t: "c",
                    p1: s.mat.applyToPointArray(r.o[a - 1][0], r.o[a - 1][1]),
                    p2: s.mat.applyToPointArray(r.i[a][0], r.i[a][1]),
                    p3: s.mat.applyToPointArray(r.v[a][0], r.v[a][1])
                });
                1 == i && (m[0] ? (e.st && h.push({
                    t: "m",
                    p: m[0]
                }), e.fl && o.push({
                    t: "m",
                    p: s.mat.applyToPointArray(m[0][0], m[0][1])
                })) : (e.st && h.push({
                    t: "m",
                    p: r.v[0]
                }), e.fl && o.push({
                    t: "m",
                    p: s.mat.applyToPointArray(r.v[0][0], r.v[0][1])
                }))), i && t.closed && (!t.trimmed || r.c) && (e.st && h.push({
                    t: "c",
                    p1: r.o[a - 1],
                    p2: r.i[0],
                    p3: r.v[0]
                }), e.fl && o.push({
                    t: "c",
                    p1: s.mat.applyToPointArray(r.o[a - 1][0], r.o[a - 1][1]),
                    p2: s.mat.applyToPointArray(r.i[0][0], r.i[0][1]),
                    p3: s.mat.applyToPointArray(r.v[0][0], r.v[0][1])
                })), e.st && (e.tr[0] = s.mat.props[0], e.tr[1] = s.mat.props[1], e.tr[2] = s.mat.props[2], e.tr[3] = s.mat.props[3], e.tr[4] = s.mat.props[4], e.tr[5] = s.mat.props[5]), e.nodes = h, e.trNodes = o
            }
        }
    }, CVShapeItemElement.prototype.renderFill = function(t, e, s) {
        var i = e.style;
        (e.c.mdf || this.firstFrame) && (i.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (i.coOp = e.o.v * s.opacity)
    }, CVShapeItemElement.prototype.renderStroke = function(t, e, s) {
        var i = e.style,
            a = e.d;
        a && (a.mdf || this.firstFrame) && (i.da = a.dasharray, i["do"] = a.dashoffset), (e.c.mdf || this.firstFrame) && (i.co = "rgb(" + bm_floor(e.c.v[0]) + "," + bm_floor(e.c.v[1]) + "," + bm_floor(e.c.v[2]) + ")"), (e.o.mdf || s.opMdf || this.firstFrame) && (i.coOp = e.o.v * s.opacity), (e.w.mdf || this.firstFrame) && (i.wi = e.w.v)
    }, CVShapeItemElement.prototype.destroy = function() {
        this.data = null, this.globalData = null, this.canvasContext = null
    }, createElement(CVBaseElement, CVSolidElement), CVSolidElement.prototype.renderFrame = function(t) {
        if (this.parent.renderFrame.call(this, t) !== !1) {
            var e = this.canvasContext;
            this.globalData.renderer.save();
            var s = this.finalTransform.mat.props;
            this.globalData.renderer.ctxTransform(s), this.globalData.renderer.ctxOpacity(this.finalTransform.opacity), e.fillStyle = this.data.sc, e.fillRect(0, 0, this.data.sw, this.data.sh), this.globalData.renderer.restore(this.data.hasMask), this.firstFrame && (this.firstFrame = !1)
        }
    }, createElement(CVBaseElement, CVTextElement), CVTextElement.prototype.createElements = function() {
        this.parent.createElements.call(this)
    }, CVMaskElement.prototype.prepareFrame = function(t) {
        var e, s = this.dynamicProperties.length;
        for (e = 0; s > e; e += 1) this.dynamicProperties[e].getInterpolatedValue(t)
    }, CVMaskElement.prototype.renderFrame = function(t) {
        var e, s, i, a, r, n = this.ctx,
            o = this.data.masksProperties.length,
            h = !1;
        for (e = 0; o > e; e++)
            if ("n" !== this.masksProperties[e].mode) {
                h === !1 && (n.beginPath(), h = !0), this.masksProperties[e].inv && (n.moveTo(0, 0), n.lineTo(this.globalData.compWidth, 0), n.lineTo(this.globalData.compWidth, this.globalData.compHeight), n.lineTo(0, this.globalData.compHeight), n.lineTo(0, 0)), r = this.viewData[e].v, s = t.applyToPointArray(r.v[0][0], r.v[0][1]), n.moveTo(s[0], s[1]);
                var m, l = r.v.length;
                for (m = 1; l > m; m++) s = t.applyToPointArray(r.o[m - 1][0], r.o[m - 1][1]), i = t.applyToPointArray(r.i[m][0], r.i[m][1]), a = t.applyToPointArray(r.v[m][0], r.v[m][1]), n.bezierCurveTo(s[0], s[1], i[0], i[1], a[0], a[1]);
                s = t.applyToPointArray(r.o[m - 1][0], r.o[m - 1][1]), i = t.applyToPointArray(r.i[0][0], r.i[0][1]), a = t.applyToPointArray(r.v[0][0], r.v[0][1]), n.bezierCurveTo(s[0], s[1], i[0], i[1], a[0], a[1])
            }
        h && n.clip()
    }, CVMaskElement.prototype.destroy = function() {
        this.ctx = null
    };
    var animationManager = function() {
            function t(t) {
                if (!t) return null;
                for (var e = 0; b > e;) {
                    if (v[e].elem == t && null !== v[e].elem) return v[e].animation;
                    e += 1
                }
                var s = new AnimationItem;
                return s.setData(t), v.push({
                    elem: t,
                    animation: s
                }), b += 1, s
            }

            function e(t) {
                var e = new AnimationItem;
                return e.setParams(t), v.push({
                    elem: null,
                    animation: e
                }), b += 1, e
            }

            function s(t, e) {
                var s;
                for (s = 0; b > s; s += 1) v[s].animation.setSpeed(t, e)
            }

            function i(t, e) {
                var s;
                for (s = 0; b > s; s += 1) v[s].animation.setDirection(t, e)
            }

            function a(t) {
                var e;
                for (e = 0; b > e; e += 1) v[e].animation.play(t)
            }

            function r(t, e) {
                g = !1, y = Date.now();
                var s;
                for (s = 0; b > s; s += 1) v[s].animation.moveFrame(t, e)
            }

            function n() {
                var t, e = Date.now(),
                    s = e - y;
                for (t = 0; b > t; t += 1) v[t].animation.renderer.destroyed ? (v.splice(t, 1), t -= 1, b -= 1) : v[t].animation.advanceTime(s);
                y = e, requestAnimationFrame(n)
            }

            function o(t) {
                var e;
                for (e = 0; b > e; e += 1) v[e].animation.pause(t)
            }

            function h(t, e, s) {
                var i;
                for (i = 0; b > i; i += 1) v[i].animation.goToAndStop(t, e, s)
            }

            function m(t) {
                var e;
                for (e = 0; b > e; e += 1) v[e].animation.stop(t)
            }

            function l(t) {
                var e;
                for (e = 0; b > e; e += 1) v[e].animation.togglePause(t)
            }

            function p(t) {
                var e;
                for (e = 0; b > e; e += 1) v[e].animation.destroy(t)
            }

            function d() {
                var e = document.getElementsByClassName("bodymovin");
                Array.prototype.forEach.call(e, t)
            }

            function f() {
                var t;
                for (t = 0; b > t; t += 1) v[t].animation.resize()
            }

            function c() {
                y = Date.now(), requestAnimationFrame(n)
            }
            var u = {},
                v = [],
                y = 0,
                g = !0,
                b = 0;
            return setTimeout(c, 0), u.registerAnimation = t, u.loadAnimation = e, u.setSpeed = s, u.setDirection = i, u.play = a, u.moveFrame = r, u.pause = o, u.stop = m, u.togglePause = l, u.searchAnimations = d, u.resize = f, u.start = c, u.goToAndStop = h, u.destroy = p, u
        }(),
        AnimationItem = function() {
            this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.pendingElements = 0, this.playCount = 0, this.prerenderFramesFlag = !0, this.repeat = "indefinite", this.animationData = {}, this.layers = [], this.assets = [], this.isPaused = !0, this.isScrolling = !1, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = randomString(10), this.renderedFrameCount = 0, this.scaleMode = "fit", this.math = Math, this.removed = !1, this.timeCompleted = 0, this.segmentPos = 0, this.segments = []
        };
    AnimationItem.prototype.setParams = function(t) {
            var e = this;
            t.context && (this.context = t.context), (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
            var s = t.animType ? t.animType : t.renderer ? t.renderer : "canvas";
            switch (s) {
                case "canvas":
                    this.renderer = new CanvasRenderer(this, t.renderer);
                    break;
                case "svg":
                    this.renderer = new SVGRenderer(this, t.renderer)
            }
            if (this.animType = s, "" === t.loop || null === t.loop || (this.loop = t.loop === !1 ? !1 : t.loop === !0 ? !0 : parseInt(t.loop)), this.autoplay = "autoplay" in t ? t.autoplay : !0, this.name = t.name ? t.name : "", this.prerenderFramesFlag = "prerender" in t ? t.prerender : !0, t.animationData) e.configAnimation(t.animationData);
            else if (t.path) {
                "json" != t.path.substr(-4) && ("/" != t.path.substr(-1, 1) && (t.path += "/"), t.path += "data.json");
                var i = new XMLHttpRequest;
                this.path = -1 != t.path.lastIndexOf("\\") ? t.path.substr(0, t.path.lastIndexOf("\\") + 1) : t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), i.open("GET", t.path, !0), i.send(), i.onreadystatechange = function() {
                    if (4 == i.readyState)
                        if (200 == i.status) e.configAnimation(JSON.parse(i.responseText));
                        else try {
                            var t = JSON.parse(i.responseText);
                            e.configAnimation(t)
                        } catch (s) {}
                }
            }
        }, AnimationItem.prototype.setData = function(t) {
            var e = {
                    wrapper: t
                },
                s = t.attributes;
            e.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", e.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : "canvas";
            var i = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
            "" === i || (e.loop = "false" === i ? !1 : "true" === i ? !0 : parseInt(i)), e.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "";
            var a = s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "";
            "false" === a && (e.prerender = !1), this.setParams(e)
        }, AnimationItem.prototype.includeLayers = function(t) {
            var e, s, i = this.animationData.layers,
                a = i.length,
                r = t.layers,
                n = r.length;
            for (s = 0; n > s; s += 1)
                for (e = 0; a > e;) {
                    if (i[e].id == r[s].id) {
                        i[e] = r[s];
                        break
                    }
                    e += 1
                }
            if (t.assets)
                for (a = t.assets.length, e = 0; a > e; e += 1) this.animationData.assets.push(t.assets[e]);
            dataManager.completeData(this.animationData), this.renderer.includeLayers(t.layers), this.renderer.buildStage(this.container, this.layers), this.renderer.renderFrame(null), this.loadNextSegment()
        }, AnimationItem.prototype.loadNextSegment = function() {
            var t = this.animationData.segments;
            if (!t || 0 === t.length) return this.trigger("data_ready"), void(this.timeCompleted = this.animationData.tf);
            var e = t.shift();
            this.timeCompleted = e.time * this.frameRate;
            var s = new XMLHttpRequest,
                i = this,
                a = this.path + this.fileName + "_" + this.segmentPos + ".json";
            this.segmentPos += 1, s.open("GET", a, !0), s.send(), s.onreadystatechange = function() {
                if (4 == s.readyState)
                    if (200 == s.status) i.includeLayers(JSON.parse(s.responseText));
                    else try {
                        var t = JSON.parse(s.responseText);
                        i.includeLayers(t)
                    } catch (e) {}
            }
        }, AnimationItem.prototype.loadSegments = function() {
            var t = this.animationData.segments;
            t || (this.timeCompleted = this.animationData.tf), this.loadNextSegment()
        }, AnimationItem.prototype.configAnimation = function(t) {
            this.animationData = t, this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.animationData.tf = this.totalFrames, this.renderer.configAnimation(t), t.assets || (t.assets = []), t.comps && (t.assets = t.assets.concat(t.comps), t.comps = null), this.animationData._id = this.animationID, this.animationData._animType = this.animType, this.layers = this.animationData.layers, this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.firstFrame = Math.round(this.animationData.ip), this.frameMult = this.animationData.fr / 1e3, this.trigger("config_ready"), this.loadSegments(), dataManager.completeData(this.animationData), this.renderer.buildItems(this.animationData.layers), this.updaFrameModifier(), this.checkLoaded()
        }, AnimationItem.prototype.elementLoaded = function() {
            this.pendingElements--, this.checkLoaded()
        }, AnimationItem.prototype.checkLoaded = function() {
            0 === this.pendingElements && (this.renderer.buildStage(this.container, this.layers), this.isLoaded = !0, this.gotoFrame(), this.autoplay && this.play())
        }, AnimationItem.prototype.resize = function() {
            this.renderer.updateContainerSize()
        }, AnimationItem.prototype.gotoFrame = function() {
            this.currentFrame = subframeEnabled ? this.currentRawFrame : this.math.floor(this.currentRawFrame), this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame()
        }, AnimationItem.prototype.renderFrame = function() {
            this.isLoaded !== !1 && this.renderer.renderFrame(this.currentFrame + this.firstFrame)
        }, AnimationItem.prototype.play = function(t) {
            t && this.name != t || this.isPaused === !0 && (this.isPaused = !1)
        }, AnimationItem.prototype.pause = function(t) {
            t && this.name != t || this.isPaused === !1 && (this.isPaused = !0)
        }, AnimationItem.prototype.togglePause = function(t) {
            t && this.name != t || (this.isPaused === !0 ? (this.isPaused = !1, this.play()) : (this.isPaused = !0, this.pause()))
        }, AnimationItem.prototype.stop = function(t) {
            t && this.name != t || (this.isPaused = !0, this.currentFrame = this.currentRawFrame = 0, this.playCount = 0, this.gotoFrame())
        }, AnimationItem.prototype.goToAndStop = function(t, e, s) {
            s && this.name != s || (this.setCurrentRawFrameValue(e ? t : t * this.frameModifier), this.isPaused = !0)
        }, AnimationItem.prototype.advanceTime = function(t) {
            this.isPaused !== !0 && this.isScrolling !== !0 && this.isLoaded !== !1 && this.setCurrentRawFrameValue(this.currentRawFrame + t * this.frameModifier)
        }, AnimationItem.prototype.updateAnimation = function(t) {
            this.setCurrentRawFrameValue(this.totalFrames * t)
        }, AnimationItem.prototype.moveFrame = function(t, e) {
            e && this.name != e || this.setCurrentRawFrameValue(this.currentRawFrame + t)
        }, AnimationItem.prototype.adjustSegment = function(t) {
            this.totalFrames = t[1] - t[0], this.firstFrame = t[0], this.trigger("segmentStart")
        }, AnimationItem.prototype.playSegments = function(t, e) {
            if ("object" == typeof t[0]) {
                var s, i = t.length;
                for (s = 0; i > s; s += 1) this.segments.push(t[s])
            } else this.segments.push(t);
            e && (this.adjustSegment(this.segments.shift()), this.setCurrentRawFrameValue(0))
        }, AnimationItem.prototype.resetSegments = function(t) {
            this.segments.length = 0, this.segments.push([this.animationData.ip * this.frameRate, Math.floor(this.animationData.op - this.animationData.ip + this.animationData.ip * this.frameRate)]), t && this.adjustSegment(this.segments.shift())
        }, AnimationItem.prototype.remove = function(t) {
            t && this.name != t || this.renderer.destroy()
        }, AnimationItem.prototype.destroy = function(t) {
            t && this.name != t || this.renderer && this.renderer.destroyed || this.renderer.destroy()
        }, AnimationItem.prototype.setCurrentRawFrameValue = function(t) {
            this.currentRawFrame = t;
            var e = !1;
            if (this.currentRawFrame >= this.totalFrames) {
                if (this.segments.length && (e = !0), this.loop === !1) return this.currentRawFrame = this.totalFrames - .01, this.gotoFrame(), this.pause(), void this.trigger("complete");
                if (this.trigger("loopComplete"), this.playCount += 1, this.loop !== !0 && this.playCount == this.loop) return this.currentRawFrame = this.totalFrames - .01, this.gotoFrame(), this.pause(), void this.trigger("complete")
            } else if (this.currentRawFrame < 0) return this.playCount -= 1, this.playCount < 0 && (this.playCount = 0), this.loop === !1 ? (this.currentRawFrame = 0, this.gotoFrame(), this.pause(), void this.trigger("complete")) : (this.trigger("loopComplete"), this.currentRawFrame = this.totalFrames + this.currentRawFrame, void this.gotoFrame());
            if (e) {
                var s = this.currentRawFrame % this.totalFrames;
                this.adjustSegment(this.segments.shift()), this.currentRawFrame = s
            } else this.currentRawFrame = this.currentRawFrame % this.totalFrames;
            this.gotoFrame()
        }, AnimationItem.prototype.setSpeed = function(t) {
            this.playSpeed = t, this.updaFrameModifier()
        }, AnimationItem.prototype.setDirection = function(t) {
            this.playDirection = 0 > t ? -1 : 1, this.updaFrameModifier()
        }, AnimationItem.prototype.updaFrameModifier = function() {
            this.frameModifier = this.frameMult * this.playSpeed * this.playDirection
        }, AnimationItem.prototype.getPath = function() {
            return this.path
        }, AnimationItem.prototype.getAssetData = function(t) {
            for (var e = 0, s = this.assets.length; s > e;) {
                if (t == this.assets[e].id) return this.assets[e];
                e += 1
            }
        }, AnimationItem.prototype.getAssets = function() {
            return this.assets
        }, AnimationItem.prototype.trigger = function(t) {
            if (this._cbs[t]) switch (t) {
                case "enterFrame":
                    this.triggerEvent(t, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult));
                    break;
                case "loopComplete":
                    this.triggerEvent(t, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult));
                    break;
                case "complete":
                    this.triggerEvent(t, new BMCompleteEvent(t, this.frameMult));
                    break;
                case "segmentStart":
                    this.triggerEvent(t, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames));
                    break;
                default:
                    this.triggerEvent(t)
            }
            "enterFrame" === t && this.onEnterFrame && this.onEnterFrame.call(this, new BMEnterFrameEvent(t, this.currentFrame, this.totalFrames, this.frameMult)), "loopComplete" === t && this.onLoopComplete && this.onLoopComplete.call(this, new BMCompleteLoopEvent(t, this.loop, this.playCount, this.frameMult)), "complete" === t && this.onComplete && this.onComplete.call(this, new BMCompleteEvent(t, this.frameMult)), "segmentStart" === t && this.onSegmentStart && this.onSegmentStart.call(this, new BMSegmentStartEvent(t, this.firstFrame, this.totalFrames))
        }, AnimationItem.prototype.addEventListener = addEventListener, AnimationItem.prototype.removeEventListener = removeEventListener, AnimationItem.prototype.triggerEvent = triggerEvent,
        function(t) {
            function e(t) {
                animationManager.play(t)
            }

            function s(t) {
                animationManager.pause(t)
            }

            function i(t) {
                animationManager.togglePause(t)
            }

            function a(t, e) {
                animationManager.setSpeed(t, e)
            }

            function r(t, e) {
                animationManager.setDirection(t, e)
            }

            function n(t) {
                animationManager.stop(t)
            }

            function o(t) {
                animationManager.moveFrame(t)
            }

            function h() {
                animationManager.searchAnimations()
            }

            function m(t) {
                return animationManager.registerAnimation(t)
            }

            function l() {
                animationManager.resize()
            }

            function p() {
                animationManager.start()
            }

            function d(t, e, s) {
                animationManager.goToAndStop(t, e, s)
            }

            function f(t) {
                subframeEnabled = t
            }

            function c(t) {
                return animationManager.loadAnimation(t)
            }

            function u(t) {
                return animationManager.destroy(t)
            }

            function v(t) {
                if ("string" == typeof t) switch (t) {
                    case "high":
                        defaultCurveSegments = 200;
                        break;
                    case "medium":
                        defaultCurveSegments = 50;
                        break;
                    case "low":
                        defaultCurveSegments = 10
                } else !isNaN(t) && t > 1 && (defaultCurveSegments = t);
                roundValues(defaultCurveSegments >= 50 ? !1 : !0)
            }

            function y() {
                "complete" === document.readyState && (clearInterval(b), h())
            }
            var g = {};
            g.play = e, g.pause = s, g.togglePause = i, g.setSpeed = a, g.setDirection = r, g.stop = n, g.moveFrame = o, g.searchAnimations = h, g.registerAnimation = m, g.loadAnimation = c, g.setSubframeRendering = f, g.resize = l, g.start = p, g.goToAndStop = d, g.destroy = u, g.setQuality = v, g.version = "3.1.7", g.checkReady = y, t.bodymovin = g;
            var b = setInterval(y, 100)
        }(window);
}(window));
