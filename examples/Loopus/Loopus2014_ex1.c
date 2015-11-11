int nondet();

void start(uint n){
int a = n, b = 0;
while (a > 0){
	a--; b++;
	while (b > 0){
		b--;
		for (int i = n-1; i > 0; i--)
			if (a > 0 && nondet()){
				a--; b++;
			}  
		} 
	 }
}
