import { request } from "@/utils/request";

// 获取列表
export function queryList(query) {
  return request({
    url: "/api/sku-inventory/list",
    method: "get",
    params: query,
  });
}

//新增
export function add(data) {
  return request({
    url: "/api/sku-inventory/add",
    method: "post",
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
    responseType: "text",
  });
}

//删除
export function del(id) {
  return request({
    url: "/api/sku-inventory/delete",
    method: "delete",
    params: { id },
  });
}
