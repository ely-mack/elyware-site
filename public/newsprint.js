const screenshotDialog=document.getElementById('screenshot-dialog');
if(screenshotDialog){
 let screenshotTrigger=null;
 document.querySelectorAll('[data-screenshot]').forEach(link=>link.addEventListener('click',event=>{
  if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  event.preventDefault();screenshotTrigger=link;
  const title=link.dataset.title||'Project screenshot';
  document.getElementById('screenshot-title').textContent=title;
  document.getElementById('screenshot-caption').textContent=link.dataset.caption||'';
  const img=document.getElementById('screenshot-full');img.src=link.getAttribute('href');img.alt=title+' — '+(link.dataset.caption||'screenshot');
  screenshotDialog.showModal();
 }));
 screenshotDialog.querySelector('button').addEventListener('click',()=>screenshotDialog.close());
 screenshotDialog.addEventListener('click',event=>{if(event.target===screenshotDialog){const r=screenshotDialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)screenshotDialog.close();}});
 screenshotDialog.addEventListener('close',()=>screenshotTrigger?.focus({preventScroll:true}));
}
