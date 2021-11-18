"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pagination = void 0;
const pagination = (array, page_index, item_per_page) => {
    const canPaginate = checkPaginationParams(page_index, item_per_page);
    const data = canPaginate
        ? array.slice((page_index - 1) * item_per_page, page_index * item_per_page)
        : array;
    return {
        data,
        hasMore: page_index * item_per_page >= array.length || !canPaginate ? false : true,
        totalPage: canPaginate ? Math.ceil(array.length / item_per_page) : 1,
    };
};
function checkPaginationParams(page_index, item_per_page) {
    if (isNaN(page_index) || isNaN(item_per_page)) {
        return false;
    }
    if (parseInt(page_index.toString()) <= 0 || parseInt(page_index.toString()) <= 0)
        return false;
    return true;
}
const Pagination = (array, offset, limit) => {
    const data = array.slice(offset, offset + limit);
    return {
        data,
        offset: offset > array.length ? array.length : offset,
        limit,
        total: array.length
    };
};
exports.Pagination = Pagination;
