//var gOnline = false;//是否在线
//
////TODO
///**
// * 通过ajax与服务器进行交互
// * @param {String} type:GET|POST|PUT|DELETE
// * @param {String} object:操作的对象，用于判断ajax的url
// * @param {JSON} data:JSON对象，其中包含了需要进行操作的所有信息
// *  
// *
// * @return {JSON} data:操作返回值
// * 			false:本次同步操作失败
// */
//function fSync(type, object, data) {
//	//success
//	var FIFO = JSON.parse(localStorage.FIFO);
//	FIFO.shift();
//	localStorage.FIFO = JSON.stringify(FIFO);
//	//fail
//	return false;
//}
////--------------
//
///**
// * 队列处理
// */
//FIFOtimer =  setInterval(function() {
//	console.log("FIFO running...")
//	localStorage.FIFO?var FIFO = JSON.parse(localStorage.FIFO):FIFO = [];
//	if(!gOnline){
//		console.log("Offline");
//		clearInterval(FIFOtimer);
//	}
//	if(FIFO.length){
//		fSync(FIFO[0].type,FIFO[0].object,FIFO[0].data)
//	}
//}, 5000);