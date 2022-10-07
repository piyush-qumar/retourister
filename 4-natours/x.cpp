#include<bits/stdc++.h>
using namespace std;
int main(){
    int n;
    stack<pair<int,int>>s;
    cin>>n;
    int a[n];
    for(int i=0;i<n;i++){
        cin>>a[i];
    }
    for(int i=0;i<n;i++){
    for(int j=i+1;j<n;j++){
        if(a[i]>a[j]){
            s.push({a[i],a[j]});
        }

        }
    }
    cout<<s.size()<<endl;
    while(!s.empty()){
       
        cout<<s.top().first<<" "<<s.top().second<<endl;
        s.pop();
    }
}
