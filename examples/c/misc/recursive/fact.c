#include<stdio.h>

int fact(int n) {
  if ( n>0 )
    return n*fact(n-1);
  else
    return 1;
}
 
int main() {
   int num, res;
 
   printf("\nEnter a number : ");
   scanf("%d", &num);
 
   res = fact(num);
 
   printf("\n%d! = %d\n\n", num, res);
   return (0);
}
