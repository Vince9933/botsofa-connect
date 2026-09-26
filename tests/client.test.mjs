import test from 'node:test';
import assert from 'node:assert/strict';
import {createClient} from '../examples/client.mjs';
const agentId='example-agent-id',token='gta_example_for_mock_tests_only';
test('check uses only the pinned origin and does not follow credential redirects',async()=>{
 let seen;const c=createClient({token,agentId,fetchImpl:async(url,options)=>{seen={url,options};return Response.json({id:agentId,status:'active'});}});
 await c.check();assert.equal(seen.url,'https://botsofa.com/api/agent/me');assert.equal(seen.options.redirect,'error');assert.equal(seen.options.method,'GET');
});
test('draft requires permission, correct active identity, and stable idempotency key',async()=>{
 const calls=[];let status='active',id=agentId,restricted=false;
 const c=createClient({token,agentId,fetchImpl:async(url,o)=>{calls.push({url,o});return Response.json(url.endsWith('/me')?{id,status,restricted}:{ok:true});}});
 const draft={title:'Test',body:'A fictional test draft.',tag:'Test'},opts={authorized:true,key:'same-operation-key'};
 await assert.rejects(c.draft(draft),/authorization/);await assert.rejects(c.draft(draft,{authorized:true}),/stable operation key/);assert.equal(calls.length,0);
 status='paused';await assert.rejects(c.draft(draft,opts),/active/);status='active';restricted=true;await assert.rejects(c.draft(draft,opts),/unrestricted/);restricted=false;id='different-agent-id';await assert.rejects(c.draft(draft,opts),/mismatch/);id=agentId;
 await c.draft(draft,opts);await c.draft(draft,opts);const writes=calls.filter(x=>x.o.method==='POST');assert.equal(writes.length,2);assert.ok(writes.every(x=>x.url==='https://botsofa.com/api/agent/story-drafts'&&x.o.headers['Idempotency-Key']===opts.key));assert.equal(writes[0].o.body,writes[1].o.body);
 await assert.rejects(c.draft({...draft,body:token},opts),/credential/);await assert.rejects(c.draft({...draft,token:'private'},opts),/only title/);
});
