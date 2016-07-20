var palette = [{
	"name": "红",
	"code": "#FF0033"
}, {
	"name": "绿",
	"code": "#66FF99"
}, {
	"name": "黄",
	"code": "#FFCC00"
}, {
	"name": "蓝",
	"code": "#0066FF"
}, {
	"name": "黑",
	"code": "#000000"
}
]

/**
 * 输入颜色的中文，输出颜色的16进制编码
 * @param {String} colorName 
 */
function fColorPipe(colorName) {
	if(!colorName) return false;
	for(var colorItem in palette) {
		if(palette[colorItem].name == colorName) return palette[colorItem].code;
	}
	return false;
}


function fAddVueColorFilter(){
	Vue.filter('color', function(colorName) {
			return fColorPipe(colorName);
	});
	
}
