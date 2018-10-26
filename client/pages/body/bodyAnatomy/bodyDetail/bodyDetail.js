// client/pages/bodyDetail/bodyDetail.js
var qcloud = require('../../../../vendor/wafer2-client-sdk/index')
var config = require('../../../../config')
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    catId: null,
    cat: null,
    side: null,
    showSideDetail: false
  },

  tapSide: function(evt){
    var that = this
    util.showBusy('请求中...')
    qcloud.request({
      url: `${config.service.host}/weapp/anatomy/side/${evt.currentTarget.dataset.side.id}`,
      login: false,
      success(result) {
        util.showSuccess('请求成功完成')
        result.data.img.url = `${config.service.host}/weapp/anatomy/img/${result.data.img.id}`
        that.setData({
          side: result.data,
          showSideDetail: true
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      catId: options.catId
    })
    util.showBusy('请求中...')
    qcloud.request({
      url: `${config.service.host}/weapp/anatomy/cat/${options.catId}`,
      login: false,
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          cat: result.data
        })
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})