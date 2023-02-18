---
title: LeetCode算法题「持续更新」
tags:
  - 算法
  - LeetCode
categories: 分享境
abbrlink: 88489d6d
date: 2018-08-22 17:15:29
updated: 2019-06-18 16:55:30
thumbnail: https://blog-1257454527.cos.ap-chengdu.myqcloud.com/LeetCode_Sharing.png
---

最近在LeetCode写一些算法，顺便用博客记录下代码，到时候就可以进行一些骚操作
<!-- more -->

### 第796题：旋转字符串

```java
class Solution {
    public boolean rotateString(String A, String B) {
        if(A.isEmpty()&&B.isEmpty())
            return true;
        for(int i=0;i<A.length();i++){
            char[] array = A.toCharArray();
            char C = array[0];
            for(int n=0;n<A.length()-1;n++)
                array[n] = array[n+1];
            array[A.length()-1] = C;
            A = String.valueOf(array);
            if(A.equals(B))
               return true;
        }
        return false;
    }
}
```

### 第7题：反转整数

```java
class Solution {
    public boolean isPalindrome(int x) {
        if(x<0||(x%10==0&&x!=0))
            return false;
        int rev = 0;
        while(x>rev) {
            rev = rev*10+x%10;
            x= x/10;
        }
        return x==rev||x==rev/10;
    }
}
```
### 第3题：无重复字符的最长子串

```java
class Solution {
    public int lengthOfLongestSubstring(String s) {
        int maxLength = 0;
        int length = s.length();
        int i = 0, j = 0;
        HashMap<Character, Integer> hashMap = new HashMap<>();
        for (; j < length; ++j){
            if (hashMap.containsKey(s.charAt(j))){
                i = Math.max(hashMap.get(s.charAt(j)) + 1, i);
            }
            maxLength = Math.max(maxLength, j - i + 1);
            hashMap.put(s.charAt(j), j);
        }
        return maxLength;
    }
}
```

### 第6题：Z字形变换

```python
class Solution:
    def convert(self, s: str, numRows: int) -> str:
        result = []
        lenth = len(s)
        i=0
        if numRows == 1:
            return s
        while i < lenth:
            result.append(s[i])
            i+= numRows*2 - 2
        h = 1
        while h < numRows-1:
            i = h
            while i < lenth:
                result.append(s[i])
                i += (numRows-h-1)* 2 
                if i >= lenth:
                    break
                result.append(s[i])
                i += h*2
            h += 1
        i=h
        while i < lenth:
            result.append(s[i])
            i+= numRows*2 - 2
        return "".join(result)
```

### 第气体

