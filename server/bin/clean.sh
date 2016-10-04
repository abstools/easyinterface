#!/bin/bash

MIN=$(($1 * 60))

find /tmp/ei/ -name "ei_*" -amin $MIN -type d -print -exec rm -rf {}/ \; 2> /dev/null

find /tmp/ei/sessions/ -name "*" -amin $MIN -type d -print -exec rm -rf {}/ \; 2> /dev/null

