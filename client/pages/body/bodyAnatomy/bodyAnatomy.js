// client/pages/body/bodyAnatomy/bodyAnatomy.js
var qcloud = require('../../../vendor/wafer2-client-sdk/index')
var config = require('../../../config')
var util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parts: [],
    curIndex: 0
  },

  tapBPart: function (evt) {
    var that = this;
    that.setData({
      curIndex: evt.currentTarget.dataset.index
    });
  },

  tapSPart: function (evt) {
    var that = this
    wx.navigateTo({
      url: 'bodyDetail/bodyDetail?catId=' + evt.currentTarget.dataset.part.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    util.showBusy('请求中...')
    qcloud.request({
      url: `${config.service.host}/weapp/anatomy/cats`,
      login: false,
      success(result) {
        util.showSuccess('请求成功完成')
        that.setData({
          parts: result.data
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