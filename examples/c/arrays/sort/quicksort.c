#include <stdio.h>
 
void quicksort (int *a, int n) {
  int i, j, p, t;
  if (n < 2) return;
  p = a[n / 2];
  for (i = 0, j = n - 1;; i++, j--) {
    while (a[i] < p) i++;
    while (p < a[j]) j--;
    if (i >= j) break;
    t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  quicksort(a, i);
  quicksort(a + i, n - i);
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

  quicksort(array,n);
 
  printf("Sorted list in ascending order:\n");
 
  for ( c = 0 ; c < n ; c++ )
     printf("%d\n", array[c]);
 
  return 0;
}
