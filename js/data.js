//工作流制定：
gFlow = {
	"flow": [{
		"id": 1,
		"name": "待上门",
		"icon": "1",
		"num": 0,
		"contain-event": [0, 1]
	}, {
		"id": 2,
		"name": "待支付",
		"icon": "2",
		"num": 0,
		"contain-event": [2, 3, 4]
	}, {
		"id": 3,
		"name": "待开工",
		"icon": "3",
		"num": 0,
		"contain-event": [5, 6, 7]
	}, {
		"id": 4,
		"name": "施工中",
		"icon": "4",
		"num": 0,
		"contain-event": [8]
	}, {
		"id": 5,
		"name": "待评价",
		"icon": "5",
		"num": 0,
		"contain-event": [9]
	}]
};
gStatus = {
	"status": [{
		"id": 0,
		"name": "待量房"
	}, {
		"id": 1,
		"name": "待排期"
	}, {
		"id": 2,
		"name": "待签约"
	}, {
		"id": 3,
		"name": "待支付"
	}, {
		"id": 4,
		"name": "待改期"
	}, {
		"id": 5,
		"name": "待确认物业"
	}, {
		"id": 6,
		"name": "待确认"
	}, {
		"id": 7,
		"name": "待开工"
	}, {
		"id": 8,
		"name": "施工中"
	}, {
		"id": 9,
		"name": "待评价"
	}]
};

