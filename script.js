const DEFAULT_DATA = {
  name: "Liliyana De Zenith",
  username: "liliyana.lyna",
  bio: "Selamat datang di link resmi aku ✨",
  banner: "https://videos.pexels.com/video-files/3129957/3129957-uhd_2560_1440_25fps.mp4",
  profile: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
  links: [
    { title: "nama website nya", url: "https://instagram.com", sub: "Link URL website" },
    { title: "nama website nya", url: "https://tiktok.com", sub: "Link URL website" },
    { title: "Nama website nya", url: "https://youtube.com", sub: "Link URL website" }
  ],
  videos: [
    "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4",
    "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4",
    "https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"
  ]
};

const SVG_EMPTY_VIDEO = `
<svg viewBox="0 0 100 100" fill="none" style="width:80px;height:80px;margin:0 auto 10px;display:block">
  <rect x="10" y="15" width="80" height="55" rx="10" fill="rgba(255,255,255,0.15)" stroke="white" stroke-width="2"/>
  <path d="M40 32 L65 42.5 L40 53 Z" fill="white"/>
  <circle cx="50" cy="85" r="4" fill="#7de2fc"/>
</svg>`;

const SVG_EMPTY_LINK = `
<svg viewBox="0 0 100 100" fill="none" style="width:80px;height:80px;margin:0 auto 10px;display:block">
  <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.12)" stroke="white" stroke-width="2"/>
  <path d="M35 50 C35 40 45 35 50 40 M50 60 C55 65 65 60 65 50 M40 45 L60 55" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>`;

let data = JSON.parse(localStorage.getItem('linkcreator_data') || 'null') || JSON.parse(JSON.stringify(DEFAULT_DATA));
let currentUser = JSON.parse(localStorage.getItem('linkcreator_user') || 'null');

function isVideoUrl(url){
  return url && (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov') || url.includes('video'));
}

function render(){
  document.getElementById('displayName').textContent = data.name;
  document.getElementById('displayUsername').textContent = '@' + data.username;
  document.getElementById('bioText').textContent = data.bio || '';

  const bV = document.getElementById('bannerVideo');
  const bI = document.getElementById('bannerImg');
  if(isVideoUrl(data.banner)){
    bV.src = data.banner; bV.style.display='block'; bI.style.display='none'; bV.play().catch(()=>{});
  } else {
    bI.src = data.banner; bI.style.display='block'; bV.style.display='none';
  }

  const pV = document.getElementById('profileVideo');
  const pI = document.getElementById('profileImg');
  if(isVideoUrl(data.profile)){
    pV.src = data.profile; pV.style.display='block'; pI.style.display='none'; pV.play().catch(()=>{});
  } else {
    pI.src = data.profile; pI.style.display='block'; pV.style.display='none';
  }

  const lc = document.getElementById('linksContainer');
  lc.innerHTML = '';
  if(!data.links || data.links.length === 0){
    lc.innerHTML = `<div class="empty-state">${SVG_EMPTY_LINK}<h4>Belum ada link</h4><p>Klik Edit untuk tambah link website kamu</p></div>`;
  } else {
    data.links.forEach(l=>{
      const a = document.createElement('a');
      a.className='link-btn';
      a.href = l.url;
      a.target = '_blank';
      a.innerHTML = `${l.title}<small>${l.sub||'Link URL website'}</small>`;
      lc.appendChild(a);
    });
  }

  const vg = document.getElementById('videoGrid');
  vg.innerHTML='';
  if(!data.videos || data.videos.length === 0){
    vg.innerHTML = `<div class="empty-state">${SVG_EMPTY_VIDEO}<h4>Video masih kosong</h4><p>Tambah video pertama kamu lewat menu Edit</p></div>`;
  } else {
    data.videos.forEach(v=>{
      const card = document.createElement('div');
      card.className='v-card';
      if(isVideoUrl(v)){
        card.innerHTML = `<video src="${v}" autoplay muted loop playsinline></video><div class="v-label">link URL video</div>`;
      } else if(v && v.trim() !== ''){
        card.innerHTML = `<img src="${v}"><div class="v-label">link URL video</div>`;
      } else {
        card.innerHTML = `${SVG_EMPTY_VIDEO}<div class="v-label">link URL video</div>`;
      }
      vg.appendChild(card);
    });
  }

  const publicUrl = location.origin + location.pathname + '#/@' + data.username;
  document.getElementById('shareUrl').textContent = publicUrl;
}

function saveData(){
  localStorage.setItem('linkcreator_data', JSON.stringify(data));
  if(currentUser && currentUser.username){
    localStorage.setItem('lc_user_' + currentUser.username, JSON.stringify(data));
  }
  render();
  alert('Tersimpan! URL publik kamu:\n' + location.origin + location.pathname + '#/@' + data.username);
}

window.addEventListener('hashchange', loadFromHash);
function loadFromHash(){
  if(location.hash.startsWith('#/@')){
    const uname = location.hash.replace('#/@','');
    const saved = localStorage.getItem('lc_user_' + uname);
    if(saved){ data = JSON.parse(saved); render(); }
  }
}

function openModal(id){ document.getElementById(id).classList.remove('hidden'); }
function closeModal(id){ document.getElementById(id).classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach(el=>{
  el.addEventListener('click', ()=> closeModal(el.dataset.close));
});

document.getElementById('btn-login').onclick = ()=> { document.getElementById('authTitle').textContent='Masuk dengan Gmail'; openModal('authModal'); };
document.getElementById('btn-daftar').onclick = ()=> { document.getElementById('authTitle').textContent='Daftar dengan Gmail'; openModal('authModal'); };
document.getElementById('btn-admin').onclick = ()=> { fillAdmin(); openModal('adminPanel'); };

document.getElementById('btn-auth-manual').onclick = ()=>{
  const email = document.getElementById('authEmail').value.trim();
  const name = document.getElementById('authName').value.trim() || 'User';
  let username = document.getElementById('authUsername').value.trim().replace('@','') || ('user' + Date.now().toString().slice(-4));
  if(!email.includes('@gmail')){ if(!confirm('Ini bukan email Gmail, tetap lanjut?')) return; }
  currentUser = { email, name, username };
  localStorage.setItem('linkcreator_user', JSON.stringify(currentUser));
  const saved = localStorage.getItem('lc_user_' + username);
  if(saved) data = JSON.parse(saved);
  else { data.username = username; data.name = name; }
  updateAuthUI();
  closeModal('authModal');
  render();
  fillAdmin();
  alert('Berhasil masuk sebagai ' + email + '\nUsername kamu: @' + username);
};

function initGoogle(){
  if(typeof google === 'undefined') return;
  google.accounts.id.initialize({
    client_id: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com",
    callback: (res)=>{
      try{
        const payload = JSON.parse(atob(res.credential.split('.')[1]));
        currentUser = { email: payload.email, name: payload.name, username: (payload.email.split('@')[0]) };
        localStorage.setItem('linkcreator_user', JSON.stringify(currentUser));
        updateAuthUI();
        closeModal('authModal');
        render();
        alert('Login Gmail berhasil: ' + payload.email);
      }catch(e){ console.log(e); }
    }
  });
  google.accounts.id.renderButton(document.getElementById('g_id_button'), { theme:"outline", size:"large", width:280, text:"continue_with" });
}

function updateAuthUI(){
  const logged =!!currentUser;
  document.getElementById('btn-login').classList.toggle('hidden', logged);
  document.getElementById('btn-daftar').classList.toggle('hidden', logged);
  document.getElementById('btn-admin').classList.toggle('hidden',!logged);
  const ui = document.getElementById('user-info');
  if(logged){ ui.classList.remove('hidden'); ui.textContent = currentUser.email; }
  else { ui.classList.add('hidden'); }
}

function fillAdmin(){
  document.getElementById('inpName').value = data.name;
  document.getElementById('inpUsername').value = data.username;
  document.getElementById('inpBio').value = data.bio;
  document.getElementById('inpBanner').value = data.banner;
  document.getElementById('inpProfile').value = data.profile;

  const al = document.getElementById('adminLinks');
  al.innerHTML='';
  data.links.forEach((l,i)=>{
    const row = document.createElement('div');
    row.className='admin-link-row';
    row.innerHTML = `<input placeholder="Nama website" value="${l.title}" data-i="${i}" data-f="title">
                     <input placeholder="https://link-url" value="${l.url}" data-i="${i}" data-f="url">
                     <button data-del="${i}">x</button>`;
    al.appendChild(row);
  });
  al.querySelectorAll('input').forEach(inp=>{
    inp.addEventListener('input', e=>{
      data.links[e.target.dataset.i][e.target.dataset.f] = e.target.value;
    });
  });
  al.querySelectorAll('[data-del]').forEach(btn=>{
    btn.onclick = ()=>{ data.links.splice(parseInt(btn.dataset.del),1); fillAdmin(); };
  });

  const av = document.getElementById('adminVideos');
  av.innerHTML='';
  data.videos.forEach((v,i)=>{
    const row = document.createElement('div');
    row.className='admin-video-row';
    row.innerHTML = `<input placeholder="https://link URL video (mp4)" value="${v}" data-i="${i}">
                     <button data-del="${i}">x</button>`;
    av.appendChild(row);
  });
  av.querySelectorAll('input').forEach(inp=>{
    inp.addEventListener('input', e=>{ data.videos[e.target.dataset.i] = e.target.value; });
  });
  av.querySelectorAll('[data-del]').forEach(btn=>{
    btn.onclick = ()=>{ data.videos.splice(parseInt(btn.dataset.del),1); fillAdmin(); };
  });
}

document.getElementById('btn-add-link').onclick = ()=>{ data.links.push({title:"nama website nya", url:"https://", sub:"Link URL website"}); fillAdmin(); };
document.getElementById('btn-add-video').onclick = ()=>{ data.videos.push("https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4"); fillAdmin(); };

document.getElementById('btn-save').onclick = ()=>{
  data.name = document.getElementById('inpName').value;
  data.username = document.getElementById('inpUsername').value.replace('@','');
  data.bio = document.getElementById('inpBio').value;
  data.banner = document.getElementById('inpBanner').value;
  data.profile = document.getElementById('inpProfile').value;
  if(currentUser) currentUser.username = data.username;
  saveData();
  closeModal('adminPanel');
  location.hash = '/@' + data.username;
};

document.getElementById('btn-export').onclick = ()=>{
  const url = location.origin + location.pathname + '#/@' + data.username;
  document.getElementById('toastUrl').textContent = url;
  document.getElementById('shareToast').classList.remove('hidden');
  navigator.clipboard.writeText(url);
  setTimeout(()=> document.getElementById('shareToast').classList.add('hidden'), 3000);
};

document.getElementById('btn-copy').onclick = ()=>{
  const url = location.origin + location.pathname + '#/@' + data.username;
  navigator.clipboard.writeText(url);
  alert('Link tersalin: ' + url);
};

updateAuthUI();
loadFromHash();
render();
initGoogle();