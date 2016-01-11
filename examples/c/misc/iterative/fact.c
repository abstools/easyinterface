#include<stdio.h>

int fact(int n) {
  int r=1;
  while ( n>0 ) {
    r *= n;
    n--;
  }
  return r;
}
 
int main() {
   int num, res;
 
   printf("\nEnter a number : ");
   scanf("%d", &num);
 
   res = fact(num);
 
   printf("\n%d! = %d\n\n", num, res);
   return (0);
}
