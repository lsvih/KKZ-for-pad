//缓存管理
console.log("缓存管理模块加载............ok");

//数据库管理
function fCache(originalsrc) {
	if(!originalsrc) return '';
	if(!localStorage.getItem(originalsrc)) {
		DownloadToCache(originalsrc);
		return originalsrc;
	} else {
		var path = plus.io.convertLocalFileSystemURL("_downloads");
		return path + "/" + localStorage.getItem(originalsrc);
	}

}

//将Vue过滤器载入，如果图片缓存存在则返回缓存地址，如果不存在则返回源地址，并将图片加入下载事件中，下载完毕后将其放入localStorage中
function fAddVueCacheFilter() {
	console.log("Vue缓存路径管理过滤器加载........ok")
	Vue.filter('cache', function(originalsrc) {
		//		console.log(fCache(originalsrc))
		return fCache(originalsrc)
	});
}
 
function DownloadToCache(url) {
	var urlarr = url.split("/");
	var downloadfilename = urlarr[urlarr.length - 1];
	plus.io.resolveLocalFileSystemURL("_downloads/" + downloadfilename, function(fs) { //先判断目录中是否已经有这个文件了，如果有则不下载，没有则下载
		console.log("文件已存在，无需下载");
		localStorage.setItem(url, downloadfilename);
	}, function(e) {
		console.log("Downloading '" + url + "' to cache...");
		var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
			if(status == 200) {
				downloadfilename = d.filename.split("/")[1];
				console.log("下载成功=" + downloadfilename); //删除保存目录前的"_downloads/"以提高存储密度
				localStorage.setItem(url, downloadfilename);
			} else {
				//下载失败
				console.log("下载失败=" + status);
			}
		});
		//启动下载任务
		dtask.start();
	});

}