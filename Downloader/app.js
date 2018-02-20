/**
 * Created by: Luojinghui/luojinghui424@gmail.com
 * Date: 2017/2/7
 * Time: 上午10:53
 */

//依赖模块
var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');
var url = require('url');

//目标网址
//在此处替换你的user_id，和token
var baseUrl = 'https://api.instagram.com/v1/users/7139964346/media/recent/?access_token=7139964346.6d8d06e.f964ada9614640bbb4fc806ccfadaf8c';

//本地存储目录
//注意，我的最终目录是在source目录底下
var dir = '../gallery';

//创建目录
mkdirp(dir, function (err) {
  if (err) {
    console.log(err);
  }
});

//发送请求
request({uri: baseUrl}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    let resData = JSON.parse(body).data;
    //console.log(JSON.parse(body).data.carousel_media);
	//resData.forEach(function (value, index) {console.log(value); });
	let last_time = 0;
	resData.forEach(function (value, index) {
      let imgMedia = value.carousel_media;
	  let tag = value.caption.text;
//	  console.log(body);
	  
		var create_time = value.created_time;
		create_time = parseInt(create_time) * 1000; //这里获得的时间戳是s，需要*1000 
		
		let year = new Date(create_time).getFullYear();  
		let month = new Date(create_time).getMonth() + 1;  
		let date = new Date(create_time).getDate();  
		
		if(month < 10) {  
			month = "0" + month  
		}
		if(date < 10) {  
			date = "0" + date  
		}
		let time_id = year +"-"+ month +"-"+ date;
		let cnt = 0;
	  
	  imgMedia.forEach(function (value, index) {
			let imgSrc = value.images.standard_resolution.url;
			let thumbnailSrc = value.images.thumbnail.url;
			cnt = cnt + 1;
			
			mkdirp(dir + "/photos", function (err) {
			  if (err) {
				console.log(err);
			  }
			});
			
			console.log('正在下载原图' + time_id+ "_"+cnt);
			download(imgSrc, dir + "/photos", time_id, tag, cnt);
			console.log('下载完成');
			
			mkdirp(dir + "/min_photos", function (err) {
			  if (err) {
				console.log(err);
			  }
			});
			
			
			console.log('正在下载压缩图' + time_id+ "_"+cnt);
			download(thumbnailSrc, dir + "/min_photos", time_id, tag, cnt);
			console.log('下载完成');
	  })
    });

    //获取的json数据保存到本地备用
    //fs.writeFile('../MyPage2.0/source/ins/ins.json',body,function(err){
    //  if(err) throw err;
    //  console.log('write JSON into TEXT');
    //});
  }
});

var getID = function(uri){
	str = url.parse(uri).href;
	let res = str.split('//')[1].split('/')[8].split('.')[0]
	return res;
};

//下载方法
var download = function (url, dir, time_id, tag, filename) {
  request.head(url, function (err, res, body) {
    request(url).pipe(fs.createWriteStream(dir + "/" + time_id + "_" + tag + "[" + filename + "].jpg"));
  });
};

