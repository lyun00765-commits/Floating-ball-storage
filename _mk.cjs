const fs=require('fs'),{execSync}=require('child_process'),{parse}=require('espree');
// 取某文件里指定函数体文本
function body(file, fn, fromGit){
  const src = fromGit ? execSync(`git show ${fromGit}:${file}`,{encoding:'utf8',maxBuffer:32e6}) : fs.readFileSync(file,'utf8');
  const ast=parse(src,{ecmaVersion:'latest',sourceType:'module',range:true});
  let out=null;
  (function w(n){ if(!n||typeof n!=='object'||out)return;
    if(n.type==='FunctionDeclaration'&&n.id&&n.id.name===fn){out=src.slice(n.range[0],n.range[1]);return}
    for(const k in n){if(k==='range'||k==='loc')continue;const v=n[k];
      if(Array.isArray(v))v.forEach(w);else if(v&&v.type)w(v)}
  })(ast);
  return out;
}
// 在文本里截取从 startMark 到 endMark（含）的片段
const seg=(txt,a,b)=>{const i=txt.indexOf(a);const j=txt.indexOf(b,i);return txt.slice(i,j+b.length)};
const out={};
// candidate
{
  const oldB=body('src/index.js','Ee','d14bed7')||null;
  out.candidate_o=null;
}
console.log('跳过');
