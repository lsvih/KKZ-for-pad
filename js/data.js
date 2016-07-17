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
		"contain-event": [3, 4, 5]
	}, {
		"id": 3,
		"name": "待开工",
		"icon": "redo",
		"num": 0,
		"contain-event": [6, 7, 8]
	}, {
		"id": 4,
		"name": "施工中",
		"icon": "star",
		"num": 0,
		"contain-event": [9]
	}, {
		"id": 5,
		"name": "待评价",
		"icon": "chatbubble",
		"num": 0,
		"contain-event": [10]
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
		"name": "待签约"
	}, {
		"id": 4,
		"name": "待支付"
	}, {
		"id": 5,
		"name": "待改期"
	}, {
		"id": 6,
		"name": "待确认物业"
	}, {
		"id": 7,
		"name": "待确认"
	}, {
		"id": 8,
		"name": "待开工"
	}, {
		"id": 9,
		"name": "施工中"
	}, {
		"id": 10,
		"name": "待评价"
	}]
};

