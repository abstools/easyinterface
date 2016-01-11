#include <stdio.h>

void swap(int* a, int* b) {
  int tmp;

  tmp = *a;
  *a = *b;
  *b = tmp;
}

void bubblesort(int* array, int n) {
  int c, d;

  for (c = 0 ; c < ( n - 1 ); c++)
    for (d = 0 ; d < n - c - 1; d++) 
      if (array[d] > array[d+1])
        swap( &array[d], &array[d+1] );
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

  bubblesort(array,n);
 
  printf("Sorted list in ascending order:\n");
 
  for ( c = 0 ; c < n ; c++ )
     printf("%d\n", array[c]);
 
  return 0;
}
