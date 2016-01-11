#include<stdio.h>

int fib(int n) {
  if ( n > 1 )
    return fib(n-1) + fib(n-2);
  else
    return n;
}
 
int main() {
  int num, res;
  
  printf("\nEnter a number : ");
  scanf("%d", &num);
  
  res = fib(num);      
 
  printf("\nfib(%d) = %d\n\n", num, res);
  return (0);
}
