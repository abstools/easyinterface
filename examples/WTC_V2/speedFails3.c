
int speedFails3(){
  int i,x,n,t;
  int b=nondet();

  while(x>=0 && x<=n)
    {
      if(b)
	{
	  x=x+t;
	}
      else
	{
	  x=x-t;
	}

    }
  
  return 0;
