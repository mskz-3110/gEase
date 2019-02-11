var gEase = this;

gEase.json_to_string = function( value ){
  return JSON.stringify( value );
};

gEase.json_from_string = function( text, default_value ){
  var value = default_value;
  try{
    value = JSON.parse( text );
  }catch ( e ){}
  return value;
};

gEase.string_repeat = function( value, count ){
  var values = [];
  for ( var i = 0; i < count; ++i ){
    values.push( value );
  }
  return values.join( "" );
};

gEase.string_alignment = function( base_value, digit, pad_value ){
  if ( 0 <= digit ){
    return ( gEase.string_repeat( pad_value, digit ) + base_value ).slice( - digit );
  }else{
    digit *= -1;
    return ( base_value + gEase.string_repeat( pad_value, digit ) ).slice( 0, digit );
  }
};

gEase.each = function( values, callback, data ){
  if ( values instanceof Object ){
    if ( values instanceof Array ){
      var values_size = values.length;
      for ( var i = 0; i < values_size; ++i ){
        if ( false === callback( values[ i ], data ) ) break;
      }
    }else{
      for ( var key in values ){
        if ( false === callback( values[ key ], data ) ) break;
      }
    }
  }
};

gEase.sheet = function( sheet_name ){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName( sheet_name );
  if ( null == sheet ) sheet = spreadsheet.insertSheet( sheet_name, spreadsheet.getNumSheets() + 1 );
  return sheet;
};

gEase.Sheet = function( sheet ){
  this.m_Sheet = sheet;
  this.GetSheet = function(){
    return this.m_Sheet;
  };
  
  this.SetRecord = function( row, col, record ){
    var range = this.m_Sheet.getRange( row, col, 1, record.length );
    range.setValues( [ record ] );
    return range;
  };
  
  this.AddRecord = function( record, col ){
    if ( undefined === col ) col = 1;
    return this.SetRecord( this.m_Sheet.getLastRow() + 1, col, record );
  };
  
  this.SetWidth = function( width, col ){
    if ( undefined === col ) col = 1;
    this.m_Sheet.setColumnWidth( col, width );
  };
  
  this.SetWidths = function( widths, col ){
    if ( undefined === col ) col = 1;
    gEase.each( widths, function( width, self ){
      self.SetWidth( width, col++ );
    }, this);
  };
  
  this.SetHeight = function( height, row ){
    if ( undefined === row ) row = 1;
    this.m_Sheet.setRowHeight( row, height );
  };
  
  this.SetHeights = function( heights, row ){
    if ( undefined === row ) row = 1;
    gEase.each( heights, function( height, self ){
      self.SetHeight( height, row++ );
    }, this);
  };
  
  this.SetFilter = function( start_row_index, start_col_index, end_row_index, end_col_index ){
    if ( undefined === start_row_index ) start_row_index = 0;
    if ( undefined === start_col_index ) start_col_index = 0;
    if ( undefined === end_row_index ) end_row_index = this.m_Sheet.getLastRow();
    if ( undefined === end_col_index ) end_col_index = this.m_Sheet.getLastColumn();
    var requests = [{
      "setBasicFilter" : {
        "filter" : {
          "range": {
            "sheetId" : this.m_Sheet.getSheetId(),
            "startRowIndex": start_row_index,
            "endRowIndex": end_row_index,
            "startColumnIndex": start_col_index,
            "endColumnIndex": end_col_index
          }
        }
      }
    }];
    Sheets.Spreadsheets.batchUpdate( { "requests" : requests }, SpreadsheetApp.getActiveSpreadsheet().getId() );
  };
  
  this.SetFilterAll = function(){
    this.SetFilter();
  };
};

gEase.Log = function( sheet_name ){
  this.m_Sheet = gEase.sheet( sheet_name );
  this.GetSheet = function(){
    return this.m_Sheet;
  };
  
  this.Write = function( msg ){
    var row = this.m_Sheet.getLastRow() + 1;
    var col = 1;
    var cell = this.m_Sheet.getRange( row, col );
    cell.setHorizontalAlignment( "left" );
    cell.setVerticalAlignment( "top" );
    cell.setWrap( false );
    cell.setValue( msg );
    return cell;
  };
  
  this.D = function( msg ){
    var cell = this.Write( msg );
    cell.setFontColor( "blue" );
    return cell;
  };
  
  this.I = function( msg ){
    var cell = this.Write( msg );
    cell.setFontColor( "black" );
    return cell;
  };
  
  this.W = function( msg ){
    var cell = this.Write( msg );
    cell.setFontColor( "olive" );
    return cell;
  };
  
  this.E = function( msg ){
    var cell = this.Write( msg );
    cell.setFontColor( "red" );
    return cell;
  };
};

gEase.Regex = function( regex ){
  this.m_Regex = regex;
  
  this.Match = function( value, callback, data ){
    var array;
    while ( null != ( array = this.m_Regex.exec( value ) ) ){
      if ( false === callback( array, data ) ) break;
    }
  };
};

gEase.DateTime = function( date ){
  this.m_Date = ( undefined === date ) ? new Date() : date;
  
  this.Local = function(){
    return {
      "year" : this.m_Date.getFullYear(),
      "mon" : this.m_Date.getMonth() + 1,
      "date" : this.m_Date.getDate(),
      "hour" : this.m_Date.getHours(),
      "min" : this.m_Date.getMinutes(),
      "sec" : this.m_Date.getSeconds(),
      "msec" : this.m_Date.getMilliseconds()
    };
  };
  
  this.ToString = function(){
    var local = this.Local();
    return [
      local.year,
      "/",
      gEase.string_alignment( local.mon, 2, "0" ),
      "/",
      gEase.string_alignment( local.date, 2, "0" ),
      " ",
      gEase.string_alignment( local.hour, 2, "0" ),
      ":",
      gEase.string_alignment( local.min, 2, "0" ),
      ":",
      gEase.string_alignment( local.sec, 2, "0" ),
      ".",
      gEase.string_alignment( local.msec, 3, "0" )
    ].join( "" );
  };
};
