#include<stdio.h>

int fib(int n) {
  if ( n == 0 || n == 1 )
    return n;

  int x = 0, y = 1, z = 1;
  while ( n > 0 ) {
    x = y;
    y = z;
    z = x + y;
    n--;
  }
  return x;
}

int main() {
  int num, res;
  
  printf("\nEnter a number : ");
  scanf("%d", &num);
  
  
  printf("\nfib(%d) = %d\n\n", num, res);
  return (0);
}
