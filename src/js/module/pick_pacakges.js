"use strict";

var vueContent;
var tempdata;
var temppackage;
var temptimeout;
var eventid = GetRequest()["eventid"]; //获得eventid
var thiseventpackage;
var eventsortid;
var uploading;
mui.plusReady(function() {
	tempdata = JSON.parse(myStorage.getItem("data"));
	temppackage = JSON.parse(myStorage.getItem("packageinfo"));
	for(let packageItem of temppackage.packageinfo) {
		packageItem = fDetailPipe(packageItem);
	}
	var numboxarr = new Array(temppackage.packageinfo.length);
	eventsortid = lsvih.array.getSubByKey({
		"id": eventid
	}, tempdata.event);
	thiseventpackage = tempdata.event[eventsortid].content.package;
	window.addEventListener('custom', function(event) { //接收别的webview发出的刷新指令
		var custom_product = event.detail;
		console.log(JSON.stringify(custom_product));
		vueContent.custom_product_list.push(custom_product);
	});
	fAddVueCacheFilter();
	vueContent = new Vue({
		el: '#package',
		data: {
			packages: temppackage,
			custom_product_list: []
		},
		ready: function() {
			console.log(JSON.stringify(temppackage))
			document.getElementById("mask").style.opacity = 0;
			document.getElementById("mask").style.zIndex = 0;
			var numboxs = document.getElementsByClassName("mui-numbox");
			for(let i = 0; i < numboxs.length; i++) {
				numboxarr[i] = mui(numboxs[i]).numbox();
			}
		},
		methods: {
			__fGetpackageNum: function(packageId) {
				return fGetpackageNum(packageId);
			},
			__fCancelSelect: function(packageId, thismask) {
				thismask.style.display = "none";
				thismask.parentNode.getElementsByClassName("package-item-title")[0].style.display = "block";
				lsvih.dom.removeClass(thismask.parentNode.getElementsByClassName("edit-num")[0], "edit-num-active");
				thismask.parentNode.getElementsByClassName("mui-input-numbox")[0].setAttribute("data-id", 0);
				temptimeout = setTimeout(function() {
					thismask.parentNode.getElementsByClassName("mui-input-numbox")[0].value = 0;
				}, 400)
			},
			__fSelectThisPackage: function(packageId, thisItem, SortId) {
				clearTimeout("temptimeout");
				numboxarr[SortId].checkValue();
				thisItem.parentNode.getElementsByClassName("mui-input-numbox")[0].value = 1;
				thisItem.parentNode.getElementsByClassName("mui-input-numbox")[0].setAttribute("data-id", 1);
				thisItem.parentNode.getElementsByClassName("check-mask")[0].style.display = "block";
				thisItem.parentNode.getElementsByClassName("package-item-title")[0].style.display = "none";
				lsvih.dom.addClass(thisItem.parentNode.getElementsByClassName("edit-num")[0], "edit-num-active");
			},
			__fEditNum: function(thisValue) {
				thisValue.setAttribute("data-id", thisValue.value);
			},
			fAddCustomProduct: function() {
				console.log(tempdata.event[eventsortid].content.house_group_id)
				plus.webview.currentWebview().setStyle({
					mask: 'rgba(0,0,0,0.4)'
				})
				mui.openWindow({
					url: `./step_sub/add_custom_product.html?${vueContent.custom_product_list.length+1}`,
					id: "sub_form",
					styles: {
						top: 114 + common.topBarHeight + 'px',
						left: "242px",
						height: "540px",
						width: '540px'
					},
					show: {
						aniShow: "slide-in-up"
					},
					waiting: {
						autoShow: false,
					}
				});
			},
			fDelCustomProduct: function(customProductId) {
				mui.toast("成功删除自定义商品!");
				vueContent.custom_product_list.$remove(lsvih.array.getObjByKey({
					id: customProductId
				}, vueContent.custom_product_list))
			}
		}
	});
});

/**
 * 通过套餐的id与eventid来获取对应event中含有本套餐的数量，如果没有则传回0；
 * @param {Object} id 套餐的id
 */
function fGetpackageNum(package_id) {
	if(!thiseventpackage >> 0) return 0;
	var num = 0;
	for(let packageItem of thiseventpackage) {
		if(packageItem.package_id == package_id) num++;
	}
	return num;
}

/**
 * 向套餐中增加一项指定id的套餐
 * @param {Object} package_id
 */
function fAddAItemToPackage(package_id) {
	tempdata.event[eventsortid].content.package.push({
		"package_id": package_id,
		"name": lsvih.array.getObjByKey({
			"package_id": package_id
		}, temppackage.packageinfo).name,
		"size": "",
		"images": [],
		"diagram": "",
		"alias": ""
	});
}

function fDetailPipe(Detail) {
	if(!Detail.package_groups >> 0 || Detail.package_groups.legnth == 0) return false;
	//step.1 找到名字相同的group_package
	Detail.package_groups = _fFindTheCurrentPackage(Detail.package_groups, Detail.name);
	return Detail;

	function _fFindTheCurrentPackage(detail, name) {
		for(let detailItem of detail) {
			if(detailItem.group_name == name) return detailItem;
		}
	}
}
/**
 * 删除package中所有指定id的元素
 * @param {Object} package_id
 */
function fDeleteAllIdInPackage(package_id) {
	var tlength = tempdata.event[eventsortid].content.package.length
	for(let k = tlength - 1; k > -1; k--) {
		if(tempdata.event[eventsortid].content.package[k].package_id == package_id) {
			fRemoveObecjtFormArray(tempdata.event[eventsortid].content.package, k);
		}
	}
}
mui("body").on("tap", ".next-btn", function() {
	var values = document.getElementsByClassName("mui-input-numbox");
	for(let j = 0; j < values.length; j++) {
		if(values[j].getAttribute("data-id") != 0) {
			if(values[j].getAttribute("data-id") != fGetpackageNum(temppackage.packageinfo[j].package_id)) { //如果发现data-id和存储的数量不同，则删除所有对应的package
				fDeleteAllIdInPackage(temppackage.packageinfo[j].package_id); //删除所有对应的package
				for(let i = 0; i < values[j].getAttribute("data-id"); i++) { //删除对应的package后遍历写入新的package
					fAddAItemToPackage(temppackage.packageinfo[j].package_id, eventid);
				}
			}
		} else {
			fDeleteAllIdInPackage(temppackage.packageinfo[j].package_id); //如果没有被选择则删除所有对应的package
		}
	}
	if(!tempdata.event[eventsortid].content.package.length) {
		mui.toast("请选择套餐");
		return false;
	} else {
		tempdata.event[eventsortid].content.custom_products = vueContent.custom_product_list;
		myStorage.setItem("data", JSON.stringify(tempdata));
		plus.webview.currentWebview().setStyle({
			mask: 'rgba(0,0,0,0.4)'
		})
		mui.openWindow({
			url: `./step_sub/filled_pick_package.html?eventid=${eventid}`,
			id: "sub_form",
			styles: {
				top: 114 + common.topBarHeight + 'px',
				left: "242px",
				height: "540px",
				width: '540px'
			},
			show: {
				aniShow: "slide-in-up"
			},
			waiting: {
				autoShow: false,
			}
		});
	}
});