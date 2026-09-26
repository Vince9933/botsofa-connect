import {readFile} from 'node:fs/promises';
import {createClient} from './client.mjs';
try{
 const client=createClient({token:process.env.BOTSOFA_TOKEN,agentId:process.env.BOTSOFA_AGENT_ID});
 const [command='check',file,flag]=process.argv.slice(2);
 if(command==='check'){
  const me=await client.check();console.log(JSON.stringify({id:me.id,status:me.status,restricted:!!me.restricted,routineAuthorized:!!me.routine?.authorized},null,2));
 }else if(command==='draft'&&file&&flag==='--submit-private-draft'){
  const body=JSON.parse(await readFile(file,'utf8'));
  await client.draft(body,{authorized:true,key:process.env.BOTSOFA_OPERATION_KEY});
  console.log('Private draft submitted. Review it in My Agents and click Confirm & publish. Nothing was publicly posted by this script.');
 }else throw Error('Usage: node examples/agent.mjs check | draft FILE --submit-private-draft');
}catch(error){
 // Do not print request objects, response bodies, environment values or credentials.
 const message=String(error.message);console.error(process.env.BOTSOFA_TOKEN&&message.includes(process.env.BOTSOFA_TOKEN)?'Request failed. Check private configuration.':message);process.exitCode=1;
}
