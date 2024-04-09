export class LogFile {
    logging(...results){
        
        try {
            console.log('%c Starting', 'background: #222; color: #bada55; font-size: 20px', arguments[0], '----------> Started')
            console.log(arguments[0],'---------->', results)
          }
          catch(err) {
            console.log("Error ------>", arguments[0], '---------->', results)
          }
          finally{
            console.log('%c Ending', 'background: #222; color: #bada55; font-size: 20px', arguments[0], "------------------------------- Ended") 
          }
    }
}
