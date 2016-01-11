#include<stdio.h>

int sum(int n) {
  if ( n>0 )
    return n + sum(n-1);
  else
    return 0;
}
 
int main() {
   int num, res;
 
   printf("\nEnter a number : ");
   scanf("%d", &num);
 
   res = sum(num);
 
   printf("\n1 + ... + %d = %d\n\n", num, res);
   return (0);
}
