int speedSingleSingle2()
{
  int x,n,y,m;
  if(n<0 || m <0) return;
  x=0;y=0;
  while (nondet())
    {
      if (x<n) {x++;y++;} 
      else if (y<m) {x++;y++;}
      else break;
    }
  return 0;
}

//et là, on n'a pas de borne en carré !!!!
