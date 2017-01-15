#!/bin/sh

TMPFILE=$(mktemp)
pngcrush -rem allb -brute -reduce turtle.png $TMPFILE 2> /dev/null && optipng -o7 $TMPFILE 2> /dev/null
cat $TMPFILE | base64 -b 80