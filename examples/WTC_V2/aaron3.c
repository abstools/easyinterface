int aaron3() {
  int x,y,z,tx;
  while (x>=y) {
    if (nondet()) {
      z=z-1;
      tx=x;
      x=nondet();
      if (x>tx+z) return 0;
    } else {
      y=y+1;
      
    }
  }
  return 0;
}
