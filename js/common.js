"use strick"
//全局变量
var gVersion = "0.01";
var gAppName = "快块装" + gVersion;

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
	var aEvent = JSON.parse(localStorage.data)["event"]
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
 * 关闭当前所有打开的子页面（sub_开头id的页面）,并隐藏其父页面的遮罩
 */
function fCloseSubPage() {
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
			})
		}
	}
}