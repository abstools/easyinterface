int alain()
{
  int x,y,z,n1,n2;
  int c1, c2;
  c1 = 0;
  if(n2 <= 2*y) return;
  if(n2 <= z+y) return;
  if(z>=0 && x>=0 && y>=0 && n1>=0 && n2>=0)
    {
      while(--n1 >= 0 )
	{
          c2 = 0;
          ++c1;
	  while(n2 > 0)
	    {
	      --n2;
	      z = y;
              ++c2;
	    }
	  z = z+y;
	  n2 = z;
	}
    }
  return 0;
}
