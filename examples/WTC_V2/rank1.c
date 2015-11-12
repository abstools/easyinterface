
void tick(int cost);
int nondet();

void rank1(int m)
{
int y= 0;
int x = m;
while(x>=0 && y>=0){
if(nondet()){
   while(y <= m && nondet())
   y++;
   x--;
  }
  y--;
}
}


