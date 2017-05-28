/**
 * @Author: Krishna Kalubandi <krishna>
 * @Date:   2017-05-27T15:16:13+05:30
 * @Email:  krishnakalubandi@gmail.com
 * @Filename: 811B.cpp
 * @Last modified by:   krishna
 * @Last modified time: 2017-05-27T15:42:34+05:30
 */

#include <bits/stdc++.h>
using namespace std;

#define ull unsigned long long
#define ll long long
#define rep(i, n) \
  for (int i = 0; i < n; ++i)
#define loop(i, x, y) \
  for (int i = x; i < y; ++i)
#define gc getchar
#define mp make_pair
#define pll pair < ll, ll >
#define vi vector < int >
#define vll vector < ll >
#define mii map < int, int >
#define mll map < ll, ll >
#define pb push_back
#define all(a) a.begin(), a.end()
#ifdef DEBUG
   # define LOG(args ...) { dbg, args; }
#else // ifdef DEBUG
  # define LOG(args ...) // Just strip off all debug tokens
#endif // ifdef DEBUG
struct debugger
{
  template<typename T>debugger& operator,(const T& v)
  {
    cerr << v << " ";
    return *this;
  }
} dbg;

template<typename T1, typename T2>
inline std::ostream& operator<<(std::ostream& os, const std::pair<T1, T2>& p)
{
  return os << "(" << p.first << ", " << p.second << ")";
}

template<typename T>
inline std::ostream& operator<<(std::ostream& os, const std::vector<T>& v)
{
  bool first = true;

  os << "[";

  for (unsigned int i = 0; i < v.size(); i++)
  {
    if (!first) os << ", ";
    os << v[i];
    first = false;
  }
  return os << "]";
}

template<typename T>
inline std::ostream& operator<<(std::ostream& os, const std::set<T>& v)
{
  bool first = true;

  os << "[";

  for (typename std::set<T>::const_iterator ii = v.begin(); ii != v.end(); ++ii)
  {
    if (!first) os << ", ";
    os << *ii;
    first = false;
  }
  return os << "]";
}

template<typename T1, typename T2>
inline std::ostream& operator<<(std::ostream& os, const std::map<T1, T2>& v)
{
  bool first = true;

  os << "[";

  for (typename std::map<T1, T2>::const_iterator ii = v.begin(); ii != v.end();
       ++ii)
  {
    if (!first) os << ", ";
    os << *ii;
    first = false;
  }
  return os << "]";
}

const int MAX = 1e4 + 5;

int tbl[MAX];


ll gcd(ll a, ll b) {
  return (b == 0) ? a : gcd(b, a % b);
}

int main() {
  int n, m;
  cin >> n >> m;
  std::vector<int> a;
  rep(i, n)  {
    int x;
    cin >> x;
    tbl[x] = a.size();
    a.push_back(x);
  }
  rep(i, m) {
    int l, r, x;
    cin >> l >> r >> x;
    l--; r--; x--;
    int val = a[x], ltA = l;
    for (int j = l; j <= r; j++) if (a[j] < val) ltA++;
    (a[ltA] == val) ? cout << "Yes" : cout << "No";
    cout << endl;
  }
}
