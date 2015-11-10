#pragma tick

int nondet();

void start(int n)
{
  int i;
  int j;

  i=0;
  while (i<n) {
    j=i+1;
    while (j<n) {
      if (nondet()) {
        tick(1);
        j=j-1;
        n=n-1;
      }
      j=j+1;
    }
    i=i+1;
  }
}

