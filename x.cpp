#include <bits/stdc++.h>
using namespace std;

int main() {
int n; cin >> n;

string s,temp;

char c='A';

for(int i=0;i<n-1;i++)
{
    char ch=c+i;
    s.push_back(ch);
    temp.push_back(ch);
}
char ch=c+(n-1);
s.push_back(ch);
reverse(temp.begin(),temp.end());
for(auto it:temp)
s.push_back(it);



int space=0;
int st=0;
while(n--)
{
    for(int i=0;i<space;i++)
    cout<<" ";
    for(int i=st;i<s.size()-st;i++)
    cout<<s[i];
    cout<<endl;
    st++;
    space++;
}
}