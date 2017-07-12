<?php

class EIRequest 
{

  // The request is done as POST request, which consists of a json
  // object.
  //
  // This object includes one filled call 'command', and the other
  // fields depend on the value of this command
  
  private $request;
  private $config_dir;

  function __construct() {
    $this->request = $_POST['eirequest'];

    if (is_string($this->request)) {
      $this->request = json_decode($this->request, true);
    }
    if( isset( $_GET['download'] ) ){
	 header("Location: ./Download.php?file=".$_GET['file']."&id=".$_GET['execid']);
	 die();
      return;
    }
      
    if ( ! array_key_exists( 'command', $this->request ) ) {
      throw new Exception("Missing command in EI request ");
    } 
  }

   public function process()
   {

     switch ( $this->request['command'] ) {

     case "ping":
	 return "EasyInterface server is alive and kicking!";
	 break;

     case "app_info":
       if ( ! array_key_exists( 'app_id', $this->request ) )
	 throw new Exception("Missing app_id");

       return EIApps::get_app_info(  $this->request['app_id']  );

     case "app_parameters":
       if ( ! array_key_exists( 'app_id', $this->request ) )
	 throw new Exception("Missing app_id");

       return EIApps::get_app_parameters(  $this->request['app_id']  );

     case "app_details":
       if ( ! array_key_exists( 'app_id', $this->request ) )
	 throw new Exception("Missing app_id");

       return EIApps::get_app_details(  $this->request['app_id']  );

     case "exset_details":
       if ( ! array_key_exists( 'exset_id', $this->request ) )
	 throw new Exception("Missing exset_id");

       return EIExamples::get_exset_details(  $this->request['exset_id']  );

    case "execute":
       if ( ! array_key_exists( 'app_id', $this->request ) )
	 throw new Exception("Missing app_id");

       if ( ! array_key_exists( 'parameters', $this->request ) )
	 throw new Exception("Missing parameters");

       return EIApps::execute(  $this->request['app_id'], $this->request['parameters'] );

    case "get_stream":
       if ( ! array_key_exists( 'exec_id', $this->request ) )
	 throw new Exception("Missing exec_id");
       if ( ! array_key_exists( 'extension', $this->request ) )
	 $ext = "ei";
       else
	 $ext = $this->request['extension'];
       return EIStream::get(  $this->request['exec_id'], $ext );


    case "kill_stream":
       if ( ! array_key_exists( 'exec_id', $this->request ) )
	 throw new Exception("Missing exec_id");

       return EIStream::kill(  $this->request['exec_id'] );

    default:
       throw new Exception("Invalid command in EI request");
     }
   }
}

?>
