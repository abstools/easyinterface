int terminate(){
  int i, j, k, ell;
  while(i <= 100 && j <= k){
    ell = i;
    i = j;
    j = ell+1;
    k--;
  }
}
