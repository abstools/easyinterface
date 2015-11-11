int nondet();

void counterex1b(int n,int x,int y)
{

  while(x>=0){
    while(y>=0 && nondet()) y--;
    x--;
    while(y<=n && nondet()) y++;
  }
}
