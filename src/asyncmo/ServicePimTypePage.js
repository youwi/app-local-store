import { request } from '../utils'
import config from "../config"



export async function asyncGetAllTypes(params) {
  return request(config.pim.allTypes, {
    method: 'post',
    data:params,
  })
}


export async function asyncGetAllItems(params) {
  return request(config.pim.allItems, {
    method: 'post',
    data:params,
  })
}


export async function asyncUpdateItem(params) {
  return request(config.pim.itemUpdate, {
    method: 'post',
    data:{item:JSON.stringify(params)},
  })

}

export async function asyncAddItem(params) {
  return request(config.pim.itemUpdate, {
    method: 'post',
    data: JSON.stringify(params),
  },true)
}



export async function asyncSaveType(params) {
  return request(config.pim.typeUpdate, {
    method: 'post',
    data: JSON.stringify(params),
  },true)
}

export async function asyncGetAllItemsByTypeShortName(params) {
  return request(config.pim.getAllItemByShortName, {
    method: 'post',
    data:  params,
  })
}

export async function asyncAddLink(params) {
  return request(config.pim.addLink, {
    method: 'post',
    data:  params,
  })
}

export async function asyncDelView(params) {
  return request(config.pim.delView, {
    method: 'post',
    data:  params,
  })
}
export async function asyncDelLink(params) {
  return request(config.pim.deleteLink, {
    method: 'post',
    data:  params,
  })
}
export async function asyncAddView(params) {
  return request(config.pim.addView, {
    method: 'post',
    data:  params,
  })
}

export async function asyncGetAllToc(params) {
  return request(config.pim.getAllToc, {
    method: 'post',
    data:  params,
  })
}
export async function asyncGetAllView(params) {
  return request(config.pim.getAllView, {
    method: 'post',
    data:  params,
  })
}

export async function asyncGetItem(params) {
  return request(config.pim.getOneItemByName, {
    method: 'post',
    data:  params,
  })
}

export async function asyncGetAllOperationByItemId(params) {
  return request(config.pim.getAllOperationByItem, {
    method: 'post',
    data:  params,
  })
}

export async function asyncUpdateOperation(params) {
  return request(config.pim.updateOperation, {
    method: 'post',
    data:  JSON.stringify(params ),
  },true)
}

export async function asyncDeleteOperation(params) {
  return request(config.pim.deleteOperation, {
    method: 'post',
    data:   params ,
  })
}
export async function asyncGetAllOperation(params) {
  return request(config.pim.getAllOperation, {
    method: 'post',
    data:   params ,
  })
}

export async function asyncGetAllOperationByTypeId(params) {
  return request(config.pim.getAllOperationByType, {
    method: 'post',
    data:   params ,
  })
}


export async function asyncGetTypeByTypeShortName(params) {
  return request(config.pim.getTypeByShortName, {
    method: 'post',
    data:   params ,
  })
}


export async function asyncDeleteItem(params) {
  return request(config.pim.deleteItem, {
    method: 'post',
    data:   params ,
  })
}

export async function asyncDeleteType(params) {
  return request(config.pim.deleteType, {
    method: 'post',
    data:   params ,
  })
}

export async function asyncGetAllUsers(params) {
  return request(config.pim.getAllUsers, {
    method: 'post',
    data:   params ,
  })
}




