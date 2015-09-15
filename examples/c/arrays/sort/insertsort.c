#include <stdio.h>

void swap(int* a, int* b) {
  int tmp;

  tmp = *a;
  *a = *b;
  *b = tmp;
}

void insertsort(int* array, int n) {
  int c, d;

  for (c = 1 ; c <= n - 1; c++) {
    d = c;
    while ( d > 0 && array[d] < array[d-1]) {
      swap( &array[d], &array[d-1] );
      d--;
    }
  }
}

int main() {
  int* array;
  int c, n;

  printf("Enter number of elements\n");
  scanf("%d", &n);

  array = malloc(n * sizeof(int));

  printf("Enter %d integers\n", n);
 
  for (c = 0; c < n; c++)
    scanf("%d", &array[c]);

  insertsort(array,n);
 
  printf("Sorted list in ascending order:\n");
 
  for ( c = 0 ; c < n ; c++ )
     printf("%d\n", array[c]);
 
  return 0;
}
