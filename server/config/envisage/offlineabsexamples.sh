#!/bin/bash

root="${1%/}/"
n=1

leadingchas() {
  for ((i=0; i<$n; i++))
  do
    echo -n " "
  done
}

recursiverm() {
  ((n++))
  for d in *; do
    if [ -d $d ]; then
      (leadingchas)
      echo "<folder name='$d'>"
      (cd $d; recursiverm)
      (leadingchas)
      echo "</folder>"
    else
      x="`pwd`/$d"
      (leadingchas)
      echo -n "<file name='$d' url='"
      echo -n "/absexamples/"
      echo -n ${x#$root}
      echo "' />"
    fi
  done
  ((n--))
}


echo "<examples>"
echo "<exset id='set1'>"
echo "<folder name='collaboratory'>"

(cd $root/collaboratory; recursiverm)

echo "</folder>"
echo "</exset>"
echo "</examples>"
