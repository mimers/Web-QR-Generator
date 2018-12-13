'use strict';
const prefix = 'https://chart.googleapis.com/chart?cht=qr&chs=400x400&chl=';

function updateLocalData() {
  let ds = [];
  document.querySelectorAll('.qr-img').forEach(i => ds.push(i.chl));
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
  qrImg.addEventListener('click', function (e) {
    if (e.altKey) {
      container.parentNode.removeChild(container);
      updateLocalData();
    }
  });

  container.appendChild(input);
  container.appendChild(qrImg);
  input.addEventListener('change', function (e) {
    let t = e.target.value.trim();
    bindImage(qrImg, t);
    updateLocalData();
  });
  return container;
}

function parseQrFromQuery() {
  const query = new URLSearchParams(location.search);
  let qrs = query.get('qrs');
  try {
    return JSON.parse(qrs);
  } catch (e) {
    console.error(e);
  }
  return null;
}

function clearSearch() {
  location.href = location.href.substr(0, location.href.length - location.search.length);
}

function init() {
  let add = document.createElement('button');
  add.className = 'qr-add';
  add.textContent = '添加二维码生成器';
  add.addEventListener('click', () => {
    document.body.insertBefore(createQR('voilà'), add)
  });
  let share = document.querySelector('button.qr-share');
  share.addEventListener('click', (e) => {
    const query = new URLSearchParams();
    query.append('qrs', localStorage.getItem('_local_qr_codes_'));
    navigator.clipboard.writeText(location.href + '?' + query.toString());
    let origin = e.target.textContent;
    e.target.textContent = '链接已复制~';
    setTimeout(() => e.target.textContent = origin, 3000);
  });
  document.body.appendChild(add);
  let localQr = JSON.parse(localStorage.getItem('_local_qr_codes_') || '["hello, world"]');
  let queryQr = parseQrFromQuery();
  localQr.forEach(chl => document.body.insertBefore(createQR(chl), add));
  if (queryQr) {
    queryQr.filter(q => !localQr.find(i => i === q)).forEach(chl => document.body.insertBefore(createQR(chl), add));
    updateLocalData();
    setTimeout(clearSearch, 300);
  }
}

init();