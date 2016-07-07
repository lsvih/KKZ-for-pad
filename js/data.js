//工作流制定：
gFlow = {
	"flow": [{
		"id": 1,
		"name": "待上门",
		"icon": "eye",
		"num": 0,
		"contain-event": [1, 2, 3]
	}, {
		"id": 2,
		"name": "待支付",
		"icon": "compose",
		"num": 0,
		"contain-event": [4, 5]
	}, {
		"id": 3,
		"name": "待开工",
		"icon": "redo",
		"num": 0,
		"contain-event": [6, 7, 8, 9]
	}, {
		"id": 4,
		"name": "施工中",
		"icon": "star",
		"num": 0,
		"contain-event": [10, 11, 12, 13, 14, 15]
	}, {
		"id": 5,
		"name": "待评价",
		"icon": "chatbubble",
		"num": 0,
		"contain-event": [16]
	}]
};
gStatus = {
	"status": [{
		"id": 1,
		"name": "待量房"
	}, {
		"id": 2,
		"name": "待排期"
	}, {
		"id": 3,
		"name": "待选材"
	}, {
		"id": 4,
		"name": "待签约"
	}, {
		"id": 5,
		"name": "待支付"
	}, {
		"id": 6,
		"name": "待支付（锁定）"
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
		"status": 1,
		"address": "北京市朝阳区小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {"ordertime":"2016-06-30T15:25:33"}
	},{
		"id": 2,
		"name": "郑家园",
		"sex": 1,
		"status": 2,
		"address": "北京市朝阳区小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {}
	},{
		"id": 3,
		"name": "郑家园",
		"sex": 0,
		"status": 4,
		"address": "北京市朝阳区小关北里204号楼",
		"phone": "19012341234",
		"optional": [],
		"content": {}
	},]
}

localStorage.data = JSON.stringify(data);