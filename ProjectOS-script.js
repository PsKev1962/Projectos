var SCRIPT_URL = 'https:
var SHEET_ID = '1CvbmCZhsyPTDfxUYLYxUwodfc28LlPSY61agOdmaA3U';
var SHEET_LINK = 'https:
var COLORS = ['#4f46e5','#22c55e','#f97316','#ef4444','#3b82f6','#eab308','#8b5cf6','#14b8a6'];
var TEMPLATES = [
{id:'bt1',name:'Website Build',icon:'🌐',desc:'End-to-end website design and development.',tasks:[{title:'Discovery & requirements',cat:'Strategy',pri:'high'},{title:'Wireframes',cat:'Design',pri:'high'},{title:'Visual design',cat:'Design',pri:'high'},{title:'Development',cat:'Development',pri:'high'},{title:'QA testing',cat:'QA',pri:'high'},{title:'Go-live',cat:'Launch',pri:'high'}]},
{id:'bt2',name:'Squarespace Website',icon:'🟦',desc:'Squarespace build from brief to live.',tasks:[{title:'Site brief & goals',cat:'Strategy',pri:'high'},{title:'Template selection',cat:'Design',pri:'high'},{title:'Brand colours & fonts',cat:'Design',pri:'high'},{title:'Homepage content',cat:'Content',pri:'high'},{title:'Inner pages',cat:'Content',pri:'high'},{title:'SEO & metadata',cat:'Launch',pri:'high'},{title:'Mobile testing',cat:'QA',pri:'high'},{title:'Domain & SSL',cat:'Launch',pri:'high'},{title:'Go-live handover',cat:'Launch',pri:'high'}]},
{id:'bt3',name:'Marketing Campaign',icon:'📢',desc:'Full campaign from brief to results.',tasks:[{title:'Campaign brief',cat:'Strategy',pri:'high'},{title:'Audience research',cat:'Strategy',pri:'med'},{title:'Creative concept',cat:'Creative',pri:'high'},{title:'Asset production',cat:'Production',pri:'high'},{title:'Campaign go-live',cat:'Launch',pri:'high'},{title:'Post-campaign review',cat:'Review',pri:'high'}]},
{id:'bt4',name:'Software Development',icon:'💻',desc:'Agile software feature cycle.',tasks:[{title:'Requirements',cat:'Planning',pri:'high'},{title:'Architecture',cat:'Planning',pri:'high'},{title:'UI/UX design',cat:'Design',pri:'high'},{title:'Backend development',cat:'Development',pri:'high'},{title:'Frontend development',cat:'Development',pri:'high'},{title:'QA & bug fixes',cat:'Testing',pri:'high'},{title:'Production release',cat:'Release',pri:'high'}]},
{id:'bt5',name:'Event Planning',icon:'🎉',desc:'Event from concept to debrief.',tasks:[{title:'Event brief & budget',cat:'Planning',pri:'high'},{title:'Venue booking',cat:'Planning',pri:'high'},{title:'Suppliers & vendors',cat:'Operations',pri:'high'},{title:'Promotion',cat:'Marketing',pri:'med'},{title:'Day-of coordination',cat:'Operations',pri:'high'},{title:'Post-event debrief',cat:'Review',pri:'med'}]}
];
var DB = {entities:[],members:[],projects:[]};
var ST = {view:'dashboard',entity:null,project:null,fstat:'all',search:''};
function h(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function ge(id){return DB.entities.find(function(e){return e.id===id;})||{name:'?',color:'#888',short:'?'};}
function gm(id){return DB.members.find(function(m){return m.id===id;})||{name:'?',color:'#888',initials:'?'};}
function gp(id){return DB.projects.find(function(p){return p.id===id;});}
function uid(){return 'x'+Date.now()+Math.floor(Math.random()*9999);}
function isOD(p){var d=parseDue(p.due);return d&&d<new Date()&&p.status!=='done';}
function isDS(p){var d=parseDue(p.due);if(!d)return false;return (d-new Date())/86400000<=7&&(d-new Date())/86400000>=0&&p.status!=='done';}
function parseDue(d){if(!d)return null;var r=new Date(d);return isNaN(r)?null:r;}
function setSS(state,lbl){
var d=document.getElementById('sync-dot');
var l=document.getElementById('sync-lbl');
if(d) d.className='sync-dot'+(state==='syncing'?' syncing':state==='error'?' error':state==='setup'?' setup':'');
if(l) l.textContent=lbl;
}
function defaults(){
DB={
entities:[{id:'e1',name:'Apex Holdings',color:'#4f46e5',short:'AH'},{id:'e2',name:'Meridian Group',color:'#22c55e',short:'MG'},{id:'e3',name:'Nova Ventures',color:'#f97316',short:'NV'},{id:'e4',name:'BlueLine Co.',color:'#3b82f6',short:'BL'}],
members:[{id:'m1',name:'Alex Reeves',email:'alex@apexholdings.com',color:'#4f46e5',initials:'AR',entity:'e1'},{id:'m2',name:'Morgan West',email:'morgan@meridiangroup.com',color:'#22c55e',initials:'MW',entity:'e2'},{id:'m3',name:'Jamie Liu',email:'jamie@novaventures.com',color:'#f97316',initials:'JL',entity:'e3'},{id:'m4',name:'Sam Torres',email:'sam@bluelineco.com',color:'#3b82f6',initials:'ST',entity:'e4'}],
projects:[{id:'p1',name:'Brand Refresh 2025',entity:'e1',status:'active',priority:'high',progress:45,due:'2025-08-15',lead:'m1',members:['m1'],desc:'Full brand identity refresh.',tasks:[{id:'t1',title:'Brand audit',cat:'Strategy',pri:'high',done:true,assign:'m1'},{id:'t2',title:'Concept development',cat:'Design',pri:'high',done:false,assign:'m1'}],notes:[],docs:[]},{id:'p2',name:'Website Redesign',entity:'e2',status:'active',priority:'high',progress:60,due:'2025-07-01',lead:'m2',members:['m2'],desc:'Redesign on Squarespace.',tasks:[{id:'t3',title:'Discovery',cat:'Strategy',pri:'high',done:true,assign:'m2'},{id:'t4',title:'Development',cat:'Dev',pri:'high',done:false,assign:'m2'}],notes:[],docs:[]}]
};
}
function loadData(cb){
if(!SCRIPT_URL){
setSS('ok','Local data');
var bk=localStorage.getItem('pos_db');
if(bk){try{DB=JSON.parse(bk);}catch(e){defaults();}}else{defaults();}
cb&&cb();
return;
}
setSS('syncing','Loading...');
var url=SCRIPT_URL+'?t='+Date.now();
fetch(url)
.then(function(r){return r.json();})
.then(function(res){
if(res.ok&&res.data&&res.data.entities){
DB=res.data;
setSS('ok','Synced '+new Date().toLocaleTimeString());
localSave();
} else {
defaults();
setSS('ok','New database');
saveData(null);
}
cb&&cb();
})
.catch(function(){
var bk=localStorage.getItem('pos_db');
if(bk){try{DB=JSON.parse(bk);}catch(e){defaults();}}else{defaults();}
setSS('error','Offline — local copy');
cb&&cb();
});
}
function saveData(cb){
localSave();
setSS('ok','Saved '+new Date().toLocaleTimeString());
if(cb) cb();
if(!SCRIPT_URL) return;
var encoded = encodeURIComponent(JSON.stringify(DB));
var url = SCRIPT_URL + '?action=save&data=' + encoded;
var img = new Image();
img.src = url;
}
function localSave(){try{localStorage.setItem('pos_db',JSON.stringify(DB));}catch(e){}}
function doSync(){loadData(function(){renderAll();toast('Synced','ok');});}
function mutate(){saveData(null);renderAll();}
function renderAll(){
updateBadges();renderEntList();
var mi=document.getElementById('main-inner');
if(!mi)return;
var v=ST.view;
if(v==='dashboard')mi.innerHTML=renderDash();
else if(v==='attention')mi.innerHTML=renderAttn();
else if(v==='projects')mi.innerHTML=renderProjs();
else if(v==='kanban')mi.innerHTML=renderKanban();
else if(v==='gantt')mi.innerHTML=renderGantt();
else if(v==='tasks')mi.innerHTML=renderTasks();
else if(v==='team')mi.innerHTML=renderTeam();
else if(v==='templates')mi.innerHTML=renderTpls();
else if(v==='squarespace')mi.innerHTML=renderSQ();
}
function setView(v){
ST.view=v;ST.project=null;
document.querySelectorAll('.nav-item').forEach(function(el){el.classList.remove('active');});
var a=document.querySelector('[data-view="'+v+'"]');if(a)a.classList.add('active');
var dp=document.getElementById('detail-panel');if(dp){dp.classList.add('hidden');dp.innerHTML='';}
renderAll();
}
function setEntity(id){ST.entity=ST.entity===id?null:id;renderEntList();renderAll();}
function updateBadges(){
var attn=getAttn();
var ab=document.getElementById('attn-badge');
if(ab){if(attn.length){ab.style.display='';ab.textContent=attn.length;}else{ab.style.display='none';}}
var pb=document.getElementById('proj-badge');if(pb)pb.textContent=DB.projects.length;
}
function renderEntList(){
var el=document.getElementById('entity-list');if(!el)return;
el.innerHTML=DB.entities.map(function(e){
var c=DB.projects.filter(function(p){return p.entity===e.id;}).length;
return '<div class="entity-row'+(ST.entity===e.id?' sel':'')+'" onclick="setEntity(\''+e.id+'\')">'+
'<span class="entity-dot" style="background:'+e.color+'"></span>'+
'<span class="entity-name">'+h(e.name)+'</span>'+
'<span class="entity-count">'+c+'</span></div>';
}).join('');
}
function fps(){
var p=DB.projects;
if(ST.entity)p=p.filter(function(x){return x.entity===ST.entity;});
if(ST.fstat!=='all'&&ST.fstat!=='open'&&ST.fstat!=='done2')p=p.filter(function(x){return x.status===ST.fstat;});
if(ST.search)p=p.filter(function(x){return x.name.toLowerCase().indexOf(ST.search.toLowerCase())>-1;});
return p;
}
function getAttn(){
var r=[];
DB.projects.forEach(function(p){
if(isOD(p))r.push({type:'overdue',proj:p,sev:'high'});
else if(p.status==='risk')r.push({type:'risk',proj:p,sev:'high'});
else if(isDS(p))r.push({type:'soon',proj:p,sev:'med'});
});
return r;
}
function spill(s){
var m={active:'s-active',planning:'s-planning',hold:'s-hold',risk:'s-risk',done:'s-done'};
return '<span class="spill '+(m[s]||'s-done')+'">'+s.charAt(0).toUpperCase()+s.slice(1)+'</span>';
}
function renderDash(){
var p=fps();
var act=p.filter(function(x){return x.status==='active';}).length;
var attn=getAttn().length;
var ot=0;p.forEach(function(x){if(x.tasks)x.tasks.forEach(function(t){if(!t.done)ot++;});});
var html='<div class="page-header"><div><div class="page-title">Dashboard</div>'+
'<div class="page-subtitle">Synced to Google Sheets — shared across all devices</div>'+
'</div><button class="tb-btn tb-btn-accent" onclick="openNewProject()">+ New Project</button></div>';
html+='<div class="stat-grid">'+
'<div class="stat-card"><div class="stat-label">Total Projects</div><div class="stat-value">'+p.length+'</div><div class="stat-sub">'+DB.entities.length+' entities</div></div>'+
'<div class="stat-card green"><div class="stat-label">Active</div><div class="stat-value">'+act+'</div></div>'+
'<div class="stat-card'+(attn>0?' red':'')+'"><div class="stat-label">Needs Attention</div><div class="stat-value">'+attn+'</div><div class="stat-sub">'+(attn>0?'<span onclick="setView(\'attention\')" style="cursor:pointer;color:var(--red);font-weight:600">Review</span>':'All clear')+'</div></div>'+
'<div class="stat-card blue"><div class="stat-label">Open Tasks</div><div class="stat-value">'+ot+'</div></div></div>';
html+='<div class="section-header"><div class="section-title">Entity Overview</div></div>';
html+='<div class="entity-grid">'+DB.entities.map(function(e){
var ep=DB.projects.filter(function(x){return x.entity===e.id;});
var ac=ep.filter(function(x){return x.status==='active';}).length;
var tt=0,dn=0;ep.forEach(function(x){if(x.tasks){tt+=x.tasks.length;x.tasks.forEach(function(t){if(t.done)dn++;})}});
var pct=tt>0?Math.round(dn/tt*100):0;
var ms=[];ep.forEach(function(x){if(x.members)x.members.forEach(function(id){if(ms.indexOf(id)<0)ms.push(id);});});
return '<div class="ent-card" onclick="setEntity(\''+e.id+'\')">'+
'<div class="ent-hdr"><span class="ent-dot" style="background:'+e.color+'"></span><span class="ent-nm">'+h(e.name)+'</span></div>'+
'<div class="ent-mg"><div><div class="ent-ml">Projects</div><div class="ent-mv">'+ep.length+'</div></div>'+
'<div><div class="ent-ml">Active</div><div class="ent-mv" style="color:var(--green)">'+ac+'</div></div>'+
'<div><div class="ent-ml">Tasks</div><div class="ent-mv">'+dn+'/'+tt+'</div></div></div>'+
'<div class="ent-bw"><div class="ent-bf" style="width:'+pct+'%;background:'+e.color+'"></div></div>'+
'<div class="ent-pc">'+pct+'% complete</div>'+
'<div class="av-row">'+ms.slice(0,5).map(function(id){var m=gm(id);return '<div class="av" style="background:'+m.color+'" title="'+h(m.name)+'">'+h(m.initials)+'</div>';}).join('')+'</div></div>';
}).join('')+'</div>';
html+='<div class="section-header"><div class="section-title">Recent Projects</div><span class="section-link" onclick="setView(\'projects\')">View all →</span></div>';
html+=projTable(p.slice(0,5));
return html;
}
function renderAttn(){
var items=getAttn();
var html='<div class="page-header"><div><div class="page-title">⚠ Needs Attention</div><div class="page-subtitle">'+items.length+' items</div></div></div>';
if(!items.length)return html+'<div class="empty-state"><div class="empty-icon">✅</div><div class="empty-text">All clear!</div></div>';
return html+'<div class="alert-list">'+items.map(function(item){
var p=item.proj;var e=ge(p.entity);
var lbl=item.type==='overdue'?'Overdue':item.type==='risk'?'At Risk':'Due Within 7 Days';
var ic=item.type==='overdue'?'🔴':item.type==='risk'?'⚠️':'🟡';
return '<div class="alert-card '+item.sev+'" onclick="selectProj(\''+p.id+'\')">'+
'<span class="alert-icon">'+ic+'</span>'+
'<div><div class="alert-title">'+h(p.name)+'</div><div class="alert-sub">'+lbl+(p.due?' · Due: '+p.due:'')+'</div></div>'+
'<span class="alert-tag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.short)+'</span></div>';
}).join('')+'</div>';
}
function renderProjs(){
var p=fps();
var html='<div class="page-header"><div><div class="page-title">All Projects</div><div class="page-subtitle">'+p.length+' projects</div></div>'+
'<button class="tb-btn tb-btn-accent" onclick="openNewProject()">+ New Project</button></div>';
html+='<div class="search-wrap"><span class="search-icon">🔍</span>'+
'<input class="search-input" id="proj-search" placeholder="Search projects..." oninput="ST.search=this.value;renderProjList()" value="'+h(ST.search)+'"></div>';
html+='<div class="task-filters">'+['all','active','planning','hold','risk','done'].map(function(s){
return '<button class="fb'+(ST.fstat===s?' active':'')+'" onclick="ST.fstat=\''+s+'\';renderAll()">'+s.charAt(0).toUpperCase()+s.slice(1)+'</button>';
}).join('')+'</div>';
html+='<div id="proj-table-wrap">'+(p.length?projTable(p):'<div class="empty-state"><div class="empty-icon">📂</div><div class="empty-text">No projects found</div></div>')+'</div>';
return html;
}
function renderProjList(){
var wrap=document.getElementById('proj-table-wrap');
if(!wrap){renderAll();return;}
var p=fps();
wrap.innerHTML=p.length?projTable(p):'<div class="empty-state"><div class="empty-icon">📂</div><div class="empty-text">No projects found</div></div>';
updateBadges();
}
function projTable(projs){
if(!projs.length)return '<div class="empty-state"><div class="empty-icon">📂</div><div class="empty-text">No projects</div></div>';
var html='<div class="proj-table"><div class="proj-thead"><span>Project</span><span>Entity</span><span>Status</span><span>Priority</span><span>Lead</span><span>Progress</span><span></span></div>';
projs.forEach(function(p){
var e=ge(p.entity);var lm=gm(p.lead);
var tt=p.tasks?p.tasks.length:0;var dn=p.tasks?p.tasks.filter(function(t){return t.done;}).length:0;
html+='<div class="proj-row" onclick="selectProj(\''+p.id+'\')">'+
'<div><div class="pnm">'+(isOD(p)?'🔴 ':isDS(p)?'🟡 ':'')+h(p.name)+'</div><div class="psub">'+dn+'/'+tt+' tasks'+(p.due?' · '+p.due:'')+'</div></div>'+
'<div><span class="etag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.short)+'</span></div>'+
'<div>'+spill(p.status)+'</div>'+
'<div class="p'+p.priority+'">'+p.priority.toUpperCase()+'</div>'+
'<div style="display:flex;align-items:center;gap:6px"><div class="av" style="background:'+lm.color+';width:22px;height:22px;font-size:8px">'+h(lm.initials)+'</div><span style="font-size:12px;color:var(--text2)">'+h(lm.name)+'</span></div>'+
'<div class="pw"><div class="pb"><div class="pbf" style="width:'+p.progress+'%"></div></div><span class="ppc">'+p.progress+'%</span></div>'+
'<div class="row-acts"><button class="delbtn" onclick="event.stopPropagation();delProj(\''+p.id+'\')" title="Delete">✕</button></div></div>';
});
return html+'</div>';
}
function renderKanban(){
var p=fps();
var cols=[{id:'planning',l:'Planning',c:'var(--blue)'},{id:'active',l:'Active',c:'var(--green)'},{id:'hold',l:'On Hold',c:'var(--yellow)'},{id:'risk',l:'At Risk',c:'var(--red)'},{id:'done',l:'Done',c:'var(--text4)'}];
var html='<div class="page-header"><div class="page-title">Board View</div><button class="tb-btn tb-btn-accent" onclick="openNewProject()">+ New Project</button></div><div class="kanban-board">';
cols.forEach(function(col){
var cards=p.filter(function(x){return x.status===col.id;});
html+='<div class="kcol"><div class="kcol-hdr"><span style="color:'+col.c+';font-size:8px">●</span><span class="kcol-title" style="color:'+col.c+'">'+col.l+'</span><span class="kcol-cnt">'+cards.length+'</span></div><div class="kcol-cards">';
if(!cards.length)html+='<div style="text-align:center;padding:20px;color:var(--text4);font-size:12px">No projects</div>';
cards.forEach(function(x){
var e=ge(x.entity);var lm=gm(x.lead);
html+='<div class="kcard" onclick="selectProj(\''+x.id+'\')">'+
'<div class="kcard-title">'+h(x.name)+'</div>'+
'<div class="kcard-meta"><span class="etag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.short)+'</span>'+
'<div class="av" style="background:'+lm.color+';width:20px;height:20px;font-size:8px">'+h(lm.initials)+'</div>'+
'<span style="font-size:11px;color:var(--text4)">'+x.progress+'%</span></div>'+
'<div class="kcard-prog"><div class="kcard-pf" style="width:'+x.progress+'%"></div></div></div>';
});
html+='</div></div>';
});
return html+'</div>';
}
function renderGantt(){
var p=fps();
var html='<div class="page-header"><div class="page-title">Timeline</div></div><div style="overflow-x:auto">'+
'<table style="min-width:700px;border-collapse:collapse;width:100%;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)">'+
'<thead><tr style="background:var(--bg3)"><th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text4);text-align:left">Project</th>'+
'<th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text4);text-align:left">Entity</th>'+
'<th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text4);text-align:left">Status</th>'+
'<th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text4);text-align:left">Due</th>'+
'<th style="padding:10px 12px;font-size:11px;font-weight:700;text-transform:uppercase;color:var(--text4);text-align:left;width:220px">Progress</th></tr></thead><tbody>';
p.forEach(function(x){
var e=ge(x.entity);
html+='<tr style="cursor:pointer;border-top:1px solid var(--border)" onclick="selectProj(\''+x.id+'\')" onmouseover="this.style.background=\'var(--bg3)\'" onmouseout="this.style.background=\'\'">'+
'<td style="padding:10px 12px;font-size:13px;font-weight:600">'+h(x.name)+'</td>'+
'<td style="padding:10px 12px"><span class="etag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.name)+'</span></td>'+
'<td style="padding:10px 12px">'+spill(x.status)+'</td>'+
'<td style="padding:10px 12px;font-size:12px;color:var(--text3)">'+(x.due||'—')+'</td>'+
'<td style="padding:10px 12px"><div style="display:flex;align-items:center;gap:8px">'+
'<div style="flex:1;height:8px;background:var(--bg4);border-radius:4px;overflow:hidden"><div style="width:'+x.progress+'%;height:100%;background:'+e.color+';border-radius:4px"></div></div>'+
'<span style="font-size:11px;color:var(--text4);white-space:nowrap">'+x.progress+'%</span></div></td></tr>';
});
return html+'</tbody></table></div>';
}
function renderTasks(){
var all=[];
fps().forEach(function(p){if(p.tasks)p.tasks.forEach(function(t){all.push({task:t,proj:p});});});
var shown=all;
if(ST.fstat==='open')shown=all.filter(function(x){return !x.task.done;});
if(ST.fstat==='done2')shown=all.filter(function(x){return x.task.done;});
var html='<div class="page-header"><div class="page-title">All Tasks</div></div>'+
'<div class="task-filters">'+
'<button class="fb'+(ST.fstat==='all'?' active':'')+'" onclick="ST.fstat=\'all\';renderAll()">All</button>'+
'<button class="fb'+(ST.fstat==='open'?' active':'')+'" onclick="ST.fstat=\'open\';renderAll()">Open</button>'+
'<button class="fb'+(ST.fstat==='done2'?' active':'')+'" onclick="ST.fstat=\'done2\';renderAll()">Done</button></div>';
if(!shown.length)return html+'<div class="empty-state"><div class="empty-icon">✓</div><div class="empty-text">No tasks</div></div>';
return html+'<div class="task-list">'+shown.map(function(x){
var t=x.task;var p=x.proj;var e=ge(p.entity);
return '<div class="task-row" onclick="selectProj(\''+p.id+'\')">'+
'<div class="tck'+(t.done?' done':'')+'" onclick="event.stopPropagation();toggleTask(\''+p.id+'\',\''+t.id+'\')">'+(t.done?'✓':'')+'</div>'+
'<span class="ttx'+(t.done?' done':'')+'">'+h(t.title)+'</span>'+
'<span class="tcat">'+h(t.cat||'')+'</span>'+
'<span style="font-size:11px;color:var(--text4)">'+h(p.name)+'</span>'+
'<span class="etag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.short)+'</span></div>';
}).join('')+'</div>';
}
function renderTeam(){
var html='<div class="page-header"><div class="page-title">Team Members</div><button class="tb-btn tb-btn-accent" onclick="openNewMember()">+ Add Member</button></div>';
if(!DB.members.length)return html+'<div class="empty-state"><div class="empty-icon">👥</div><div class="empty-text">No team members yet</div></div>';
return html+'<div class="team-grid">'+DB.members.map(function(m){
var ps=DB.projects.filter(function(p){return p.members&&p.members.indexOf(m.id)>-1;});
var ot=0;ps.forEach(function(p){if(p.tasks)p.tasks.forEach(function(t){if(!t.done&&t.assign===m.id)ot++;});});
var e=ge(m.entity);
return '<div class="mem-card">'+
'<div class="mem-av" style="background:'+m.color+'">'+h(m.initials)+'</div>'+
'<div class="mem-nm">'+h(m.name)+'</div>'+
'<div class="mem-em">'+h(m.email)+'</div>'+
'<div style="font-size:11px;margin-top:2px;color:'+e.color+'">'+h(e.name)+'</div>'+
'<div class="mem-stats"><div class="mst"><div class="mst-v">'+ps.length+'</div><div class="mst-l">Projects</div></div>'+
'<div class="mst"><div class="mst-v">'+ot+'</div><div class="mst-l">Open Tasks</div></div></div></div>';
}).join('')+'</div>';
}
function renderTpls(){
return '<div class="page-header"><div class="page-title">Templates</div></div>'+
'<div class="tpl-grid">'+TEMPLATES.map(function(t){
return '<div class="tpl-card"><div class="tpl-icon">'+t.icon+'</div>'+
'<div class="tpl-name">'+h(t.name)+'</div>'+
'<div class="tpl-desc">'+h(t.desc)+'</div>'+
'<div class="tpl-cnt">'+t.tasks.length+' tasks included</div>'+
'<button class="tpl-btn" onclick="openProjectFromTemplate(\''+t.id+'\')">Use Template</button></div>';
}).join('')+'</div>';
}
function renderSQ(){
var links=[{icon:'🏠',label:'Dashboard',sub:'Main account',url:'https:
var html='<div class="page-header"><div class="page-title">🟦 Squarespace</div></div>'+
'<div class="section-header"><div class="section-title">Quick Access</div></div>'+
'<div class="sq-links">'+links.map(function(l){return '<a href="'+l.url+'" target="_blank" class="sq-link"><div class="sq-li">'+l.icon+'</div><div class="sq-ll">'+l.label+'</div><div class="sq-ls">'+l.sub+'</div></a>';}).join('')+'</div>';
if(!SCRIPT_URL){
html+='<div class="setup-banner">'+
'<strong>⚙️ One-time Google Sheets setup required</strong><br>'+
'To sync data across all computers, you need to connect Google Sheets by setting up a free Google Apps Script.<br><br>'+
'<strong>Step 1:</strong> <a href="https:
'<strong>Step 2:</strong> Delete all existing code and paste the script from the file you downloaded called <strong>ProjectOS-GoogleScript.js</strong><br>'+
'<strong>Step 3:</strong> Click <strong>Deploy → New Deployment → Web App</strong><br>'+
'<strong>Step 4:</strong> Set "Execute as" = <strong>Me</strong> · "Who has access" = <strong>Anyone</strong> → Deploy<br>'+
'<strong>Step 5:</strong> Copy the Web App URL and paste it below:<br><br>'+
'<input id="script-url-input" class="fi" placeholder="https:
'<button class="btn btn-primary" onclick="saveScriptUrl()" style="font-size:12px;padding:6px 14px">Save & Connect</button>'+
'</div>';
} else {
html+='<div style="background:var(--green-light);border:1px solid var(--green);border-radius:var(--radius);padding:16px;font-size:13px;margin-bottom:16px">'+
'<strong style="color:var(--green)">✅ Google Sheets connected</strong><br>'+
'<span style="color:var(--text3);font-size:12px">All data syncs automatically to your shared Google Sheet.</span><br>'+
'<a href="'+SHEET_LINK+'" target="_blank" style="color:var(--accent);font-size:12px">Open Google Sheet →</a></div>'+
'<button class="tb-btn" onclick="resetScriptUrl()" style="font-size:12px">Disconnect / Change Script URL</button>';
}
return html;
}
function saveScriptUrl(){
var inp=document.getElementById('script-url-input');
if(!inp||!inp.value.trim()){alert('Please paste your Google Apps Script URL.');return;}
SCRIPT_URL=inp.value.trim();
localStorage.setItem('pos_script_url',SCRIPT_URL);
toast('Connected! Loading data...','ok');
loadData(function(){renderAll();});
}
function resetScriptUrl(){
if(!confirm('Disconnect Google Sheets? Data stays locally.'))return;
SCRIPT_URL='';localStorage.removeItem('pos_script_url');renderAll();
}
function selectProj(id){
ST.project=id;
var p=gp(id);if(!p)return;
var dp=document.getElementById('detail-panel');
dp.classList.remove('hidden');
renderDetail(p);
}
function renderDetail(p){
var dp=document.getElementById('detail-panel');if(!dp)return;
var e=ge(p.entity);
var tasks=p.tasks||[];var dn=tasks.filter(function(t){return t.done;}).length;
var pct=tasks.length?Math.round(dn/tasks.length*100):0;
var html='<div class="dp-hdr"><div>'+
'<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">'+
'<span class="etag" style="background:'+e.color+'20;color:'+e.color+'">'+h(e.short)+'</span>'+spill(p.status)+
'</div>'+
'<div class="dp-title">'+h(p.name)+'</div>'+
'<div class="dp-meta">Due: '+(p.due||'—')+' · '+p.priority+' priority</div></div>'+
'<button class="dp-close" onclick="closeDetail()">✕</button></div>'+
'<div class="dp-body">'+
'<div class="dp-sec"><div class="dp-sec-title">Progress</div>'+
'<div class="prog-lbl"><span>'+pct+'%</span><span>'+dn+'/'+tasks.length+' tasks</span></div>'+
'<div class="prog-track"><div class="prog-fill" style="width:'+pct+'%"></div></div></div>';
if(p.desc)html+='<div class="dp-sec"><div class="dp-sec-title">Description</div><div style="font-size:13px;color:var(--text2);line-height:1.6">'+h(p.desc)+'</div></div>';
html+='<div class="dp-sec"><div class="dp-sec-title">Status</div>'+
'<select class="st-sel" onchange="updateStatus(\''+p.id+'\',this.value)">'+
['planning','active','hold','risk','done'].map(function(s){return '<option value="'+s+'"'+(p.status===s?' selected':'')+'>'+s.charAt(0).toUpperCase()+s.slice(1)+'</option>';}).join('')+
'</select></div>';
html+='<div class="dp-sec"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">'+
'<div class="dp-sec-title" style="margin:0">Tasks</div>'+
'<button class="btn btn-primary" style="padding:3px 10px;font-size:11px" onclick="openAddTask(\''+p.id+'\')">+ Add</button></div>';
if(!tasks.length){
html+='<div style="padding:12px;text-align:center;color:var(--text4);font-size:12px;border:1px solid var(--border);border-radius:6px">No tasks yet</div>';
}else{
html+=tasks.map(function(t){
var asgn=t.assignees&&t.assignees.length?t.assignees:(t.assign?[t.assign]:[]);
var avs=asgn.map(function(id){var m=gm(id);return '<div class="av" style="background:'+m.color+';width:20px;height:20px;font-size:8px;margin-left:-3px;border:2px solid var(--bg2)" title="'+h(m.name)+'">'+h(m.initials)+'</div>';}).join('');
var names=asgn.map(function(id){return gm(id).name.split(' ')[0];}).join(', ')||'Unassigned';
var dueStr='';
if(t.due){var dd=new Date(t.due);var od=!t.done&&dd<new Date();dueStr='<span class="task-due'+(od?' overdue':'')+'">📅 '+(od?'Overdue · ':'')+t.due+'</span>';}
var prog=t.progress||0;
var pc=t.pri==='high'?'var(--red)':t.pri==='med'?'var(--orange)':'var(--green)';
return '<div class="task-card">'+
'<div class="task-card-top">'+
'<div class="tck'+(t.done?' done':'')+'" onclick="toggleTask(\''+p.id+'\',\''+t.id+'\')">'+
(t.done?'✓':'')+
'</div>'+
'<div class="task-card-body">'+
'<div class="task-card-title'+(t.done?' done':'')+'">'+h(t.title)+'</div>'+
'<div class="task-card-meta">'+
(t.cat?'<span class="tcat">'+h(t.cat)+'</span>':'')+
'<span style="font-size:10px;font-weight:700;color:'+pc+'">'+t.pri.toUpperCase()+'</span>'+
dueStr+
'</div>'+
'<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">'+
'<div class="task-assignees" style="padding-left:4px">'+avs+'</div>'+
'<span style="font-size:11px;color:var(--text3)">'+names+'</span>'+
'</div>'+
'<div class="task-prog-wrap">'+
'<div class="task-prog-track"><div class="task-prog-fill" style="width:'+prog+'%"></div></div>'+
'<input class="task-prog-input" type="number" min="0" max="100" value="'+prog+'" onchange="updateTaskProg(\''+p.id+'\',\''+t.id+'\',this.value)" title="% complete">'+
'<span style="font-size:11px;color:var(--text4)">%</span>'+
'</div>'+
'</div>'+
'</div>'+
'</div>';
}).join('');
}
html+='</div>';
var notes=p.notes||[];
html+='<div class="dp-sec"><div class="dp-sec-title">Notes</div>'+
'<div class="note-list">'+notes.slice().reverse().map(function(n){
return '<div class="note-item"><span class="note-who">'+h(n.who)+'</span><span class="note-when">'+h(n.when)+'</span><div class="note-txt">'+h(n.text)+'</div></div>';
}).join('')+(notes.length===0?'<div style="font-size:12px;color:var(--text4)">No notes yet</div>':'')+'</div>'+
'<textarea class="note-area" id="note-ta-'+p.id+'" placeholder="Add a note..."></textarea>'+
'<button class="btn btn-primary" style="font-size:12px;padding:6px 14px;margin-top:6px" onclick="addNote(\''+p.id+'\')">Add Note</button></div></div>';
dp.innerHTML=html;
}
function exportData(){
var json=JSON.stringify(DB,null,2);
var blob=new Blob([json],{type:'application/json'});
var url=URL.createObjectURL(blob);
var a=document.createElement('a');
a.href=url;
a.download='ProjectOS-backup-'+new Date().toISOString().slice(0,10)+'.json';
a.click();
URL.revokeObjectURL(url);
toast('Data exported as JSON file','ok');
}
function importData(){
var inp=document.createElement('input');
inp.type='file';
inp.accept='.json';
inp.onchange=function(e){
var f=e.target.files[0];if(!f)return;
var r=new FileReader();
r.onload=function(ev){
try{
var parsed=JSON.parse(ev.target.result);
if(!parsed.entities||!parsed.projects){alert('Invalid ProjectOS backup file.');return;}
if(!confirm('This will replace all current data with the imported data. Continue?'))return;
DB=parsed;
mutate();
toast('Data imported successfully','ok');
}catch(e){alert('Could not read file — make sure it is a valid ProjectOS JSON export.');}
};
r.readAsText(f);
};
inp.click();
}
function updateTaskProg(pid,tid,val){
var p=gp(pid);if(!p||!p.tasks)return;
var t=p.tasks.find(function(x){return x.id===tid;});if(!t)return;
t.progress=Math.min(100,Math.max(0,parseInt(val)||0));
if(t.progress===100)t.done=true;
var fill=document.getElementById('tpf-'+tid);if(fill)fill.style.width=t.progress+'%';
var dn=p.tasks.filter(function(x){return x.done||(x.progress||0)===100;}).length;
p.progress=p.tasks.length?Math.round(p.tasks.reduce(function(s,x){return s+(x.progress||0);},0)/p.tasks.length):0;
mutate();
}
function closeDetail(){var dp=document.getElementById('detail-panel');if(dp){dp.classList.add('hidden');dp.innerHTML='';}ST.project=null;}
function toggleTask(pid,tid){
var p=gp(pid);if(!p||!p.tasks)return;
var t=p.tasks.find(function(x){return x.id===tid;});if(!t)return;
t.done=!t.done;
var dn=p.tasks.filter(function(x){return x.done;}).length;
p.progress=p.tasks.length?Math.round(dn/p.tasks.length*100):0;
if(ST.project===pid)renderDetail(p);
mutate();
}
function updateStatus(pid,val){var p=gp(pid);if(!p)return;p.status=val;mutate();}
function addNote(pid){
var p=gp(pid);if(!p)return;
var ta=document.getElementById('note-ta-'+pid);
if(!ta||!ta.value.trim())return;
if(!p.notes)p.notes=[];
p.notes.push({who:'Team',when:new Date().toLocaleString(),text:ta.value.trim()});
renderDetail(p);mutate();toast('Note saved','ok');
}
function delProj(pid){
if(!confirm('Delete this project? Cannot be undone.'))return;
DB.projects=DB.projects.filter(function(p){return p.id!==pid;});
mutate();toast('Deleted','ok');
}
function openNewProject(tplId){
var eo=DB.entities.map(function(e){return '<option value="'+e.id+'">'+h(e.name)+'</option>';}).join('');
var mo=DB.members.map(function(m){return '<option value="'+m.id+'">'+h(m.name)+'</option>';}).join('');
document.getElementById('modal-title').textContent=tplId?'New Project from Template':'New Project';
document.getElementById('modal-body').innerHTML=
'<div class="fr"><label class="fl">Project Name *</label><input class="fi" id="np-nm" placeholder="e.g. Website Redesign"></div>'+
'<div class="fr2">'+
'<div><label class="fl">Entity</label><select class="fs" id="np-ent">'+eo+'</select></div>'+
'<div><label class="fl">Lead</label><select class="fs" id="np-lead">'+mo+'</select></div></div>'+
'<div class="fr2">'+
'<div><label class="fl">Status</label><select class="fs" id="np-stat"><option value="planning">Planning</option><option value="active">Active</option></select></div>'+
'<div><label class="fl">Priority</label><select class="fs" id="np-pri"><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div></div>'+
'<div class="fr2">'+
'<div><label class="fl">Due Date</label><input class="fi" id="np-due" type="date"></div>'+
'<div><label class="fl">Progress %</label><input class="fi" id="np-prog" type="number" min="0" max="100" value="0"></div></div>'+
'<div class="fr"><label class="fl">Description</label><textarea class="fta" id="np-desc" placeholder="Brief description..."></textarea></div>';
document.getElementById('modal-submit').onclick=function(){
var nm=document.getElementById('np-nm').value.trim();
if(!nm){alert('Please enter a project name.');return;}
var tasks=[];
if(tplId){var tpl=TEMPLATES.find(function(t){return t.id===tplId;});if(tpl)tasks=tpl.tasks.map(function(t){return {id:uid(),title:t.title,cat:t.cat,pri:t.pri,done:false,assign:document.getElementById('np-lead').value};});}
DB.projects.push({id:uid(),name:nm,entity:document.getElementById('np-ent').value,status:document.getElementById('np-stat').value,priority:document.getElementById('np-pri').value,progress:parseInt(document.getElementById('np-prog').value)||0,due:document.getElementById('np-due').value||null,lead:document.getElementById('np-lead').value,members:[document.getElementById('np-lead').value],desc:document.getElementById('np-desc').value.trim(),tasks:tasks,notes:[],docs:[]});
closeModal();mutate();toast('Project created & saved','ok');
};
showModal();setTimeout(function(){var el=document.getElementById('np-nm');if(el)el.focus();},80);
}
function openAddTask(pid){
var p=gp(pid);if(!p)return;
var mCBs=DB.members.map(function(m){
return '<label style="display:flex;align-items:center;gap:8px;padding:5px 0;cursor:pointer;font-size:13px;color:var(--text2)">'+
'<input type="checkbox" class="nt-assign-cb" value="'+m.id+'" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer">'+
'<span class="av" style="background:'+m.color+';width:20px;height:20px;font-size:8px;flex-shrink:0">'+h(m.initials)+'</span>'+
h(m.name)+'</label>';
}).join('');
document.getElementById('modal-title').textContent='Add Task';
document.getElementById('modal-body').innerHTML=
'<div class="fr"><label class="fl">Task Title *</label><input class="fi" id="nt-title" placeholder="e.g. Write homepage copy"></div>'+
'<div class="fr2">'+
'<div><label class="fl">Category</label><input class="fi" id="nt-cat" placeholder="e.g. Design"></div>'+
'<div><label class="fl">Priority</label><select class="fs" id="nt-pri"><option value="high">High</option><option value="med">Medium</option><option value="low">Low</option></select></div>'+
'</div>'+
'<div class="fr2">'+
'<div><label class="fl">Deadline</label><input class="fi" id="nt-due" type="date"></div>'+
'<div><label class="fl">Est. Hours</label><input class="fi" id="nt-hrs" type="number" min="0" placeholder="e.g. 4"></div>'+
'</div>'+
'<div class="fr"><label class="fl">Assign To (select all responsible)</label>'+
'<div style="border:1px solid var(--border2);border-radius:6px;padding:8px 12px;background:var(--bg);max-height:160px;overflow-y:auto">'+mCBs+'</div></div>'+
'<div class="fr"><label class="fl">Notes</label><textarea class="fta" id="nt-notes" placeholder="Any details..." style="min-height:50px"></textarea></div>';
document.getElementById('modal-submit').onclick=function(){
var title=document.getElementById('nt-title').value.trim();
if(!title){alert('Please enter a task title.');return;}
var cbs=document.querySelectorAll('.nt-assign-cb:checked');
var assignees=Array.prototype.slice.call(cbs).map(function(cb){return cb.value;});
if(!p.tasks)p.tasks=[];
p.tasks.push({
id:uid(),
title:title,
cat:document.getElementById('nt-cat').value.trim(),
pri:document.getElementById('nt-pri').value,
due:document.getElementById('nt-due').value||null,
hrs:document.getElementById('nt-hrs').value||null,
notes:document.getElementById('nt-notes').value.trim(),
done:false,
progress:0,
assignees:assignees
});
closeModal();if(ST.project===pid)renderDetail(p);mutate();toast('Task added & saved','ok');
};
showModal();
}
function openNewMember(){
var eoCBs=DB.entities.map(function(e){
return '<label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:13px;color:var(--text2)">'+
'<input type="checkbox" class="nm-ent-cb" value="'+e.id+'" style="width:15px;height:15px;accent-color:var(--accent);cursor:pointer">'+
'<span class="av" style="background:'+e.color+';width:20px;height:20px;font-size:8px;flex-shrink:0">'+h(e.short)+'</span>'+
h(e.name)+'</label>';
}).join('');
document.getElementById('modal-title').textContent='Add Team Member';
document.getElementById('modal-body').innerHTML=
'<div class="fr"><label class="fl">Full Name *</label><input class="fi" id="nm-nm" placeholder="e.g. Sam Jones"></div>'+
'<div class="fr"><label class="fl">Email</label><input class="fi" id="nm-em" type="email" placeholder="sam@company.com"></div>'+
'<div class="fr"><label class="fl">Entities (select all that apply)</label>'+
'<div style="border:1px solid var(--border2);border-radius:6px;padding:8px 12px;background:var(--bg);max-height:160px;overflow-y:auto">'+eoCBs+'</div></div>'+
'<div class="fr"><label class="fl">Colour</label><div class="color-opts" id="cop">'+
COLORS.map(function(c,i){return '<div class="co'+(i===0?' sel':'')+'" style="background:'+c+'" onclick="pickCol(this,\''+c+'\')"></div>';}).join('')+'</div></div>';
window._col=COLORS[0];
document.getElementById('modal-submit').onclick=function(){
var nm=document.getElementById('nm-nm').value.trim();if(!nm){alert('Please enter a name.');return;}
var cbs=document.querySelectorAll('.nm-ent-cb:checked');
var entities=Array.prototype.slice.call(cbs).map(function(cb){return cb.value;});
if(!entities.length){alert('Please select at least one entity.');return;}
var ini=nm.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
DB.members.push({id:uid(),name:nm,email:document.getElementById('nm-em').value.trim(),entities:entities,color:window._col||COLORS[0],initials:ini});
closeModal();mutate();toast('Member added & saved','ok');
};
showModal();
}
function openNewEntity(){
document.getElementById('modal-title').textContent='Add Entity';
document.getElementById('modal-body').innerHTML=
'<div class="fr"><label class="fl">Entity Name *</label><input class="fi" id="ne-nm" placeholder="e.g. Coastal Holdings"></div>'+
'<div class="fr"><label class="fl">Short Code (2-3 letters)</label><input class="fi" id="ne-sh" placeholder="e.g. CH" maxlength="3" style="text-transform:uppercase"></div>'+
'<div class="fr"><label class="fl">Colour</label><div class="color-opts" id="cop">'+
COLORS.map(function(c,i){return '<div class="co'+(i===0?' sel':'')+'" style="background:'+c+'" onclick="pickCol(this,\''+c+'\')"></div>';}).join('')+'</div></div>';
window._col=COLORS[0];
document.getElementById('modal-submit').onclick=function(){
var nm=document.getElementById('ne-nm').value.trim();if(!nm){alert('Please enter a name.');return;}
var sh=(document.getElementById('ne-sh').value.trim().toUpperCase()||nm.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase());
DB.entities.push({id:uid(),name:nm,short:sh,color:window._col||COLORS[0]});
closeModal();mutate();toast('Entity added & saved','ok');
};
showModal();
}
function openProjectFromTemplate(id){openNewProject(id);}
function pickCol(el,c){window._col=c;document.querySelectorAll('.co').forEach(function(d){d.classList.remove('sel');});el.classList.add('sel');}
function showModal(){document.getElementById('modal-overlay').classList.add('show');}
function closeModal(){document.getElementById('modal-overlay').classList.remove('show');}
function closeModalOvl(e){if(e.target===document.getElementById('modal-overlay'))closeModal();}
function toast(msg,type){
var t=document.getElementById('toast');
t.textContent=msg;
t.style.background=type==='ok'?'#22c55e':type==='err'?'#ef4444':'#111827';
t.classList.add('show');
setTimeout(function(){t.classList.remove('show');},3000);
}
(function(){
var inEd=(window.self!==window.top||document.body.classList.contains('sqs-edit-mode-active')||document.body.classList.contains('sqs-edit-mode')||window.location.href.indexOf('/config/')>-1||window.location.search.indexOf('editMode')>-1);
if(inEd)return;
var r=document.getElementById('pos-root');
if(r&&r.parentNode!==document.body)document.body.appendChild(r);
r.style.setProperty('position','fixed','important');
r.style.setProperty('top','0','important');
r.style.setProperty('left','0','important');
r.style.setProperty('right','0','important');
r.style.setProperty('bottom','0','important');
r.style.setProperty('width','100vw','important');
r.style.setProperty('height','100vh','important');
r.style.setProperty('z-index','2147483647','important');
function hc(){['header','footer','nav','.Header','.Footer','#header','#footer','.site-header','.site-footer','.sqs-announcement-bar','.sqs-announcement-bar-dropzone','[data-section-theme]','.header-nav','.page-section','.index-section','.sections'].forEach(function(s){document.querySelectorAll(s).forEach(function(el){if(!el.closest('#pos-root'))el.style.setProperty('display','none','important');});});}
hc();setTimeout(hc,500);setTimeout(hc,1500);
})();
try {
var backup = localStorage.getItem('pos_db');
if(backup) { DB = JSON.parse(backup); } else { defaults(); }
} catch(e) { defaults(); }
renderAll();
setTimeout(function(){
if(!SCRIPT_URL) return;
setSS('syncing','Syncing...');
fetch(SCRIPT_URL + '?t=' + Date.now())
.then(function(r){ return r.json(); })
.then(function(res){
if(res.ok && res.data && res.data.projects){
DB = res.data;
localSave();
setSS('ok','Synced ' + new Date().toLocaleTimeString());
renderAll();
} else { setSS('ok','Local data'); }
})
.catch(function(){ setSS('error','Offline'); });
}, 2000);