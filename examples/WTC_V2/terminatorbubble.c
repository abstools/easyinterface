
/* get inconsistent state, rankfinder fails to prove termination */

int terminatorbubble() {
  int size;
  int error;
  int b;
  int j;
  int t;
  error=0;
  b=size;
  if (size>0) {
  while (b>=1) {
    if (size<=0) return 0;
    j=1;
    t=0;
    while (j<=b-1) {
      if (j<1 || j>size) { return 0; }
      if (j+1<1 || j+1>size) { return 0; }
      if (brandom()){ t=j;}
      j=j+1;
    }
    if (1>t || t>=b) return 0;
    b=t;
  }
  }
}
