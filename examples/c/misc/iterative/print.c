#include<stdio.h>

void print(int n) {
  int i;
  for(i=0; i<=n; i++)
    printf("%d\n",i);
}
 
int main() {
   int num, res;
 
   printf("\nEnter a number : ");
   scanf("%d", &num);
 
   print(num);
 
   return (0);
}
