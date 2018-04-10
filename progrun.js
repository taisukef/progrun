"use strict";

var editor;
var canvas;
var ctx;

var loadProg = function(url) {
	getXMLJSON(url, function(data) {
//			dump(data);
		setProg(data.app.program, data.app.bgimg);
	});
};
var initProgrun = function() {
	editor = $('editor');
	canvas = $('canvas');
	ctx = canvas.getContext('2d');
	
	var hash = document.location.hash;
	if (hash.length > 1) {
		var url = hash.substring(1);
//		alert(url);
		loadProg(url);
	} else {
		load();
	}
	setInterval(autosave, 3000);
	
	runProg();
}
// 自動保存用の関数
var filename = 'progban-main';
var bkdata;
function load() {
	setProg(localStorage.getItem(filename), localStorage.getItem(filename + "-bgurl"));
};
var setProg = function(prog, bgurl) {
	resetVar();
	editor.setValue(prog);
	setBackground(bgurl);
};
var setBackground = function(bgurl) {
	if (bgurl != null) {
		bgimg = new Image();
		bgimg.src = bgurl;
		bgimg.url = bgurl;
		gridhint = false;
	} else {
		bgimg = null;
		gridhint = true;
	}
};
function autosave() {
	var s = editor.getValue() + (bgimg != null ? bgimg.url : "");
	if (s != bkdata) {
		localStorage.setItem(filename, editor.getValue());
		if (bgimg) {
			localStorage.setItem(filename + "-bgurl", bgimg.url);
		} else {
			localStorage.removeItem(filename + "-bgurl");
		}
		bkdata = s;
	}
}
var timerid = null;

function runProg() {
	resetVar();
	
	if (timerid != null)
		clearInterval(timerid);
	drawCanvas();
	timerid = setInterval(function() {
		t++;
		drawCanvas();
	}, 100);
}
var a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z;
var one, two, up, down, left, right;
var cx, cy;
var ox, oy;
function resetVar() { // 変数初期化　グローバル変数を用意する
    a = b = c = d = e = f = g = h = i = j = k = l = m = n = o = p = q = r = s = t = u = v = w = x = y = z = 0;
	cx = cy = 0; // cursor auto x, y
	ox = oy = 0; // orgiin
    one = two = up = down = left = right = false;
	
    t = 0; // 実行時からのフレーム数（1フレーム100msec）
}
var bkeditor;
var gridhint = true;
var bgimg = null;

function drawCanvas() {
	setSize(8);
	initCanvas();
	
	if (gridhint) {
		drawGrid();
		drawGrid10(); // 補助線を引く
	}
	try {
		if (editor.getValue() != bkeditor) {
			bkeditor = checkCode(editor.getValue());
		}
		cx += (left ? -1 : 0) + (right ? 1 : 0);
		cy += (up ? -1 : 0) + (down ? 1 : 0);
		eval(bkeditor);
	} catch (e) {
	}
}
/*
^ *rect\([0-9a-z=<>!&^|+-/*%?,.: ]+,[0-9?,.a-z: ]+,[0-9?,.a-z: ]+,[0-9?,.a-z: ]+\)$

^ *rect\(,[0-9?,.a-z: ]+,[0-9?,.a-z: ]+,[0-9?,.a-z: ]+\)$

^ *[a-z] *[(+=)|(-=)|(/=)|(\*=)|(%=)|(&=)|(|=)|(^=)]
*/
var EXP = "[\"0-9a-z=<>!&\\^\\|+\\-/\\*%\\?,\\.:\\(\\)\\[\\] ]+";
//var EXP2 = "[\"0-9a-zA-Z]+";

var CODE = [
	new RegExp("^ *color\\(" + EXP + "\\)$"),
	new RegExp("^ *rect\\(" + EXP + "," + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *circle\\(" + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *line\\(" + EXP + "," + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *origin\\(" + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *stamp\\(" + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *rgb\\(" + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *rgba\\(" + EXP + "," + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *hue\\(" + EXP + "\\)$"),
	new RegExp("^ *hsv\\(" + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *hsva\\(" + EXP + "," + EXP + "," + EXP + "," + EXP + "\\)$"),
	new RegExp("^ *[a-z] *[(+=)|(\\-=)|(/=)|(\\\*=)|(%=)|(&=)|(\\|=)|(\\^=)]" + EXP + "$")
];
var checkCode = function(code) {
	var ss = code.split('\n');
	var res = [];
	for (var i = 0; i < ss.length; i++) {
		var s = ss[i];
		for (var j = 0; j < CODE.length; j++) {
			if (s.match(CODE[j])) {
				res.push(s);
				break;
			}
		}
	}
	return res.join('\n');
}
// Canvasの初期化
function initCanvas() {
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0, 0, 50 * size, 50 * size);
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.strokeStyle = "rgb(0, 0, 0)";
	
	if (bgimg != null) {
		var w = 50 * size;
		var iw = bgimg.width;
		var ih = bgimg.height;
		var ix = 0;
		var iy = 0;
		var iw2 = iw;
		var ih2 = ih;
		if (iw > ih) {
			ix = (w - w / iw * ih) / 2;
			iw2 = ih;
		} else {
			iy = (w - w / ih * iw) / 2;
			ih2 = iw;
		}
		ctx.drawImage(bgimg, ix, iy, iw2, ih2, 0, 0, w, w);
	}
}
function drawGrid() {
	ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
	ctx.beginPath();
	ctx.moveTo(0, 0);
	ctx.lineTo(0, 500);
	ctx.moveTo(0, 0);
	ctx.lineTo(500, 0);
	for (var ii = 1; ii <= 50; ii++){
		ctx.moveTo(size * ii, 0);
		ctx.lineTo(size * ii, 500);
		ctx.moveTo(0, size * ii);
		ctx.lineTo(500, size * ii);
	}
	ctx.closePath();
	ctx.lineWidth = 2;
	
	ctx.stroke();
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
}

// Canvasの補助線
function drawGrid10() {
	ctx.strokeStyle = "rgba(0, 0, 0, .3)";
	ctx.beginPath();
	for (var ii = 10; ii < 50; ii=ii+10){
		ctx.moveTo(size * ii, 0);
		ctx.lineTo(size * ii, 500);
		ctx.moveTo(0, size * ii);
		ctx.lineTo(500, size * ii);
	}
	ctx.closePath();
	ctx.lineWidth = 3;
	
	ctx.stroke();
	ctx.strokeStyle = "rgba(0, 0, 0, 1)";
}

/*
window.onorientationchange = change;
//画面の回転によって読み込むcssを変更する。
function change() {
	switch (window.orientation) {
        case 0:
        case 180:	
        	document.getElementById('bposi').href = "css/portrait.css";
            break;
        case 90:
        case -90:
            document.getElementById('bposi').href = "css/landscape.css";
            break;
    }
}
*/

//cacheファイルを確認して差分がある場合に更新
function update() {
	if (typeof navigator.onLine != undefined) {
		if (navigator.onLine) {
			if (typeof applicationCache != undefined) {
				applicationCache.onupdateready = function() {
					location.reload();
				}
				try {
					applicationCache.update();
				} catch (e) {
				}
			}
		}
	}
}
//プレビュー時スライド操作を無効, iPadで画面固定
/*
document.addEventListener("touchmove", function(e) {
//	if(document.getElementById("prev").style.display == "block")
	e.preventDefault();
}, false);
*/
//------------------------------------------------------------------
var size = 10;
function setSize(sz) {
	size = sz;
}
function line(x1, y1, x2, y2) {
	x1 += ox;
	y1 += oy;
	x2 += ox;
	y2 += oy;
	ctx.beginPath();
	ctx.moveTo(x1 * size, y1 * size);
	ctx.lineTo(x2 * size, y2 * size);
	ctx.closePath();
	ctx.stroke();
}
function circle(x, y, r) {
	x += ox;
	y += oy;
	ctx.beginPath();
 	ctx.arc(x * size, y * size, r * size, 0, Math.PI * 2, false);
 	ctx.closePath();
  	ctx.fill();
}
function rect(x, y, w, h) {
	x += ox;
	y += oy;
	ctx.fillRect(x * size, y * size, w * size, h * size);
}
function origin(x, y) {
	ox = x;
	oy = y;
}
function polygon(x, y) {
	ctx.beginPath();
	ctx.moveTo(x * size, y * size);
	for(var i = 2; i < arguments.length; i += 2){
		ctx.lineTo(arguments[i] * size, arguments[i + 1] * size);
	}
	ctx.lineTo(x * size, y * size);
	ctx.closePath();
	ctx.fill();
}
var hue = function(h) {
	hsva(h, 1, 1, 1);
};
var hsv = function(h, s, v) {
	hsva(h, s, v, 1);
};
var hsva = function(h, s, v, a) {
	var c = hsv2rgb(h, s, v);
	rgba(c[0], c[1], c[2], a);
};
var rgb = function(r, g, b) {
	rgba(r, g, b, 1);
};
var rgba = function(r, g, b, a) {
	if (r < 0)
		r = 0;
	else if (r > 255)
		r = 255;
	if (g < 0)
		g = 0;
	else if (g > 255)
		g = 255;
	if (b < 0)
		b = 0;
	else if (b > 255)
		b = 255;
	if (a < 0)
		a = 0;
	else if (a > 1)
		a = 1;
//	var col= "#" + dec2hex(r, 2) + dec2hex(g, 2) + dec2hex(b, 2);
	var col= "rgba(" + (r >> 0) + "," + (g >> 0) + "," + (b >> 0) + "," + a + ")";
	ctx.strokeStyle = col;
	ctx.fillStyle = col;
};
function color(c) {
	c = Math.floor(c);
	var val = ((c >> 3) & 1) == 1 ? 15 : 7;
	var r = Math.floor(((c >> 2) & 1) * val);
	var g = Math.floor(((c >> 1) & 1) * val);
	var b = Math.floor((c & 1) * val);
	var col= "#" + dec2hex(r, 1) + dec2hex(g, 1) + dec2hex(b, 1);
	ctx.strokeStyle = col;
	ctx.fillStyle = col;
}
var hex2dec1 = function(c) {
	return "0123456789abcdef".indexOf(c);
}
function stamp(s, x, y) {
	var len = s.length;
	stamp4x4(s, x, y);
	stamp4x4(s.substring(4), x, y + 4);
	stamp4x4(s.substring(8), x + 4, y);
	stamp4x4(s.substring(12), x + 4, y + 4);
}
function stamp4x4(s, x, y) {
	for (var i = 0; i < 4 && s.length; i++) {
		var n = hex2dec1(s.charAt(i));
		for (var j = 0; j < 4; j++) {
			if (n & (1 << (3 - j)))
				rect(x + j, y + i, 1, 1);
		}
	}
}
function end() {
	changeEdit();
}
function sin(n) {
	return Math.sin(n);
}
function cos(n) {
	return Math.cos(n);
}
function tan(n) {
	return Math.tan(n);
}
function atan(y, x) {
	return Math.atan(y, x);
}
function abs(n) {
	return Math.abs(n);
}
function rnd(n) {
	return Math.floor(Math.random() * n);
}
/*
function print(s) {
	if (document.getElementById("edit").style.display != "block") {
		alert(s);
		end();
	}
}
*/
