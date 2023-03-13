//onchange event
$(document).ready(function(){
	let input
    $('#customFileLangHTML').on('change',function(e){
        input =   e.currentTarget.files
    })
    $('#upload_btn').click(function(){
        UploadFiles(input)
    })
 })


 const UploadFiles = (()=>{

    //progress

    const UploadProgress = (loaded,total)=>{
         console.log("progress " + loaded + ' / ' + total)
    }

    //upload
    const upload = (res,file,fileId)=>{
        let fs =  file.slice(res.bytes[0].check,file.size)
        
       
        var start = res.bytes[0].check;
        var chunkSize = 1024 * 1024;
        var chunks = Math.ceil(fs.size/chunkSize,chunkSize);
        var slice = Math.ceil(file.size/chunkSize,chunkSize);
       
        var chunk = (start) ? (slice - chunks)-1 : 0;   
        
        var reader = new FileReader();
        reader.onload = function(e){            
            chunk++
            let xhr  = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8000/uploads?chunk="+chunk+"&totalchunk="+chunks);
            xhr.onreadystatechange = function() {
                if(this.readyState == 4 && this.status == 200) {
                        if(chunk <= slice){
                            var offset = chunk*chunkSize;
                            blob =  file.slice(offset,offset+chunkSize);
                            reader.readAsBinaryString(blob);
                        }else{
                            chunk = slice;
                        }
                }
            };
            // xhr.onload = () => {
                
            //     if(chunk <= chunks){
            //         var offset = chunk*chunkSize;
            //         blob =  file.slice(offset,offset+chunkSize);
            //         reader.readAsBinaryString(blob);
            //         // blob = file.slice(start,start+chunkSize);
            //         // reader.readAsBinaryString(blob);
            //         // console.log(blob)
            //     }else{
            //         chunk = chunks;
            //     }
            // }
            // if(start <= totalSize){

            //     //blob = file.slice(offset,offset+chunkSize);
            //     blob = file.slice(start,start+chunkSize);
            //     reader.readAsBinaryString(blob);
            //     // let xhr  = new XMLHttpRequest();
            //     // xhr.open("POST", "http://localhost:8000/uploads?chunk="+chunk+"&totalchunk="+chunks);
            //     // let formData = new FormData();
            //     // formData.append("file",blob,'video.mp4');    
            //     // xhr.send(formData) 
            // }else{
            //     start = totalSize;
            // }
 
            //  let xhr  = new XMLHttpRequest();
            //  xhr.open("POST", "http://localhost:8000/uploads?chunk="+chunk+"&totalchunk="+chunks);
            //  xhr.upload.onprogress = async (e) => {
            //     start += step;  
            //     chunk++ 
            //     if(start <= total){
                    
            //         blob = file.slice(start,start+step);
            //         // reader.readAsBinaryString(blob);
            //         reader.readAsText(blob);
            //     } else {
            //         start = total;
            //     }  
            //         const loaded = parseInt(start) + e.loaded;
            //         console.log(loaded * 100 / file.size)
                    
            //     };
           
           
            let formData = new FormData();
            formData.append("file",blob,'video.mp4');    
            xhr.send(formData) 

        };

            // var blob = file.slice(start,step);
            var blob = file.slice(start,chunkSize)
            reader.readAsBinaryString(blob);

        //  let reader = new FileReader()
        // console.log(reader.readAsArrayBuffer(file))
        // let startByte = res.bytes[0].check
        // let xhr  = new XMLHttpRequest();
        // xhr.open("POST", "http://localhost:8000/uploads", true);

        // // xhr.upload.onprogress = (e) => {
        // //     const loaded = parseInt(startByte) + e.loaded;
        // //     console.log(loaded * 100 / file.size)
            
        // // };
        // let formData = new FormData();
        // formData.append("file",file);
        // xhr.send(formData)
        
       
        // fetch("http://localhost:8000/uploads?n=123", {
        //     method: "POST",
        //     mode: "cors",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body:JSON.stringify({'mem':'nadru'})
        // }).then(res=>res.json())
        //   .then(res=>{
        //     console.log(res)
        // }).catch(e=>{
        //     console.log(e)
        // })
        // var chunkSize = 1024 * 1024;
        // var fileSize = file.size;
        // var chunks = Math.ceil(file.size/chunkSize,chunkSize);
        // var chunk = 0;   
        // var reader = new FileReader();
        // while (chunk <= chunks) {
        //     var offset = chunk*chunkSize;
        //     var blob =  file.slice(offset,offset+chunkSize);
        //     chunk++;

            // fetch("http://localhost:8000/uploads?n="+chunk, {
            //     method: "POST",
            //     body:data
            // })

            // let xhr  = new XMLHttpRequest();
            // xhr.open("POST", "http://localhost:8000/uploads?chunk="+chunk+"&totalchunk="+chunks);
            // let formData = new FormData();

            // formData.append("file",blob,'video.mp4');    
            // xhr.send(formData) 

            // let xhr  = new XMLHttpRequest();
            // xhr.open("POST", "http://localhost:8000/uploads?number="+chunk+"&filename="+file.name+"&totalchunk="+chunks, true);
            // let formData = new FormData();
            // formData.append("file",file);
            // xhr.send(formData)
           
    //    }
        // let cSize = 1024*1 //1KB
        // let startPointer = 0;
        // let endPointer = file.size;
        // let chunks = [];
        // console.log(file.slice(startByte))
        // while(startPointer<endPointer){
        //  let newStartPointer = startPointer+cSize;
        //  console.log(file.slice(startPointer,newStartPointer))
        // //  chunks.push(file.slice(startPointer,newStartPointer));
        //  startPointer = newStartPointer;
        // }
       

    }

   
    
    //check status
    const uploadStatus = (file)=>{
         let fileId = file.name + '-' + file.size + '-' + file.lastModified;
         return fetch('http://localhost:8000/status',{
            headers: {
                'name':'badru.mp4',
                'size':file.size,
            }
        }).then(res=>res.json())
        .then(res=>{
         upload(res,file,fileId)
        }).catch(e=>{
            console.log(e)
        })
        
       
     

    }
    return (files)=>{
         [...files].forEach(file=>{
            uploadStatus(file)
         })
    }
 })()
