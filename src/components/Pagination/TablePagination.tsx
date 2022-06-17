import React from 'react'

interface TablePaginationProp {
    allPage: number,
    currentPage: number,
    limitRowPerPage: number,
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
}

export const TablePagination: React.FC<TablePaginationProp> = ({
    allPage,
    currentPage,
    limitRowPerPage,
    setCurrentPage
}) => {
    const _ = require('lodash');

    const clickLeftArrow = () => setCurrentPage((prev) => prev * 0)
    const clickRightArrow = () => setCurrentPage(() => (Math.ceil(allPage) - 1) * limitRowPerPage)
    
    return (
        <div className="py-5 text-center">
            <a onClick={clickLeftArrow}
                className="btn btn-icon btn-sm btn-light-primary mr-2 my-1">
                <i className="ki ki-bold-double-arrow-back icon-xs"></i>
            </a>
            {_.range(0, Math.ceil(allPage), 1)
                .map((p: number) =>
                    <a onClick={() => setCurrentPage(() => p * limitRowPerPage)}
                        className={currentPage === p * limitRowPerPage ?
                            "btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1 active" :
                            "btn btn-icon btn-sm border-0 btn-hover-primary mr-2 my-1"}
                    >{p + 1}
                    </a>
                )}
            <a onClick={clickRightArrow}
                className="btn btn-icon btn-sm btn-light-primary mr-2 my-1">
                <i className="ki ki-bold-double-arrow-next icon-xs"></i>
            </a>
        </div>
    )
}
