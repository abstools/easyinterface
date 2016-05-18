int nondet();
void tick(int c);

void p3(int x,int y, int z){
 while(x>0) {
   if(nondet()){
     while(nondet() && y>0 ){
        y--;   
        tick(2);
     }
   }else{
   if(nondet())
       y++;
   else
       y=z;
   }
  x--;
 }

}
