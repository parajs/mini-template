//index.js
//获取应用实例
const app = getApp()
import { findTopMemorialList } from '../../api/index'
Page({
  data: {
    autoplay: true,
    indicatorDots: false,
    isVisible: true
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    findTopMemorialList({ orderBy: 1}).then((result)=>{
    })
    
  },
  bindconfirm(){

  },
  bindfocus(){
    this.setData({
      isVisible: false
    })
  },
  bindinput(e){
    const { value } = e.detail
    if (!value){
      this.setData({
        isVisible: true
      })
    }else{
      this.setData({
        isVisible: false
      })
    }
   
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
