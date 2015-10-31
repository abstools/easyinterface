<?php

class EIStream {

  static function get($exec_id) {
    $p = EIStream::path($exec_id);
/*    if(!EIStream::isStream($exec_id)){
      return "<ei_stream>FINISHED</ei_stream>";
    } 
  */ 
    exec("ls ".$p."*.ei", $files);
    sort($files, SORT_NATURAL );
    $output = "";
    if(EIStream::finish($exec_id))
      $output .= "<ei_stream>FINISHED</ei_stream>";
    foreach ($files as $f){
      $aux = file_get_contents($f);
      if($aux === FALSE)
	continue;
      else
	$output .= $aux;
      unlink($f);
      unset($aux);
      $output .= "\n";
    }
    $output .= "";
   return $output;
  }

  static function kill( $exec_id ) {
    //if(!EIStream::isStream($exec_id))
      //return "<ei_stream>FINISHED</ei_stream>";
   // $aux = EIStream::getPID($exec_id);
    //if($aux === FALSE)
     // return "<ei_stream>FINISHED</ei_stream>";
    //exec("kill -9 ".$aux);
    return "<ei_stream>FINISHED</ei_stream>";
  }

  static function getPID( $id ) {
    return get_file_contents(EIStream::path($id)."pid");
  }

  static function isStream($id){
    return file_exists(EIStream::path($id)."pid");
  }

  static function finish($id){
    return file_exists(EIStream::path($id)."terminate");
  }

  static function path($id){
    $aux = sys_get_temp_dir()."/easyinterface_".$id;
    $dir = str_replace("\\", "/", $aux);
    unset($aux);
    return $dir."/_ei_stream/";
  }


  
}

?>
