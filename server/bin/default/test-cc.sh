#!/bin/bash

echo "<eiout>"
echo "<eicommands>"

echo "</eicommands>"
echo "<eiactions>"
cat <<EOF
<timeline widget="dialog" title="Time Line Test">

<content format="svg">
<svg id="caca" height="150" width="500">
  <ellipse class="ellip" cx="240" cy="100" rx="220" ry="30" style="fill:purple"></ellipse>
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
<changecontent action="append">
<elements>
<selector value=".ellip"/>
</elements>
<content format="html">

        <animateTransform
            attributeName="transform"
            begin="0s"
            dur="20s"
            type="rotate"
            from="0 60 60"
            to="360 60 60"
            repeatCount="indefinite"
        />

</content>

</changecontent>
</eicommands>
</step>


</timeline>

EOF

echo "</eiactions>"
echo "</eiout>"

