<?php header('Access-Control-Allow-Origin: *'); ?>

<? 

include "EIConfig.php";
include "misc.php";
include "EIRequest.php";
include "EIApps.php";
include "EIExamples.php";

println("<ei_response>");
try {
  $request = new EIRequest();
  $response =  preg_replace("/(<\?xml)(.)*\?>/" , '', $request->process());
  println( $response );
} catch (Exception $e) {
  print("<eierror>");
  print( $e->getMessage() );
  println("</eierror>");
}
println("</ei_response>");

?>
