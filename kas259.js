/* v259: pot-achter → plant → pot-voorrand, ook als de HTML al getekend was */
(function(){
  function zetLippen(){
    try{
      document.querySelectorAll('.mk-pot').forEach(pot=>{
        const img=pot.querySelector(':scope > .potimg, :scope > .potwrap > .potimg');
        if(!img) return;
        let wrap=img.closest('.potwrap');
        if(!wrap){
          wrap=document.createElement('span');
          wrap.className='potwrap';
          img.parentElement.insertBefore(wrap, img);
          wrap.appendChild(img);
        }
        const plant=pot.querySelector(':scope > .kplant')||wrap.querySelector(':scope > .kplant');
        if(plant && plant.parentElement!==wrap) wrap.appendChild(plant);
        let lip=wrap.querySelector('.potlip');
        if(!lip){
          lip=document.createElement('img');
          lip.className='potlip';
          lip.alt='';
          lip.setAttribute('aria-hidden','true');
          wrap.appendChild(lip);
        }
        if(!lip.src) lip.src=img.currentSrc||img.src;
        wrap.appendChild(lip); /* lip altijd als laatste */
      });
      document.querySelectorAll('.mk-vloer').forEach(pot=>{
        const img=pot.querySelector(':scope > .gpimg, :scope > .gpwrap > .gpimg');
        if(!img) return;
        let wrap=img.closest('.gpwrap');
        if(!wrap){
          wrap=document.createElement('span');
          wrap.className='gpwrap';
          img.parentElement.insertBefore(wrap, img);
          wrap.appendChild(img);
        }
        [...pot.children].forEach(ch=>{
          if(ch===wrap) return;
          if(ch.classList.contains('gplabel')||ch.classList.contains('kpot-groei')) return;
          wrap.appendChild(ch); /* plantimg / superimg / kplant */
        });
        let lip=wrap.querySelector('.gplip');
        if(!lip){
          lip=document.createElement('img');
          lip.className='gplip';
          lip.alt='';
          lip.setAttribute('aria-hidden','true');
          wrap.appendChild(lip);
        }
        if(!lip.src) lip.src=img.currentSrc||img.src;
        wrap.appendChild(lip);
      });
    }catch(e){}
  }
  if(typeof V!=='undefined'&&typeof V.mijnkas==='function'){
    const o=V.mijnkas;
    V.mijnkas=function(){
      const r=o.apply(this,arguments);
      try{zetLippen()}catch(e){}
      return r;
    };
  }
  document.addEventListener('DOMContentLoaded', zetLippen);
})();
