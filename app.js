(() => {
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const mats={
 iron:{name:'Sắt',symbol:'Fe',desc:'Sắt có thể tạo gỉ màu nâu đỏ khi tiếp xúc đồng thời với nước và oxy.'},
 copper:{name:'Đồng',symbol:'Cu',desc:'Đồng tương đối bền trong nước thường; phản ứng phụ thuộc vào môi trường hóa học.'},
 aluminum:{name:'Nhôm',symbol:'Al',desc:'Nhôm được bảo vệ bởi một lớp oxit mỏng; lớp này có thể bị ảnh hưởng bởi axit hoặc bazơ.'},
 zinc:{name:'Kẽm',symbol:'Zn',desc:'Kẽm có thể phản ứng với axit loãng và một số dung dịch kiềm.'}
};
const media={air:{name:'Không khí (O₂)',liquid:false},water:{name:'Nước',liquid:true},nacl:{name:'Dung dịch NaCl (trong)',liquid:true},cuso4:{name:'Dung dịch CuSO₄',liquid:true},naoh:{name:'Dung dịch NaOH',liquid:true},h2so4:{name:'H₂SO₄ loãng (20%)',liquid:true}};
const titles={home:'Tổng quan mô phỏng',simulation:'Mô phỏng ăn mòn',materials:'Thư viện vật liệu'};
function go(p){if(!titles[p])p='home';$$('.page').forEach(x=>x.classList.toggle('active',x.id==='page-'+p));$$('.nav-link').forEach(x=>x.classList.toggle('active',x.dataset.page===p));$('#page-title').textContent=titles[p];if(location.hash!=='#'+p)history.replaceState(null,'','#'+p);window.scrollTo({top:0,behavior:'smooth'});}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));$$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));go(location.hash.slice(1)||'home');
function cards(){const ids=Object.keys(mats);const markup=ids.map(id=>`<article class="material-card"><div class="element-symbol">${mats[id].symbol}</div><h3>${mats[id].name}</h3><p>${mats[id].desc}</p></article>`).join('');$('#material-grid').innerHTML=markup;$('#home-material-grid').innerHTML=ids.slice(0,3).map(id=>`<article class="material-card"><div class="element-symbol">${mats[id].symbol}</div><h3>${mats[id].name}</h3><p>${mats[id].desc}</p></article>`).join('');}
cards();
const mass=$('#sim-mass'),vol=$('#sim-volume'),simConc=$('#sim-concentration'),simTemp=$('#sim-temp'),simTime=$('#sim-time');
mass.addEventListener('input',()=>$('#mass-output').value=mass.value+' g');vol.addEventListener('input',()=>$('#volume-output').value=vol.value+' mL');
simConc.addEventListener('input',()=>$('#sim-concentration-output').value=simConc.value+'%');simTemp.addEventListener('input',()=>$('#sim-temp-output').value=simTemp.value+' °C');simTime.addEventListener('input',()=>$('#sim-time-output').value=simTime.value+' giờ');
function updateSimFields(){const key=$('#sim-medium').value;$('#liquid-fields').hidden=!media[key].liquid;$('#sim-concentration-wrap').hidden=(key==='air'||key==='water'||key==='h2so4');}
$('#sim-medium').addEventListener('change',updateSimFields);updateSimFields();
function reactionFor(d){
 const {mat,medium,concentration:c,temp}=d;
 if(medium==='air') return {reacts:false,title:'Không có biến đổi rõ trong điều kiện này',text:'O₂ trong không khí một mình không đủ để mô phỏng quá trình gỉ thông thường. Sắt cần có cả nước/độ ẩm và oxy; nhôm vốn có lớp oxit bảo vệ.'};
 if(medium==='water'){
  if(mat==='iron')return {reacts:true,slow:true,title:'Ăn mòn chậm có thể xảy ra',text:'Sắt có thể bị ăn mòn khi có nước và oxy hòa tan. Mức độ thực tế phụ thuộc lượng oxy, thời gian và các chất hòa tan.'};
  if(mat==='copper')return {reacts:false,title:'Không phản ứng đáng kể',text:'Đồng không phản ứng đáng kể với nước sạch ở điều kiện thường.'};
  if(mat==='aluminum')return {reacts:false,title:'Không phản ứng đáng kể',text:'Lớp oxit mỏng trên bề mặt nhôm thường bảo vệ kim loại trong nước ở điều kiện thường.'};
  return {reacts:false,title:'Không phản ứng đáng kể',text:'Kẽm không có biểu hiện phản ứng rõ rệt với nước lạnh ở điều kiện mô phỏng này.'};
 }
 if(medium==='nacl'){
  if(mat==='iron')return {reacts:true,title:'Có thể bị ăn mòn',text:'Dung dịch NaCl dẫn điện và ion chloride có thể thúc đẩy ăn mòn sắt khi có oxy hòa tan.'};
  if(mat==='aluminum')return {reacts:true,slow:true,title:'Có nguy cơ ăn mòn cục bộ',text:'Ion chloride có thể làm suy yếu lớp oxit bảo vệ nhôm, nhưng mức độ phụ thuộc nhiều vào điều kiện bề mặt và dung dịch.'};
  if(mat==='zinc')return {reacts:true,slow:true,title:'Ăn mòn có thể xảy ra',text:'Kẽm có thể bị ăn mòn trong dung dịch muối; sản phẩm và mức độ phụ thuộc oxy, nồng độ và thời gian.'};
  return {reacts:true,slow:true,title:'Biến đổi bề mặt có thể xảy ra chậm',text:'Đồng có thể bị ăn mòn trong môi trường chứa chloride và oxy, nhưng không thể xác định mức độ chỉ từ tên dung dịch.'};
 }
 if(medium==='cuso4'){
  if(mat==='iron')return {reacts:true,title:'Có phản ứng hóa học',text:'Sắt đẩy đồng ra khỏi dung dịch đồng(II) sunfat: Fe + CuSO₄ → FeSO₄ + Cu. Đồng kim loại có thể bám lên bề mặt sắt.'};
  if(mat==='zinc')return {reacts:true,title:'Có phản ứng hóa học',text:'Kẽm hoạt động mạnh hơn đồng nên có thể đẩy đồng ra khỏi dung dịch: Zn + CuSO₄ → ZnSO₄ + Cu.'};
  if(mat==='copper')return {reacts:false,title:'Không phản ứng thế',text:'Đồng kim loại không đẩy được chính ion Cu²⁺ ra khỏi dung dịch CuSO₄.'};
  return {reacts:'conditional',title:'Phụ thuộc lớp oxit bề mặt',text:'Nhôm có thể khử ion Cu²⁺ về đồng trong điều kiện thích hợp, nhưng lớp oxit tự nhiên có thể cản trở phản ứng. Không thể kết luận chắc chắn chỉ từ thông số hiện tại.'};
 }
 if(medium==='naoh'){
  if(mat==='aluminum')return {reacts:true,title:'Có thể phản ứng trong kiềm',text:'Nhôm có tính lưỡng tính và có thể phản ứng với dung dịch NaOH, tạo aluminat và khí H₂. Tốc độ phụ thuộc nồng độ, nhiệt độ và lớp oxit.'};
  if(mat==='zinc')return {reacts:true,title:'Có thể phản ứng trong kiềm',text:'Kẽm có tính lưỡng tính và có thể phản ứng với dung dịch NaOH tạo các dạng zincat và khí H₂; mức độ phụ thuộc điều kiện.'};
  return {reacts:false,title:'Không phản ứng đáng kể',text:'Sắt và đồng thường không phản ứng đáng kể với dung dịch NaOH trong điều kiện mô phỏng này.'};
 }
 if(medium==='h2so4'){
  if(mat==='copper')return {reacts:false,title:'Không phản ứng với axit loãng',text:'Bạn nhận xét đúng: đồng không phản ứng đáng kể với H₂SO₄ loãng ở điều kiện thường vì axit này không có tính oxi hóa đủ mạnh để hòa tan đồng.'};
  if(mat==='iron')return {reacts:true,title:'Có phản ứng hóa học',text:'Sắt phản ứng với H₂SO₄ loãng tạo muối sắt(II) sunfat và khí hiđro: Fe + H₂SO₄ → FeSO₄ + H₂↑.'};
  if(mat==='zinc')return {reacts:true,title:'Có phản ứng hóa học',text:'Kẽm phản ứng với H₂SO₄ loãng tạo kẽm sunfat và khí hiđro: Zn + H₂SO₄ → ZnSO₄ + H₂↑.'};
  return {reacts:'conditional',title:'Phản ứng phụ thuộc lớp oxit',text:'Nhôm có thể phản ứng với axit sulfuric loãng, nhưng lớp oxit bề mặt và điều kiện cụ thể ảnh hưởng đến việc phản ứng bắt đầu và diễn ra như thế nào.'};
 }
 return {reacts:false,title:'Chưa xác định',text:'Không đủ thông tin để kết luận.'};
}
function estimateStage(d,r){
 if(r.reacts===false)return 0;
 if(r.reacts==='conditional')return 0;
 let s=0;
 if(d.medium==='air')s=d.mat==='iron'?1:0;
 else if(d.medium==='water')s=d.mat==='iron'?1:0;
 else if(d.medium==='nacl')s=d.mat==='iron'?2:(d.mat==='aluminum'?1:1);
 else if(d.medium==='cuso4')s=3;
 else if(d.medium==='naoh')s=2;
 else if(d.medium==='h2so4')s=2;
 if(r.slow)s=Math.max(0,s-1);
 if(d.medium!=='air'&&d.medium!=='water'){
  if(Number(d.concentration)>=10)s=Math.min(3,s+1);
  if(Number(d.concentration)<=2)s=Math.max(0,s-1);
 }
 if(Number(d.temp)>=40)s=Math.min(3,s+1);
 if(Number(d.time)>=72)s=Math.min(3,s+1); else if(Number(d.time)<=6)s=Math.max(0,s-1);
 return Math.max(0,Math.min(3,s));
}
function plateSVG(mat,stage){
 let fill={iron:'#899096',copper:'#b9784f',aluminum:'#c6cbd0',zinc:'#a9afb4'}[mat],symbol=mats[mat].symbol,damage='';
 if(stage>=1){let n=stage===1?5:stage===2?13:25;for(let i=0;i<n;i++){let x=(i*37+13)%130+10,y=(i*29+21)%170+15,r=stage===1?2.5:stage===2?4:7;let rust=mat==='iron'?'#9b5e3e':mat==='copper'?'#6c7e55':'#777d81';damage+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${rust}" opacity="${stage===1?'.55':stage===2?'.72':'.9'}"/>`;}}
 if(stage===3)return `<svg viewBox="0 0 150 200" role="img" aria-label="Minh họa biến đổi bề mặt mạnh"><defs><linearGradient id="rust" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6f5a4a"/><stop offset=".5" stop-color="#b4774f"/><stop offset="1" stop-color="#4f4944"/></linearGradient></defs><path d="M25 22 L62 14 L82 29 L119 19 L128 53 L115 77 L130 104 L105 127 L117 159 L91 184 L61 170 L44 188 L24 158 L31 126 L14 104 L30 76 L18 50Z" fill="url(#rust)" stroke="#61574e" stroke-width="2"/>${damage}<text x="75" y="109" text-anchor="middle" fill="#fff" font-size="19" font-weight="700" opacity=".9">${symbol}</text></svg>`;
 return `<svg viewBox="0 0 150 200" role="img" aria-label="Minh họa mẫu kim loại"><defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f3f4f4"/><stop offset=".4" stop-color="${fill}"/><stop offset="1" stop-color="#626b71"/></linearGradient></defs><path d="M29 13 Q75 8 121 15 L117 185 Q75 193 32 184Z" fill="url(#metal)" stroke="#727b80" stroke-width="2"/>${damage}<text x="75" y="106" text-anchor="middle" fill="#fff" stroke="#535a5d" stroke-width=".5" font-size="24" font-weight="700">${symbol}</text></svg>`;
}
function renderSimulation(d){
 const mat=mats[d.mat],medium=media[d.medium],reaction=reactionFor(d),stage=estimateStage(d,reaction);
 const sample=`<div class="sample-figure">${plateSVG(d.mat,stage)}<span>${mat.name} · ${d.mass} g</span></div>`;
 const beaker=medium.liquid?`<div class="beaker"><div class="liquid" style="top:${Math.max(42,90-Number(d.volume)*.16)}px"></div><div class="beaker-scale">250<br>200<br>150<br>100<br>50 mL</div>${sample}</div>`:`<div class="air-scene"><div class="air-label">O₂ · Không khí</div>${sample}</div>`;
 const stageNames=['Chưa có biến đổi nhìn thấy rõ','Biến đổi nhẹ','Biến đổi rõ rệt','Biến đổi bề mặt mạnh'];
 const condition=(d.medium!=='air'&&d.medium!=='water')?` · nồng độ ${d.concentration}%`:'';
 const reactionLabel=reaction.reacts===false?'Không phản ứng đáng kể':reaction.reacts==='conditional'?'Phản ứng phụ thuộc điều kiện':'Có thể xảy ra phản ứng/ăn mòn';
 $('#simulation-scene').innerHTML=`<div class="scene-wrap"><div class="scene-object">${beaker}</div><div class="scene-description"><div class="stage-chip">${reactionLabel}</div><h3>${reaction.title}</h3><p>${reaction.text}</p><p><strong>Môi trường:</strong> ${medium.name}${medium.liquid?' · '+d.volume+' mL':''}</p><p><strong>Điều kiện:</strong> ${d.temp} °C · ${d.time} giờ${condition}</p></div></div>`;
 $('#sim-status').textContent=reaction.reacts===false?'Không có phản ứng đáng kể theo điều kiện đã chọn.':reaction.reacts==='conditional'?'Cần thêm điều kiện để kết luận chắc chắn.':`Trạng thái minh họa: ${stageNames[stage].toLowerCase()}.`;
}
$('#sim-form').addEventListener('submit',e=>{e.preventDefault();renderSimulation({mat:$('#sim-material').value,mass:mass.value,medium:$('#sim-medium').value,volume:vol.value,concentration:simConc.value,temp:simTemp.value,time:simTime.value});});
})();
