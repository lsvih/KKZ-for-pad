var gulp = require("gulp"); //创建 gulp模块
var uglify = require("gulp-uglify"); //创建js混淆压缩 模块
var minify_css = require("gulp-minify-css"); //创建css混淆压缩模块
var less = require("gulp-less");
var gulp_concat = require("gulp-concat"); //创建 文件合并模块
var del = require("del");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin"); //压缩图片
var replace = require("gulp-replace");
var htmlmin = require("gulp-htmlmin");
var sourcemaps = require("gulp-sourcemaps");
var babel = require("gulp-babel");

function clean(path) {
	console.log("Clean: " + path)
	del(path)
}

gulp.task("less", function() {
	gulp.src("./src/less/*.less")
		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write())
		//		.pipe(rename({
		//			suffix: ".min"
		//		}))
		.pipe(minify_css())
		.pipe(gulp.dest("./dist/css"))
});

gulp.task("css", function() {
	gulp.src("./src/css/*.css")
		//		.pipe(rename({
		//			suffix: ".min"
		//		}))
		//		.pipe(minify_css())
		.pipe(gulp.dest("./dist/css"))
});

gulp.task("javascripts", function() {
	gulp.src(["./src/js/*.js", "./src/js/*/*.js"])
		.pipe(replace("let ", "var ")) //DCloud基座与微信不支持let用法因此换成var
		//		.pipe(replace('"use strict ";', '')) //微信不支持不支持严格模式
		//		.pipe(rename({
		//			suffix: ".min"
		//		}))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(uglify().on('error', function(e) {
			console.log(e);
		}))
		.pipe(gulp.dest("./dist/js"))
});

gulp.task("html", function() {
	var options = {
		removeComments: true, //清除HTML注释
		collapseWhitespace: true, //压缩HTML
		collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
		removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
		removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
		removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
		minifyJS: true, //压缩页面JS
		minifyCSS: true //压缩页面CSS
	};
	gulp.src(["./src/*.html", "./src/*/*.html", "./src/*/*/*.html"])
		//		.pipe(replace("let ", "var ")) //微信不支持let用法因此换成var
		//		.pipe(replace('"use strict";', '')) //微信不支持严格模式
		//		.pipe(replace(".css", ".min.css")); //将html引用的资源从css与js变成min.css与min.js
		//		.pipe(replace(".js", ".min.js"));
		.pipe(htmlmin(options))
		.pipe(gulp.dest("./dist/"))
});

gulp.task("images", function() {
	gulp.src(["./src/images/*.*", "./src/images/**/*.*"])
		.pipe(imagemin())
		.pipe(gulp.dest("./dist/images/"));
});

gulp.task("fonts", function() {
	gulp.src("./src/fonts/*.*")
		.pipe(gulp.dest("./dist/fonts/"));
});

gulp.task("clean", function() {
	clean("./dist/*");
});

gulp.task("build", function() {
	gulp.run("less", "css", "javascripts", "html", "images", "fonts");
	console.log("Done!")
});

gulp.task("default", function() {
	gulp.run("build");
	console.log("Done!")
	gulp.watch(["./src/*.*", "./src/*/*.*", "./src/*/*/*.*"], function() {
		gulp.run("build");
	});
});