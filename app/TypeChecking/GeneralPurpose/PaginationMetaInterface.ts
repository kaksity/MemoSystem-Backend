interface PaginationMetaInterface {
    per_page: number

    current_page: number
  
    total: number
  
    first_page: number
  
    last_page: number
  
    has_more_pages: boolean
  
    has_pages: boolean
}

export default PaginationMetaInterface
