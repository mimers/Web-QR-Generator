// ==UserScript==
// @name         Google在线二维码服务
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://chart.googleapis.com/chart
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const prefix = 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=';
    document.body.innerHTML = '';
    let localQr = JSON.parse(localStorage.getItem('_local_qr_codes_') || '["hello, world"]');
    document.title = '简洁强大的二维码生成器';

    function updateLocalData() {
        let ds = [];
        document.querySelectorAll('.qr-img').forEach(i => ds.push(i.chl))
        localStorage.setItem('_local_qr_codes_', JSON.stringify(ds.map(i => i)));
    }

    function bindImage(img, chl) {
        img.src = prefix + encodeURIComponent(chl);
        img.chl = chl;
    }

    function createQR(chl) {
        let container = document.createElement('div');
        container.className = 'qr-container';
        let input = document.createElement('textarea');
        input.className = 'qr-input';
        let qrImg = document.createElement('img');
        qrImg.className = 'qr-img';
        if (chl) {
            bindImage(qrImg, chl);
            input.value = chl;
        }
        qrImg.addEventListener('click', function(e) {
            if (e.altKey) {
                container.parentNode.removeChild(container);
                updateLocalData();
            }
        });

        container.appendChild(input);
        container.appendChild(qrImg);
        input.addEventListener('change', function(e) {
            let t = e.target.value.trim();
            bindImage(qrImg, t);
            updateLocalData();
        })
        return container;
    }

    let add = document.createElement('button');
    add.textContent = '添加二维码生成器';
    add.addEventListener('click', function() { document.body.insertBefore(createQR('voilà'), add) });
    document.body.appendChild(add);
    localQr.forEach(chl => document.body.insertBefore(createQR(chl), add));

    document.head.querySelector('style').innerHTML = `
body {
    display: flex;
    background: white;
    margin: 0;
    padding: 8px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
}
.qr-container {
    box-shadow: 0px 2px 3px 0px lightgray, 0px 0px 2px 0px lightgray;
    border-radius: 0px 0px 4px 4px;
    margin: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.qr-input {
    width: 400px;
    height: 60px;
    word-break: break-all;
}
.qr-img {
    height: 400px;
    width: 400px;
    transition: filter ease .5s;
}
.qr-input:focus + .qr-img {
    filter:  blur(13px);
}
button {
    height: 100px;
    width: 100px;
    font-size: 20px;
}
`;
})();
