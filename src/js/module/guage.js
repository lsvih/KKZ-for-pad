var vueContent;
var MAXIMAGECOUNT = 10;
var eventid = GetRequest()["eventid"]; //获得eventid
var tempdata = JSON.parse(myStorage.getItem("data"));
var uploading;
var iRoomSortId;
var eventsortid = lsvih.array.getSubByKey({
	"id": eventid
}, tempdata.event);
mui.plusReady(function() {
	"use strict";
	console.log(tempdata.event[eventsortid].content.room.length);
	if(!tempdata.event[eventsortid].content.room.length) {
		for(let room of JSON.parse(localStorage.getItem("RoomType"))) {
			if(room.default == 1) tempdata.event[eventsortid].content.room.push(room);
		}
	}
	vueContent = new Vue({
		el: "#room",
		data: {
			"event": tempdata.event[eventsortid],
			"type": JSON.parse(localStorage.getItem("RoomType"))
		},
		ready: function() {
			document.getElementById("mask").style.opacity = 0;
			document.getElementById("mask").style.zIndex = -1;
			mui('.mui-scroll-wrapper').scroll();
		},
		methods: {
			__fAddPic: function(e) {
				iRoomSortId = e;
				document.activeElement.blur();
				mui("#picture").popover('toggle');
			},
			__fAddSameTypeRoomAfter: function(index) {
				var newobj = lsvih.array.getObjByKey({
					"room_id": tempdata.event[eventsortid].content.room[index].room_id
				}, JSON.parse(localStorage.getItem("RoomType")));
				vueContent.content.room.splice(index, 0, newobj);
			},
			__fAddRoom: function(roomId) {
				tempdata.event[eventsortid].content.room.push(lsvih.array.getObjByKey({
					"room_id": roomId
				}, JSON.parse(localStorage.getItem("RoomType"))));
				mui('.mui-popover').popover('hide');
			},
			__fEditPictures: function(thisobj) { //编辑图片
				iRoomSortId = thisobj.currentTarget.parentNode.parentNode.getAttribute("data-id");
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
			__fAddDiagram: function(iRoomSortId, edit) { //调用画板画示意图,edit为空则为创建模式，否则为编辑模式。edit中内容为base64内容
				mui.openWindow({
					url: "../module/drawing_board.html",
					id: "drawing_board",
					styles: {
						top: 0,
						bottom: 0,
						right: 0,
						width: "100%",
						height: "100%"
					},
					extras: {
						eventid: eventid,
						packagesort: iRoomSortId,
						edit: edit
					},
					show: {
						aniShow: "fade-in"
					},
					waiting: {
						autoShow: false,
					}
				});
			}
		}
	});

	window.addEventListener('delete', function(event) {
		var statustarget = "room[" + iRoomSortId + "].images";
		var deleteitem = vueContent.event.content.room[iRoomSortId].images[event.detail - 1];
		vueContent.event.content.room[iRoomSortId].images.$remove(deleteitem);
	});
	window.addEventListener('diagram', function(event) {
		var tempdiagramarr = event.detail.split("///");
		var imgkey = tempdiagramarr[2];
		vueContent.event.content.room[tempdiagramarr[1]].diagram = myStorage.getItem(imgkey);
		myStorage.removeItem(imgkey);
	});

	mui('#picture').on('tap', '.mui-popover-action li>a', function() {
		var statustarget = "room[" + iRoomSortId + "].images";
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

	/**
	 * 判断数组中每一项的size images diagram是否为空，为空返回false，全部不为空返回true
	 * @param {Array} arr
	 */
	function __fIsSizeImagesDiagramEmpty(arr) {
		for(let arritem of arr) {
			if(arritem.size) return true; //根据需求，只需要填好面积即可
		}
		return false;
	}
	/**
	 * 删除size为空的项
	 * @param {Array} arr
	 */
	function __fDeleteSizeImagesDiagramEmpty(arr) {
		for(var i = arr.length - 1; i >= 0; i--) {
			if(!arr[i].size) {
				arr.$remove(arr[i]);
			}
		}
	}
	/**
	 * 根据逻辑设置备注
	 * @param {Array} arr
	 */
	function __fSetAlias(arr) {
		var emptyalias = [];
		for(var i = 0; i < arr.length; i++) {
			if(!arr[i].alias) {
				emptyalias.push({
					"room_id": arr[i].room_id,
					"index": i
				})
			}
		}
		if(__fIsEmptyAliasTypeDuplicate(emptyalias)) {
			mui.toast("请为相同类型的不同房间添加备注");
			uploading.close();
			return false;
		} else {
			for(let alias of emptyalias) {
				arr[alias.index].alias = arr[alias.index].name;
			}
			fUploadImages(); //上传图片
		}

		function __fIsEmptyAliasTypeDuplicate(arr) {
			for(let arritem of arr) {
				if(lsvih.array.getArrByCondition('room_id==' + arritem.room_id, arr).length > 1) return true;
			}
			return false;
		}
	}
	mui("body").on("tap", ".mui-icon-arrowright", function() {
		uploading = plus.nativeUI.showWaiting("请稍后...");
		if(__fIsSizeImagesDiagramEmpty(tempdata.event[eventsortid].content.room)) {
			uploading.setTitle("正在上传量房信息，请耐心等待...");
			//过滤空数据
			__fDeleteSizeImagesDiagramEmpty(tempdata.event[eventsortid].content.room);
			//进入备注逻辑
			__fSetAlias(tempdata.event[eventsortid].content.room);
		} else {
			mui.toast("请完成量房数据填写");
			uploading.close();
		}

	});
	var roomlength;
	var grouptosuccess;
	var thisGroupCount;
	var imagesarr;

	function fUploadImages() {
		roomlength = tempdata.event[eventsortid].content.room.length;
		imagesarr = new Array(roomlength);
		for(var s = 0; s < imagesarr.length; s++) {
			imagesarr[s] = new Array(tempdata.event[eventsortid].content.room[s].images.length);
		} //构建存储图片的数组
		grouptosuccess = roomlength;
		_fGroupImages(roomlength);
	}

	function _fGroupImages(tosuccess) {
		if(tosuccess == 0) { //所有组全部改写base64完毕
			//success
			myStorage.setItem("tempimg", imagesarr);
			fUploadStatus();
		} else {
			thisGroupCount = tempdata.event[eventsortid].content.room[roomlength - tosuccess].images.length; //当前组的下标
			_fImg2Base64(thisGroupCount); //开始组内图片递归
		}
	}

	function _fImg2Base64(tosuccess) {
		if(tosuccess == 0) { //这个组里的所有图片改写base64完毕
			_fGroupImages(--grouptosuccess); //组递归
		} else {
			var bitmap = new plus.nativeObj.Bitmap(uuid());
			// 从本地加载Bitmap图片

			bitmap.load(tempdata.event[eventsortid].content.room[roomlength - grouptosuccess].images[thisGroupCount - tosuccess], function() {
				var base64 = bitmap.toBase64Data();
				imagesarr[roomlength - grouptosuccess][thisGroupCount - tosuccess] = base64;
				_fImg2Base64(--tosuccess); //递归开始下一张图片
			}, function(e) {
				console.log('加载图片失败：' + JSON.stringify(e));
			});
		}
	}
	/**
	 * 当所有图片都存好后，开始更新状态与上传信息的过程
	 */
	function fUploadStatus() {
		//先将服务器上已经有的信息删除
		mui.ajax(gAPIServer + 'house-room/batch-delete?filter=house_id:' + tempdata.event[eventsortid].house_id + '&access-token=' + User("access_token"), {
			type: 'DELETE',
			dataType: 'json',
			timeout: 6000,
			success: function(data) {
				if(data.success == true) {
					//构造批量上传数据
					var data = [];
					for(var a = 0; a < tempdata.event[eventsortid].content.room.length; a++) {
						data.push({
							"house_id": tempdata.event[eventsortid].house_id,
							"room_id": tempdata.event[eventsortid].content.room[a].room_id,
							"alias": tempdata.event[eventsortid].content.room[a].alias,
							"area": tempdata.event[eventsortid].content.room[a].size,
							"plan_t_img": tempdata.event[eventsortid].content.room[a].diagram,
							"measure_t_imgs": myStorage.getItem("tempimg")[a]
						})
					}
					console.log(JSON.stringify(data))
					mui.ajax(gAPIServer + 'house-room/batch-create?access-token=' + User("access_token"), {
						data: {
							"items": JSON.stringify(data)
						},
						type: 'POST',
						dataType: 'json',
						timeout: 6000,
						success: function(data) {
							if(data.success == true) {
								console.log(JSON.stringify(data.data));
								uploading.close()
								myStorage.setItem("data", JSON.stringify(tempdata)); //将信息存储在本地
								plus.webview.currentWebview().loadURL("pick_products.html?eventid=" + eventid);
							} else {
								mui.alert(data.message, gAppName);
								uploading.close();
							}
						},
						error: function(xhr, textStatus, errorThrown) {
							console.log(JSON.stringify(xhr));
							mui.alert("上传量房信息失败，请稍后重试", gAppName, "确认", function() {
								uploading.close();
							});

						}
					});
				} else {
					mui.alert(data.message, gAppName);
					uploading.close();
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				console.log(JSON.stringify(xhr));
				mui.alert("更新状态失败，请稍后重试", gAppName, "确认", function() {
					uploading.close();
				});
			}
		});
	}
});