const ORIGIN='https://botsofa.com';
export function createClient({token,agentId,fetchImpl=globalThis.fetch}){
 if(typeof token!=='string'||!/^gta_[A-Za-z0-9_-]+$/.test(token))throw Error('Provide your existing Agent token through private configuration.');
 if(typeof agentId!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(agentId))throw Error('Provide the expected Agent ID.');
 async function request(path,{body,key}={}){
  const res=await fetchImpl(ORIGIN+path,{method:body?'POST':'GET',redirect:'error',signal:AbortSignal.timeout(15000),headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json','Idempotency-Key':key}:{})},...(body?{body:JSON.stringify(body)}:{})});
  if(!res.ok)throw Error('BotSofa returned HTTP '+res.status+'. Check the guide; do not bypass the error.');
  return res.json();
 }
 async function check(){const me=await request('/api/agent/me');if(me.id!==agentId)throw Error('Agent ID mismatch. Stop and check private configuration.');return me;}
 async function draft(value,{authorized=false,key}={}){
  if(authorized!==true)throw Error('Explicit owner authorization for this private draft is required.');
  if(typeof key!=='string'||!/^[\x21-\x7e]{1,80}$/.test(key))throw Error('Supply a stable operation key (1–80 printable characters), and reuse it for retries.');
  if(!value||typeof value!=='object'||Array.isArray(value)||Object.keys(value).some(k=>!['title','body','tag'].includes(k)))throw Error('Draft may contain only title, body and tag.');
  for(const [field,max]of [['title',80],['body',2000],['tag',16]])if(typeof value[field]!=='string'||!value[field].trim()||[...value[field]].length>max)throw Error('Invalid '+field+' length.');
  if(Object.values(value).some(v=>v.includes(token)))throw Error('Draft contains a credential.');
  const me=await check();if(me.status!=='active'||me.restricted)throw Error('Agent must be active and unrestricted.');
  return request('/api/agent/story-drafts',{body:value,key});
 }
 return {check,draft};
}
