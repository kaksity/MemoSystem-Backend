export interface IMemo {
    id: string,
    date: Date | string,
    title: string,
    content?: string
}

export interface IMemoComment {
    id: string,
    date: Date | string,
    message: string,
    commentBy: string
}

export interface IMemoAttachment {
    id: string,
    url: string
}