function gEaseTest(){
  var Log = new gEase.Log( "log" );
  Log.D( "dbg" );
  Log.I( "inf" );
  Log.W( "wrn" );
  Log.E( "err" );
  Log.D( null );
  
  Log.D( gEase.json_from_string( "", {} ) );
  Log.D( gEase.json_to_string( gEase.json_from_string( "[{ \"KEY\" : \"VALUE\" }]" ) ) );
  
  ( new gEase.Regex( /([0-9])[a-z]/g ) ).Match( "1a2b", array => {
    Log.D( gEase.json_to_string( array ) );
  });
  ( new gEase.Regex( new RegExp( "([0-9])[a-z]", "g" ) ) ).Match( "3c4d", array => {
    Log.D( gEase.json_to_string( array ) );
  });
  
  Log.D( "date_time="+ ( new gEase.DateTime() ).ToString() );
  
  var sheet = new gEase.Sheet( gEase.sheet_get( "log" ) );
  var range = sheet.AddRecord( 1, [ 1, 2, 3 ] );
  sheet.SetHeights( range.getRow(), [ 30, 60 ] );
  sheet.AddRecord( 2, [ "A", "B", "C" ] );
  sheet.SetWidths( 1, [ 200 ] );
  sheet.SetFilterAll();
  
  Log.D( gEase.html_encode( "&" ) +" : "+ gEase.html_decode( "&amp;" ) );
  Log.D( gEase.html_encode( "'" ) +" : "+ gEase.html_decode( "&#x27;" ) );
  Log.D( gEase.html_encode( "`" ) +" : "+ gEase.html_decode( "&#x60;" ) );
  Log.D( gEase.html_encode( "\"" ) +" : "+ gEase.html_decode( "&quot;" ) );
  Log.D( gEase.html_encode( "<" ) +" : "+ gEase.html_decode( "&lt;" ) );
  Log.D( gEase.html_encode( ">" ) +" : "+ gEase.html_decode( "&gt;" ) );
}
