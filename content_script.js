const avgNode = document.getElementById('avgRObj');

function spider() {
    let td = avgNode.getElementsByTagName('td');
    let win = td[1].innerText,
        draw = td[2].innerText,
        lose = td[3].innerText;
    let winpct = td[4].innerText / 100, drawpct = td[5].innerText / 100, losepct = td[6].innerText / 100;

    let first_td = avgNode.previousSibling.previousSibling.getElementsByTagName('td');
    let fwin = first_td[1].innerText,
        fdraw = first_td[2].innerText,
        flose = first_td[3].innerText;
    let fwinpct = first_td[4].innerText / 100, fdrawpct = first_td[5].innerText / 100, flosepct = first_td[6].innerText / 100;

    let lists = document.getElementById("oddsList_tab");
    let company = lists.firstChild.childNodes;
    let allwin = [], alldraw = [], alllose = [];
    let all1stwin = [], all1stdraw = [], all1stlose = [];
    for (let i = 0, len = company.length; i < len; i = i + 2) {
        let winstart = company[i].childNodes[2].innerText,
            drawstart = company[i].childNodes[3].innerText,
            losestart = company[i].childNodes[4].innerText;
        let end = company[i + 1].childNodes;
        let winend = end[0].innerText > 0 ? end[0].innerText : winstart,
            drawend = end[1].innerText > 0 ? end[1].innerText : drawstart,
            loseend = end[2].innerText > 0 ? end[2].innerText : losestart;
        allwin.push(winend);
        alldraw.push(drawend);
        alllose.push(loseend);
        all1stwin.push(winstart);
        all1stdraw.push(drawstart);
        all1stlose.push(losestart);
    }
    return {
        companys: {
            win: allwin,
            draw: alldraw,
            lose: alllose,
            fwin: all1stwin,
            fdraw: all1stdraw,
            flose: all1stlose
        },
        avg: {
            win: win,
            draw: draw,
            lose: lose,
            fwin: fwin,
            fdraw: fdraw,
            flose: flose       
        },
        percent: {
            win: winpct,
            draw: drawpct,
            lose: losepct,
            fwin: fwinpct,
            fdraw: fdrawpct,
            flose: flosepct
        }
    };
}

function calc(arr, avg, ratio) {
    let l = arr.length;
    let S = arr.reduce((x, y) => {
        return (x + Math.pow((y - avg) * ratio, 2));
    }, 0);
    return Math.round(S / l / 0.0001 * 100) / 100;
}

function changeValue(w, d, l, fw, fd, fl) {
    document.getElementById('lisanwinF').innerText = fw;
    document.getElementById('lisandrawF').innerText = fd;
    document.getElementById('lisanloseF').innerText = fl;
    document.getElementById('lisanwinR').innerText = w;
    document.getElementById('lisandrawR').innerText = d;
    document.getElementById('lisanloseR').innerText = l;
}

function reload() {
    let data = spider();

    let win_d = calc(data.companys.win, data.avg.win, data.percent.win),
        draw_d = calc(data.companys.draw, data.avg.draw, data.percent.draw),
        lose_d = calc(data.companys.lose, data.avg.lose, data.percent.lose),
        fwin_d = calc(data.companys.fwin, data.avg.fwin, data.percent.fwin),
        fdraw_d = calc(data.companys.fdraw, data.avg.fdraw, data.percent.fdraw),
        flose_d = calc(data.companys.flose, data.avg.flose, data.percent.flose);

    changeValue(win_d, draw_d, lose_d, fwin_d, fdraw_d, flose_d);
}


(function init() {
    inject();
    avgNode.parentNode.removeChild(avgNode.parentNode.firstChild);
    avgNode.parentNode.firstChild.nextSibling.lastChild.previousSibling.innerText = '离散值';
    avgNode.parentNode.firstChild.nextSibling.lastChild.previousSibling.setAttribute('colspan', 3);
    document.getElementById('highFObj').lastChild.previousSibling.setAttribute('colspan', 3);
    document.getElementById('lowFObj').lastChild.previousSibling.setAttribute('colspan', 3);
    document.getElementById('avgFObj').lastChild.previousSibling.remove();
    let td1 = createTD();
    td1.setAttribute('id', 'lisanwinF');
    document.getElementById('avgFObj').appendChild(td1);
    let td2 = createTD();
    td2.setAttribute('id', 'lisandrawF');
    document.getElementById('avgFObj').appendChild(td2);
    let td3 = createTD();
    td3.setAttribute('id', 'lisanloseF');
    td3.className = 'rb';
    document.getElementById('avgFObj').appendChild(td3);
    let td4 = createTD();
    td4.setAttribute('id', 'lisanwinR');
    document.getElementById('avgRObj').appendChild(td4);
    let td5 = createTD();
    td5.setAttribute('id', 'lisandrawR');
    document.getElementById('avgRObj').appendChild(td5);
    let td6 = createTD();
    td6.setAttribute('id', 'lisanloseR');
    td6.className = 'rb';
    document.getElementById('avgRObj').appendChild(td6);
    reload();
})();

function createTD() {
    return document.createElement("td");
}

function inject() {
    let elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.innerHTML = "" +
        'var link = document.getElementById("div_companySelect").getElementsByTagName("a");' +
        'var btn = document.getElementsByClassName("sbtn");' +
        'for (var i = 0, len = link.length, l = btn.length; i < len + l; i++) {' +
            'var node = i < len ? link[i] : btn[i - len];' +
            'node.addEventListener("click", function() {' +
                'window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");' +
            '}, false);' +
        '}';
    document.getElementsByTagName('body')[0].appendChild(elem);
}

let port = chrome.runtime.connect();

window.addEventListener("message", function(event) {
    if (event.source != window) return;

    if (event.data.type && (event.data.type == "FROM_PAGE")) {
        reload();
    }
}, false);
