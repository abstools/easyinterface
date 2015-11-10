void start(int x, int y)
{
  int t;

  while (x>0) {
    x--;
    t=x, x=y, y=t;
  }
}

