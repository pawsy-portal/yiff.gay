// 🐇
const BASE = '1117890204569718885';
const $ = (id) => document.getElementById(id);
const q = (s) => document.querySelector(s);

let cur = window.location.hash.substring(1) || BASE;
let eff_a = 0, acts_d = [], loop, int_b, int_a, int_c;

if (!window.location.hash) window.location.hash = cur;

const tk = {
    m: (e) => { e.stopPropagation(); $('dd').classList.toggle('show'); },
    id: () => { const n = prompt("ID:", cur); if(n && n !== cur) window.location.hash = n; },
    raw: () => window.open(`https://pawsy.fun/api/userinfo?id=${cur}`, '_blank'),
    save: async () => {
        const card = $('p.c'), nick = $('nick').innerText || 'user';
        $('dd').classList.remove('show');
        const old = card.style.transform;
        card.style.transform = 'none';
        const canvas = await html2canvas(card, { useCORS: true, backgroundColor: "#000", scale: 2 });
        card.style.transform = old;
        const a = document.createElement('a');
        a.download = `perfil de ${nick}.png`;
        a.href = canvas.toDataURL();
        a.click();
    }
};

window.onclick = () => $('dd').classList.remove('show');

function md(t) {
    if(!t) return "";
    return t.replace(/<([^>]+)>/g, '<a href="$1" target="_blank">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>')
            .replace(/__([^_]+)__/g, '<u>$1</u>');
}

function clock() {
    acts_d.forEach((a, i) => {
        if(a.tempo?.início && a.tempo?.final) {
            const s = a.tempo.início > 1e10 ? a.tempo.início/1000 : a.tempo.início,
                  e = a.tempo.final > 1e10 ? a.tempo.final/1000 : a.tempo.final,
                  n = Date.now()/1000, t = e - s, c = Math.max(0, Math.min(t, n - s));
            const b = $(`b-${i}`), l = $(`t-${i}`);
            if(b) b.style.width = `${(c/t)*100}%`;
            if(l) l.innerText = `${Math.floor(c/60)}:${Math.floor(c%60).toString().padStart(2,'0')}`;
        }
    });
}

async function effs(c, s) {
    if (!c || eff_a > 0) return;
    const el = $('p.e'); eff_a = 1;
    const run = () => {
        el.src = c; el.style.opacity = '1';
        loop = setTimeout(() => {
            el.src = s;
            loop = setTimeout(() => {
                el.style.opacity = '0';
                loop = setTimeout(run, 8000);
            }, 4000);
        }, 3000);
    };
    run();
}

async function load() {
    try {
        const r = await fetch(`https://pawsy.fun/api/userinfo?id=${cur}`);
        if (!r.ok) { cur = BASE; window.location.hash = BASE; load(); return; }
        const d = await r.json();
        
        $('u.b').style.backgroundImage = $('b.b').style.backgroundImage = d.banner?.url ? `url(${d.banner.url})` : 'none';
        $('u.a').src = d.avatar || '';
        const n = d.nome?.apelido || d.nome?.username || '';
        $('nick').innerText = n;
        $('pg.t').innerText = `Perfil de ${n}`;
        $('u.h').innerText = `@${d.nome?.username || ''}`;
        $('u.p').innerText = d.pronome ? ` • ${d.pronome}` : '';
        $('u.bio').innerHTML = md(d.bio);
        $('u.s').className = `s.d ${d.status?.tipo || 'offline'}`;

        const dc = $('u.d');
        if(d.decoração?.url) { dc.src = d.decoração.url; dc.style.display = 'block'; } else dc.style.display = 'none';

        const cl = $('cl.w');
        if(d.tag?.url) { cl.classList.add('active'); $('cl.i').src = d.tag.url; $('cl.n').innerText = d.tag.nome; } else cl.classList.remove('active');

        const b = $('bdgs'); b.innerHTML = '';
        if(d.insígnias) d.insígnias.forEach(i => b.innerHTML += `<img src="${i.url}" class="bdg.icon">`);

        if(d.efeito_perfil?.cover) effs(d.efeito_perfil.cover, d.efeito_perfil.still);

        const ac = $('acts'); ac.innerHTML = ''; acts_d = d.atividades || [];
        acts_d.forEach((a, i) => {
            let p = ''; if(a.tempo?.final) {
                const dur = (a.tempo.final - a.tempo.início) / (a.tempo.final > 1e10 ? 1000 : 1);
                p = `<div class="bar.w"><div id="b-${i}" class="bar.f"></div></div><div class="tm.l"><span id="t-${i}">0:00</span><span>${Math.floor(dur/60)}:${Math.floor(dur%60).toString().padStart(2,'0')}</span></div>`;
            }
            ac.innerHTML += `<div class="c.b"><div class="lbl">${a.tipo}</div><div class="act.c"><img src="${a.imagem}" class="act.img"><div><div style="font-size:14px;font-weight:600">${a.nome}</div><div style="font-size:13px;color:var(--mt)">${a.detalhes||''}</div>${p}</div></div></div>`;
        });
        $('p.c').classList.remove('l');
    } catch(e) { cur = BASE; load(); }
}

function reset() {
    $('p.c').classList.add('l');
    $('u.b').style.backgroundImage = $('b.b').style.backgroundImage = 'none';
    $('u.a').src = ''; $('u.d').style.display = 'none';
    $('u.bio').innerHTML = ''; $('bdgs').innerHTML = '';
    $('acts').innerHTML = ''; eff_a = 0; clearTimeout(loop);
    $('p.e').style.opacity = '0'; $('p.e').src = '';
    clearInterval(int_b); clearInterval(int_a); clearInterval(int_c);
    setTimeout(start, 300);
}

function start() { load(); int_b = setInterval(load, 60000); int_a = setInterval(load, 15000); int_c = setInterval(clock, 1000); }

window.addEventListener('hashchange', () => { cur = getUserId(); reset(); });
function getUserId() { return window.location.hash.substring(1) || BASE; }

start();
