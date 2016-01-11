#!/opt/local/bin/bash

names=()
values=()
pos=0
val=""

for i in "$@"
do
  if [ ${i:0:1} == "-" ]
  then
      names[$pos]=$name
      values[$pos]=$val
      ((pos++))
      name=${i:1}
      val=""
  else
      val+=" $i"
  fi
done

names[$pos]=$name
values[$pos]=$val

function getparam {
    local x=0
    local ret=-1
    while [ $x -le $pos ]
    do
	if [ "${names[$x]}" == "$1" ]
	then
	    ret=${values[$x]}
	    break
	fi
	((x++))
    done
    echo $ret

}  
