window.onload = function () {
  var box = document.getElementsByClassName('slideBox')[0]
  // 初始化轮播
  new initSlide(box)

}

function initSlide(div) {
  this.slideBox = div
  this.banner = this.slideBox.querySelector('.slideBanners')
  this.bannerli = this.banner.getElementsByTagName('li')
  this.points = this.slideBox.querySelector('.slidePoints')
  this.pointsli = this.points.getElementsByTagName('li')
  this.left = this.slideBox.querySelector('.slideL')
  this.right = this.slideBox.querySelector('.slideR')
  this.index = 1
  this.step = 0
  this.init()
}
initSlide.prototype = {
  constructor: initSlide,
  init: function () {
    var that = this
    window.onresize = function () {
      that.step = that.bannerli[0].offsetWidth
      that.banner.style.left = -that.step + 'px'
      that.slideBox.style.height = that.bannerli[0].offsetHeight + 'px'
    }
    // 默认触发一次事件
    this.fireEvent(window, 'resize')
    // 自动轮播
    this.autoPlay()
    // 点击轮播
    this.spanClick()
    // 点击跳转
    this.pointsClick()
  },
  // 默认触发事件
  fireEvent: function (ele, event) {
    if (document.all) {
      eventName = 'on' + event
      ele.fireEvent(eventName)
    } else {
      var e = document.createEvent('HTMLEvents')
      e.initEvent(event, true, true)
      ele.dispatchEvent(e)
    }
  },
  // banner滑动
  move: function () {
    animate(this.banner, {
      left: -this.step * this.index
    }, function () {
      this.jump()
      this.pointsLight()
    }.call(this))
  },
  // 无缝跳转
  jump: function () {
    if (this.index === (this.bannerli.length - 1)) {
      setTimeout(function () {
        this.index = 1
        this.banner.style.left = -this.step * this.index + 'px'
      }.bind(this), 1500)
    }
    if (this.index === 0) {
      setTimeout(function () {
        this.index = this.bannerli.length - 2
        this.banner.style.left = -this.step * this.index + 'px'
      }.bind(this), 1500)
    }
  },
  // 轮播图下面的小灯
  pointsLight: function () {
    var that = this
    var num = this.index - 1
    num = num === 5 ? 0 : num < 0 ? 4 : num
    for (var i=0; i<that.pointsli.length; i++) {
      that.pointsli[i].className = ''
    }
    that.pointsli[num].className = 'active'
  },

  autoPlay: function () {
    var timer = setInterval(function () {
      this.index++
      this.move()
    }.bind(this), 2000)
    this.stopAuto(timer)
  },
  // 停止播放
  stopAuto: function (timer) {
    eventHandler.addEvent(this.slideBox, 'mouseenter', function () {
      clearInterval(timer)
    }.bind(this))

    eventHandler.addEvent(this.slideBox, 'mouseleave', function () {
      this.autoPlay()
    }.bind(this))
  },
  // 左右按钮绑定
  spanClick: function () {
    eventHandler.addEvent(this.left, 'click', function () {
      this.index--
      this.move()
    }.bind(this))

    eventHandler.addEvent(this.right, 'click', function () {
      this.index++
      this.move()
    }.bind(this))
  },
  // 小灯点击绑定
  pointsClick: function () {
    var that = this
    for (var k=0; k<this.pointsli.length; k++) {
      this.pointsli[k].index = k
      eventHandler.addEvent(this.pointsli[k], 'click', function () {
        that.index = this.index + 1
        that.move()
      })
    }
  }
  
}