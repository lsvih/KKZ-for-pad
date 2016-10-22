"use strict";
mui.init();
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
	eventsortid = lsvih.array.getSubByKey({
		"id": eventid
	}, tempdata.event);
	thiseventpackage = tempdata.event[eventsortid].content.package;
	console.log(JSON.stringify(tempdata.event[eventsortid].content.room))
	vueContent = new Vue({
		el: "#select-gauge",
		data: {
			"packages": thiseventpackage,
			"gauge": tempdata.event[eventsortid].content.room
		},
		ready: function() {
			mui('.mui-scroll-wrapper').scroll();
		}
	});
	mui("header").on("tap", ".mui-icon-closeempty", function() {
		plus.webview.currentWebview().opener().setStyle({
			mask: 'none'
		});
		plus.webview.currentWebview().close();
	});
	mui("header").on("tap", ".submit-btn", function() {
		if(_fIsSelectAll()) {
			uploading = plus.nativeUI.showWaiting("正在上传套餐数据，请稍后...");
			fPostHouseGroup();
		} else {
			mui.toast("请完成全部数据填写");
			return false;
		}

		function _fIsSelectAll() {
			var selectCollection = document.getElementsByTagName("select");
			//TODO 换成for of
			for(let i = 0; i < selectCollection.length; i++) {
				if(selectCollection[i].value == "请选择量房数据") return false;
			}
			return true;
		}
	})
});

/**
 * 创建housegroup
 */
function fPostHouseGroup() {
	const group_id_arr = [];
	for(let packageItem of thiseventpackage) {
		group_id_arr.push(packageItem.package_id);
	}
	//先将之前的houseGroup清空
	common.ajax(`house-group/batch-delete?filter=house_appointment_id:${eventid}`, {}, "DELETE", function(data) {
		common.ajax(`groups/group-by-package?package_ids=[${group_id_arr}]`, {}, "GET", function(data) {
			var house_appointment_id = tempdata.event[eventsortid].id;
			var house_id = tempdata.event[eventsortid].house_id;
			var group_id = data.group_id;
			common.ajax("house-groups", {
				'house_appointment_id': house_appointment_id,
				'house_id': house_id,
				'group_id': group_id
			}, "POST", function(data) {
				tempdata.event[eventsortid].content.group_id = group_id;
				tempdata.event[eventsortid].content.house_group_id = data.id;
				myStorage.setItem("data", JSON.stringify(tempdata));
				uploading.setTitle("正在上传量房信息，请稍后...");
				fPostHouseGroupPackage();
			}, "", {
				closeObj: uploading
			});
		}, "", {
			closeObj: uploading
		});
	}, "", {
		closeObj: uploading
	});

}
const house_group_packages = [];

function fPostHouseGroupPackage() {
	for(let i = 0; i < thiseventpackage.length; i++) {
		var roomsortid = document.getElementsByTagName("select")[i].options[document.getElementsByTagName("select")[i].selectedIndex].getAttribute("value");
		var thisRoom = tempdata.event[eventsortid].content.room[roomsortid];
		house_group_packages.push({
			"house_group_id": tempdata.event[eventsortid].content.house_group_id,
			"package_id": thiseventpackage[i].package_id,
			"graph_info": thisRoom.graph_info,
			"num": 1,
			"plan_t_img": thisRoom.remote_plan_t_img,
			"measure_t_imgs": thisRoom.remote_measure_t_imgs
		});
	}
	console.log(JSON.stringify(house_group_packages));
	//批量创建houseGroupPackage
	common.ajax("house-group-package/batch-create", {
		"jsbody": JSON.stringify(house_group_packages)
	}, "POST", function() {

		let custom_products = tempdata.event[eventsortid].content.custom_products;
		const toUpload_product = [];
		custom_products.map((e) => {
			toUpload_product.push({
				'house_group_id': tempdata.event[eventsortid].content.house_group_id,
				'name': e.name,
				'unit_price': e.price,
				'num': e.num
			})
		})
		common.ajax(`house-group-customproduct/batch-create`, {
			"jsbody": JSON.stringify(toUpload_product)
		}, "POST", function() {
			common.ajax(`house-groups/${tempdata.event[eventsortid].content.house_group_id}`, {
				'status': 1,
			}, "PUT", function(data) {
				myStorage.setItem("data", JSON.stringify(tempdata));
				plus.webview.currentWebview().opener().setStyle({
					mask: "none"
				});
				mui.fire(plus.webview.getLaunchWebview(), "reloadhouse", eventid);
				plus.webview.currentWebview().opener().evalJS("location.href='select_product.html?eventid='+eventid");
				uploading.close();
				plus.webview.currentWebview().close();
			}, "", {
				closeObj: uploading,
				isReload: true
			});
		}, "", {
			closeObj: uploading,
			isReload: true
		})

	}, "", {
		closeObj: uploading
	});
}