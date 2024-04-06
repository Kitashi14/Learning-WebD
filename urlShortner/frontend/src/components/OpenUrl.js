import {useParams } from "react-router-dom";

const OpenUrl = (props)=>{

    const urlId = useParams().id;
    console.log(urlId);

    try{

        
    }catch(err){
        console.log(err);
        alert("Something went wrong");
    }
    return (<></>);
}

export default OpenUrl;