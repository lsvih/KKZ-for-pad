"use strick"
//全局变量
var gVersion = "0.01";
var gAppName = "快块装";
var gTopbarHeight = 20; //状态栏高度，沉浸式使用
var gServer = "http://123.56.200.45/kkz/"
var gAPIServer = gServer + "api/web/"//api接口目录

/**
 * 获得当前日期
 * 日期返回格式：YYYY-MM-DD
 */
function fGetDate() {
	var d = new Date();
	return d.getFullYear() + "-" + ((d.getMonth() + 1) < 10 ? "0" : "") + (d.getMonth() + 1) + "-" + d.getDate(); 
}
//判断是否存在队列对象，如果不存在则创建
if(!localStorage.FIFO) localStorage.FIFO = JSON.stringify([]);
/**
 * 查找某元素是否有指定的ClassName
 * fHasClass(elements, cName)
 * @param {Object} 判断的对象
 * @param {String} ClassName
 * @return true=找到
 */
function fHasClass(elements, cName) {
	return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)")); // ( \\s|^ ) 判断前面是否有空格 （\\s | $ ）判断后面是否有空格 两个感叹号为转换为布尔值 以方便做判断 
}

/**
 * 为指定元素增加ClassName
 * fAddClass(elements, cName)
 * @param {Object} 添加ClassName的对象
 * @param {String} ClassName
 */
function fAddClass(elements, cName) {
	if(!fHasClass(elements, cName)) {
		elements.className += " " + cName;
	}
}
/**
 * 将指定元素的指定ClassName移除
 * fRemoveClass(elements, cName)
 * @param {Object} 待移除ClassName的对象
 * @param {String} ClassName
 */
function fRemoveClass(elements, cName) {
	if(fHasClass(elements, cName)) {
		elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " "); // replace方法是替换 
	}
}

/**
 * 计算并更新工作流数量
 * fCaculateNumOfFlow()
 */
function fCaculateNumOfFlow() {
	for(var o = 0; o < gFlow.flow.length; o++) {
		gFlow.flow[o].num = fListAllFlowEvent(gFlow.flow[o].id).length;
	}
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
	var aEvent = JSON.parse(myStorage.getItem("data"))["event"]
	for(var i = 0; i < gFlow.flow.length; i++) {
		if(gFlow.flow[i].id == flowId) aEventList = gFlow.flow[i]["contain-event"];
	}
	if(aEventList == null) return false;
	for(var j = 0; j < aEventList.length; j++) {
		for(var k = 0; k < aEvent.length; k++) {
			if(aEvent[k].status == aEventList[j]) aFlowEvent.push(aEvent[k]);
		}
	}
	return aFlowEvent;
}

/**
 * 根据id，在数组中查找并返回对象
 * @param {Number} id
 * @param {Array} 查找的数组
 * @return {Object} 返回符合条件的对象 
 * 			false = 没有找到符合条件的对象
 */
function fFindObjById(id, array) {
	if(fFindObjSortById(id, array) === false) return false;
	return array[fFindObjSortById(id, array)]
}
/**
 * 根据id,在数组中查找并返回对象的下标
 * @param {Number} id
 * @param {Array} 查找的数组
 * @return {Number} 返回对象在数组中的下标值
 * 			false 没有找到符合条件的对象
 */
function fFindObjSortById(id, array) {
	for(var p = 0; p < array.length; p++) {
		if(id == array[p].id) return p;
	}
	return false;
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
	var allwebview = plus.webview.all();
	for(var i = 0; i < allwebview.length; i++) {
		if(allwebview[i].id.split("_")[0] == "sub") {
			var parentwebview = allwebview[i].opener();
			plus.webview.close(allwebview[i]);
		}
	}
}

/**
 * 获取当前元素的下标
 * @param {Object} this,
 * @param {Array} 元素集
 */
function index(current, obj) {
	for(var i = 0, length = obj.length; i < length; i++) {
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
	var allwebview = plus.webview.all();
	for(var i = 0; i < allwebview.length; i++) {
		if(allwebview[i].id.split("_")[0] == "sub") {
			allwebview[i].setStyle({
				mask: maskoption
			});
			allwebview[i].addEventListener("maskClick", function() {
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
		for(var i in path.files) {
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
	for(var i = 0; i < timeline.length; i++) {
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
		var str = url.substr(1);
		strs = str.split("&");
		for(var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
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
	for(var i = 0, n = 0; i < arr.length; i++) {
		if(arr[i] != arr[num]) {
			arr[n++] = arr[i];
		}
	}
	arr.length -= 1;
}


(function(win, mui) {
	/**
 	* @author 1020450921@qq.com
 	* @link http://www.cnblogs.com/phillyx
 	* @link http://ask.dcloud.net.cn/people/%E5%B0%8F%E4%BA%91%E8%8F%9C
	* @description 本地存储
	*/
	var myStorage = {};

	function getItem(k) {
		var jsonStr = window.localStorage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};

	function getItemPlus(k) {
		var jsonStr = plus.storage.getItem(k.toString());
		return jsonStr ? JSON.parse(jsonStr).data : null;
	};
	myStorage.getItem = function(k) {
		return getItem(k) || getItemPlus(k);
	};
	myStorage.setItem = function(k, value) {
		value = JSON.stringify({
			data: value
		});
		k = k.toString();
		try {
			window.localStorage.setItem(k, value);
		} catch (e) {
			console.log(e);
			//TODO 超出localstorage容量限制则存到plus.storage中
			//且删除localStorage重复的数据
			removeItem(k);
			plus.storage.setItem(k, value);
		}
	};

	function getLength() {
		return window.localStorage.length;
	};
	myStorage.getLength = getLength;

	function getLengthPlus() {
		return plus.storage.getLength();
	};
	myStorage.getLengthPlus = getLengthPlus;

	function removeItem(k) {
		return window.localStorage.removeItem(k);
	};

	function removeItemPlus(k) {
		return plus.storage.removeItem(k);
	};
	myStorage.removeItem = function(k) {
		window.localStorage.removeItem(k);
		return plus.storage.removeItem(k);
	}
	myStorage.clear = function() {
		window.localStorage.clear();
		return plus.storage.clear();
	};

	function key(index) {
		return window.localStorage.key(index);
	};
	myStorage.key = key;

	function keyPlus(index) {
		return plus.storage.key(index);
	};
	myStorage.keyPlus = keyPlus;

	function getItemByIndex(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = key(index);
		item.keyvalue = getItem(item.keyname);
		return item;
	};
	myStorage.getItemByIndex = getItemByIndex;

	function getItemByIndexPlus(index) {
		var item = {
			keyname: '',
			keyvalue: ''
		};
		item.keyname = keyPlus(index);
		item.keyvalue = getItemPlus(item.keyname);
		return item;
	};
	myStorage.getItemByIndexPlus = getItemByIndexPlus;
	/**
	 * @author liuyf 2015-05-04
	 * @description 获取所有存储对象
	 * @param {Object} key 可选，不传参则返回所有对象，否则返回含有该key的对象
	 */
	myStorage.getItems = function(k) {
		var items = [];
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		var i = 0;
		if (k) {
			for (; i < numKeys; i++) {
				if (key(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndex(i));
				}
			}
			for (i = 0; i < numKeysPlus; i++) {
				if (keyPlus(i).toString().indexOf(k) != -1) {
					items.push(getItemByIndexPlus(i));
				}
			}
		} else {
			for (i = 0; i < numKeys; i++) {
				items.push(getItemByIndex(i));
			}
			for (i = 0; i < numKeysPlus; i++) {
				items.push(getItemByIndexPlus(i));
			}
		}
		return items;
	};
	/**
	 * @description 清除指定前缀的存储对象
	 * @param {Object} keys
	 * @default ["filePathCache_","ajax_cache_"]
	 * @author liuyf 2015-07-21
	 */
	myStorage.removeItemByKeys = function(keys, cb) {
		if (typeof(keys) === "string") {
			keys = [keys];
		}
		var numKeys = getLength();
		var numKeysPlus = getLengthPlus();
		//TODO plus.storage是线性存储的，从后向前删除是可以的 
		//稳妥的方案是将查询到的items，存到临时数组中，再删除  
		var tmpks = [];
		var tk,
			i = numKeys - 1;
		for (; i >= 0; i--) {
			tk = key(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItem(k);
		});
		for (i = numKeysPlus - 1; i >= 0; i--) {
			tk = keyPlus(i);
			Array.prototype.forEach.call(keys, function(k, index, arr) {
				if (tk.toString().indexOf(k) != -1) {
					tmpks.push(tk);
				}
			});
		}
		tmpks.forEach(function(k) {
			removeItemPlus(k);
		})
		cb && cb();
	};
	win.myStorage = myStorage;
}(window, mui));


//var item=myStorage.getItem(key);
//返回值DOMString: 键key对应应用存储的值，如果没有则返回null。
//说明：方法内部默认先从localStorage取值，没有再从plus.Storage取值

//void myStorage.setItem(key, value);
//修改或添加键值(key-value)对数据到应用数据存储中
//说明：方法默认将数据存储在localStorage中，超出localStorage容量限制则存到plus.storage中

//var len=myStorage.getLength();
//获取plus.storage中保存的键值对的个数:

//myStorage.clear();
//清除所有键值

//void myStorage.removeItem();
//通过key值删除键值对存储的数据
