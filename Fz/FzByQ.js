/**
 * Created By ljq
 */

//========================================================================================================================
//缓动动画函数封装 用json进行多个css样式缓动动画 加上fn可回调函数
function animate(ele, json, fn) {
  clearInterval(ele.timer);
  ele.timer = setInterval(function() {
    var bool = true;
    for (var k in json) {
      var leader;
      if (k === "opacity") {
        leader = getStyle(ele, k) * 100 || 1;
      } else {
        leader = parseInt(getStyle(ele, k)) || 0;
      }
      var step = (json[k] - leader) / 10;
      step = step > 0 ? Math.ceil(step) : Math.floor(step);
      leader = leader + step;
      if (k === "opacity") {
        ele.style.opacity = leader / 100;
        ele.style.filter = "alpha(opacity:" + leader + ")";
      } else if (k === "zIndex") {
        ele.style.zIndex = json[k];
      } else {
        ele.style[k] = leader + "px";
      }
      if (json[k] !== leader) {
        bool = false;
      }
    }
    if (bool) {
      clearInterval(ele.timer);
      if (fn) {
        fn();
      }
    }
  }, 25);
}
//========================================================================================================================
//获取css样式封装
function getStyle(ele, attribute) {
  if (window.getComputedStyle) {
    return window.getComputedStyle(ele, null)[attribute];
  } else {
    return ele.currentStyle(attribute);
  }
}
//========================================================================================================================
//阻止冒泡封装
function stopBub(event) {
  event = event || window.event;
  if (event && event.stopPropagation) {
    event.stopPropagation();
  } else {
    event.cancelBubble = true;
  }
}
//stopBub();
//========================================================================================================================
//取消网页默认行为
function stopDefault(event) {
  event = event || window.event;
  if (event && event.preventDefault) {
    event.preventDefault;
  } else {
    event.returnValue = false;
  }
  return false;
}
//========================================================================================================================
//获取网页可视区域的宽高
function client() {
  return {
    "width": window.clientWidth || document.documentElement.clientWidth || document.body.clientWidth,
    "height": window.clientHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}
//========================================================================================================================
//获取网页被卷去的高度和宽度
function scroll() {
  return {
    "top": window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop,
    "left": window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft
  }
}
//========================================================================================================================
//禁止文字被勾选
function getSelection() {
  document.onmousemove = function() {
    if (window.getSelection) {
      return window.getSelection().removeAllRanges()
    } else {
      return document.selection.empty()
    }
  };
}
//========================================================================================================================
//事件监听器的兼容写法
EventListen = {
  //事件绑定
  addEvent: function(ele, str, fn) {
    //通过判断调用的方式兼容IE678
    //判断浏览器是否支持该方法，如果支持那么调用，如果不支持换其他方法
    if (ele.addEventListener) {
      //直接调用
      ele.addEventListener(str, fn);
    } else if (ele.attachEvent) {
      ele.attachEvent("on" + str, fn);
    } else {
      //在addEventListener和attachEvent都不存在的情况下，用此代码
      ele["on" + str] = fn;
    }
  },
  //事件解绑
  removeEvent: function(ele, fn, str) {
    if (ele.removeEventListener) {
      ele.removeEventListener(str, fn);
    } else if (ele.detachEvent) {
      ele.detachEvent("on" + str, fn);
    } else {
      ele["on" + str] = null;
    }
  }
};
// EventListen.addEvent(btn,"click",function)    // 用法

//========================================================================================================================
//ajax的封装函数
function ajax(method, url, params, done) {
  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP")
  method = method.toUpperCase()
  if (typeof params === 'object') { //如果params是obj对象,则遍历转换为字符串
    var tempArr = []
    for (var key in params) {
      tempArr.push(key + '=' + params[key])
    }
    params = tempArr.join('&') //将对象转换为字符串
  }
  if (method === 'GET') {
    url = url + '?' + params //get 通过url地址?传值
  }
  xhr.open(method, url)
  var data = null
  if (method === 'POST') { //post传值则需要修改请求头的Content-Type
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    data = params
  }
  xhr.send(data);
  EventListen.addEvent(xhr, 'readystatechange', function() {
    if (this.readyState !== 4) return
    done(this.responseText); //传入一个回调函数，意思是当ajax异步请求完成之后再执行这个函数
  })
} //调用测试
//   ajax('post','user.php','key1=value1&key2=value2',function(res){ 
//     console.log(res);// 当ajax异步请求完成之后就会把响应体打印到控制台
//   });
//========================================================================================================================
//封装jsonp，跨域请求
function jsonp(url, params, done) {
  var script = document.createElement("script")
  if (typeof params === 'objetc') { // 遍历需要发送的数据
    var tempArr = []
    for (var key in params) {
      tempArr.push(key + '=' + params[key])
    }
    params = tempArr.join('&')
  }
  //生成发送给服务端的随机回调函数名
  var funcName = 'jsonp_' + Date.now() + '_' + Math.random().toString().substr(2, 8)
  script.src = url + '?' + params + '&callback=' + funcName
  document.body.appendChild(script)
  window[funcName] = function(res) {
    done(res)
    delete funcName //拿到请求后清除随机函数名和script节点
    document.body.removeChild(script)
  }
}
//测试调用  需服务端配合
/*jsonp('http://localhost/case03/jsonp/server.php',{id:1,name:'Tom'},function (res){
console.log(res);
})*/
//========================================================================================================================
//===============ready封装 start==========================================================================================
function ready(fn) {
  if (document.addEventListener) {
    //当初始的 HTML 文档被完全加载和解析完成之后，
    //DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。
    document.addEventListener('DOMContentLoaded', function() {
      document.removeEventListener('DOMContentLoaded', arguments.callee, false)
      fn()
    }, false)
  } else {
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState == 'complete') {
        document.detachEvent('onreadystatechange', arguments.callee, false)
        fn()
      }
    })
  }
}
//===============仿ready封装 end==========================================================================================
//===============cookie start=============================================================================================
var cookie = {
    // 设置
    set: function(key, val, time = 1) {
      var timer = new Date()
      timer.setTime(timer.getTime() + time * 24 * 60 * 60 * 1000)
      document.cookie = key + '=' + escape(val) + ';expires=' + timer.toGMTString()
    },
    // 获取
    get: function(key) {
      var coo = document.cookie.replace(/[ ]/g, '')
      var cooArr = coo.split(';')
      if (!coo || !cooArr[0]) return
      var val = ''
      for (var i = 0; i < cooArr.length; i++) {
        var arr = cooArr[i].split('=')
        if (key === arr[0]) {
          val = arr[1]
          break
        }
      }
      return val
    },
    // 删除
    del: function(key) {
      var timer = new Date()
      timer.setTIme(timer.getTime() - 10000)
      document.cookie = key + '=v;expires=' + timer.toGMTString()
    }
  }
  //===============cookie end===============================================================================================
  //===============通用的事件侦听器函数 start===============================================================================
var event = {
    // 添加绑定
    addEvent: function(ele, type, handler) {
      if (ele.addEventListener) {
        ele.addEventListener(type, handler, false)
      } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, handler)
      } else {
        ele['on' + type] = handler
      }
    },
    // 去除绑定
    removeEvent: function(ele, type, handler) {
      if (ele.removeEventListener) {
        ele.removeEventListener(type, handler, false)
      } else if (ele.detachEvent) {
        ele.detachEvent('on' + type, handler)
      } else {
        ele['on' + type] = null
      }
    },
    // 获得event
    getEvent: function(event) {
      var e = event || window.event
      return e
    },
    // 获得目标元素
    getTarget: function(event) {
      var e = this.getEvent(event)
      return e.target
    },
    // 阻止冒泡
    stopBuble: function(event) {
      var e = this.getEvent(event)
      if (e.stopPropagation) {
        e.stopPropagation()
      } else {
        e.cancelBubble = true
      }
    },
    // 阻止默认事件
    preventDefault: function(event) {
      var e = this.getEvent(event)
      if (e.preventDefault) {
        e.preventDefault()
      } else {
        e.returnValue = false
      }
    }
  }
  //===============通用的事件侦听器函数 end ================================================================================