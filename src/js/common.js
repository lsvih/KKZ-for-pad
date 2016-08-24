"use strict";

//全局变量
var common = {};
common.version = "1.3";
common.appName = "块块装";
common.topBarHeight = 20;
common.server = "http://123.56.200.45/kkz/";
common.apiServer = common.server + "api/web/";
/**
 * 封装AJAX方法
 * @param {String} apiUrl
 * @param {Object} DATA
 * @param {Object} Type PUT|DELETE|GET|POST
 * @param {Function} successcallback 成功回调
 * @param {Function} errcallback 失败回调
 * @param {Object} option配置,包括closeObj,isReload
 */
common.ajax = function(apiUrl, DATA, Type, successcallback, errcallback, option) {
	var option = option || {};
	var closeObj = option.closeObj;
	var isReload = !!option.isReload;
	var errfunction = errcallback || function(xhr, textStatus, errorThrown) {
			console.log(`Url:${apiUrl},${JSON.stringify(xhr)}`);
			mui.alert("网络连接失败，请稍后重试", common.appName, "确认", function() {
				if(closeObj) closeObj.close();
				if(isReload) plus.webview.currentWebview().reload();
			});
		}
		//TODO 自定义成功回调
	var url = common.apiServer + apiUrl + (~apiUrl.indexOf("?") ? "&" : "?") + (User("access_token") == null ? '' : 'access-token=' + User("access_token"));
	mui.ajax(url, {
		data: DATA,
		type: Type,
		dataType: 'json',
		timeout: 12000,
		success: function(data) {
			if(data.success == true) {
				successcallback(data.data);
			} else {
				mui.alert(data.message, common.appName);
				if(closeObj) eval(closeObj + '.close()');
				if(isReload) plus.webview.currentWebview().reload();
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			errfunction(xhr, textStatus, errorThrown);
		}
	});
}

//判断是否存在队列对象，如果不存在则创建
if(!localStorage.FIFO) localStorage.FIFO = JSON.stringify([]);

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for(let i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";
	var uuid = s.join("");
	return uuid;
}

/**
 * 列出某工作流步骤下的所有事件
 * @param {Number} 需要遍历的工作流步骤的Id
 * return {Array} 取出的步骤对象数组
 *		  false = 没找到指定工作流步骤
 */
function fListAllFlowEvent(flowId) {
	var aEventList;
	var aFlowEvent = new Array;
	if(!myStorage.getItem("data")) return false;
	var aEvent = JSON.parse(myStorage.getItem("data")).event;
	for(let i = 0; i < gFlow.flow.length; i++) {
		if(gFlow.flow[i].id == flowId) aEventList = gFlow.flow[i]["contain-event"]
	}
	if(aEventList == null) return false;
	for(let eventListItem of aEventList) {
		for(let eventItem of aEvent) {
			if(eventItem.status == eventListItem) aFlowEvent.push(eventItem);
		}
	}
	return aFlowEvent;
}

/**
 * 关闭子页面并将工作流3与4隐藏
 * @param {Function} callback 回调函数（如果有的话）
 */
function fCloseSubPage(callback) {
	fCloseSubOpenPage();
	plus.webview.hide("plg_input", "fade-out", 200);
	plus.webview.hide("plg_work", "fade-out", 200);
	if(typeof(callback) === "function") callback();
}
/**
 * 关闭当前所有打开的子页面（sub_开头id的页面）,并隐藏其父页面的遮罩
 */
function fCloseSubOpenPage() {
	for(let webview of plus.webview.all()) {
		if(webview.id.split("_")[0] == "sub") {
			var parentwebview = webview.opener();
			plus.webview.close(webview);
		}
	}
}

/**
 * 获取当前元素的下标
 * @param {Object} this,
 * @param {Array} 元素集
 */
function index(current, obj) {
	for(let i = 0; i < obj.length; i++) {
		if(obj[i].outerHTML == current.outerHTML) {
			return i;
		}
	}
	return false;
}

/**
 * 设置所有子页面的遮罩
 * @param {String} maskoption 遮罩样式
 */
function fSetSubPageMask(maskoption) {
	for(let webview of plus.webview.all()) {
		if(webview.id.split("_")[0] == "sub") {
			webview.setStyle({
				mask: maskoption
			});
			webview.addEventListener("maskClick", function() {
				mui.fire(plus.webview.getLaunchWebview(), "menu:close");
			});
		}
	}
	plus.webview.getWebviewById("plg_input").setStyle({
		mask: maskoption
	});
	plus.webview.getWebviewById("plg_input").addEventListener("maskClick", function() {
		mui.fire(plus.webview.getLaunchWebview(), "menu:close");
	}); //为工作流3增加遮罩及事件
	plus.webview.getWebviewById("plg_work").setStyle({
		mask: maskoption
	});
	plus.webview.getWebviewById("plg_work").addEventListener("maskClick", function() {
		mui.fire(plus.webview.getLaunchWebview(), "menu:close");
	}); //为工作流4增加遮罩及事件
}

/**
 * 拍照传入指定vueContent.event.content的Vue对象中
 * @param {String} targetJSON 目标图片JSONkey,如向property.img插入图片
 */
function getImage(targetJSON) {
	var inserTarget = eval("vueContent.event.content." + targetJSON);
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(p) {
		console.log("成功：" + p);
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			console.log(entry.fullPath); //真实路径
			plus.gallery.save(p, function() {
				console.log("保存图片到相册成功");
			});
			var localurl = entry.toLocalURL();
			var pictureContaint = document.getElementById("pictures");
			inserTarget.push(localurl);
		}, function(e) {
			console.log("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
		console.log("失败：" + e.message);
	}, {
		filename: "_doc/camera/"
	});
}
/**
 * 由相册获取图片传入vueContent.event.content目标Vue对象中
 * @param {String} targetJSON 目标图片JSONkey,如向property.img插入图片
 */
function galleryImg(targetJSON) {
	// 从相册中选择图片
	var inserTarget = eval("vueContent.event.content." + targetJSON);
	plus.gallery.pick(function(path) {
		for(let i in path.files) {
			inserTarget.push(path.files[i]);
		}

	}, function(e) {
		console.log("取消选择图片");
	}, {
		filter: "image",
		multiple: true,
		maximum: MAXIMAGECOUNT - inserTarget.length
	});
}

/**
 * 在某次event的timeline中获取指定日期的timeline下标
 * Date: YYYY-MM-DD
 * 如果没找到相应的时期则返回false
 * @param {String} date 需要查找下标的日期
 * @param {Object} JSON 需要查找的event json对象
 */
function fGetSortIdByDate(date, JSON) {
	var timeline = JSON.content.timeline;
	if(timeline.length == 0) return false;
	for(let i = 0; i < timeline.length; i++) {
		if(timeline[i].date == date) return i;
	}
	return false;
}

/**
 * 获取url后带的参数值，使用方法:GetRequest()['id']
 */
function GetRequest() {
	var url = location.search;
	var theRequest = new Object();
	if(url.indexOf("?") != -1) {
		var strs = url.substr(1).split("&");
		for(let str of strs) {
			theRequest[str.split("=")[0]] = unescape(str.split("=")[1]);
		}
	}
	return theRequest;
}

/**
 * 从数组中移除指定下标的元素
 * @param {Array} arr
 * @param {Number} num 待删除元素的下标
 */
function fRemoveObecjtFormArray(arr, num) {
	if(isNaN(num) || num >= arr.length) {
		return false;
	}
	for(let i = 0, n = 0; i < arr.length; i++) {
		if(arr[i] != arr[num]) {
			arr[n++] = arr[i];
		}
	}
	arr.length -= 1;
}

/**
 * 登录后从用户数据中取出相应字段
 * @param {String} 字段名
 */
function User(e) {
	if(localStorage.user == undefined || localStorage.user == null) return null;
	var userdata = JSON.parse(localStorage.user);
	return userdata[e];
}