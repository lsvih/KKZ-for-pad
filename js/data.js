//工作流制定：
gFlow = {
	"flow": [{
		"id": 1,
		"name": "待上门",
		"icon": "eye",
		"num": 0,
		"contain-event": [1, 2]
	}, {
		"id": 2,
		"name": "待支付",
		"icon": "compose",
		"num": 0,
		"contain-event": [4, 5, 6]
	}, {
		"id": 3,
		"name": "待开工",
		"icon": "redo",
		"num": 0,
		"contain-event": [7, 8, 9]
	}, {
		"id": 4,
		"name": "施工中",
		"icon": "star",
		"num": 0,
		"contain-event": [10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
	}, {
		"id": 5,
		"name": "待评价",
		"icon": "chatbubble",
		"num": 0,
		"contain-event": [20]
	}]
};
gStatus = {
	"status": [{
		"id": 1,
		"name": "待量房"
	}, {
		"id": 2,
		"name": "待排期"
	},  {
		"id": 4,
		"name": "待签约"
	}, {
		"id": 5,
		"name": "待支付"
	}, {
		"id": 6,
		"name": "待支付(锁定)"
	}, {
		"id": 7,
		"name": "待确认物业"
	}, {
		"id": 8,
		"name": "待确认"
	}, {
		"id": 9,
		"name": "待开工"
	}, {
		"id": 10,
		"name": "待拆除验收"
	}, {
		"id": 11,
		"name": "待水电验收"
	}, {
		"id": 12,
		"name": "待防水验收"
	}, {
		"id": 13,
		"name": "待安装验收"
	}, {
		"id": 14,
		"name": "待最终验收"
	}, {
		"id": 15,
		"name": "待材料验收"
	}, {
		"id": 16,
		"name": "拆除施工中"
	}, {
		"id": 17,
		"name": "水电施工中"
	}, {
		"id": 18,
		"name": "防水施工中"
	}, {
		"id": 19,
		"name": "安装施工中"
	}, {
		"id": 20,
		"name": "待评价"
	}]
};

data = {
	"event": [{
		"id": 1,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 1,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"ordertime": "2016-06-30T15:25:33"
		}
	}, {
		"id": 2,
		"name": "郑家园",
		"sex": 1,
		"contractid": "",
		"status": 2,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}]
		}
	}, {
		"id": 3,
		"name": "郑家园",
		"sex": 1,
		"contractid": "",
		"status": 3,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON"
		}
	}, {
		"id": 5,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 4,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"]
		}
	}, {
		"id": 7,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 5,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"],
			"expected_start_date": "2016-07-15",
			"left_time_for_pay": 3

		}
	}, {
		"id": 12,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 6,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"],
			"expected_start_date": "2016-07-15",
			"left_time_for_pay": 0
		}
	}, {
		"id": 13,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 7,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"],
			"expected_start_date": "2016-07-15",
			"left_time_for_pay": 0,
			"property": {
				"text": "",
				"img": []
			}
		}
	}, {
		"id": 14,
		"name": "郑家园2",
		"sex": 0,
		"contractid": "",
		"status": 7,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"],
			"expected_start_date": "2016-07-15",
			"left_time_for_pay": 0,
			"property": {
				"text": "",
				"img": []
			}
		}
	}, {
		"id": 16,
		"name": "郑家园2",
		"sex": 0,
		"contractid": "1",
		"status": 9,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"renderings": ["../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png", "../images/preview.png"],
			"expected_start_date": "2016-07-15",
			"left_time_for_pay": 0,
			"pending_construction": {
				"text": "",
				"img": []
			}
		}
	}, {
		"id": 15,
		"name": "郑家园",
		"sex": 0,
		"contractid": "",
		"status": 20,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {}
	}, {
		"id": 21,
		"name": "郑家园2",
		"sex": 0,
		"contractid": "1",
		"status": 19,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {
			"price": 71702,
			"package": [{
				"id": 1,
				"name": "厨房",
				"num": 10,
				"unit": "米²"
			}, {
				"id": 10,
				"name": "门",
				"num": 3,
				"unit": "个"
			}],
			"schedule": "这儿是排期信息，一会儿会改成JSON",
			"selection": "这儿是选材信息，一会儿改成JSON",
			"expected_start_date": "2016-07-15",
			"pending_construction": {
				"text": "",
				"img": []
			},
			"worker": {
				"id": 1023,
				"name": "涂显锋",
				"sex": 0,
				"worder_type": "瓦工",
				"tel": "17701322774",
				"seniority": "5",
				"photo": "http://www.ld12.com/upimg358/20160130/15480563199962.jpg"
			},
			"timeline": [{
				"date": "2016-07-13",
				"process": {
					"process_name": "贴砖",
					"process_text": "清楚，勾缝剂等等等等",
					"process_img": ["https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=333724665,2937436334&fm=116&gp=0.jpg", "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3621235604,538405218&fm=116&gp=0.jpg"]
				}
			}, {
				"date": "2016-07-14",
				"process": {
					"process_name": "贴砖",
					"process_text": "清楚，勾缝剂等等等等",
					"process_img": ["https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=333724665,2937436334&fm=116&gp=0.jpg", "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3621235604,538405218&fm=116&gp=0.jpg"]
				}
			}, {
				"date": "2016-07-15",
				"process": {
					"process_name": "贴砖",
					"process_text": "清楚，勾缝剂等等等等",
					"process_img": ["https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=333724665,2937436334&fm=116&gp=0.jpg", "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3621235604,538405218&fm=116&gp=0.jpg"]
				}
			}, {
				"date": "2016-07-15",
				"process": {
					"process_name": "贴砖",
					"process_text": "清楚，勾缝剂等等等等",
					"process_img": ["https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=333724665,2937436334&fm=116&gp=0.jpg", "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3621235604,538405218&fm=116&gp=0.jpg"]
				}
			}],
			"today_broadcast": {
				"date": "2016-07-14",
				"submit": false,
				"text": "",
				"img": []
			}
		}
	}, {
		"id": 55,
		"name": "郑家园",
		"sex": 0,
		"contractid": "181042470121123124",
		"status": 20,
		"province": "北京",
		"city": "北京",
		"district": "朝阳",
		"address": "小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {}
	}, ]
}

localStorage.data = JSON.stringify(data);
//localStorage.clear("data")