int counterex1c()
{
  int n;
  int b;
  int x,y;
  while (x>=0 && 0<=y && y<=n) {
    if (b==0) {
      y++;                      /* transition t1 */
      if (random()) b=1;        /* transition t3 */
    }
    else if (b==1) {
      y--;                      /* transition t2 */
      if (random()) {x--; b=0;} /* transition t4 */
    }
    else break;
  }
  return 0;
}

