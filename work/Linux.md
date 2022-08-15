## 重命名

```Shell
for i in `ls ./`;do new_name=`echo "$i" | awk -F"B" '{print $1""$2}'`;mv $i $new_name;done
```
