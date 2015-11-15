int nondet();
void tick(int c);

void p1(int x,int y){
 while(x>0) {
   x--;
   y++;
 while(y>0 && nondet()>0){
     y--;tick(1);
   }
 }
  while(y>0){
    y--;tick(1);}
}
