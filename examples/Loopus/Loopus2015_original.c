
void tick(int cost);
int nondet();

void xnu(int len)
{
int beg=0;int end=0;int i=0;
 while(i < len){
 i++;
 if (nondet)
   end = i;
 if (nondet){
   int k = beg;
   while (k < end){
	k++;tick(1);
   }
   end = i;
   beg = end;
   }
 }
}

