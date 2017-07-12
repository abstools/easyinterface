<?php

class EIStream {

  static function get($exec_id,$ext) {
    $p = EIStream::path($exec_id);
    if(!EIStream::isStream($exec_id)){
      return "<ei_stream state='nostream' />";
    }
    if(EIStream::finish($exec_id))
      $state = "terminated";
    else
      $state = "running";
    echo $ext;
    exec("ls ".$p."*.".$ext, $files); // TODO: security on extension
    sort($files, SORT_NATURAL );

    $output_f = "";
    $empty = true;

    foreach ($files as $f){
      $aux = file_get_contents($f);
      if($aux === FALSE)
	continue;
      else{
	$empty = false;

	$output_f .= $aux;
	$output_f .= "";

      }
      unlink($f);
      unset($aux);
    }
    $output ="";
    if($empty)
      $state .= " empty";
    else{
      $output .= "<content><![CDATA[\n";
      $output .= $output_f;
      $output .= "]]></content>\n";
    }
    return "<ei_stream state='".$state."' >\n".$output."</ei_stream>";
  }

  static function kill( $exec_id ) {
    if(!EIStream::isStream($exec_id) || EIStream::finish($exec_id))
      return "<ei_stream state='terminated' />";

    $aux = EIStream::getPID($exec_id);
    if($aux === FALSE)
      return "<ei_stream state='unknown' />";
    exec("bin/misc/killproc.sh ".$aux);
    exec("touch ".EIStream::path($exec_id)."terminated");
    return "<ei_stream state='stopped' />";
  }

  static function getPID( $id ) {
    return file_get_contents(EIStream::path($id)."pid");
  }

  static function isStream($id){
    return file_exists(EIStream::path($id)."pid");
  }

  static function finish($id){
    return file_exists(EIStream::path($id)."terminated");
  }

  static function path($id){
    $aux = sys_get_temp_dir()."/ei/ei_".$id;
    $dir = str_replace("\\", "/", $aux);
    unset($aux);
    return $dir."/_ei_stream/";
  }
}

?>
