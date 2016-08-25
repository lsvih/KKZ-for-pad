"use strict";
mui.init({
	gestureConfig: {
		doubletap: false,
		longtap: false
	},
	swipeBack: false
});
var MAXIMAGECOUNT = 10;
var vueContent;
mui.plusReady(function() {
	window.addEventListener('refreshvue', function(event) {
		var aShow = event.detail.split(",");
		vueContent.refresh(aShow[0], aShow[1]);
	});
	window.addEventListener('delete', function(event) {
		var statustarget = vueContent.event.status == "7" ? "property" : "pending_construction";
		var deleteitem = vueContent.event.content[statustarget].img[event.detail - 1];
		vueContent.event.content[statustarget].img.$remove(deleteitem);
	});
	window.addEventListener('sb', function(event) { //纯展示用
		document.getElementById("back-drop").style.display = "none";
	});
	vueContent = new Vue({
		el: "#event",
		data: {
			"event": fListAllFlowEvent(myStorage.getItem("thisflow"))[myStorage.getItem("thiseventsort")]
		},
		methods: {
			refresh: function(a, b) {
				document.getElementById("back-drop").style.display = "none";
				plus.webview.close("sub_edituser"); //再切换时将阴影去掉，同时关闭打开的子页面（为了下一次打开子页面动画正常播放）
				if(vueContent.event !== undefined && vueContent.event !== null) {
					var tempobj = JSON.parse(myStorage.getItem("data"));
					tempobj.event[lsvih.array.getSubByKey({
						"id": vueContent.event.id
					}, tempobj.event)] = vueContent.event;
					myStorage.setItem("data", JSON.stringify(tempobj)); //在本地存储修改
				}
				vueContent.event = fListAllFlowEvent(a)[b];
				myStorage.setItem("thisstatus", vueContent.event.status);
			},
			__fDetail: function(eventid, type, option) {
				var extras = option ? {
					type: type,
					eventid: eventid
				} : {
					type: type,
					eventid: eventid,
					option: JSON.stringify(option)
				};
				mui.openWindow({
					url: "index_frame.html",
					id: "sub_detail",
					styles: {
						top: 60 + common.topBarHeight + 'px',
						bottom: 0,
						left: "38.7%",
						height: "100%",
						width: '61.6%',
						bounce: 'none',
						bounceBackground: '#ffffff',
					},
					extras: extras,
					show: {
						aniShow: "slide-in-right"
					},
					waiting: {
						autoShow: false,
					}
				});
			},
			//编辑用户信息
			__fEditUser: function(eventid) {
				document.getElementById("back-drop").style.display = "block";
				mui.openWindow({
					url: "../index_sub/edituser.html",
					id: "sub_edituser",
					styles: {
						top: "15%",
						bottom: 0,
						right: "6.8%",
						width: "48%",
						height: "244px"
					},
					extras: {
						eventid: eventid
					},
					show: {
						aniShow: "fade-in"
					},
					waiting: {
						autoShow: false,
					}
				});
			},
			__fAddPic: function() {
				document.activeElement.blur();
				mui("#picture").popover('toggle');
			},
			__fEditPictures: function(thisobj) { //编辑图片
				mui.openWindow({
					url: "../module/preview_image.html",
					id: "preview_image",
					styles: {
						top: 0,
						bottom: 0,
						right: 0,
						width: "100%",
						height: "100%"
					},
					extras: {
						images: thisobj.currentTarget.parentNode.parentNode.innerHTML,
						indexid: index(thisobj.currentTarget, thisobj.currentTarget.parentNode.parentNode.getElementsByTagName("img")),
						deletemode: lsvih.dom.hasClass(thisobj.currentTarget, "adds")
					},
					show: {
						aniShow: "fade-in"
					},
					waiting: {
						autoShow: false,
					}
				});
			},
			__fCheck: function(type) {
				switch(type) {
					case "selection":
						mui.confirm('是否确认以上选材信息？确认后将无法修改选材信息。', common.appName, ['否', '是'], function(f) {
							if(f.index == 1) {
								vueContent.event.content.selection_check = true;
								SaveToLocal();
							}
						});
						break;
					case "schedule":
						mui.confirm('是否确认以上排期信息？确认后将无法修改排期信息。', common.appName, ['否', '是'], function(f) {
							if(f.index == 1) {
								vueContent.event.content.schedule_check = true;
								SaveToLocal();
							}
						});
						break;
					default:
						mui.confirm('是否确认以上选材信息？确认后将无法修改排期信息。', common.appName, ['否', '是'], function(f) {
							if(f.index == 1) {
								vueContent.event.content.schedule_check = true;
								SaveToLocal();
							}
						});
						break;
				}

			}
		}
	});
});
document.getElementById("back-drop").addEventListener("tap", function() {
	document.getElementById("back-drop").style.display = "none";
	plus.webview.close("sub_edituser");
});
mui('#picture').on('tap', '.mui-popover-action li>a', function() {
	var statustarget = vueContent.event.status == "7" ? "property.img" : "pending_construction.img";
	switch(this.getAttribute("data")) {
		case "1": //拍照
			mui("#picture").popover('toggle');
			getImage(statustarget);
			break;
		case "2": //从相册选择
			mui("#picture").popover('toggle');
			galleryImg(statustarget);
			break;
		default:
			break;
	}
});

mui("#event").on("tap", ".edit-time", function() {
	document.getElementById("select-time").focus();
});

function fSelecetTimeChange(e) {
	var inittime = e.getAttribute("init-time");
	if(!e.value)(e.value = inittime, e.blur()); //点击"清除"重新设定时间并关闭时间设定
}

function fSaveTime(e) {
	if(e.value == "") e.value = e.getAttribute("init-time"); //防止出现时间为空的情况
	if(e.getAttribute("init-time") != e.value) { //当时间有修改时才进行本地修改与上传操作
		mui.confirm(`是否将预计开工时间从${e.getAttribute("init-time")}修改为${e.value}？`, common.appName, ['否', '是'], function(f) {
			if(f.index == 1) {
				var tempobj1 = JSON.parse(myStorage.getItem("data"));
				tempobj1.event[lsvih.array.getSubByKey({
					"id": vueContent.event.id
				}, tempobj1.event)].content.expected_start_date = e.value;
				vueContent.event.content.expected_start_date = e.value;
				myStorage.setItem("data", JSON.stringify(tempobj1)); //在本地存储修改时间
				//TODO:将修改时间存入队列等待同步
			} else {
				e.value = e.getAttribute("init-time");
			}
		});
	}
}
var toUploadCount;
var imagesarr = [];
mui("#event").on("tap", ".submit-property", function() {
	var imagesArr = vueContent.event.content.property.img;
	toUploadCount = imagesArr.length;
	if(!toUploadCount) {
		mui.toast("请按规范上传物业交割图片。")
	} else {
		_fImagesToBase64(toUploadCount, fUploadProperty);
	}
});
/**
 * 递归将图片转换为base64
 * @param {Number} tosuccess待成功数量
 */
function _fImagesToBase64(tosuccess, callback) {
	if(tosuccess == 0) {
		callback(imagesarr);
	} else {
		var bitmap = new plus.nativeObj.Bitmap(uuid());
		// 从本地加载Bitmap图片
		bitmap.load(vueContent.event.content.property.img[toUploadCount - tosuccess], function() {
			var base64 = bitmap.toBase64Data();
			imagesarr[toUploadCount - tosuccess] = base64;
			_fImagesToBase64(--tosuccess, callback); //递归开始下一张图片
		}, function(e) {
			console.log(`加载图片失败:${JSON.stringify(e)}`);
		});
	}
}
var uploading;
/**
 * 上传物业信息图片
 * @param {Array} images
 */
function fUploadProperty(images) {
	uploading = plus.nativeUI.showWaiting("正在上传物业信息...");
	common.ajax(`house-groups/${vueContent.event.content.house_group_id}`, {
		'contract_imgs': JSON.stringify(images),
		'status': 8
	}, "PUT", function(data) {
		vueContent.event.status = 8;
		var tempdata = JSON.parse(myStorage.getItem("data"));
		var eventsortId = lsvih.array.getSubByKey({
			"id": vueContent.event.id
		}, tempdata.event);
		tempdata.event[eventsortId].status = 8;
		myStorage.setItem("data", JSON.stringify(tempdata));
		mui.fire(plus.webview.getWebviewById("list"), "refreshvue", myStorage.getItem("thisflow"));
		mui.fire(plus.webview.getWebviewById("index_content"), "refreshvue", `${myStorage.getItem("thisflow")},${localStorage.getItem("thiseventsort")}`);
		uploading.close();
	}, "", {
		closeObj: uploading
	});
}

/**
 * 将修改后的vueContent存入storage中
 */
function SaveToLocal(){
	var tempdata = JSON.parse(myStorage.getItem("data"));
	var eventsortid = lsvih.array.getSubByKey({"id":vueContent.event.id},tempdata.event);
	tempdata.event[eventsortid] = vueContent.event;
	myStorage.setItem(JSON.stringify(tempdata));
}
