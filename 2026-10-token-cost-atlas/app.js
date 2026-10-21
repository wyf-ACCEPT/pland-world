const models = [
  {provider:"OpenAI",name:"GPT-6 Astra",tier:"旗舰",input:10,output:50,margin:.4,source:"https://developers.openai.com/api/docs/pricing"},
  {provider:"OpenAI",name:"GPT-6.1 Sol",tier:"主流",input:2,output:10,margin:.4,source:"https://developers.openai.com/api/docs/pricing"},
  {provider:"OpenAI",name:"GPT-6 Luna",tier:"轻量",input:.1,output:.5,margin:.4,source:"https://developers.openai.com/api/docs/pricing"},
  {provider:"Google",name:"Gemini 4 Argon",tier:"旗舰 · 促销",input:2,output:10,margin:.4,source:"https://ai.google.dev/gemini-api/docs/pricing",promo:true,promoUntil:"2026-11-30"},
  {provider:"Google",name:"Gemini 3.8 Flash",tier:"主流 · 促销",input:.75,output:3.75,margin:.4,source:"https://ai.google.dev/gemini-api/docs/pricing",promo:true,promoUntil:"2026-12-31"},
  {provider:"Google",name:"Gemini 3.5 Flash-Lite",tier:"轻量",input:.3,output:2.5,margin:.4,source:"https://ai.google.dev/gemini-api/docs/pricing"},
  {provider:"Anthropic",name:"Claude Fable 5.1",tier:"旗舰",input:10,output:50,margin:.4,source:"https://platform.claude.com/docs/en/about-claude/pricing"},
  {provider:"Anthropic",name:"Claude Opus 5.5",tier:"高端",input:4,output:20,margin:.4,source:"https://platform.claude.com/docs/en/about-claude/pricing"},
  {provider:"Anthropic",name:"Claude Sonnet 5.5",tier:"主流",input:2,output:10,margin:.4,source:"https://platform.claude.com/docs/en/about-claude/pricing"},
  {provider:"Anthropic",name:"Claude Haiku 5.5",tier:"轻量",input:.1,output:.5,margin:.4,source:"https://platform.claude.com/docs/en/about-claude/pricing"},
  {provider:"DeepSeek",name:"V4 Pro · 离峰",tier:"高端",input:.66,output:1.98,margin:.2,source:"https://api-docs.deepseek.com/quick_start/pricing/",size:"1,600B",active:"49B 激活"},
  {provider:"DeepSeek",name:"V4.1 Flash · 离峰",tier:"轻量",input:.15,output:.6,margin:.2,source:"https://api-docs.deepseek.com/quick_start/pricing/",size:"552B＋196B",active:"8B 入 / 16B 出"}
];
const scenarios=[
  {key:"balanced",label:"1K 输入 / 1K 输出",input:1,output:1},
  {key:"longout",label:"1K 输入 / 10K 输出",input:1,output:10},
  {key:"longin",label:"10K 输入 / 1K 输出",input:10,output:1}
];
const blended=(m,s)=>(m.input*s.input+m.output*s.output)/(s.input+s.output);
const format=n=>"$"+(n>=10?n.toFixed(2):n.toFixed(3)).replace(/\.?0+$/,"");
const providerClass=p=>p==="DeepSeek"?"deepseek":p==="OpenAI"?"openai":p==="Google"?"google":"anthropic";
const modelCell=m=>`<div class="model-name"><span class="provider-mark ${providerClass(m.provider)}">${m.provider.slice(0,1)}</span><div><strong>${m.name}</strong><small>${m.provider} · <a href="${m.source}" target="_blank" rel="noopener noreferrer">官方价目 ↗</a></small></div></div>`;
const sizeCell=m=>m.size?`<div class="size-disclosed"><strong>${m.size}</strong><small>${m.active}</small></div>`:`<span class="size-undisclosed" title="该具体版本的官方资料未披露总参数或每 token 激活参数">未披露</span>`;
const heatCell=(value,group,kind="")=>`<td class="number heat-cell ${kind}" data-heat-group="${group}" data-heat-value="${value}">${format(value)}</td>`;
const rowPrice=m=>`<tr class="${m.provider==="DeepSeek"?"deepseek-row":""}"><td>${modelCell(m)}</td><td><span class="tier ${m.promo?"is-promo":""}">${m.tier}</span></td><td>${sizeCell(m)}</td>${heatCell(m.input,"price-input")}${heatCell(m.output,"price-output")}${scenarios.map(s=>heatCell(blended(m,s),"price-"+s.key,"result")).join("")}</tr>`;
const rowCost=m=>`<tr class="${m.provider==="DeepSeek"?"deepseek-row":""}"><td>${modelCell(m)}</td><td><span class="margin-label">${Math.round(m.margin*100)}% 假设</span></td><td>${sizeCell(m)}</td>${scenarios.map(s=>heatCell(blended(m,s)*(1-m.margin),"cost-"+s.key,"cost-result")).join("")}</tr>`;
const colorStops=[[33,77,67],[43,53,65],[107,65,52]];
function heatColor(t){
  const x=Math.max(0,Math.min(1,t))*2;
  const i=Math.min(1,Math.floor(x));
  const f=x-i;
  return "rgb("+colorStops[i].map((v,k)=>Math.round(v+(colorStops[i+1][k]-v)*f)).join(",")+")";
}
function paintHeat(root=document){
  const groups=new Map();
  root.querySelectorAll("[data-heat-group]").forEach(cell=>{
    const key=cell.dataset.heatGroup;
    if(!groups.has(key))groups.set(key,[]);
    groups.get(key).push(cell);
  });
  groups.forEach((cells,key)=>{
    const values=cells.map(c=>Number(c.dataset.heatValue));
    const low=Math.min(...values),high=Math.max(...values);
    cells.forEach((cell,i)=>{
      const t=high===low ? 0.5 : (Math.log1p(values[i])-Math.log1p(low))/(Math.log1p(high)-Math.log1p(low));
      cell.style.setProperty("--heat-bg",heatColor(key==="hardware-tps"?1-t:t));
    });
  });
}
function renderPrice(sortKey,ascending=true){
  const displayed=[...models];
  if(sortKey){const s=scenarios.find(x=>x.key===sortKey);displayed.sort((a,b)=>(blended(a,s)-blended(b,s))*(ascending?1:-1));}
  document.getElementById("price-body").innerHTML=displayed.map(rowPrice).join("");
  paintHeat(document.getElementById("price-table"));
}
document.getElementById("cost-body").innerHTML=models.map(rowCost).join("");
paintHeat(document.getElementById("cost-table"));
document.getElementById("deepseek-body").innerHTML=models.filter(m=>m.provider==="DeepSeek").flatMap(m=>scenarios.map(s=>{
  const price=blended(m,s);
  return `<tr><td><strong>${m.name}</strong><small>${s.label}</small></td>${heatCell(price,"ds-price")}${heatCell(price*.8,"ds-thin")}${heatCell(price*.171,"ds-media","alternate")}</tr>`;
})).join("");
paintHeat(document.querySelector(".scenario-box table"));
renderPrice();
let activeSort=null,ascending=true;
document.querySelectorAll("[data-sort]").forEach(button=>button.addEventListener("click",()=>{
  const key=button.dataset.sort;
  ascending=activeSort===key?!ascending:true;
  activeSort=key;
  renderPrice(key,ascending);
  document.querySelectorAll("[data-sort]").forEach(b=>b.parentElement.setAttribute("aria-sort",b===button?(ascending?"ascending":"descending"):"none"));
}));
const sections=[...document.querySelectorAll("main section[id]")];
const navLinks=[...document.querySelectorAll(".rail nav a")];
const observer=new IntersectionObserver(entries=>{
  entries.filter(e=>e.isIntersecting).forEach(e=>{
    const target=["cost","deepseek"].includes(e.target.id)?"pricing":e.target.id;
    navLinks.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+target));
  });
},{rootMargin:"-25% 0px -65% 0px"});
sections.forEach(section=>observer.observe(section));

const hardwareModels=[
  {name:"GPT-OSS-120B",size:"117B 总 / 5.1B 激活",shape:"约 5K 输入 / 1.25K 输出",tps:90204.71,source:"https://raw.githubusercontent.com/mlcommons/inference_results_v6.1/main/closed/CoreWeave/results/B200-SXM-180GBx8_TRT/gpt-oss-120b/Server/performance/run_1/mlperf_log_summary.txt",currentApi:{input:.03,output:.17,source:"https://coreweave.com/forge-pricing/inference-agents"}},
  {name:"DeepSeek-R1 原版",size:"671B 总 / 37B 激活",shape:"约 0.8K 输入 / 3.88K 输出",tps:56121.33,source:"https://raw.githubusercontent.com/mlcommons/inference_results_v6.1/main/closed/CoreWeave/results/B200-SXM-180GBx8_TRT/deepseek-r1/Server/performance/run_1/mlperf_log_summary.txt",historicalApi:{input:.55,output:2.19,source:"https://api-docs.deepseek.com/news/news250120/"}},
  {name:"Llama 2 70B",size:"70B dense",shape:"OpenOrca；输入输出长度可变",tps:102397.63,source:"https://raw.githubusercontent.com/mlcommons/inference_results_v6.1/main/closed/CoreWeave/results/B200-SXM-180GBx8_TRT/llama2-70b-99.9/Server/performance/run_1/mlperf_log_summary.txt"}
];
const atlasDedicated=[
  {name:"Groq LPU / GPT-OSS-120B",input:.15,output:.60,basis:"开发者 API · 输入 $0.15 / 输出 $0.60",source:"https://console.groq.com/docs/models",note:"公开售价；单用户速度并非整机聚合吞吐"},
  {name:"Cerebras / GPT-OSS-120B",input:.35,output:.75,basis:"Developer API · 输入 $0.35 / 输出 $0.75",source:"https://www.cerebras.ai/pricing",note:"探索档价格；生产容量需询价"}
];
const atlasNebius=[
  {name:"Nebius 8×B200 / Llama 2 70B",hourly:68,tps:101610.58,precision:"FP4",source:"https://raw.githubusercontent.com/mlcommons/inference_results_v5.1/main/closed/Nebius/results/B200-SXM-180GBx8_TRT/llama2-70b-99.9/Server/performance/run_1/mlperf_log_summary.txt"},
  {name:"Nebius 8×H200 / Llama 2 70B",hourly:43.2,tps:34029.38,precision:"FP8",source:"https://raw.githubusercontent.com/mlcommons/inference_results_v5.1/main/closed/Nebius/results/H200-SXM-141GBx8_TRT/llama2-70b-99.9/Server/performance/run_1/mlperf_log_summary.txt"}
];
const atlasTPU=[
  {name:"Google TPU v5e / Llama 2 70B",tps:1510,source:"https://cloud.google.com/blog/products/ai-machine-learning/hex-llm-on-tpus-in-vertex-ai-model-garden/"},
  {name:"Google TPU v5e / Gemma 7B",tps:6250,source:"https://cloud.google.com/blog/products/ai-machine-learning/hex-llm-on-tpus-in-vertex-ai-model-garden/"}
];
let atlasScenarioKey="balanced";
let atlasFilterKey="all";
let atlasSortKey="tier-desc";
let currentHardwareHourly=null;
const atlasLink=(url,label)=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${label} ↗</a>`;
const atlasValue=(value,group,detail,kind="",digits=null)=>{
  if(value===null||value===undefined)return `<td class="atlas-empty">—</td>`;
  const amount=digits===null?format(value):money(value,digits);
  return `<td class="atlas-amount heat-cell ${kind}" data-heat-group="${group}" data-heat-value="${value}"><strong>${amount}</strong><small>${detail}</small></td>`;
};
const atlasApiRow=(m,s)=>{
  const price=blended(m,s),cost=price*(1-m.margin);
  const priceDetail=m.provider==="DeepSeek"?"离峰 · 峰时 "+format(price*2):m.promo?"促销至 "+m.promoUntil+" · 之后 "+format(price*2):"标准按量价";
  const costDetail=m.provider==="DeepSeek"?"20% 毛利假设 · 82.9% 情景 "+format(price*.171):"40% 毛利假设";
  const flag=m.promo?"限时促销":m.provider==="DeepSeek"?"峰谷价":"标准价";
  return `<tr><td class="atlas-entity"><strong>${m.name}</strong><small>${m.provider} · ${m.tier}</small></td><td class="atlas-base"><b>输入 ${format(m.input)} / 输出 ${format(m.output)}</b><small>USD / M，各自计费</small></td>${atlasValue(price,"atlas-api",priceDetail)}${atlasValue(cost,"atlas-inferred",costDetail,"atlas-assumption")}${atlasValue(null)}${atlasValue(null)}<td class="atlas-evidence"><span class="atlas-pill official">官方 API</span><span class="atlas-pill assumption">毛利假设</span>${m.promo||m.provider==="DeepSeek"?`<span class="atlas-pill variable">${flag}</span>`:""}<small>${atlasLink(m.source,"价目")}</small></td></tr>`;
};
const atlasGpuRow=(m,hourly,s)=>{
  const cloud=68.8e6/(m.tps*3600);
  const owned=hourly===null?null:hourly*1e6/(m.tps*3600);
  const reference=m.currentApi||m.historicalApi;
  const historical=!!m.historicalApi;
  const apiDetail=historical?"2025-01-20 历史发售价 · 已退役":reference?"CoreWeave 现售 API · 基准形状另算":"";
  const apiValue=reference?atlasValue(blended(reference,s),"atlas-api",apiDetail,historical?"atlas-variable":""):atlasValue(null);
  return `<tr class="${historical?"atlas-historic-row":""}"><td class="atlas-entity"><strong>8×B200 / ${m.name}</strong><small>CoreWeave · MLPerf v6.1</small><small>${m.size}</small></td><td class="atlas-base"><b>云 $68.80 / 八卡小时</b><small>购 $390,703.50 / 台 · Exxact</small>${reference?`<small>${historical?"R1 历史":"CoreWeave 现售"} API：入 ${format(reference.input)} / 出 ${format(reference.output)}</small>`:""}</td>${apiValue}${atlasValue(null)}${atlasValue(cloud,"atlas-cloud","同商公开价 × 原始日志","",3)}${atlasValue(owned,"atlas-owned","跨商购价＋融资／托管试算 *","atlas-assumption",4)}<td class="atlas-evidence"><span class="atlas-pill computed">MLPerf 有效</span><span class="atlas-pill assumption">自有跨商</span>${reference?`<span class="atlas-pill ${historical?"variable":"official"}">${historical?"历史价 · 2025-01-20":"同模型同商 API"}</span>`:""}<small>${atlasLink(m.source,"日志")}${reference?" · "+atlasLink(reference.source,historical?"历史价":"API 价"):""}</small></td></tr>`;
};
const atlasNebiusRow=m=>{
  const cloud=m.hourly*1e6/(m.tps*3600);
  return `<tr><td class="atlas-entity"><strong>${m.name}</strong><small>MLPerf v5.1 · ${m.precision}</small></td><td class="atlas-base"><b>云 ${money(m.hourly)} / 八卡小时</b><small>Nebius 当前按需价</small></td>${atlasValue(null)}${atlasValue(null)}${atlasValue(cloud,"atlas-cloud","历史基准 × 当前价","atlas-variable",3)}${atlasValue(null)}<td class="atlas-evidence"><span class="atlas-pill computed">MLPerf 有效</span><span class="atlas-pill variable">跨日期</span><small>${atlasLink("https://nebius.com/prices","价目")} · ${atlasLink(m.source,"日志")}</small></td></tr>`;
};
const atlasDedicatedRow=(m,s)=>{
  const price=(m.input*s.input+m.output*s.output)/(s.input+s.output);
  return `<tr><td class="atlas-entity"><strong>${m.name}</strong><small>专用推理平台 API</small></td><td class="atlas-base"><b>输入 ${format(m.input)} / 输出 ${format(m.output)}</b><small>USD / M，各自计费</small></td>${atlasValue(price,"atlas-api","开发者 API 报价")}${atlasValue(null)}${atlasValue(null)}${atlasValue(null)}<td class="atlas-evidence"><span class="atlas-pill official">官方 API</span><span class="atlas-pill variable">整机成本缺口</span><small>${m.note} · ${atlasLink(m.source,"来源")}</small></td></tr>`;
};
const atlasTpuRow=m=>{
  const cloud=9.6e6/(m.tps*3600);
  return `<tr><td class="atlas-entity"><strong>${m.name}</strong><small>8 芯 · Google Hex-LLM</small></td><td class="atlas-base"><b>云 $9.60 / 八芯小时</b><small>TPU v5e 美国区域按需价</small></td>${atlasValue(null)}${atlasValue(null)}${atlasValue(cloud,"atlas-cloud","历史峰值 × 当前价","atlas-variable",3)}${atlasValue(null)}<td class="atlas-evidence"><span class="atlas-pill computed">聚合吞吐</span><span class="atlas-pill variable">跨日期</span><small>${atlasLink("https://cloud.google.com/tpu/pricing","价目")} · ${atlasLink(m.source,"测试")}</small></td></tr>`;
};
function renderAtlas(hourly=currentHardwareHourly){
  const body=document.getElementById("atlas-body");
  const s=scenarios.find(x=>x.key===atlasScenarioKey);
  const show=type=>atlasFilterKey==="all"||atlasFilterKey===type;
  const tierRank=m=>m.tier.includes("旗舰")?0:m.tier.includes("高端")?1:m.tier.includes("主流")?2:3;
  const sortedModels=[...models];
  if(atlasSortKey==="tier-desc")sortedModels.sort((a,b)=>tierRank(a)-tierRank(b)||blended(b,s)-blended(a,s));
  if(atlasSortKey==="tier-asc")sortedModels.sort((a,b)=>tierRank(b)-tierRank(a)||blended(a,s)-blended(b,s));
  if(atlasSortKey==="price-desc")sortedModels.sort((a,b)=>blended(b,s)-blended(a,s));
  if(atlasSortKey==="price-asc")sortedModels.sort((a,b)=>blended(a,s)-blended(b,s));
  const band=(label,detail)=>`<tr class="atlas-band"><th scope="rowgroup" colspan="7">${label}<small>${detail}</small></th></tr>`;
  let html="";
  if(show("api"))html+=band("A / 模型 API 服务","客户售价可核查 · 成本为毛利假设")+sortedModels.map(m=>atlasApiRow(m,s)).join("");
  if(show("gpu"))html+=band("B / GPU 云租与自有整机","GPT-OSS 现售 API、R1 历史 API 同行展示；硬件列为 USD / M 输出 token")+hardwareModels.map(m=>atlasGpuRow(m,hourly,s)).join("")+atlasNebius.map(atlasNebiusRow).join("");
  if(show("special"))html+=band("C / 专用推理平台","API 售价与芯片租金按各自可得资料展示")+atlasDedicated.map(m=>atlasDedicatedRow(m,s)).join("")+atlasTPU.map(atlasTpuRow).join("");
  body.innerHTML=html;
  paintHeat(document.getElementById("atlas-table"));
}
document.querySelectorAll("[data-atlas-scenario]").forEach(button=>button.addEventListener("click",()=>{
  atlasScenarioKey=button.dataset.atlasScenario;
  document.querySelectorAll("[data-atlas-scenario]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
  renderAtlas();
}));
document.querySelectorAll("[data-atlas-filter]").forEach(button=>button.addEventListener("click",()=>{
  atlasFilterKey=button.dataset.atlasFilter;
  document.querySelectorAll("[data-atlas-filter]").forEach(b=>b.setAttribute("aria-pressed",String(b===button)));
  renderAtlas();
}));
document.getElementById("atlas-sort").addEventListener("change",event=>{
  atlasSortKey=event.target.value;
  renderAtlas();
});
const hardwareIds=["purchase","life","power","pue","electricity","capital","colo","other"];
function money(n,digits=2){return "$"+n.toFixed(digits);}
function renderHardware(){
  const values=Object.fromEntries(hardwareIds.map(id=>[id,Number(document.getElementById("hardware-"+id).value)]));
  const valid=values.purchase>0&&values.life>0&&values.power>=0&&values.pue>=1&&values.electricity>=0&&values.capital>=0&&values.colo>=0&&values.other>=0&&Object.values(values).every(Number.isFinite);
  document.getElementById("hardware-error").textContent=valid?"":"请输入有效的非负数；购价与寿命必须大于零，PUE 至少为 1。";
  if(!valid){
    ["hourly","depreciation","energy","colo-cost","overhead","power-share"].forEach(id=>document.getElementById("hardware-"+id).textContent="—");
    ["owned","hourly","own-value","own-share"].forEach(id=>document.getElementById("bridge-"+id).textContent="—");
    document.getElementById("bridge-own-bar").style.setProperty("--bar","0%");
    document.getElementById("hardware-body").innerHTML="";
    currentHardwareHourly=null;
    renderAtlas(null);
    return;
  }
  const capitalRate=values.capital/100;
  const capitalRecovery=capitalRate===0?1/values.life:capitalRate/(1-Math.pow(1+capitalRate,-values.life));
  const depreciation=values.purchase*capitalRecovery/8760;
  const energy=values.power*values.pue*values.electricity;
  const colocation=values.power*values.colo/730;
  const hourly=depreciation+energy+colocation+values.other;
  currentHardwareHourly=hourly;
  document.getElementById("hardware-hourly").innerHTML=money(hourly)+"<span>/小时</span>";
  document.getElementById("hardware-depreciation").textContent=money(depreciation)+"/h";
  document.getElementById("hardware-energy").textContent=money(energy)+"/h";
  document.getElementById("hardware-colo-cost").textContent=money(colocation)+"/h";
  document.getElementById("hardware-overhead").textContent=money(values.other)+"/h";
  document.getElementById("hardware-power-share").textContent=(energy/hourly*100).toFixed(1)+"%";
  const bridgeOwned=hourly*1e6/(hardwareModels[0].tps*3600);
  document.getElementById("bridge-owned").textContent=money(bridgeOwned,4)+"/M 输出";
  document.getElementById("bridge-hourly").textContent=money(hourly);
  document.getElementById("bridge-own-value").textContent=money(bridgeOwned,4);
  document.getElementById("bridge-own-share").textContent=((1-bridgeOwned/.29)*100).toFixed(1)+"%";
  document.getElementById("bridge-own-bar").style.setProperty("--bar",Math.min(100,Math.max(0,bridgeOwned/.29*100)).toFixed(1)+"%");
  document.getElementById("hardware-body").innerHTML=hardwareModels.map(m=>{
    const millionPerHour=m.tps*3600/1e6;
    const cloud=68.8/millionPerHour;
    const owned=hourly/millionPerHour;
    return `<tr><td><div class="hardware-model"><strong>${m.name}</strong><small>${m.shape}</small></div></td><td class="model-size-inline">${m.size}</td><td class="number heat-cell" data-heat-group="hardware-tps" data-heat-value="${m.tps}">${m.tps.toLocaleString("en-US",{maximumFractionDigits:0})}</td><td class="number heat-cell" data-heat-group="hardware-cloud" data-heat-value="${cloud}">${money(cloud,3)}</td><td class="number heat-cell cost-result" data-heat-group="hardware-owned" data-heat-value="${owned}">${money(owned,4)}</td><td><a href="${m.source}" target="_blank" rel="noopener noreferrer">日志 ↗</a></td></tr>`;
  }).join("");
  paintHeat(document.getElementById("hardware-table"));
  renderAtlas(hourly);
}
hardwareIds.forEach(id=>document.getElementById("hardware-"+id).addEventListener("input",renderHardware));
renderHardware();
paintHeat(document.querySelector(".specialized-section table"));
