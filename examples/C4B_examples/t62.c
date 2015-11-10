#pragma tick

void start(int l, int h) {
  assert(l < h);
  for (;;) {
    do { l++; tick(1); } while (l<h && nondet());
    do { h--; tick(1); } while (l<h && nondet());
    if (l >= h) break;
    tick(1);
  }
}

