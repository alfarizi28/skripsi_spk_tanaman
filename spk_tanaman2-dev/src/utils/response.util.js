const successResponse = (message,data=null)=>{
    return{
        success:true,
        message,
        data
    }
}

class errorResponse extends Error {
    constructor (status,message){
        super(message)
        this.status=status
    }
}

module.exports={
    successResponse,
    errorResponse
}