#!/bin/bash

echo "<eiout>"
echo "<eicommands>"

echo "</eicommands>"
echo "<eiactions>"
cat <<EOF
<timeline widget="dialog" title="Time Line Test">

<content format="svg">
<svg id="caca" height="150" width="500">
  <ellipse cx="240" cy="100" rx="220" ry="30" style="fill:purple"></ellipse>
  <ellipse cx="220" cy="70" rx="190" ry="20" style="fill:lime"></ellipse>
  Sorry, your browser does not support inline SVG. 
</svg>
</content>
<step autoclean="true">
<eicommands>
</eicommands>
</step>

<step autoclean="true">
<eicommands>
<changecontent action="prepend">
<elements>
<selector value="#caca"/>
</elements>
<content format="svg">
<svg>
<ellipse cx="240" cy="45" rx="170" ry="15" style="fill:yellow"></ellipse>
</svg>
</content>

</changecontent>
</eicommands>
</step>


</timeline>

EOF

echo "</eiactions>"
echo "</eiout>"

