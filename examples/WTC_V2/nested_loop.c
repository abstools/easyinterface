int nondet();

void nestedLoop(int n, int m, int N){
  int i, j, k;
  if(0<=n && 0<=m && 0<=N){
    i = 0;
    while(i<n && nondet()){
      j = 0;
      while(j<m && nondet()){
        j += 1;
        k = i;
        while(k<N && nondet())
          k += 1;
        i = k;
      }
      ++i;
    }
  }
}
