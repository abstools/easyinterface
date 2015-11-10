int nondet();

void start(int x, int y)
{
  while (x>y) {
    if (nondet())
      y=y+1;
    else
      x=x-1;
  }
}

