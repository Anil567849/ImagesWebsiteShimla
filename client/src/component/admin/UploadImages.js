import react, { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const UploadImages = ()=> {

    const [startDate, setStartDate] = useState(new Date());
    const [folderName, setFolder] = useState("");
    const [imageUrl, setImageUrl] = useState("");



    const storeDataInDB = async ({folderName, datas}) => {

        try{
            const result = await fetch("/storeInDB", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body : JSON.stringify({
                    'folderName' : folderName,
                    'data' : datas,
                    'eventDate' : startDate,
                    imageUrl
                })
              });  

            const {message} = await result.json();
            alert(message);

        }catch(err){
            console.log("uploadImages.js " + err);
        }

    }


    const getAllImages = async (e)=> {
        e.preventDefault();

        if(folderName[folderName.length-1] != '/'){
            alert('put / at the end');
        }else{
            try{
                const result = await fetch('/getAllImagesFromAWSS3', {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                    },
                    body : JSON.stringify({
                        folderName
                    })
                })

                const datas = await result.json();
                if(datas.message == 'empty'){
                    alert('No Data Found On This Folder Name');
                }else{
                    // console.log(datas);
                    datas.shift(); // folder bhi deta h - isme image nhi h - to hta do
    
    
                    storeDataInDB({folderName, datas});
                }

            }catch(err){
                console.log(err);
            }
        }
    }



    return (
        <div className='container'>
            <div className="row d-flex justify-content-center">

                <div className="col-md-8">

                    <form onSubmit={getAllImages} method="POST" encType="multipart/form-data">
                        <div className="mb-1">
                            <label htmlFor="folderName"  className="form-label">Folder Name</label>
                            <input type="text" value={folderName} onChange={(e) => setFolder(e.target.value)} className="form-control" id="folderName" aria-describedby="emailHelp" required/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="imageUrl"  className="form-label">Url of One Image</label>
                            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-control" id="imageUrl" required/>                            
                        </div>
                        <div className="mb-1">
                            <label htmlFor="folderName"  className="form-label">Date of Event</label>
                            <DatePicker dateFormat='dd/MM/yyyy' selected={startDate} onChange={(date:Date) => setStartDate(date)}  required/>
                        </div>
                        <button type="submit" className="btn btn-primary">Upload</button>
                    </form>
                
                </div>
            </div>            
        </div>
    )
    
}

export default UploadImages;