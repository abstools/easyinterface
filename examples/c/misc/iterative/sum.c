#include<stdio.h>

int sum(int n) {
  int r=0;
  while ( n>0 ) {
    r += n;
    n--;
  }
  return r;
}
 
int main() {
   int num, res;
 
   printf("\nEnter a number : ");
   scanf("%d", &num);
 
   res = sum(num);
 
   printf("\n1 + ... + %d = %d\n\n", num, res);
   return (0);
}
