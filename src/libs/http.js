import { BASE_URL } from "../config";
const doAjax = Symbol('doAjax');

class HTTP {
    [doAjax](options) {
        let o = window.XMLHttpRequest ?
            new XMLHttpRequest() :
            new ActiveXObject('Microsoft.XMLHTTP');

        if (!o) {
            throw new Error('浏览器不支持异步发起HTTP请求');
        }

        let opt = options || {};
        let type = (opt.type || 'GET').toUpperCase();
        let async = '' + opt.aysnc === 'false' ? false : true;
        let dataType = opt.dataType || 'JSON';
        let jsonp = opt.jsonp || 'cb';
        let jsonpCallback = opt.jsonpCallback || 'jQuery' + randomNum() + '_' + new Date().getTime();
        // let url = opt.url;
        let url = BASE_URL + opt.url;
        let data = opt.data || null;
        let timeout = opt.timeout || 30000;
        let error = opt.error || function () { };
        let success = opt.success || function () { };
        let complete = opt.complete || function () { };
        let t = null;

        if (!url) {
            throw new Error('url不能为空');
        }

        if (dataType.toUpperCase() === 'JSONP' && type !== 'GET') {
            throw new Error('如果dataType为JSONP,type请设置为GET或者不设置');
        }

        if (dataType.toUpperCase() === 'JSONP') {
            var oScript = document.createElement('script');
            oScript.src = url.indexOf('?') === -1 ?
                url + '?' + jsonp + '=' + jsonpCallback :
                url + '&' + jsonp + '=' + jsonpCallback;
            document.body.appendChild(oScript);
            document.body.removeChild(oScript);
            window[jsonpCallback] = (data) => {
                success(data);
            }
            return;
        }

        o.onreadystatechange = () => {
            if (o.readyState === 4) {
                if (o.status >= 200 && o.status < 300 || o.status === 304) {
                    switch (dataType.toUpperCase()) {
                        case 'JSON':
                            success(JSON.parse(o.responseText));
                            break;
                        case 'TEXT':
                            success(o.responseText);
                            break;
                        case 'XML':
                            success(o.responseXML);
                            break;
                        default:
                            success(JSON.parse(o.responseText));
                            break;
                    }
                } else {
                    error()
                }
                complete();
                clearTimeout(t);
                t = null;
                o = null;
            }
        }

        o.open(type, url, async);
        type === 'POST' && o.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        o.send(type === 'GET' ? null : formatDatas(data));
    
        t = setTimeout(function() {
            o.abort();
            clearTimeout(t);
            t = null;
            o = null;
            throw new Error('请求超时');
        }, timeout)
    }  
    
    ajax(opt) {
        this[doAjax](opt);
    }

    post(url, data, dataType, success, error, complete) {
        this[doAjax]({
            type: 'POST',
            url,
            data,
            dataType,
            success,
            error,
            complete
        })
    }

    get(url, dataType, success, error, complete) {
        this[doAjax]({
            type: 'GET',
            url,
            dataType,
            success,
            error,
            complete
        })
    }
}

function formatDatas(obj) {
    var str = '';
    for(let key in obj) {
        str += key + '=' + obj[key] + '&';
    }

    return str.replace(/&$/, '');
}

function randomNum() {
    var num = '';
    for(var i = 0; i < 20; i++) {
        num += Math.floor(Math.random() * 10);
    }
    return num;
}

export default HTTP;