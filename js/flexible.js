(function(win, lib) {
    var timer = null,
        doc = win.document,
        docEl = doc.documentElement,
        dpr = 0,
        flexible = lib.flexible || (lib.flexible = {}),
        isIOS = win.navigator.appVersion.match(/iphone/gi),
        isUC = win.navigator.appVersion.match(/UCBrowser/gi),
        devicePixelRatio  = win.devicePixelRatio; //密度像素比
    // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案,把得到的值赋给dpr
    if (isIOS) {
        if (devicePixelRatio  >= 3 && (!dpr || dpr >= 3)) {
            dpr = 3
        } else if (devicePixelRatio  >= 2 && (!dpr || dpr >= 2)) {
            dpr = 2
        } else {
            dpr = 1;
        }
    } else {
        dpr = 1
    }
    docEl.setAttribute("data-dpr", dpr);

    //dom加载完毕，将body的默认font-size设置为12px
    if (doc.readyState === "complete") {
        doc.body.style.fontSize = "12px"
    } else {
        doc.addEventListener("DOMContentLoaded", function() {
            //dom 加载完毕后就将body的font-size设置为12px;
            doc.body.style.fontSize = "12px"
        }, false);
    }
    //设置docEl元素font-size 主函数
    function refreshRem() {

        var bodyWidth = docEl.getBoundingClientRect().width;
        var rem = bodyWidth / 10;
        docEl.style.fontSize = rem + "px";
        flexible.rem = win.rem = rem;
    }
    //监听事件变化，屏幕旋转或者大小被动态调整，更新根节点font-size
    //M端一般用不到，可以注销掉
    var change = "onorientationchange" in window ? "orientationchange" : "resize";

    win.addEventListener(change, function() {
        clearTimeout(timer);
        timer = setTimeout(refreshRem(), 300)
    }, false)

    win.addEventListener("pageshow", function(e) {
        //如果页面中保存在了bfcache中，则win.persisted的值为true；否则，为false。
        if (win.persisted) {
            clearTimeout(timer);
            timer = setTimeout(refreshRem(), 300)
        }
    }, false)

    refreshRem();
    flexible.dpr = win.dpr = dpr;
    flexible.refreshRem = refreshRem;

    //rem转化为px，挂载在window.lib对象下
    flexible.rem2px = function(d) {
            var val = parseFloat(d) * this.rem;
            if (typeof d === 'string' && d.match(/rem$/)) {
                val += 'px';
            }
            return val;
        }
        //px转化为rem，挂载在window.lib对象下
    flexible.px2rem = function(d) {
        var val = parseFloat(d) / this.rem;
        if (typeof d === 'string' && d.match(/px$/)) {
            val += 'rem';
        }
        return val;
    }
    if (isIOS && !isUC) { 
        //iphone且不是UC浏览器
        var onepx = "notHairlines",
            ua = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
            ver = parseInt(ua[1], 10);
        ver >= 8 && (onepx = "hairlines"),
            document.documentElement.classList.add(onepx)
    }
}(window, window.lib || (window.lib = {})));