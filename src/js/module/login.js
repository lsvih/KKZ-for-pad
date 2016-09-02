"use strict";
mui.init();
var successfilecount = 0;
var loading;
var datalength;
var insertSuccessCount;
mui.plusReady(function() {
	plus.navigator.closeSplashscreen();
	if(!localStorage.getItem("firstrun")) {
		mui.alert("即将下载资源包，请确认当前网络环境为WiFi。", common.appName, "确认", function() {
			if(plus.networkinfo.getCurrentType() != 3) { //判断当前环境是否为wifi环境
				mui.alert("请确认您的网络环境为WiFi环境", common.appName, "确认", function() {
					plus.runtime.restart();
				});
			} else { //如果为wifi环境则开始下载资源包
				loading = plus.nativeUI.showWaiting("正在下载资源包列表，请耐心等待...");
				common.ajax('packages?expand=groupPackages.group.groupProducts.product.productBrands.brand,groupPackages.group.groupProducts.product.productBrands.skus', {}, "GET", function(data) {
					fSavePackageinfo(data)
				}, "", {
					closeObj: loading,
					isReload: true
				});
			}
		});
	}
	mui("body").on("tap", "#login", function() {
		var username = document.getElementById("username").value;
		var password = document.getElementById("password").value;
		if(!username) {
			mui.alert("请输入用户名", common.appName);
			return false;
		}
		if(!password) {
			mui.alert("请输入密码", common.appName);
			return false;
		}
		document.activeElement.blur();
		loading = plus.nativeUI.showWaiting("正在登录，请稍后...");
		common.ajax("users/login", {
			'LoginForm[username]': username,
			'LoginForm[password]': password
		}, "POST", function(data) {
			window.plus.bridge.execSync("JGpushplugin", "PluginSetTagsFunctionSync", ["", "", "", String(data.id)]);
			localStorage.user = JSON.stringify({
				"id": data.id,
				"username": data.username,
				"sex": data.sex,
				"head_img-url": data["head_img-url"],
				"access_token": data.access_token
			});
			loading.setTitle("正在加载用户数据，请稍后");
			common.ajax('house-appointments?filter=inspector_id:' + User("id") + '&expand=houseGroups.houseGroupSchedules.sku.productBrand.product,houseGroups.houseGroupSchedules.process,houseGroups.houseGroupSchedules.check.checkStandards,houseGroups.houseGroupPackages.package,houseGroups.houseGroupSkus,user,house&sort=houseGroups.houseGroupSchedules.schedule_at', {}, "GET", function(data) {
				var tempdata = {
					"event": []
				};
				if(!data.items >> 0 || data.items.length !== 0) {
					for(let appoint of data.items) {
						var toinsertdata = {
							"id": appoint.id,
							"house_id": appoint.house.id,
							"user_id": appoint.user_id,
							"name": appoint.user.fullname,
							"sex": appoint.user.sex,
							"status": appoint.houseGroups.length !== 0 ? appoint.houseGroups[0].status : -1,
							"province": appoint.house.province,
							"city": appoint.house.city,
							"district": appoint.house.county,
							"street": appoint.house.street,
							"address": appoint.house.address,
							"phone": appoint.user.mobile,
							"content": appoint.houseGroups.length == 0 ? {
								"ordertime": lsvih.time.stampToStr(appoint.appointment_at * 1000, "datetime-local"),
								"package": [],
								"room": [],
								"skus": [],
								"check": {
									"selection": false,
									"gauge": false,
									"schedule": false
								},
								"property": {
									"img": []
								},
								"pending_construction": {
									"img": [],
									"text": ""
								},
								"broadcast": {
									"img": [],
									"text": "",
									"date": ""
								},
								"completed": {
									"img": [],
									"text": ""
								}
							} : {
								"house_group_id": appoint.houseGroups[0].id,
								"room": [],
								"schedule": appoint.houseGroups[0].houseGroupSchedules,
								"group_id": appoint.houseGroups[0].group_id,
								"ordertime": lsvih.time.stampToStr(appoint.appointment_at * 1000, "datetime-local"),
								"package": __fMapPackage(appoint.houseGroups[0].houseGroupPackages),
								"skus": appoint.houseGroups[0].houseGroupSkus,
								"price": appoint.houseGroups[0].group_amount,
								"clear_amount": appoint.houseGroups[0].clear_amount,
								"distance_rate": appoint.houseGroups[0].distance_rate,
								"taxes_amount": appoint.houseGroups[0].taxes_amount,
								"group_quotation": appoint.houseGroups[0].group_quotation,
								"group_contract": appoint.houseGroups[0].group_contract,
								"time_period": appoint.houseGroups[0].time_period,
								"is_holiday_work": appoint.houseGroups[0].is_holiday_work,
								"duration": appoint.houseGroups[0].duration,
								"start_at": appoint.houseGroups[0].start_at,
								"check": {
									"selection": false,
									"gauge": false,
									"schedule": false
								},
								"property": {
									"img": []
								},
								"pending_construction": {
									"img": [],
									"text": ""
								},
								"broadcast": {
									"img": [],
									"text": "",
									"date": ""
								},
								"completed": {
									"img": [],
									"text": ""
								}
							}
						}
						tempdata.event.push(toinsertdata);
						toinsertdata = {};
					}
				}
				myStorage.setItem("data", JSON.stringify(tempdata));
				loading.close();
				mui.toast("登陆成功!");
				plus.runtime.restart();
			}, "", {
				closeObj: loading
			});
			/**
			 * 将传入的packages数组转化为符合的格式
			 */
			function __fMapPackage(packagearr) {
				if(!packagearr >> 0 || packagearr.length !== 0) {
					const __temparr = [];
					for(let packageItem of packagearr) {
						__temparr.push({
							"house_group_id": packageItem.house_group_id,
							"package_id": packageItem.package_id,
							"name": packageItem.package.name,
							"size": packageItem.area,
							"images": packageItem.measure_t_imgs,
							"diagram": packageItem.plan_t_img
						});
					}
					return __temparr;
				} else {
					return [];
				}
			}
		}, "", {
			closeObj: loading
		});
	});
});

function DownloadResource(url) {
	var urlarr = url.split("/");
	var downloadfilename = urlarr[urlarr.length - 1]; //读出文件名
	plus.io.resolveLocalFileSystemURL("_downloads/" + downloadfilename, function(fs) { //先判断目录中是否已经有这个文件了，如果有则不下载，没有则下载
		myStorage.setItem(downloadfilename, true);
		successfilecount++;
	}, function(e) {
		console.log("Downloading '" + url + "' to cache...");
		var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
			switch(status) {
				case 404:
					//如果文件不存在，也当其下载成功数+1
					console.log("下载失败,文件不存在");
					successfilecount++;
					break;
				case 200:
					successfilecount++;
					downloadfilename = d.filename.split("/")[1]; //d.filename读出来为_downloads/xxxxxx.xxx形式
					console.log("下载成功=" + downloadfilename);
					myStorage.setItem(downloadfilename, true); //删除路径前的"_downloads/"以提高存储密度
					break;
				default:
					console.log("下载失败=" + status);
					mui.alert("网络异常，下载任务已暂停，请检查网络环境后重试。", common.appName, "确定", function() {
						plus.runtime.restart();
					})
			}
		});
		//启动下载任务
		dtask.start();
	});
}

function fSavePackageinfo(data) {
	const packageinfo = [];
	if(data.items >> 0 || data.items.length !== 0) {
		for(let packageitem of data.items) {
			const tempProductGroup = [];
			if(packageitem.groupPackages >> 0 || packageitem.groupPackages.length !== 0) {
				for(let grouppackageitem of packageitem.groupPackages) {
					const tempGroupProduct = [];
					if(grouppackageitem.group.groupProducts >> 0 || grouppackageitem.group.groupProducts.length !== 0) {
						for(let groupproductitem of grouppackageitem.group.groupProducts) {
							const tempProductBrand = [];
							if(groupproductitem.product.productBrands >> 0 || groupproductitem.product.productBrands.length !== 0) {
								for(let productbranditem of groupproductitem.product.productBrands) {
									const tempSku = [];
									if(productbranditem.skus >> 0 || productbranditem.skus.length !== 0) {
										for(let skuitem of productbranditem.skus) {
											tempSku.push({
												"sku_id": skuitem.id,
												"model": skuitem.model,
												//"color": skuitem.color,
												"size": skuitem.size,
												"text": skuitem.description,
												"img": skuitem.show_t_imgs
											});
										}
									}
									tempProductBrand.push({
										"product_brand_id": productbranditem.id,
										"brand_id": productbranditem.brand_id,
										"brand_name": productbranditem.brand.name,
										"skus": tempSku
									});
								}
							}
							tempGroupProduct.push({
								"group_product_id": groupproductitem.id,
								"product_id": groupproductitem.product_id,
								"num": groupproductitem.num,
								"is_selectable": groupproductitem.is_selectable,
								"name": groupproductitem.product.name,
								"product_brands": tempProductBrand
							});
						}
					}

					tempProductGroup.push({
						"group_package_id": grouppackageitem.id,
						"group_id": grouppackageitem.group_id,
						"group_name": grouppackageitem.group.name,
						"group_products": tempGroupProduct
					});
				}
			}
			packageinfo.push({
				"package_id": packageitem.id,
				"name": packageitem.name,
				"cover": packageitem.cover_t_img,
				"images": packageitem.show_t_imgs,
				"text": packageitem.description,
				"package_groups": tempProductGroup
			});
		}

	}
	myStorage.setItem("packageinfo", JSON.stringify({
		"packageinfo": packageinfo
	}));
	fDownloadFiles()
}

function fDownloadFiles() {
	mui('body').progressbar({
		progress: 0,
		color: 'success'
	}).show();
	//显示进度条与遮罩,提示开始下载
	mui.ajax(common.server + 'uploads/assets/commonFiles.txt', {
		dataType: 'text',
		type: 'get',
		timeout: 6000,
		success: function(data) {
			loading.setTitle("正在下载资源包，请耐心等待...");
			var arr;
			if(data !== null && data !== undefined && data !== "") {
				arr = eval(data); //将资源包列表转换为数组对象进行遍历
			} else {
				arr = [];
			}
			for(let uploadItem of arr) {
				var filenamearr = uploadItem.split("/");
				var filename = filenamearr[filenamearr.length - 1];
				if(!myStorage.getItem("filename")) {
					DownloadResource(common.server + 'uploads/' + uploadItem);
				}
			}
			var processController = setInterval(function() {
				if(successfilecount < arr.length) {
					mui("body").progressbar().setProgress(successfilecount / arr.length * 100);
				}
				if(true) {
					//				if(successfilecount == arr.length) {
					clearInterval(processController);
					mui("body").progressbar().setProgress(100);
					localStorage.setItem("firstrun", lsvih.time.day());
					mui.toast("资源包下载完成！");
					loading.close();
				}
			}, 50); //定时检查是否完成下载，同时更新进度条
		},
		error: function(xhr, textStatus, errorThrown) { //如果获取资源包列表时的网络连接失败了，则判定当前网络状态差，重新执行
			console.log(JSON.stringify(xhr))
			mui.alert("请确认网络连接后重试", common.appName, "确认", function() {
				plus.runtime.restart();
			});
		}
	});
}