/* v198: hitbox-hulp voor vormborden (offset van bijgesneden kader) */
(function(){
  const _auw=window.strikAuw;
  if(_auw)window.strikAuw=function(p,cel){
    const box=(window.M3&&M3.b&&M3.b._box)||{r0:0,c0:0};
    return _auw([p[0]-((box.r0)|0),p[1]-((box.c0)|0)],cel);
  };
})();
