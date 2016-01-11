#include<stdio.h>

void print(int n) {
  int i;

  for(i=0; i<=n; i++)
    printf("%d\n",i);
}
 
int main() {
   int num, res;
 
   // read a number
   printf("\nEnter a number : ");
   scanf("%d", &num);

   // print 
   printf("\nHere are the numbers from 0 to %d: ",num);
   print(num);
 
   return (0);
}
