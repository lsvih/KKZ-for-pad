var loading;
mui.init();
var eventid = GetRequest()["eventid"];
var tempdata = JSON.parse(myStorage.getItem("data"));
var eventsortid = lsvih.array.getSubByKey({
	"id": eventid
}, tempdata.event);
var thisevent = tempdata.event[eventsortid];
var house_group_id = thisevent.content.house_group_id;
var group_id = thisevent.content.group_id;
var package_id;
var vueContent;
var temppackage;
var thisgroup;
function __fGetCurrentGroup(packageinfo, groupid) {
	for(var k = 0; k < packageinfo.length; k++) {
		if(lsvih.array.getSubByKey({
				"group_id": groupid
			}, packageinfo[k].package_groups) !== false) {
			package_id = packageinfo[k].package_id;
			return lsvih.array.getObjByKey({
				"group_id": groupid
			}, packageinfo[k].package_groups);
		}
	}
}
mui.plusReady(function() {
	temppackage = JSON.parse(myStorage.getItem("packageinfo")).packageinfo;
	thisgroup = __fGetCurrentGroup(temppackage, group_id)
	loading = plus.nativeUI.showWaiting("正在加载，请稍后...");
	plus.webview.close("sub_doc");
	fAddVueCacheFilter();
	var detailinfo = plus.webview.currentWebview().detail;
	vueContent = new Vue({
		el: "#detail",
		data: {
			detail: fDetailPipe(thisgroup),
		},
		ready: function() {
			loading.close();
			document.getElementById("mask").style.opacity = 0;
			document.getElementById("mask").style.zIndex = 0;
			fSelectDefault();
		},
		methods: {
			cache: function(value) {
				return fCache(value);
			},
			previewimage: function(thisobj) { //查看单张图片大图
				plus.webview.show(plus.webview.create("../module/preview_image.html", "preview_image", {}, {
					images: thisobj.currentTarget.parentNode.innerHTML,
					indexid: index(thisobj.currentTarget, thisobj.currentTarget.parentNode.getElementsByTagName("img")),
					deletemode: lsvih.dom.hasClass(thisobj.currentTarget, "adds")
				}), "fade-in", 200);
			},
			previewimages: function(thisobj) { //查看多张图片大图
				plus.webview.show(plus.webview.create("../module/preview_image.html", "preview_image", {}, {
					images: thisobj.currentTarget.parentNode.parentNode.innerHTML,
					indexid: index(thisobj.currentTarget, thisobj.currentTarget.parentNode.parentNode.getElementsByTagName("img")),
					deletemode: lsvih.dom.hasClass(thisobj.currentTarget, "adds")
				}), "fade-in", 200);
			},
			Change: function(thisevent) {
				var thisobj = thisevent.currentTarget;
				if(lsvih.dom.hasClass(thisobj, "selected") || lsvih.dom.hasClass(thisobj, "selected-color")) return false;
				var parent = thisobj.parentNode;
				var productsortid = parent.parentNode.getElementsByTagName("i")[0].innerHTML;
				var type = parent.className.split("product-")[1];
				var items = parent.getElementsByTagName("span");
				for(var k = 0; k < items.length; k++) {
					lsvih.dom.removeClass(items[k], "selected");
				}
				lsvih.dom.addClass(thisobj, "selected");
				if(type == "brand") {
					var brandsortid = thisobj.getAttribute("value");
					this.detail.group_products[productsortid].selectbrand = brandsortid;
					setTimeout(function() {
						mui.trigger(parent.parentNode.getElementsByClassName("product-model")[0].getElementsByTagName("span")[0], "tap");
					}, 1);
				}
				if(type == "model") {
					var brandsortid = this.detail.group_products[productsortid].selectbrand;
					var modelsortid = thisobj.getAttribute("value");
					this.detail.group_products[productsortid].product_brands[brandsortid].selectmodel = modelsortid;
					setTimeout(function() {
						mui.trigger(parent.parentNode.getElementsByClassName("product-size")[0].getElementsByTagName("span")[0], "tap");
					}, 1);
					var modelName = thisobj.innerText.replace(/\s+/g, "");
					var skus = this.detail.group_products[productsortid].product_brands[brandsortid].skus;
					var sku = lsvih.array.getObjByKey({
						"model": modelName
					}, skus);
					var sku_id = sku.sku_id;
					parent.parentNode.parentNode.setAttribute("data-id", sku_id);
					this.detail.group_products[productsortid].showimage = sku.img;
					this.detail.group_products[productsortid].showtext = sku.text;
				}

			},
			//文字展开
			toggle: function(a, o, e) {
				if(a == "1") { //收缩
					o.style.height = "38px";
					setTimeout(function() {
						e.innerHTML = "<span class='mui-icon mui-icon-arrowdown'></span>";
						e.setAttribute("data-id", 0);
					}, 500);
				} else { //展开
					o.style.height = "150px";
					setTimeout(function() {
						e.innerHTML = "<span class='mui-icon mui-icon-arrowup'></span>";
						e.setAttribute("data-id", 1);
					}, 500);
				}
			},
		}
	});

});
/**
 * 运行时选择所有项的第一个
 */
function fSelectDefault() {
	var products = document.getElementsByClassName("product");
	for(var i = 0; i < products.length; i++) {
		mui.trigger(products[i].getElementsByClassName("product-brand")[0].getElementsByTagName("span")[0], "tap");
	}
}
/**
 * 详情处理中间件，将详情中的每个商品都加上属性树
 * @param {Object} DetailGroup 
 */
function fDetailPipe(DetailGroup) {
	for(var b = 0; b < DetailGroup.group_products.length; b++) {
		DetailGroup.group_products[b].showtext = DetailGroup.group_products[b].product_brands[0].skus[0].text;
		DetailGroup.group_products[b].showimage = DetailGroup.group_products[b].product_brands[0].skus[0].img;
		DetailGroup.group_products[b].selectbrand = 0;
		for(var c = 0; c < DetailGroup.group_products[b].product_brands.length; c++) {
			DetailGroup.group_products[b].product_brands[c].tree = fCreateProductBrandTree(DetailGroup.group_products[b].product_brands[c].skus);
			DetailGroup.group_products[b].product_brands[c].selectmodel = 0;
		}
	}
	return DetailGroup;
}
/**
 * 根据初始型号生成品牌的属性树
 * @param {Array} Brand 品牌下的sku信息
 */
function fCreateProductBrandTree(Brand) {
	var TreeArray = [];
	for(var c = 0; c < Brand.length; c++) {
		TreeArray.push({
			"name": Brand[c].model, //型号名称
			"size": [{
					"name": Brand[c].size
				}] //尺寸，需求为一对一关系
		});
	}
	return TreeArray;
}

mui("body").on("tap", ".close-btn", function() {
	plus.webview.currentWebview().close();
});
var uploadinfo = [];
var successcount = 0;
var uploading;
mui("body").on("tap", ".next-btn", function() {
	var products = document.getElementsByClassName("product");
	for(var i = 0; i < products.length; i++) {
		if(products[i].value == "unfinished") {
			mui.toast("请完成全部材料选择!")
			return false;
		}
	} //先判断是否全部选择完毕
	uploading = plus.nativeUI.showWaiting("正在生成选材资料，请稍后...");
	for(var s = 0; s < products.length; s++) {
		var product_sort = products[s].getElementsByTagName("i")[0].innerText;
		var product_id = vueContent.detail.group_products[product_sort].product_id;
		var sku_id = products[s].parentNode.getAttribute("data-id");
		uploadinfo.push({
			"house_group_id": house_group_id,
			"package_id": package_id,
			"product_id": product_id,
			"sku_id": sku_id
		});
	}
	common.ajax("house-group-sku/batch-create", {
		"items": JSON.stringify(uploadinfo)
	}, "POST", function(data) {
		common.ajax(`house-groups/${tempdata.event[eventsortid].content.house_group_id}`, {
			'status': 2,
		}, "PUT", function(data) {
			tempdata.event[eventsortid].status = 2;
			tempdata.event[eventsortid].content.skus = uploadinfo;
			tempdata.event[eventsortid].content.group_quotation = data.group_quotation;
			tempdata.event[eventsortid].content.price = data.group_amount;
			tempdata.event[eventsortid].content.taxes_amount = data.taxes_amount;
			myStorage.setItem("data", JSON.stringify(tempdata));
			mui.fire(plus.webview.getWebviewById("list"), "refreshvue", myStorage.getItem("thisflow"));
			mui.fire(plus.webview.getWebviewById("index_content"), "refreshvue", myStorage.getItem("thisflow") + "," + localStorage.getItem("thiseventsort"));
			uploading.close();
			mui.toast("选材完毕，报价清单已生成。");
			plus.webview.currentWebview().loadURL("../step/group_quotation.html?eventid=" + eventid);
		}, "", {
			closeObj: uploading,
			isReload: true
		});
	}, "", {
		closeObj: uploading
	});
});