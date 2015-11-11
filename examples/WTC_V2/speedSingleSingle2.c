int nondet();

int speedSingleSingle2(int n,int m)
{
  int x,y;
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


