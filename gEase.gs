var gEase = this;

gEase.json_to_string = function( value ){
  return JSON.stringify( value );
};

gEase.json_from_string = function( text, default_value ){
  return ( "" === text ) ? default_value : JSON.parse( text );
};

gEase.string_repeat = function( value, count ){
  var values = [];
  for ( var i = 0; i < count; ++i ){
    values.push( value );
  }
  return values.join( "" );
};

gEase.string_alignment = function( base_value, digit, pad_value ){
  return ( gEase.string_repeat( pad_value, digit ) + base_value ).slice( - digit );
};

gEase.html_encode = function( value ){
  return value.replace( /&/, "&amp;" )
    .replace( /'/, "&#x27;" )
    .replace( /`/, "&#x60;" )
    .replace( /"/, '&quot;' )
    .replace( /</, "&lt;" )
    .replace( />/, "&gt;" );
};

gEase.html_decode = function( value ){
  return value.replace( /&amp;/, "&" )
    .replace( /&#x27;/, "'" )
    .replace( /&#x60;/, "`" )
    .replace( /&quot;/, '"' )
    .replace( /&lt;/, "<" )
    .replace( /&gt;/, ">" );
};

gEase.sheet_get = function( sheet_name ){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.getSheetByName( sheet_name );
};

gEase.sheet_add = function( sheet_name ){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  return spreadsheet.insertSheet( sheet_name, spreadsheet.getNumSheets() + 1 );
};

gEase.sheet_get_or_add = function( sheet_name ){
  var sheet = gEase.sheet_get( sheet_name );
  return ( null !== sheet ) ? sheet : gEase.sheet_add( sheet_name );
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
  
  this.AddRecord = function( col, record ){
    return this.SetRecord( this.m_Sheet.getLastRow() + 1, col, record );
  };
  
  this.SetWidth = function( col, width ){
    this.m_Sheet.setColumnWidth( col, width );
  };
  
  this.SetWidths = function( col, widths ){
    var self = this;
    widths.forEach( width => {
      self.SetWidth( col++, width );
    });
  };
  
  this.SetHeight = function( row, height ){
    this.m_Sheet.setRowHeight( row, height );
  };
  
  this.SetHeights = function( row, heights ){
    var self = this;
    heights.forEach( height => {
      self.SetHeight( row++, height );
    });
  };
  
  this.SetFilter = function( start_row_index, end_row_index, start_col_index, end_col_index ){
    if ( undefined === start_row_index ) start_row_index = 0;
    if ( undefined === end_row_index ) end_row_index = this.m_Sheet.getLastRow();
    if ( undefined === start_col_index ) start_col_index = 0;
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
  this.m_Sheet = gEase.sheet_get_or_add( sheet_name );
  
  this.Write = function( msg ){
    if ( null === msg ) msg = "(null)";
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
  
  this.Match = function( value, callback ){
    var array;
    while ( null !== ( array = this.m_Regex.exec( value ) ) ){
      if ( false === callback( array ) ) break;
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
