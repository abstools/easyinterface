#!/bin/bash

declare -A params

name="dummy"
val=""

for i in "$@"
do
  if [ ${i:0:1} == "-" ]
  then
      params["$name"]=${val:1}
      name=${i:1}
      val=""
  else
      val+=" $i"
  fi
done

params["$name"]=${val:1}

