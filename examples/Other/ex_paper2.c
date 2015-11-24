
int nondet();
void tick(int c);

void p1(int x,int y, int z,int r){
 while(x>0) {
   x--;
   if(nondet()>0){
     int z=y;
     while(z>0){
        z--;tick(1);}
//	tick(y);
   }else{
   if(nondet()>0)
       y=y+z;
   else
       y=r;
   }
 }

}
