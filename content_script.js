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

function addDom(w, d, l, fw, fd, fl) {
    let tr1 = document.createElement("tr"), tr2 = document.createElement("tr");
    tr1.className = "checknow";
    tr2.className = "checknow";
    tr1.innerHTML = '<td class="lb rb"></td><td bgcolor="#F2F2F2" class="rb">初盘离散值</td><td>' + fw + '</td><td>' + fd + '</td><td class="rb">' + fl + '</td><td colspan="9" class="rb"></td>';
    tr2.innerHTML = '<td class="lb rb"></td><td bgcolor="#F2F2F2" class="rb">即时离散值</td><td>' + w + '</td><td>' + d + '</td><td class="rb">' + l + '</td><td colspan="9" class="rb"></td>';
    avgNode.parentNode.appendChild(tr1);
    avgNode.parentNode.appendChild(tr2);
}

function reload() {
    let dom = document.querySelectorAll('.checknow');
    if (dom.length > 0) {
        [].forEach.call(dom, el => {
            avgNode.parentNode.removeChild(el);
        });
    }
    let data = spider();

    let win_d = calc(data.companys.win, data.avg.win, data.percent.win),
        draw_d = calc(data.companys.draw, data.avg.draw, data.percent.draw),
        lose_d = calc(data.companys.lose, data.avg.lose, data.percent.lose),
        fwin_d = calc(data.companys.fwin, data.avg.fwin, data.percent.fwin),
        fdraw_d = calc(data.companys.fdraw, data.avg.fdraw, data.percent.fdraw),
        flose_d = calc(data.companys.flose, data.avg.flose, data.percent.flose);

    addDom(win_d, draw_d, lose_d, fwin_d, fdraw_d, flose_d);
}

reload();

inject();

function inject() {
    let elem = document.createElement('script');
    elem.type = 'text/javascript';
    elem.innerHTML = "" +
        'var link = document.getElementById("div_companySelect").getElementsByTagName("a");' +
        'for (var i = 0, len = link.length; i < len; i++) {' +
            'link[i].addEventListener("click", function() {' +
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
