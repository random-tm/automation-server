//Fix strange == typing issues
export default (networkData) => {
    const cleanedData = cleanObj(networkData);
    return cleanedData;
}

const cleanObj = (networkData) => {
    for(let key in networkData){
        if(typeof networkData[key] == "string"){
            if(networkData[key] === "false"){
                networkData[key] = false;
            } else if (networkData[key] === "true"){
                networkData[key] = true;
            }
        } else if(typeof networkData[key] == "object"){
            networkData[key] = cleanObj(networkData[key]);
        }
    }
    return networkData;
}