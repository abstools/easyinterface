int nondet();

int speedSingleSingle(int n)
{
  int x;
  x=0;
  while (x<n)
    {
      if (nondet()) x++ ; else x++;  
    }
  return 0;
}

