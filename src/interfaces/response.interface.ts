export interface ResponseWithoutData{
    message: string,
    statusCode: number
    success: boolean,
}

export interface ResponseWithData<T> extends ResponseWithoutData{
    data: T
}