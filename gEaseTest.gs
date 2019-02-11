function gEaseTest(){
  var Log = new gEase.Log( "log" );
  Log.D( "dbg" );
  Log.I( "inf" );
  Log.W( "wrn" );
  Log.E( "err" );
  
  Log.D( gEase.json_from_string( "", {} ) );
  Log.D( gEase.json_to_string( gEase.json_from_string( "[{ \"KEY\" : \"VALUE\" }]" ) ) );
  
  ( new gEase.Regex( /([0-9])[a-z]/g ) ).Match( "1a2b", function( array ){
    Log.D( gEase.json_to_string( array ) );
  });
  ( new gEase.Regex( new RegExp( "([0-9])[a-z]", "g" ) ) ).Match( "3c4d", function( array ){
    Log.D( gEase.json_to_string( array ) );
  });
  
  Log.D( "date_time="+ ( new gEase.DateTime() ).ToString() );
  
  var sheet = new gEase.Sheet( Log.GetSheet() );
  var range = sheet.AddRecord( [ 1, 2, 3 ] );
  sheet.SetHeights( [ 30, 60 ], range.getRow() );
  sheet.AddRecord( [ "A", "B", "C" ], 2 );
  sheet.SetWidths( [ 200 ] );
  sheet.SetFilterAll();
}
